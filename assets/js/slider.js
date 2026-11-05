/**
 * BOVICURE & FEEDS™ – SLIDER & CAROUSEL ENGINE
 * Zero-dependency Vanilla JS Sliders with Swipe, Autoplay, & Staggered Transitions
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initHeroSliders();
    initCarousels();
  });

  /**
   * 1. Hero Sliders Engine – Continuous, Premium Automatic 5-Second Rotation
   */
  function initHeroSliders() {
    const heroSliders = document.querySelectorAll('.hero-slider-section');

    heroSliders.forEach(slider => {
      const slides = slider.querySelectorAll('.hero-slide');
      const dotsContainer = slider.querySelector('.slider-pagination-dots');
      const prevBtn = slider.querySelector('.slider-prev');
      const nextBtn = slider.querySelector('.slider-next');

      if (!slides.length) return;

      let currentIndex = 0;
      let autoplayTimer = null;
      const autoplayDelay = 5000; // Continuous 5 seconds slide interval
      let isTransitioning = false;

      // Build pagination dots
      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        slides.forEach((_, idx) => {
          const dot = document.createElement('div');
          dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
          dot.setAttribute('data-slide-to', idx);
          dot.setAttribute('role', 'button');
          dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
          dot.addEventListener('click', (e) => {
            e.preventDefault();
            if (idx === currentIndex || isTransitioning) return;
            goToSlide(idx, idx > currentIndex ? 'next' : 'prev');
            resetAutoplay();
          });
          dotsContainer.appendChild(dot);
        });
      }

      function goToSlide(targetIndex, direction = 'next') {
        if (isTransitioning) return;
        const normalizedTarget = (targetIndex + slides.length) % slides.length;
        if (normalizedTarget === currentIndex) return;

        isTransitioning = true;
        const outgoingSlide = slides[currentIndex];
        const incomingSlide = slides[normalizedTarget];

        // Clean any lingering state on all slides except current
        slides.forEach((s, idx) => {
          if (idx !== currentIndex && idx !== normalizedTarget) {
            s.classList.remove('active', 'slide-outgoing');
          }
        });

        // Mark outgoing slide to crossfade away smoothly
        outgoingSlide.classList.remove('active');
        outgoingSlide.classList.add('slide-outgoing');

        // Activate incoming slide with fresh animation trigger
        incomingSlide.classList.add('active');

        // Update pagination dots
        if (dotsContainer) {
          const dots = dotsContainer.querySelectorAll('.slider-dot');
          dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === normalizedTarget);
          });
        }

        currentIndex = normalizedTarget;

        // Reset transition lock and clean outgoing after CSS transition finishes
        setTimeout(() => {
          if (outgoingSlide) {
            outgoingSlide.classList.remove('slide-outgoing');
          }
          isTransitioning = false;
        }, 1300);
      }

      function nextSlide() {
        goToSlide(currentIndex + 1, 'next');
      }

      function prevSlide() {
        goToSlide(currentIndex - 1, 'prev');
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          prevSlide();
          resetAutoplay();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          nextSlide();
          resetAutoplay();
        });
      }

      // Continuous automatic rotation engine
      function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(() => {
          if (document.visibilityState !== 'hidden') {
            nextSlide();
          }
        }, autoplayDelay);
      }

      function stopAutoplay() {
        if (autoplayTimer) {
          clearInterval(autoplayTimer);
          autoplayTimer = null;
        }
      }

      function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
      }

      // Window tab visibility listener to avoid out-of-focus queue lag
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          startAutoplay();
        } else {
          stopAutoplay();
        }
      });

      // Touch / Swipe support
      let touchStartX = 0;
      let touchEndX = 0;

      slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });

      function handleSwipe() {
        const threshold = 40;
        const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
        const diff = touchEndX - touchStartX;

        if (Math.abs(diff) > threshold) {
          if (diff < 0) {
            isRtl ? prevSlide() : nextSlide();
          } else {
            isRtl ? nextSlide() : prevSlide();
          }
          resetAutoplay();
        }
      }

      // Start automatic 5-second continuous rotation immediately
      startAutoplay();
    });
  }

  /**
   * 2. Multi-Item Card Carousels (Products, Testimonials, Blog)
   */
  function initCarousels() {
    const carousels = document.querySelectorAll('.carousel-container');

    carousels.forEach(carousel => {
      const track = carousel.querySelector('.carousel-track');
      const prevBtn = carousel.querySelector('.carousel-prev');
      const nextBtn = carousel.querySelector('.carousel-next');

      if (!track) return;

      const items = track.children;
      let currentIndex = 0;
      let isDown = false;
      let startX = 0;
      let scrollLeftPos = 0;

      // Mouse drag scroll
      track.style.cursor = 'grab';

      track.addEventListener('mousedown', (e) => {
        isDown = true;
        track.style.cursor = 'grabbing';
        startX = e.pageX - track.offsetLeft;
        scrollLeftPos = track.scrollLeft;
      });

      track.addEventListener('mouseleave', () => {
        isDown = false;
        track.style.cursor = 'grab';
      });

      track.addEventListener('mouseup', () => {
        isDown = false;
        track.style.cursor = 'grab';
      });

      track.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 1.5;
        track.scrollLeft = scrollLeftPos - walk;
      });

      // Controls
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          const itemWidth = items[0] ? items[0].offsetWidth + 24 : 320;
          track.scrollBy({ left: -itemWidth, behavior: 'smooth' });
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          const itemWidth = items[0] ? items[0].offsetWidth + 24 : 320;
          track.scrollBy({ left: itemWidth, behavior: 'smooth' });
        });
      }
    });
  }
})();
