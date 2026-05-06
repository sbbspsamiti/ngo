// =====================================================
//  Shri Banke Bihari Shiksha Prasar Samiti — main.js
// =====================================================

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('mainNav');

  if (toggle && nav) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.toggle('open');
      toggle.innerHTML = nav.classList.contains('open')
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });

    // Close nav when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !toggle.contains(e.target) && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });

    // Close nav after clicking a link (mobile UX)
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          nav.classList.remove('open');
          toggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
      });
    });
  }

  // Donate-card selector animation (homepage / donate page)
  document.querySelectorAll('.donate-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.donate-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  // Animate stat counters when in view
  const stats = document.querySelectorAll('.stat-item h3');
  if (stats.length) {
    const animateCount = (el) => {
      const target = el.textContent;
      const num = parseInt(target.replace(/\D/g, ''));
      const suffix = target.replace(/[\d,]/g, '');
      if (!num) return;
      let current = 0;
      const step = Math.max(1, Math.ceil(num / 50));
      const interval = setInterval(() => {
        current += step;
        if (current >= num) { current = num; clearInterval(interval); }
        el.textContent = current + suffix;
      }, 30);
    };
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    stats.forEach(s => obs.observe(s));
  }

  // Add subtle scroll-shadow on header
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) header.style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)';
      else header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
    });
  }
});
