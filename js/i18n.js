// =====================================================
//  Bilingual handler — Hindi (default) + English toggle
// =====================================================
(function () {
  const STORAGE_KEY = 'sbbsps_lang';
  const html = document.documentElement;

  // Apply stored or default language as early as possible
  const initial = localStorage.getItem(STORAGE_KEY) || 'hi';
  html.setAttribute('data-lang', initial);
  html.setAttribute('lang', initial);

  function setLang(lang) {
    html.setAttribute('data-lang', lang);
    html.setAttribute('lang', lang);
    localStorage.setItem(STORAGE_KEY, lang);

    // Update toggle button states
    document.querySelectorAll('.lang-toggle button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update <title> if data-attr provided on <title>
    const t = document.querySelector('title');
    if (t && t.dataset[`title${cap(lang)}`]) {
      document.title = t.dataset[`title${cap(lang)}`];
    }

    // Update meta-description
    const m = document.querySelector('meta[name="description"]');
    if (m && m.dataset[`description${cap(lang)}`]) {
      m.setAttribute('content', m.dataset[`description${cap(lang)}`]);
    }

    // Update placeholders / aria-labels via data-attrs
    document.querySelectorAll('[data-placeholder-hi],[data-placeholder-en]').forEach(el => {
      const v = el.dataset[`placeholder${cap(lang)}`];
      if (v) el.setAttribute('placeholder', v);
    });
    document.querySelectorAll('[data-aria-hi],[data-aria-en]').forEach(el => {
      const v = el.dataset[`aria${cap(lang)}`];
      if (v) el.setAttribute('aria-label', v);
    });

    // Notify listeners (e.g. event/gallery renderer)
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // Bind toggle buttons after DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.lang-toggle button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === html.getAttribute('data-lang'));
      btn.addEventListener('click', () => setLang(btn.dataset.lang));
    });
    // Re-apply on load to fire data-attr swaps
    setLang(html.getAttribute('data-lang'));
  });

  // Expose globally
  window.SBBSPS_I18N = { setLang, getLang: () => html.getAttribute('data-lang') };
})();
