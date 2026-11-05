/**
 * BOVICURE & FEEDS™ – THEME & RTL CONTROLLER
 * Handles Dark/Light Mode & RTL/LTR Layout Direction with localStorage
 * Smooth 60fps transitions and crossfades
 */

(function () {
  'use strict';

  const THEME_STORAGE_KEY = 'bovicure_theme_mode';
  const DIR_STORAGE_KEY = 'bovicure_dir_mode';

  // Apply saved theme and direction immediately to prevent flash
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const savedDir = localStorage.getItem(DIR_STORAGE_KEY) || 'ltr';
    document.documentElement.setAttribute('dir', savedDir);
  } catch (e) {}

  document.addEventListener('DOMContentLoaded', () => {
    initThemeButtons();
    initRtlButtons();
    updateTogglesUI();
  });

  function initThemeButtons() {
    const themeButtons = document.querySelectorAll('.theme-toggle-btn');
    themeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTheme();
      });
    });
  }

  function initRtlButtons() {
    const rtlButtons = document.querySelectorAll('.rtl-toggle-btn');
    rtlButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleRTL();
      });
    });
  }

  let isSwitchingTheme = false;
  function toggleTheme() {
    if (isSwitchingTheme) return;
    isSwitchingTheme = true;

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    const themeButtons = document.querySelectorAll('.theme-toggle-btn');
    themeButtons.forEach(btn => btn.classList.add('btn-spin'));

    document.documentElement.setAttribute('data-theme', newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (e) {}
    updateTogglesUI();

    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: newTheme } }));

    setTimeout(() => {
      themeButtons.forEach(btn => btn.classList.remove('btn-spin'));
      isSwitchingTheme = false;
    }, 350);

    if (window.showToast) {
      window.showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    }
  }

  let isSwitchingDir = false;
  function toggleRTL() {
    if (isSwitchingDir) return;
    isSwitchingDir = true;

    const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
    const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';

    // 1. Trigger icon spin animation on all RTL buttons
    const rtlButtons = document.querySelectorAll('.rtl-toggle-btn');
    rtlButtons.forEach(btn => btn.classList.add('btn-spin'));

    // 2. Add transition class to root for smooth crossfade
    document.documentElement.classList.add('is-switching-dir');

    // 3. Briefly soften opacity then swap direction cleanly
    setTimeout(() => {
      document.documentElement.setAttribute('dir', newDir);
      try {
        localStorage.setItem(DIR_STORAGE_KEY, newDir);
      } catch (e) {}

      updateTogglesUI();

      // Trigger custom event so any sliders/components know direction changed
      window.dispatchEvent(new CustomEvent('directionchange', { detail: { dir: newDir } }));

      // 4. Smoothly restore full view
      setTimeout(() => {
        document.documentElement.classList.remove('is-switching-dir');
        rtlButtons.forEach(btn => btn.classList.remove('btn-spin'));
        isSwitchingDir = false;
      }, 160);

      // Toast feedback
      if (window.showToast) {
        const msg = newDir === 'rtl' 
          ? 'Switched to RTL Layout (Right-to-Left)' 
          : 'Switched to LTR Layout (Left-to-Right)';
        window.showToast(msg, 'info');
      }
    }, 70);
  }

  function updateTogglesUI() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const currentDir = document.documentElement.getAttribute('dir') || 'ltr';

    // Update Theme Icons & Titles (Reflects current active mode)
    const themeButtons = document.querySelectorAll('.theme-toggle-btn');
    themeButtons.forEach(btn => {
      const icon = btn.querySelector('i');
      if (currentTheme === 'dark') {
        if (icon) icon.className = 'fa-solid fa-moon';
        btn.setAttribute('title', 'Dark Mode Active (Click for Light Mode)');
        btn.setAttribute('aria-label', 'Switch to Light Mode');
      } else {
        if (icon) icon.className = 'fa-solid fa-sun';
        btn.setAttribute('title', 'Light Mode Active (Click for Dark Mode)');
        btn.setAttribute('aria-label', 'Switch to Dark Mode');
      }
    });

    // Update RTL Icons, Titles & Active States
    const rtlButtons = document.querySelectorAll('.rtl-toggle-btn');
    rtlButtons.forEach(btn => {
      const icon = btn.querySelector('i');
      const textSpan = btn.querySelector('.btn-text');
      if (currentDir === 'rtl') {
        if (icon) icon.className = 'fa-solid fa-right-left';
        btn.setAttribute('title', 'RTL Layout Active (Click for LTR Layout)');
        btn.setAttribute('aria-label', 'Switch to LTR Layout');
        btn.classList.add('is-rtl-active');
        if (textSpan) textSpan.textContent = 'LTR';
      } else {
        if (icon) icon.className = 'fa-solid fa-right-left';
        btn.setAttribute('title', 'LTR Layout Active (Click for RTL Layout)');
        btn.setAttribute('aria-label', 'Switch to RTL Layout');
        btn.classList.remove('is-rtl-active');
        if (textSpan) textSpan.textContent = 'RTL';
      }
    });
  }

  // Export globals
  window.toggleTheme = toggleTheme;
  window.toggleRTL = toggleRTL;
})();
