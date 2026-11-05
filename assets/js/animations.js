/**
 * BOVICURE & FEEDS™ – WOW ANIMATIONS & ADVANCED MOTION ENGINE
 * Vanilla JS IntersectionObserver, SPA Page Transitions, Staggered Card Entrances,
 * Typography Split-Word Reveals, Cursor Spotlight & Micro-Interactions
 */

(function () {
  'use strict';

  // Check user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * 0. Immediate Page Entrance & Exit Controller (Single Page App Feel)
   */
  function markPageLoaded() {
    if (document.body) {
      document.body.classList.remove('page-transitioning-out');
      document.body.classList.add('page-loaded');
    }
  }

  // Ensure body is revealed without delay
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', markPageLoaded);
  } else {
    markPageLoaded();
  }
  window.addEventListener('load', markPageLoaded);
  window.addEventListener('pageshow', (event) => {
    // When restored from bfcache
    markPageLoaded();
  });

  /**
   * Smooth Page Transitions on Internal Link Navigation
   */
  function initPageTransitions() {
    if (prefersReducedMotion) return;

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // Filter out non-navigating links, protocols, modals, or external domains
      if (
        link.target === '_blank' ||
        href.startsWith('#') ||
        href.startsWith('javascript:') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('sms:') ||
        href.startsWith('whatsapp:') ||
        link.hasAttribute('download') ||
        link.hasAttribute('data-no-transition') ||
        e.defaultPrevented ||
        e.metaKey || e.ctrlKey || e.shiftKey || e.altKey ||
        e.button !== 0
      ) {
        return;
      }

      // Check URL destination host
      let targetUrl;
      try {
        targetUrl = new URL(link.href, window.location.href);
      } catch (err) {
        return;
      }

      if (targetUrl.origin !== window.location.origin) {
        return;
      }

      // If linking to same path with just a hash jump, do not animate out
      if (targetUrl.pathname === window.location.pathname && targetUrl.hash) {
        return;
      }

      // If linking to identical current page
      if (targetUrl.href === window.location.href) {
        return;
      }

      e.preventDefault();
      document.body.classList.add('page-transitioning-out');

      setTimeout(() => {
        window.location.href = link.href;
      }, 200);

      // Failsafe timeout in case navigation is cancelled
      setTimeout(() => {
        document.body.classList.remove('page-transitioning-out');
      }, 1200);
    });
  }

  /**
   * 1. Automatic Grid Staggering & Scroll-Triggered Reveal with IntersectionObserver
   */
  let revealObserver = null;

  function initScrollReveal() {
    // Auto-stagger grid containers across all pages
    const gridContainers = document.querySelectorAll(
      '.grid-2, .grid-3, .grid-4, .product-grid, .category-grid, .services-grid, .blog-grid, .testimonials-track, .values-grid, .team-grid, .facility-grid, .cert-grid, .timeline-grid, .stats-section .grid-4'
    );

    gridContainers.forEach(container => {
      const children = Array.from(container.children);
      children.forEach((child, idx) => {
        // If not already decorated with a reveal class, add reveal-up
        if (!child.classList.contains('reveal') &&
            !child.classList.contains('reveal-up') &&
            !child.classList.contains('reveal-left') &&
            !child.classList.contains('reveal-right') &&
            !child.classList.contains('reveal-zoom')) {
          child.classList.add('reveal-up');
        }

        // Apply automatic cascading stagger delay if not manually set
        if (!child.style.transitionDelay && !Array.from(child.classList).some(c => c.startsWith('delay-'))) {
          const delay = Math.min(idx * 0.08, 0.56);
          child.style.transitionDelay = `${delay}s`;
        }
      });
    });

    const revealElements = document.querySelectorAll(
      '.reveal:not(.is-revealed), .reveal-up:not(.is-revealed), .reveal-left:not(.is-revealed), .reveal-right:not(.is-revealed), .reveal-zoom:not(.is-revealed)'
    );

    if (!revealElements.length) return;

    if (!revealObserver) {
      const observerOptions = {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.08
      };

      revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);
    }

    revealElements.forEach(el => revealObserver.observe(el));
  }

  /**
   * 2. Editorial Typography Split-Word Reveals
   */
  function initSplitText() {
    if (prefersReducedMotion) return;

    // Target prominent section headings that haven't been split yet
    const headlines = document.querySelectorAll('.section-title:not([data-split-done]), .split-reveal:not([data-split-done])');

    headlines.forEach(headline => {
      // Don't split if headline contains complex nested inputs or widgets
      if (headline.querySelector('input, button, select, textarea, form')) return;

      const text = headline.innerText.trim();
      if (!text || text.length > 120) return; // Keep long paragraphs intact

      const words = text.split(/\s+/);
      if (words.length <= 1) return;

      headline.setAttribute('data-split-done', 'true');
      headline.setAttribute('aria-label', text); // preserve accessibility for screen readers

      const wrappedHtml = words.map((word, idx) => {
        const delay = (idx * 0.045).toFixed(3);
        return `<span class="split-word-mask" aria-hidden="true"><span class="split-word-inner" style="transition-delay: ${delay}s">${word}</span></span>`;
      }).join(' ');

      headline.innerHTML = wrappedHtml;

      // If headline or its section is already inside viewport or revealed, show words
      if (headline.classList.contains('is-revealed') || headline.closest('.is-revealed')) {
        headline.querySelectorAll('.split-word-mask').forEach(m => m.classList.add('is-revealed'));
      }
    });
  }

  /**
   * 3. Smooth Animated Counters with Easing
   */
  function initAnimatedCounters() {
    const counters = document.querySelectorAll('.counter-val:not(.counted), .stat-card-value:not(.counted)');
    if (!counters.length) return;

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          counter.classList.add('counted');

          const rawText = counter.getAttribute('data-target') || counter.textContent.trim();
          const prefixMatch = rawText.match(/^([^\d\.\,\s]+)/);
          const prefix = prefixMatch ? prefixMatch[1] : '';
          const suffixMatch = rawText.match(/([^\d\.\,\s]+)$/);
          const suffix = suffixMatch && suffixMatch[1] !== prefix ? ' ' + suffixMatch[1] : (rawText.endsWith('%') ? '%' : '');

          const numericString = rawText.replace(/[^0-9.]/g, '');
          const isDecimal = numericString.includes('.');
          const target = parseFloat(numericString) || 0;

          if (isNaN(target) || target === 0) return;

          const duration = 1800;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // EaseOutExpo easing
            const easeOutProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentCount = easeOutProgress * target;

            const formatted = isDecimal ? currentCount.toFixed(1) : Math.floor(currentCount).toLocaleString();
            counter.textContent = `${prefix}${formatted}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              const finalFormatted = isDecimal ? target.toFixed(1) : Math.floor(target).toLocaleString();
              counter.textContent = `${prefix}${finalFormatted}${suffix}`;
            }
          }

          requestAnimationFrame(updateCounter);
          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.15 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  /**
   * 4. Magnetic Hover Physics on Primary Action Buttons
   */
  function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.btn-magnetic, .btn-primary.btn-lg, .action-float-btn');

    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /**
   * 5. Parallax Tilt Effect for Floating Visual Cards
   */
  function initParallaxCards() {
    const cards = document.querySelectorAll('.parallax-card');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        card.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /**
   * 6. Universal Material Click Ripple Effect on ALL Buttons & Controls
   */
  function initButtonRipples() {
    document.addEventListener('click', (e) => {
      const targetBtn = e.target.closest(
        '.btn, .btn-icon, .action-btn, .action-float-btn, .control-pill, .qty-btn, .read-more-btn, .social-icon-btn, .slider-arrow-btn, .modal-close-btn, .tab-pill, .category-filter-item, .tbl-action-btn, .sidebar-link'
      );
      if (!targetBtn) return;

      const rect = targetBtn.getBoundingClientRect();
      const diameter = Math.max(rect.width, rect.height) * 1.5;
      const x = e.clientX - rect.left - diameter / 2;
      const y = e.clientY - rect.top - diameter / 2;

      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      ripple.style.width = `${diameter}px`;
      ripple.style.height = `${diameter}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      const prevPosition = window.getComputedStyle(targetBtn).position;
      if (prevPosition === 'static') {
        targetBtn.style.position = 'relative';
      }
      targetBtn.style.overflow = 'hidden';

      targetBtn.appendChild(ripple);

      ripple.addEventListener('animationend', () => {
        ripple.remove();
      });
    });
  }

  /**
   * 7. Button Shimmer Glow Effect
   */
  function initButtonShimmer() {
    document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline, .btn-outline-white').forEach(btn => {
      btn.classList.add('btn-shimmer');
    });
  }

  /**
   * 8. Interactive Top Scroll Progress Bar
   */
  function initScrollProgressBar() {
    let progressBar = document.getElementById('scrollProgressBar');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.id = 'scrollProgressBar';
      progressBar.setAttribute('aria-hidden', 'true');
      document.body.prepend(progressBar);
    }

    function updateProgress() {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) {
        progressBar.style.width = '0%';
        return;
      }
      const scrollPercent = (window.scrollY / scrollHeight) * 100;
      progressBar.style.width = `${Math.min(Math.max(scrollPercent, 0), 100)}%`;
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();
  }

  /**
   * 9. Dynamic Cursor Spotlight Glow on Cards
   */
  function initCardSpotlight() {
    const cards = document.querySelectorAll(
      '.product-card:not(.spotlight-bound), .feature-box:not(.spotlight-bound), .testimonial-card:not(.spotlight-bound), .service-card:not(.spotlight-bound), .blog-card:not(.spotlight-bound), .dashboard-card:not(.spotlight-bound), .service-detail-card:not(.spotlight-bound), .stat-item:not(.spotlight-bound), .facility-tour-card:not(.spotlight-bound)'
    );

    cards.forEach(card => {
      card.classList.add('spotlight-active', 'spotlight-bound');
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  /**
   * DOM Ready Initialization
   */
  document.addEventListener('DOMContentLoaded', () => {
    markPageLoaded();
    initPageTransitions();
    initButtonRipples();
    initButtonShimmer();
    initScrollProgressBar();

    if (!prefersReducedMotion) {
      initScrollReveal();
      initSplitText();
      initAnimatedCounters();
      initMagneticButtons();
      initParallaxCards();
      initCardSpotlight();
    } else {
      document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-zoom').forEach(el => {
        el.classList.add('is-revealed');
      });
      document.querySelectorAll('.counter-val').forEach(counter => {
        counter.textContent = counter.getAttribute('data-target') || counter.textContent;
      });
    }
  });

  // Export globals
  window.initScrollReveal = initScrollReveal;
  window.initAnimatedCounters = initAnimatedCounters;
  window.initButtonRipples = initButtonRipples;
  window.initCardSpotlight = initCardSpotlight;
  window.initScrollProgressBar = initScrollProgressBar;
  window.initSplitText = initSplitText;
  window.markPageLoaded = markPageLoaded;
})();
