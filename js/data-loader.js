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
      <div class="event-cover" style="${e.cover ? `background-image:url('${e.cover}')` : `background: linear-gradient(135deg, var(--primary), var(--secondary))`}">
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
      ${e.cover ? `<img class="event-modal-cover" src="${e.cover}" alt="${t(e,'title')}">` : `<div class="event-modal-cover" style="background: linear-gradient(135deg, var(--primary), var(--secondary)); display:flex; align-items:center; justify-content:center; color:#fff; font-size:1.8rem; font-weight:bold; padding:20px; text-align:center;">${t(e, 'title')}</div>`}
      <div class="event-modal-body">
        <h2>${t(e, 'title')}</h2>
        <div class="event-modal-meta">
          <span><i class="fas fa-calendar"></i>${fmtDate(e.date, lang())}</span>
          <span><i class="fas fa-tag"></i>${t(e, 'category')}</span>
          <span><i class="fas fa-map-marker-alt"></i>${t(e, 'location')}</span>
        </div>
        <p>${t(e, 'description')}</p>
        ${e.video ? (e.video.endsWith('.mp4') ? `<video class="event-modal-video" src="${e.video}" controls></video>` : `<iframe class="event-modal-video" src="${e.video}" allowfullscreen></iframe>`) : ''}
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
  grid.innerHTML = items.map(p => {
    const isVideo = p.src.endsWith('.mp4') || p.type === 'video';
    if (isVideo) {
      return `
        <div class="gallery-item video-item" onclick="openGalleryModal('${p.src}', true, '${t(p, 'caption')}')">
          <video src="${p.src}" muted loop playsinline preload="metadata" onmouseover="this.play()" onmouseout="this.pause()"></video>
          <div class="video-play-overlay"><i class="fas fa-play"></i></div>
          <div class="caption">${t(p, 'caption')}</div>
        </div>
      `;
    } else {
      return `
        <div class="gallery-item" onclick="openGalleryModal('${p.src}', false, '${t(p, 'caption')}')">
          <img src="${p.src}" alt="${t(p,'caption')}" loading="lazy">
          <div class="caption">${t(p, 'caption')}</div>
        </div>
      `;
    }
  }).join('');
}

window.openGalleryModal = function (src, isVideo, caption) {
  const modal = document.getElementById('galleryModal');
  if (!modal) return;
  modal.innerHTML = `
    <div class="event-modal-inner" style="max-width: 800px; background: transparent; box-shadow: none; overflow: visible;">
      <button class="event-modal-close" onclick="closeGalleryModal()" aria-label="Close" style="top:-15px; right:-15px; background:var(--primary); box-shadow:0 2px 10px rgba(0,0,0,0.5);">×</button>
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px;">
        ${isVideo ? 
          `<video src="${src}" controls autoplay style="max-width: 100%; max-height: 75vh; border-radius: var(--radius); box-shadow: var(--shadow-lg); background:#000; display:block;"></video>` : 
          `<img src="${src}" style="max-width: 100%; max-height: 75vh; border-radius: var(--radius); object-fit: contain; box-shadow: var(--shadow-lg); display:block;">`
        }
        <div style="color: #fff; text-align: center; font-size: 1.1rem; font-weight: 500; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">${caption}</div>
      </div>
    </div>`;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeGalleryModal = function () {
  const modal = document.getElementById('galleryModal');
  if (!modal) return;
  const video = modal.querySelector('video');
  if (video) video.pause();
  modal.classList.remove('open');
  document.body.style.overflow = '';
};

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
  const gModal = document.getElementById('galleryModal');
  if (gModal) {
    gModal.addEventListener('click', (e) => { if (e.target === gModal) closeGalleryModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeGalleryModal(); });
  }
});
