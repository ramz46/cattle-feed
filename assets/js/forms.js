/**
 * BOVICURE & FEEDS™ – FORMS, VALIDATION & INTERACTIVE NUTRITION CALCULATOR
 * Validates Contact/Bulk order forms, parses query params, & powers the Cattle Ration Calculator
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initContactForm();
    initNewsletterForms();
    initNutritionCalculator();
    initQuickSearch();

    // Enforce numeric phone validation across all phone inputs
    document.querySelectorAll('input[type="tel"], input[name="phone"]').forEach(setupPhoneInputRestriction);
  });

  /**
   * Phone Number Strict Number & Symbol Enforcement
   * Prevents typing, pasting, autofilling, or submitting letters/alphabets in phone fields.
   */
  function setupPhoneInputRestriction(phoneInput) {
    if (!phoneInput || phoneInput.dataset.phoneRestricted) return;
    phoneInput.dataset.phoneRestricted = 'true';

    // Helper to get or create error message span below input
    function getErrorSpan(input) {
      let errSpan = input.parentElement ? input.parentElement.querySelector('.form-error-msg') : null;
      if (!errSpan && input.parentElement) {
        errSpan = document.createElement('span');
        errSpan.className = 'form-error-msg';
        errSpan.style.color = 'var(--danger)';
        errSpan.style.fontSize = '0.78rem';
        errSpan.style.display = 'block';
        errSpan.style.marginTop = '0.25rem';
        errSpan.style.transition = 'opacity 0.2s ease';
        input.parentElement.appendChild(errSpan);
      }
      return errSpan;
    }

    let warningTimer = null;
    function showTemporaryWarning(msg) {
      const errSpan = getErrorSpan(phoneInput);
      if (errSpan) {
        errSpan.textContent = msg;
        phoneInput.style.borderColor = 'var(--danger)';
        clearTimeout(warningTimer);
        warningTimer = setTimeout(() => {
          const currentVal = phoneInput.value.trim();
          if (!/[a-zA-Z]/.test(currentVal)) {
            errSpan.textContent = '';
            phoneInput.style.borderColor = '';
          }
        }, 2500);
      }
    }

    // 1. Intercept keydown to block alphabets and unwanted special characters instantly
    phoneInput.addEventListener('keydown', (e) => {
      // Allow navigation and editing control keys
      const functionalKeys = [
        'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Home', 'End'
      ];
      if (functionalKeys.includes(e.key)) return;

      // Allow Ctrl / Cmd combinations (e.g. Copy, Paste, Cut, Select All, Undo)
      if (e.ctrlKey || e.metaKey) return;

      // Single printable characters: allow ONLY numbers and standard phone symbols (+, -, (, ), ., space)
      if (e.key && e.key.length === 1) {
        if (/[a-zA-Z]/.test(e.key)) {
          e.preventDefault();
          showTemporaryWarning('Alphabets are not allowed. Please enter numbers only.');
          return;
        }
        if (!/[0-9+\-\s().]/.test(e.key)) {
          e.preventDefault();
          showTemporaryWarning('Only numbers and phone symbols (+, -, parentheses, spaces) are allowed.');
          return;
        }
      }
    });

    // 2. Real-time input cleaner (handles mobile keyboards, autocompletes, drag-drop, speech-to-text)
    phoneInput.addEventListener('input', () => {
      const raw = phoneInput.value;
      if (/[a-zA-Z]/.test(raw)) {
        phoneInput.value = raw.replace(/[a-zA-Z]/g, '').replace(/[^0-9+\-\s().]/g, '');
        showTemporaryWarning('Alphabets are not allowed in the phone number and were removed.');
      } else if (/[^0-9+\-\s().]/.test(raw)) {
        phoneInput.value = raw.replace(/[^0-9+\-\s().]/g, '');
        showTemporaryWarning('Invalid characters removed. Numbers only.');
      } else {
        const errSpan = phoneInput.parentElement ? phoneInput.parentElement.querySelector('.form-error-msg') : null;
        if (errSpan && errSpan.textContent.includes('Alphabets')) {
          errSpan.textContent = '';
          phoneInput.style.borderColor = '';
        }
      }
    });

    // 3. Paste event sanitization
    phoneInput.addEventListener('paste', (e) => {
      const pasted = (e.clipboardData || window.clipboardData)?.getData('text');
      if (pasted && /[a-zA-Z]/.test(pasted)) {
        e.preventDefault();
        const cleaned = pasted.replace(/[a-zA-Z]/g, '').replace(/[^0-9+\-\s().]/g, '');
        const start = phoneInput.selectionStart || 0;
        const end = phoneInput.selectionEnd || 0;
        const current = phoneInput.value;
        phoneInput.value = current.slice(0, start) + cleaned + current.slice(end);
        phoneInput.setSelectionRange(start + cleaned.length, start + cleaned.length);
        showTemporaryWarning('Letters were stripped from the pasted phone number. Numbers only.');
      }
    });
  }

  /**
   * 1. Contact & Bulk Order Form Validation & Query Parameter Auto-Fill
   */
  function initContactForm() {
    const contactForm = document.getElementById('contactOrderForm');
    if (!contactForm) return;

    // Check URL parameters to prefill form
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const typeParam = urlParams.get('type');
      const planParam = urlParams.get('plan');
      const authorParam = urlParams.get('author');

      if (typeParam === 'bulk') {
        const productSelect = contactForm.querySelector('[name="productInterest"]');
        const quantityInput = contactForm.querySelector('[name="quantity"]');
        if (productSelect) productSelect.value = "Ultra-Lact Pro High-Yield Dairy Feed";
        if (quantityInput) quantityInput.value = "25";
        const messageInput = contactForm.querySelector('[name="message"]');
        if (messageInput && !messageInput.value) {
          messageInput.value = "Inquiring about bulk delivery and freight discount rates for scheduled silo replenishment.";
        }
      } else if (typeParam === 'custom-ration') {
        const productSelect = contactForm.querySelector('[name="productInterest"]');
        if (productSelect) productSelect.value = "Custom TMR Formulation";
        const messageInput = contactForm.querySelector('[name="message"]');
        if (messageInput && !messageInput.value) {
          messageInput.value = "Generated from online Cattle Ration Calculator. Requesting custom balanced formulation for our milking herd.";
        }
      }

      if (planParam) {
        const productSelect = contactForm.querySelector('[name="productInterest"]');
        if (productSelect) productSelect.value = "General Veterinary / Farm Consultation";
        const messageInput = contactForm.querySelector('[name="message"]');
        let planTitle = "Consultation Package";
        if (planParam === 'single-audit') planTitle = "Single Forage Audit ($249 one-time)";
        if (planParam === 'partner') planTitle = "Commercial Herd Partner (FREE with feed contract)";
        if (planParam === 'enterprise') planTitle = "Rotary & Robotic Mega-Dairy Enterprise Plan";
        if (messageInput && !messageInput.value) {
          messageInput.value = `Requesting enrollment in the: ${planTitle}. Please contact us to schedule the initial on-farm herd audit.`;
        }
      }

      if (authorParam) {
        const messageInput = contactForm.querySelector('[name="message"]');
        if (messageInput && !messageInput.value) {
          messageInput.value = `Inquiry directed to Dr. Frank Morales regarding bunker silage management and microbial inoculants.`;
        }
      }
    } catch (e) {}

    // Initialize phone restriction on contact form phone input
    const contactPhoneInput = contactForm.querySelector('[name="phone"]');
    if (contactPhoneInput) {
      setupPhoneInputRestriction(contactPhoneInput);
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const nameInput = contactForm.querySelector('[name="fullName"]');
      const emailInput = contactForm.querySelector('[name="email"]');
      const phoneInput = contactForm.querySelector('[name="phone"]');
      const quantityInput = contactForm.querySelector('[name="quantity"]');

      // Validation helper
      function validateField(input, condition, errorMsg) {
        let errSpan = input.parentElement.querySelector('.form-error-msg');
        if (!errSpan) {
          errSpan = document.createElement('span');
          errSpan.className = 'form-error-msg';
          errSpan.style.color = 'var(--danger)';
          errSpan.style.fontSize = '0.78rem';
          errSpan.style.display = 'block';
          errSpan.style.marginTop = '0.25rem';
          input.parentElement.appendChild(errSpan);
        }

        if (!condition) {
          input.style.borderColor = 'var(--danger)';
          errSpan.textContent = errorMsg;
          isValid = false;
        } else {
          input.style.borderColor = 'var(--success)';
          errSpan.textContent = '';
        }
      }

      if (nameInput) validateField(nameInput, nameInput.value.trim().length >= 3, 'Please enter your full name (min 3 chars).');
      if (emailInput) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        validateField(emailInput, emailRegex.test(emailInput.value.trim()), 'Please enter a valid email address.');
      }
      if (phoneInput) {
        const phoneVal = phoneInput.value.trim();
        const hasAlphabets = /[a-zA-Z]/.test(phoneVal);
        const digits = (phoneVal.match(/\d/g) || []).length;
        const validPhoneRegex = /^[0-9+\-\s().]{7,25}$/;

        if (!phoneVal) {
          validateField(phoneInput, false, 'Phone number is required.');
        } else if (hasAlphabets) {
          validateField(phoneInput, false, 'Alphabets are not allowed. Please enter numbers only.');
        } else if (digits < 7 || !validPhoneRegex.test(phoneVal)) {
          validateField(phoneInput, false, 'Please provide a valid contact phone number (at least 7 digits).');
        } else {
          validateField(phoneInput, true, '');
        }
      }
      if (quantityInput && quantityInput.value) {
        validateField(quantityInput, parseInt(quantityInput.value, 10) > 0, 'Quantity must be at least 1.');
      }

      if (isValid) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting Farm Inquiry...';

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          contactForm.reset();

          // Reset borders
          contactForm.querySelectorAll('input, select, textarea').forEach(el => el.style.borderColor = '');

          if (window.showToast) {
            window.showToast('Inquiry submitted successfully! Our agricultural specialist will contact you within 2 hours.', 'success', 6000);
          }
        }, 1100);
      }
    });
  }

  /**
   * 2. Newsletter Forms
   */
  function initNewsletterForms() {
    const forms = document.querySelectorAll('.newsletter-form');

    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        if (!input) return;

        const email = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
          if (window.showToast) window.showToast('Please enter a valid email address.', 'warning');
          return;
        }

        const btn = form.querySelector('button[type="submit"]');
        const origBtnText = btn ? btn.innerHTML : '';
        if (btn) {
          btn.disabled = true;
          btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        }

        setTimeout(() => {
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = origBtnText;
          }
          input.value = '';
          if (window.showToast) {
            window.showToast('Subscribed! You will receive our monthly Cattle Nutrition Bulletin.', 'success');
          }
        }, 800);
      });
    });
  }

  /**
   * 3. Interactive Cattle Nutrition & Ration Calculator with Dynamic Gauges
   */
  function initNutritionCalculator() {
    const calcForm = document.getElementById('rationCalculatorForm');
    if (!calcForm) return;

    const animalTypeSelect = document.getElementById('calcAnimalType');
    const bodyWeightInput = document.getElementById('calcBodyWeight');
    const milkYieldInput = document.getElementById('calcMilkYield');
    const weightValDisplay = document.getElementById('calcWeightVal');
    const milkValDisplay = document.getElementById('calcMilkVal');

    // Result elements
    const dmiResult = document.getElementById('calcDMI');
    const cpResult = document.getElementById('calcCP');
    const concentrateResult = document.getElementById('calcConcentrate');
    const forageResult = document.getElementById('calcForage');
    const mineralResult = document.getElementById('calcMineral');

    // Visual gauge bars
    const dmiBar = document.getElementById('calcDmiBar');
    const concentrateBar = document.getElementById('calcConcentrateBar');

    function calculateRation() {
      const type = animalTypeSelect ? animalTypeSelect.value : 'lactating';
      const weight = parseFloat(bodyWeightInput ? bodyWeightInput.value : 550);
      const milk = parseFloat(milkYieldInput ? milkYieldInput.value : 22);

      if (weightValDisplay) weightValDisplay.textContent = `${weight} kg`;
      if (milkValDisplay) milkValDisplay.textContent = `${milk} Liters/day`;

      let dmiPercentage = 0.03; // Default 3% of body weight
      let concentratePerMilk = 0.42;
      let maintenanceConcentrate = 1.8;
      let dailyMineral = 60 + (milk * 1.5);

      if (type === 'lactating') {
        dmiPercentage = 0.033;
        concentratePerMilk = 0.42;
        maintenanceConcentrate = 1.8;
        dailyMineral = 60 + (milk * 1.5);
      } else if (type === 'dry') {
        dmiPercentage = 0.022;
        concentratePerMilk = 0;
        maintenanceConcentrate = 2.0;
        dailyMineral = 50;
      } else if (type === 'calf') {
        dmiPercentage = 0.028;
        concentratePerMilk = 0;
        maintenanceConcentrate = weight * 0.015;
        dailyMineral = 25;
      } else if (type === 'beef') {
        dmiPercentage = 0.026;
        concentratePerMilk = 0;
        maintenanceConcentrate = weight * 0.012;
        dailyMineral = 45;
      }

      // Dry Matter Intake (kg/day)
      const totalDMI = (weight * dmiPercentage) + (type === 'lactating' ? (milk * 0.1) : 0);
      // Total Concentrate Feed required (kg/day)
      const totalConcentrate = maintenanceConcentrate + (type === 'lactating' ? (milk * concentratePerMilk) : 0);
      // Green Forage / Silage requirement (Fresh basis ~25% DM)
      const forageDM = Math.max(totalDMI - (totalConcentrate * 0.88), 1);
      const freshForage = forageDM / 0.25;
      // Crude protein estimate (g/day)
      const totalCP = (weight * 0.0012) + (type === 'lactating' ? (milk * 0.085) : 0);

      // Render Values
      if (dmiResult) dmiResult.textContent = `${totalDMI.toFixed(1)} kg`;
      if (cpResult) cpResult.textContent = `${(totalCP * 1000).toFixed(0)} g`;
      if (concentrateResult) concentrateResult.textContent = `${totalConcentrate.toFixed(1)} kg`;
      if (forageResult) forageResult.textContent = `${freshForage.toFixed(1)} kg`;
      if (mineralResult) mineralResult.textContent = `${dailyMineral.toFixed(0)} g`;

      // Update Gauge Bar Widths
      if (dmiBar) {
        const dmiPercent = Math.min((totalDMI / 30) * 100, 100);
        dmiBar.style.width = `${dmiPercent}%`;
      }
      if (concentrateBar) {
        const concPercent = Math.min((totalConcentrate / 20) * 100, 100);
        concentrateBar.style.width = `${concPercent}%`;
      }
    }

    if (bodyWeightInput) bodyWeightInput.addEventListener('input', calculateRation);
    if (milkYieldInput) milkYieldInput.addEventListener('input', calculateRation);
    if (animalTypeSelect) animalTypeSelect.addEventListener('change', calculateRation);

    // Initial calculation
    calculateRation();
  }

  /**
   * 4. Global Quick Search Modal
   */
  function initQuickSearch() {
    const searchBtns = document.querySelectorAll('.search-toggle-btn');
    const modal = document.getElementById('searchModal');
    const closeBtn = document.getElementById('closeSearchModal');
    const input = document.getElementById('globalSearchInput');
    const resultsContainer = document.getElementById('globalSearchResults');

    if (!modal) return;

    searchBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (input) {
          input.value = '';
          setTimeout(() => input.focus(), 100);
          if (resultsContainer) {
            resultsContainer.innerHTML = '<p style="color: var(--text-light); text-align: center; padding: 1.5rem 0;">Type at least 2 characters to search cattle feeds & medicines...</p>';
          }
        }
      });
    });

    function closeSearch() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeSearch);
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeSearch();
    });

    if (input && resultsContainer) {
      input.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (query.length < 2) {
          resultsContainer.innerHTML = '<p style="color: var(--text-light); text-align: center; padding: 1.5rem 0;">Type at least 2 characters to search cattle feeds & medicines...</p>';
          return;
        }

        const matches = (window.PRODUCTS_DATA || []).filter(item => 
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
        );

        if (!matches.length) {
          resultsContainer.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 1.5rem 0;">No matching products found for "<strong>${query}</strong>"</p>`;
          return;
        }

        resultsContainer.innerHTML = matches.map(item => `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1rem; background: var(--bg-body); border-radius: var(--radius-md); border: 1px solid var(--border-light); gap: 1rem; transition: transform 0.2s ease;">
            <div style="display: flex; align-items: center; gap: 0.85rem;">
              <img src="${item.image}" alt="${item.name}" style="width: 48px; height: 48px; border-radius: var(--radius-sm); object-fit: cover;">
              <div>
                <h5 style="font-size: 0.95rem; margin-bottom: 0.2rem;">${item.name}</h5>
                <span class="badge badge-primary" style="font-size: 0.72rem;">${item.category}</span>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <strong style="color: var(--primary); font-size: 1.1rem;">$${item.price.toFixed(2)}</strong>
              <button class="btn btn-primary btn-sm" onclick="window.openQuickView(${item.id}); document.getElementById('searchModal').classList.remove('active'); document.body.style.overflow = '';">
                <i class="fa-solid fa-eye"></i> View
              </button>
            </div>
          </div>
        `).join('');
      });
    }
  }

  // Export
  window.initNutritionCalculator = initNutritionCalculator;
  window.setupPhoneInputRestriction = setupPhoneInputRestriction;
})();
