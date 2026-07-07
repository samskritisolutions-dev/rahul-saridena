/* ============================================
   DR. RAHUL SARIDENA — MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. NAVBAR SCROLL ─────────────────────── */
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ── 2. MOBILE MENU ───────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav  = document.querySelector('.mobile-nav');
  const closeBtn   = document.querySelector('.mobile-nav .close-btn');

  hamburger?.addEventListener('click', () => {
    mobileNav?.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  closeBtn?.addEventListener('click', () => {
    mobileNav?.classList.remove('open');
    document.body.style.overflow = '';
  });
  mobileNav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── 3. ACTIVE NAV LINK ───────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── 4. HERO BG TRANSITION ────────────────── */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    const img = new Image();
    img.src = heroBg.style.backgroundImage?.replace(/url\(['"]?/, '').replace(/['"]?\)/, '') ||
              getComputedStyle(heroBg).backgroundImage?.replace(/url\(['"]?/, '').replace(/['"]?\)/, '');
    img.onload = () => heroBg.classList.add('loaded');
    setTimeout(() => heroBg.classList.add('loaded'), 100);
  }

  /* ── 5. SCROLL REVEAL ─────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));
  }

  /* ── 6. COUNTER ANIMATION ─────────────────── */
  function animateCounter(el, target, suffix) {
    let start = 0;
    const duration = 1800;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          const target = parseInt(el.dataset.counter);
          const suffix = el.dataset.suffix || '';
          animateCounter(el, target, suffix);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  }

  /* ── 7. GALLERY FILTER ────────────────────── */
  const filterBtns = document.querySelectorAll('[data-filter]');
  const galleryItems = document.querySelectorAll('[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      galleryItems.forEach(item => {
        const cat = item.dataset.category;
        if (filter === 'all' || cat === filter) {
          item.classList.remove('hidden');
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  /* ── 8. LIGHTBOX ──────────────────────────── */
  const lightbox     = document.querySelector('.lightbox');
  const lightboxImg  = document.querySelector('.lightbox-img');
  const lightboxCap  = document.querySelector('.lightbox-caption');
  const lbClose      = document.querySelector('.lightbox-close');
  const lbPrev       = document.querySelector('.lightbox-prev');
  const lbNext       = document.querySelector('.lightbox-next');

  let currentLightboxIndex = 0;
  let galleryImgs = [];

  if (lightbox) {
    galleryImgs = [...document.querySelectorAll('.gallery-item img')];

    document.querySelectorAll('.gallery-item').forEach((item, i) => {
      item.addEventListener('click', () => {
        openLightbox(i);
      });
    });

    function openLightbox(index) {
      currentLightboxIndex = index;
      const src = galleryImgs[index]?.src;
      const title = galleryImgs[index]?.alt || '';
      if (lightboxImg) lightboxImg.src = src;
      if (lightboxCap) lightboxCap.textContent = `${index + 1} / ${galleryImgs.length} — ${title}`;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    lbClose?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });

    lbPrev?.addEventListener('click', () => {
      currentLightboxIndex = (currentLightboxIndex - 1 + galleryImgs.length) % galleryImgs.length;
      openLightbox(currentLightboxIndex);
    });

    lbNext?.addEventListener('click', () => {
      currentLightboxIndex = (currentLightboxIndex + 1) % galleryImgs.length;
      openLightbox(currentLightboxIndex);
    });

    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lbPrev?.click();
      if (e.key === 'ArrowRight') lbNext?.click();
    });
  }

  /* ── 9. CONTACT FORM ──────────────────────── */
  const contactForm = document.querySelector('#contact-form');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = '✓ Message Sent!';
    btn.style.background = '#22c55e';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.disabled = false;
      contactForm.reset();
    }, 3000);
  });

  /* ── 10. MARQUEE DUPLICATE ────────────────── */
  document.querySelectorAll('.marquee-track').forEach(track => {
    const clone = track.innerHTML;
    track.innerHTML += clone;
  });

  /* ── 11. SMOOTH ANCHOR LINKS ──────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── 12. STICKY HEADER OFFSET ─────────────── */
  document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
    });
  });

});
