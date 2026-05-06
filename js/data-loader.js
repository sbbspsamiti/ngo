// =====================================================
//  JSON-driven renderer for Events + Gallery
// =====================================================

const fmtDate = (iso, lang) => {
  if (!iso) return '';
  const d = new Date(iso);
  const months_hi = ['जनवरी','फ़रवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितम्बर','अक्टूबर','नवम्बर','दिसम्बर'];
  const months_en = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const m = (lang === 'hi') ? months_hi[d.getMonth()] : months_en[d.getMonth()];
  return `${d.getDate()} ${m} ${d.getFullYear()}`;
};

const lang = () => document.documentElement.getAttribute('data-lang') || 'hi';
const t = (item, key) => item[`${key}_${lang()}`] ?? item[`${key}_en`] ?? item[key] ?? '';

// ---------- EVENTS ----------
async function loadEvents() {
  const grid = document.getElementById('eventsGrid');
  if (!grid) return;
  let events = [];
  try {
    const r = await fetch('data/events.json', { cache: 'no-store' });
    events = await r.json();
  } catch (err) {
    console.warn('Could not load events.json', err);
  }
  // Sort: newest first
  events.sort((a, b) => new Date(b.date) - new Date(a.date));
  window.__events = events;
  renderEvents();
}

function renderEvents(filter = 'all') {
  const grid = document.getElementById('eventsGrid');
  if (!grid) return;
  const events = (window.__events || []).filter(e => filter === 'all' || e.category === filter);

  if (!events.length) {
    grid.innerHTML = `<div class="event-empty" style="grid-column:1/-1">
      <i class="fas fa-calendar-day"></i>
      <p><span class="hi">कोई कार्यक्रम उपलब्ध नहीं है।</span><span class="en">No events available yet.</span></p>
    </div>`;
    return;
  }

  grid.innerHTML = events.map(e => `
    <div class="event-card" onclick="openEvent('${e.id}')">
      <div class="event-cover" style="background-image:url('${e.cover}')">
        <span class="event-tag">${t(e, 'category')}</span>
        <span class="event-date">${fmtDate(e.date, lang())}</span>
      </div>
      <div class="event-body">
        <h4>${t(e, 'title')}</h4>
        <div class="event-meta"><i class="fas fa-map-marker-alt"></i>${t(e, 'location')}</div>
        <p>${truncate(t(e, 'description'), 120)}</p>
        <a href="javascript:;" class="event-link"><span class="hi">विवरण देखें →</span><span class="en">View details →</span></a>
      </div>
    </div>
  `).join('');
}

function truncate(s, n) { return s.length > n ? s.slice(0, n) + '…' : s; }

window.openEvent = function (id) {
  const e = (window.__events || []).find(x => x.id === id);
  if (!e) return;
  const modal = document.getElementById('eventModal');
  modal.innerHTML = `
    <div class="event-modal-inner">
      <button class="event-modal-close" onclick="closeEvent()" aria-label="Close">×</button>
      <img class="event-modal-cover" src="${e.cover}" alt="${t(e,'title')}">
      <div class="event-modal-body">
        <h2>${t(e, 'title')}</h2>
        <div class="event-modal-meta">
          <span><i class="fas fa-calendar"></i>${fmtDate(e.date, lang())}</span>
          <span><i class="fas fa-tag"></i>${t(e, 'category')}</span>
          <span><i class="fas fa-map-marker-alt"></i>${t(e, 'location')}</span>
        </div>
        <p>${t(e, 'description')}</p>
        ${e.video ? `<iframe class="event-modal-video" src="${e.video}" allowfullscreen></iframe>` : ''}
        ${e.photos?.length ? `<div class="event-modal-photos">${e.photos.map(p => `<img src="${p}" alt="" loading="lazy" onclick="window.open('${p}','_blank')">`).join('')}</div>` : ''}
      </div>
    </div>`;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeEvent = function () {
  document.getElementById('eventModal').classList.remove('open');
  document.body.style.overflow = '';
};

// ---------- GALLERY ----------
async function loadGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  let photos = [];
  try {
    const r = await fetch('data/gallery.json', { cache: 'no-store' });
    photos = await r.json();
  } catch (err) {
    console.warn('Could not load gallery.json', err);
  }
  window.__gallery = photos;
  renderGallery();
}

function renderGallery(filter = 'all') {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  const items = (window.__gallery || []).filter(p => filter === 'all' || p.category === filter);
  if (!items.length) {
    grid.innerHTML = `<div class="event-empty" style="grid-column:1/-1">
      <i class="fas fa-images"></i><p><span class="hi">कोई फ़ोटो नहीं</span><span class="en">No photos</span></p>
    </div>`;
    return;
  }
  grid.innerHTML = items.map(p => `
    <div class="gallery-item" onclick="window.open('${p.src}','_blank')">
      <img src="${p.src}" alt="${t(p,'caption')}" loading="lazy">
      <div class="caption">${t(p, 'caption')}</div>
    </div>
  `).join('');
}

// Re-render on language change
document.addEventListener('langchange', () => {
  if (window.__events) renderEvents(window.__currentFilter || 'all');
  if (window.__gallery) renderGallery(window.__currentGalleryFilter || 'all');
});

// Bind filter buttons
document.addEventListener('DOMContentLoaded', () => {
  loadEvents();
  loadGallery();

  document.querySelectorAll('[data-event-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-event-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      window.__currentFilter = btn.dataset.eventFilter;
      renderEvents(btn.dataset.eventFilter);
    });
  });
  document.querySelectorAll('[data-gallery-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-gallery-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      window.__currentGalleryFilter = btn.dataset.galleryFilter;
      renderGallery(btn.dataset.galleryFilter);
    });
  });

  // Close modal on backdrop click / Esc
  const modal = document.getElementById('eventModal');
  if (modal) {
    modal.addEventListener('click', (e) => { if (e.target === modal) closeEvent(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeEvent(); });
  }
});
