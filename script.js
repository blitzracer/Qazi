(() => {
  'use strict';

  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  const year = document.getElementById('year');
  const heroVisual = document.querySelector('.hero-visual');
  const heroFrame = document.querySelector('.hero-photo-wrap');

  if (year) year.textContent = new Date().getFullYear();

  // Reveal content gently as it enters the viewport.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -28px 0px' });
    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${(index % 4) * 55}ms`;
      observer.observe(item);
    });
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }

  // Mobile menu: one source of truth for open/closed state.
  const isMobile = () => window.matchMedia('(max-width: 700px)').matches;
  const setMenu = (open) => {
    if (!menuToggle || !nav) return;
    const shouldOpen = Boolean(open) && isMobile();
    menuToggle.setAttribute('aria-expanded', String(shouldOpen));
    menuToggle.setAttribute('aria-label', shouldOpen ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('open', shouldOpen);
    document.body.classList.toggle('menu-open', shouldOpen);
    nav.setAttribute('aria-hidden', String(!shouldOpen && isMobile()));
  };

  if (menuToggle && nav) {
    nav.setAttribute('aria-hidden', String(isMobile()));
    menuToggle.addEventListener('click', (event) => {
      event.preventDefault();
      setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenu(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setMenu(false);
        menuToggle.focus();
      }
    });

    document.addEventListener('click', (event) => {
      if (menuToggle.getAttribute('aria-expanded') !== 'true') return;
      if (nav.contains(event.target) || menuToggle.contains(event.target)) return;
      setMenu(false);
    });

    window.addEventListener('resize', () => {
      if (!isMobile()) {
        nav.classList.remove('open');
        nav.setAttribute('aria-hidden', 'false');
        document.body.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation');
      } else {
        nav.setAttribute('aria-hidden', String(menuToggle.getAttribute('aria-expanded') !== 'true'));
      }
    }, { passive: true });
  }

  // Subtle hero image tilt on mouse devices only.
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (heroVisual && heroFrame && canHover) {
    heroVisual.addEventListener('pointermove', (event) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      heroFrame.style.transform = `rotate(2deg) rotateX(${-y * 3}deg) rotateY(${x * 4}deg)`;
    });
    heroVisual.addEventListener('pointerleave', () => {
      heroFrame.style.transform = '';
    });
  }
})();
