/**
 * BOVICURE & FEEDS™ – MAIN SCRIPT
 * Header sticky state, mobile drawer, toast manager, back-to-top, accordions,
 * express checkout modal, policy modals, video modal, and universal button interactions
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initStickyHeader();
    initMobileNav();
    initBackToTop();
    initAccordions();
    highlightActiveNavLink();
    initGlobalWishlist();
    initGlobalModals();
    initBlogInteractions();
    initLivestockCareTabs();
  });

  /**
   * 1. Sticky Header
   */
  function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    function handleScroll() {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
      if (scrollY > 15) {
        header.classList.add('is-sticky');
        header.classList.remove('header-transparent');
      } else {
        header.classList.remove('is-sticky');
        if (header.hasAttribute('data-transparent')) {
          header.classList.add('header-transparent');
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /**
   * 2. Mobile Navigation Drawer
   */
  function initMobileNav() {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const mobileDrawer = document.getElementById('mobileNavDrawer');
    const closeBtn = document.getElementById('closeMobileDrawer');
    const backdrop = document.getElementById('cartBackdrop');

    if (!mobileDrawer) return;

    function openMobileNav() {
      mobileDrawer.classList.add('active');
      if (backdrop) backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeMobileNav() {
      mobileDrawer.classList.remove('active');
      if (backdrop) backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', openMobileNav);
    if (closeBtn) closeBtn.addEventListener('click', closeMobileNav);
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        closeMobileNav();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('active')) {
        closeMobileNav();
      }
    });

    // Submenu toggles inside mobile drawer
    const submenuTriggers = mobileDrawer.querySelectorAll('.mobile-submenu-trigger');
    submenuTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const submenu = trigger.nextElementSibling;
        if (submenu) {
          submenu.classList.toggle('active');
          const icon = trigger.querySelector('.fa-chevron-down');
          if (icon) icon.style.transform = submenu.classList.contains('active') ? 'rotate(180deg)' : '';
        }
      });
    });
  }

  /**
   * 3. Back to Top Button
   */
  function initBackToTop() {
    const btn = document.getElementById('backToTopBtn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /**
   * 4. FAQ & Information Accordions
   */
  function initAccordions() {
    const accordions = document.querySelectorAll('.accordion-header');

    accordions.forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        const isActive = item.classList.contains('active');

        // Close siblings if in exclusive group
        const parent = item.parentElement;
        if (parent && parent.classList.contains('accordion-group-exclusive')) {
          parent.querySelectorAll('.accordion-item').forEach(sibling => {
            sibling.classList.remove('active');
            const icon = sibling.querySelector('.accordion-icon');
            if (icon) icon.style.transform = 'rotate(0deg)';
          });
        }

        if (!isActive) {
          item.classList.add('active');
          const icon = header.querySelector('.accordion-icon');
          if (icon) icon.style.transform = 'rotate(180deg)';
        } else {
          item.classList.remove('active');
          const icon = header.querySelector('.accordion-icon');
          if (icon) icon.style.transform = 'rotate(0deg)';
        }
      });
    });
  }

  /**
   * 5. Active Nav Link Highlighter
   */
  function highlightActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-link, .mobile-nav-link');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
        link.classList.add('active');
      }
    });
  }

  /**
   * 6. Global Wishlist Button Synchronization
   */
  function initGlobalWishlist() {
    document.addEventListener('click', (e) => {
      const wishlistBtn = e.target.closest('.wishlist-btn, [title="Add to Wishlist"]');
      if (!wishlistBtn) return;

      e.preventDefault();
      const idAttr = wishlistBtn.getAttribute('data-id') || wishlistBtn.getAttribute('data-wishlist-id');
      const id = idAttr ? parseInt(idAttr, 10) : 1;

      if (window.toggleWishlist) {
        window.toggleWishlist(id, wishlistBtn);
      } else {
        wishlistBtn.classList.toggle('active');
        const icon = wishlistBtn.querySelector('i');
        const isFav = wishlistBtn.classList.contains('active');
        if (icon) icon.className = isFav ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
        if (window.showToast) {
          window.showToast(isFav ? 'Added to your Farm Wishlist!' : 'Removed from Wishlist', isFav ? 'success' : 'info');
        }
      }
    });
  }

  /**
   * 7. Global Modals (Express Farm Checkout, Policy/Standards & Video Tour)
   */
  function initGlobalModals() {
    // 7A. Express Farm Checkout Modal
    window.openCheckoutModal = function () {
      const cart = window.getCart ? window.getCart() : [];
      if (!cart || !cart.length) {
        if (window.showToast) {
          window.showToast('Your cart is empty! Add products before checking out.', 'warning');
        }
        return;
      }

      // Close cart drawer if open
      if (window.closeCartDrawer) window.closeCartDrawer();

      let modal = document.getElementById('checkoutModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'checkoutModal';
        modal.className = 'modal-overlay';
        modal.setAttribute('aria-label', 'Express Farm Checkout');
        document.body.appendChild(modal);
      }

      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const isFreeShipping = subtotal >= 150.00;
      const freightCost = isFreeShipping ? 0 : 25.00;
      const orderTotal = subtotal + freightCost;

      modal.innerHTML = `
        <div class="modal-dialog checkout-modal-dialog">
          <div class="checkout-modal-header">
            <div class="checkout-header-brand">
              <div class="checkout-header-icon">
                <i class="fa-solid fa-truck-ramp-box"></i>
              </div>
              <div class="checkout-header-texts">
                <h3 class="checkout-modal-title">Express Farm Dispatch Checkout</h3>
                <span class="checkout-modal-subtitle">Direct Mill Order &amp; Freight Schedule</span>
              </div>
            </div>
            <button class="checkout-close-btn" id="closeCheckoutModal" aria-label="Close Checkout Modal">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="checkout-modal-body" id="checkoutModalBody">
            <div class="checkout-grid">
              <!-- Left Form Column -->
              <div class="checkout-form-col">
                <h4 class="checkout-section-title"><i class="fa-solid fa-location-dot"></i> 1. Farm Delivery Location</h4>
                <form id="farmCheckoutForm" novalidate>
                  <div class="checkout-form-group">
                    <label class="checkout-form-label">Contact Name *</label>
                    <input type="text" name="customerName" class="filter-search-input" placeholder="e.g. Marcus Vance" required style="padding: 0.7rem 1rem;" value="Marcus Vance">
                  </div>
                  <div class="checkout-input-row">
                    <div>
                      <label class="checkout-form-label">Farm Name</label>
                      <input type="text" name="farmName" class="filter-search-input" placeholder="Vance Valley Holsteins" style="padding: 0.7rem 1rem;" value="Vance Valley Holsteins">
                    </div>
                    <div>
                      <label class="checkout-form-label">Phone Number *</label>
                      <input type="tel" name="phone" class="filter-search-input" placeholder="+1 (555) 000-0000" required inputmode="tel" autocomplete="tel" pattern="^[0-9+\-\\s().]{7,25}$" title="Please enter a valid phone number (digits only, no letters)." style="padding: 0.7rem 1rem;" value="+1 (515) 390-2810">
                    </div>
                  </div>
                  <div class="checkout-form-group">
                    <label class="checkout-form-label">Farm Delivery Address / GPS *</label>
                    <input type="text" name="deliveryAddress" class="filter-search-input" placeholder="4820 Agri-Valley Rd, Silo B" required style="padding: 0.7rem 1rem;" value="4820 Agri-Valley Rd, Bunker Silo #2">
                  </div>
                  
                  <div class="checkout-form-group">
                    <label class="checkout-form-label">Silo Discharge / Unloading Method</label>
                    <select name="dischargeType" class="sort-select" style="width: 100%; padding: 0.7rem 1rem;">
                      <option value="pneumatic">Pneumatic Tanker Blow-in (Direct to Silo)</option>
                      <option value="palletized">Palletized 50kg HDPE Bags (Forklift on site)</option>
                      <option value="tipping">Heavy Tipping Trailer (Commodity Bay)</option>
                    </select>
                  </div>

                  <h4 class="checkout-section-title payment-title" style="margin-top: 1.5rem;"><i class="fa-solid fa-credit-card"></i> 2. Commercial Payment Terms</h4>
                  <div class="checkout-payment-group">
                    <label class="checkout-payment-option">
                      <input type="radio" name="paymentMethod" value="net30" checked>
                      <div class="payment-option-text">
                        <strong class="payment-option-title">Commercial Farm Account (Net-30 Invoice)</strong>
                        <span class="payment-option-desc">Direct billing for certified agricultural enterprises &amp; cooperatives.</span>
                      </div>
                    </label>
                    <label class="checkout-payment-option">
                      <input type="radio" name="paymentMethod" value="creditCard">
                      <div class="payment-option-text">
                        <strong class="payment-option-title">Credit / Debit Card (Instant Processing)</strong>
                        <span class="payment-option-desc">Visa, MasterCard, Amex, Discover with 256-bit encryption.</span>
                      </div>
                    </label>
                    <label class="checkout-payment-option">
                      <input type="radio" name="paymentMethod" value="ach">
                      <div class="payment-option-text">
                        <strong class="payment-option-title">Bank Wire / ACH Transfer on Dispatch</strong>
                        <span class="payment-option-desc">Receive wiring instructions via email with automated receipt.</span>
                      </div>
                    </label>
                  </div>

                  <button type="submit" class="btn btn-primary btn-lg" id="confirmOrderBtn" style="width: 100%; padding: 0.95rem 1.5rem;">
                    <i class="fa-solid fa-check-circle"></i> Confirm Order &amp; Schedule Dispatch ($${orderTotal.toFixed(2)})
                  </button>
                </form>
              </div>

              <!-- Right Order Summary Column -->
              <div class="checkout-summary-box">
                <h4 class="checkout-summary-title">Order Summary (${cart.length} Products)</h4>
                
                <div class="checkout-cart-items-scroll">
                  ${cart.map(item => `
                    <div class="checkout-cart-item">
                      <div class="checkout-cart-item-info">
                        <img src="${item.image}" alt="${item.name}" class="checkout-cart-item-img">
                        <div>
                          <div class="checkout-cart-item-name" title="${item.name}">${item.name}</div>
                          <span class="checkout-cart-item-meta">${item.quantity} × $${item.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <div class="checkout-cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  `).join('')}
                </div>

                <div class="checkout-totals-block">
                  <div class="checkout-totals-row">
                    <span class="checkout-totals-label">Feed Subtotal:</span>
                    <strong>$${subtotal.toFixed(2)}</strong>
                  </div>
                  <div class="checkout-totals-row">
                    <span class="checkout-totals-label">Freight Logistics:</span>
                    <strong style="color: ${isFreeShipping ? 'var(--success)' : 'var(--text-main)'};">
                      ${isFreeShipping ? '<i class="fa-solid fa-circle-check"></i> FREE Farm Delivery' : `$${freightCost.toFixed(2)}`}
                    </strong>
                  </div>
                  <div class="checkout-totals-row checkout-grand-total">
                    <span>Total Amount:</span>
                    <strong style="color: var(--primary);">$${orderTotal.toFixed(2)}</strong>
                  </div>
                </div>

                <div class="checkout-security-notice">
                  <i class="fa-solid fa-shield-halved" style="color: var(--primary); font-size: 1rem; margin-top: 0.1rem; flex-shrink: 0;"></i>
                  <span>100% NIR Quality Assured • Zero Mycotoxin Tested • 48-Hour Dispatch Guarantee.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Enforce numeric phone validation on modal phone input
      const modalPhone = modal.querySelector('input[name="phone"]');
      if (modalPhone && window.setupPhoneInputRestriction) {
        window.setupPhoneInputRestriction(modalPhone);
      }

      // Attach Close listener
      modal.querySelector('#closeCheckoutModal').addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });

      // Handle Checkout Submission
      const form = modal.querySelector('#farmCheckoutForm');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('#confirmOrderBtn');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Reserving Silo Slot & Processing...';

        setTimeout(() => {
          const orderNumber = 'BOVI-' + Math.floor(10000 + Math.random() * 90000);
          const modalBody = modal.querySelector('#checkoutModalBody');

          modalBody.innerHTML = `
            <div style="text-align: center; padding: 2.5rem 1rem;">
              <div style="width: 80px; height: 80px; border-radius: var(--radius-full); background: var(--success-bg); color: var(--success); display: inline-flex; align-items: center; justify-content: center; font-size: 2.8rem; margin-bottom: 1.25rem;" class="pulse-rings">
                <i class="fa-solid fa-circle-check"></i>
              </div>
              <h2 style="font-size: 1.85rem; margin-bottom: 0.5rem; color: var(--primary);">Order Successfully Confirmed!</h2>
              <div style="display: inline-block; background: var(--bg-body); padding: 0.4rem 1.25rem; border-radius: var(--radius-full); font-weight: 800; font-size: 1.1rem; color: var(--text-main); margin-bottom: 1.25rem; border: 1px solid var(--border-color);">
                Order Reference: <span style="color: var(--secondary);">${orderNumber}</span>
              </div>
              <p style="max-width: 550px; margin: 0 auto 1.75rem; font-size: 1rem; color: var(--text-muted); line-height: 1.6;">
                Thank you! Your feed formulation order has been assigned to our central milling dispatch queue. Your freight coordinator will contact you to verify silo access before pneumatic discharge.
              </p>
              
              <div class="d-flex justify-center gap-2 flex-wrap">
                <button class="btn btn-outline" onclick="window.showToast('Official Bill of Lading & Order Summary downloaded.', 'success')">
                  <i class="fa-solid fa-file-arrow-down"></i> Download Invoice & PO (PDF)
                </button>
                <button class="btn btn-primary" onclick="document.getElementById('checkoutModal').classList.remove('active'); document.body.style.overflow = '';">
                  <i class="fa-solid fa-shop"></i> Return to Storefront
                </button>
              </div>
            </div>
          `;

          // Clear cart
          if (window.clearCart) window.clearCart();

          if (window.showToast) {
            window.showToast(`Order #${orderNumber} placed successfully!`, 'success', 5000);
          }
        }, 1200);
      });
    };

    // 7B. Universal Policy & Standards Modal
    window.openPolicyModal = function (initialTab = 'biosecurity') {
      let modal = document.getElementById('policyModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'policyModal';
        modal.className = 'modal-overlay';
        document.body.appendChild(modal);
      }

      modal.innerHTML = `
        <div class="modal-dialog" style="max-width: 780px;">
          <button class="modal-close-btn" id="closePolicyModal" title="Close"><i class="fa-solid fa-xmark"></i></button>
          
          <div style="padding: 2.5rem;">
            <div class="d-flex align-center gap-2" style="margin-bottom: 1.5rem;">
              <span class="badge badge-primary"><i class="fa-solid fa-shield-halved"></i> Certified Standards</span>
              <h3 style="margin: 0; font-size: 1.45rem;">BoviCure Governance & Compliance</h3>
            </div>

            <!-- Tab Buttons -->
            <div class="d-flex gap-1" style="border-bottom: 2px solid var(--border-color); margin-bottom: 1.5rem; flex-wrap: wrap;">
              <button class="btn btn-sm ${initialTab === 'biosecurity' ? 'btn-primary' : 'btn-outline'} policy-tab-btn" data-tab="tab-biosecurity">
                <i class="fa-solid fa-vial-circle-check"></i> Biosecurity Standards
              </button>
              <button class="btn btn-sm ${initialTab === 'terms' ? 'btn-primary' : 'btn-outline'} policy-tab-btn" data-tab="tab-terms">
                <i class="fa-solid fa-file-contract"></i> Terms of Supply
              </button>
              <button class="btn btn-sm ${initialTab === 'privacy' ? 'btn-primary' : 'btn-outline'} policy-tab-btn" data-tab="tab-privacy">
                <i class="fa-solid fa-user-shield"></i> Herd Privacy Policy
              </button>
            </div>

            <!-- Tab 1: Biosecurity -->
            <div class="policy-tab-content ${initialTab === 'biosecurity' ? 'd-block' : 'd-none'}" id="tab-biosecurity">
              <h4 style="margin-bottom: 0.75rem; color: var(--primary);">ISO 9001:2015 & GMP+ Biosecurity Framework</h4>
              <p style="font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); margin-bottom: 1rem;">
                Every ingredient received into BoviCure feed mills undergoes instantaneous Near-Infrared (NIR) wet-chemistry verification and LC-MS mycotoxin screening.
              </p>
              <ul style="font-size: 0.9rem; line-height: 1.6; display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem;">
                <li><i class="fa-solid fa-circle-check text-highlight"></i> <strong>Zero Aflatoxin Protocol:</strong> Guaranteed undetectable (&lt;1.0 ppb) aflatoxin, vomitoxin (DON), and zearalenone.</li>
                <li><i class="fa-solid fa-circle-check text-highlight"></i> <strong>Sanitized Transport:</strong> All pressurized bulk trucks complete an automated 4-stage undercarriage and tire sanitization wash before leaving the yard.</li>
                <li><i class="fa-solid fa-circle-check text-highlight"></i> <strong>Twin-Screw Thermal Processing:</strong> Pelleted feeds achieve 85°C core temperature for complete pathogen and salmonella elimination.</li>
              </ul>
            </div>

            <!-- Tab 2: Terms of Supply -->
            <div class="policy-tab-content ${initialTab === 'terms' ? 'd-block' : 'd-none'}" id="tab-terms">
              <h4 style="margin-bottom: 0.75rem; color: var(--secondary);">Commercial Feed Mill Terms of Supply</h4>
              <p style="font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); margin-bottom: 1rem;">
                Governing direct mill shipments, bulk freight demurrage, and quality guarantees for commercial dairy and beef operations.
              </p>
              <ul style="font-size: 0.9rem; line-height: 1.6; display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem;">
                <li><i class="fa-solid fa-check text-highlight"></i> <strong>Certified Weights:</strong> State-certified 100-foot automated gross axle scales provide certified weight certificates with every load.</li>
                <li><i class="fa-solid fa-check text-highlight"></i> <strong>Prompt Dispatch:</strong> Standard scheduled deliveries arrive within 48 hours; emergency triage dispatches guaranteed within 12 hours.</li>
                <li><i class="fa-solid fa-check text-highlight"></i> <strong>Payment Terms:</strong> Approved dairy farms enjoy Net-30 commercial billing with ACH electronic remittance.</li>
              </ul>
            </div>

            <!-- Tab 3: Privacy Policy -->
            <div class="policy-tab-content ${initialTab === 'privacy' ? 'd-block' : 'd-none'}" id="tab-privacy">
              <h4 style="margin-bottom: 0.75rem; color: var(--vet-blue);">Farm & Herd Data Privacy Policy</h4>
              <p style="font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); margin-bottom: 1rem;">
                Your farm's milk yield records, forage inventory analyses, and CNCPS custom formulation models remain strictly private and encrypted.
              </p>
              <ul style="font-size: 0.9rem; line-height: 1.6; display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem;">
                <li><i class="fa-solid fa-lock text-highlight"></i> We never monetize, sell, or share herd health metrics with commercial commodity traders.</li>
                <li><i class="fa-solid fa-lock text-highlight"></i> Custom mineral recipes and proprietary ration mixes remain the intellectual property of your operation.</li>
              </ul>
            </div>

            <div class="text-end" style="border-top: 1px solid var(--border-color); padding-top: 1.25rem;">
              <button class="btn btn-primary btn-sm" onclick="document.getElementById('policyModal').classList.remove('active'); document.body.style.overflow = '';">
                Understood &amp; Close
              </button>
            </div>
          </div>
        </div>
      `;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      modal.querySelector('#closePolicyModal').addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });

      // Policy tab switcher
      const tabBtns = modal.querySelectorAll('.policy-tab-btn');
      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          tabBtns.forEach(b => {
            b.classList.remove('btn-primary');
            b.classList.add('btn-outline');
          });
          btn.classList.remove('btn-outline');
          btn.classList.add('btn-primary');

          const targetId = btn.getAttribute('data-tab');
          modal.querySelectorAll('.policy-tab-content').forEach(c => {
            c.classList.remove('d-block');
            c.classList.add('d-none');
          });
          const targetEl = modal.querySelector(`#${targetId}`);
          if (targetEl) {
            targetEl.classList.remove('d-none');
            targetEl.classList.add('d-block');
          }
        });
      });
    };

    // Bind footer policy links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const text = link.textContent.trim().toLowerCase();
      if (text.includes('privacy policy')) {
        e.preventDefault();
        window.openPolicyModal('privacy');
      } else if (text.includes('terms of supply') || text.includes('terms & conditions')) {
        e.preventDefault();
        window.openPolicyModal('terms');
      } else if (text.includes('biosecurity standards') || text.includes('biosecurity')) {
        e.preventDefault();
        window.openPolicyModal('biosecurity');
      }
    });

    // 7C. Interactive Video Operations Tour (On-Site HTML5 Player & Modal)
    window.openVideoModal = function () {
      let modal = document.getElementById('videoModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'videoModal';
        modal.className = 'modal-overlay';
        document.body.appendChild(modal);
      }

      modal.innerHTML = `
        <div class="modal-dialog" style="max-width: 860px; width: 92%; background: #0b1a10; padding: 0; overflow: hidden; border-radius: var(--radius-xl); box-shadow: 0 25px 60px rgba(0,0,0,0.65); border: 1px solid rgba(255,255,255,0.12);">
          <div style="background: rgba(13, 26, 17, 0.95); padding: 0.9rem 1.4rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1);">
            <div class="d-flex align-center gap-2" style="color: #ffffff; font-size: 0.95rem; font-weight: 700;">
              <i class="fa-solid fa-circle-play" style="color: var(--secondary);"></i>
              <span>BoviCure &amp; Feeds™ – Farm &amp; Mill Operations Tour</span>
            </div>
            <button class="action-btn" id="closeVideoModal" style="color: #ffffff; background: transparent; border: none; font-size: 1.25rem; cursor: pointer; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          
          <div style="position: relative; background: #000000; width: 100%; aspect-ratio: 16/9; display: flex; align-items: center; justify-content: center; overflow: hidden;">
            <video id="siteVideoPlayer" 
                   controls 
                   autoplay 
                   playsinline 
                   style="width: 100%; height: 100%; object-fit: contain; display: block; outline: none;">
              <source src="assets/videos/bovicure-farm-tour.webm" type="video/webm">
              <source src="assets/videos/bovicure-farm-tour.mp4" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>
          
          <div style="padding: 1.25rem 1.5rem; background: var(--bg-surface); color: var(--text-main); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h5 style="margin: 0 0 0.2rem; font-size: 0.95rem;">Automated Twin-Screw Pellet Milling &amp; High-Yield Dairy Operations</h5>
              <span style="font-size: 0.8rem; color: var(--text-muted);">Central Production Facility &amp; Research Herd Operations</span>
            </div>
            <a href="contact.html" class="btn btn-secondary btn-sm" onclick="window.closeVideoModal();">
              <i class="fa-solid fa-calendar-check"></i> Book In-Person Mill Tour
            </a>
          </div>
        </div>
      `;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      const player = modal.querySelector('#siteVideoPlayer');
      if (player) {
        player.play().catch(() => {});
      }

      window.closeVideoModal = function() {
        const p = modal.querySelector('#siteVideoPlayer');
        if (p) {
          p.pause();
          p.currentTime = 0;
        }
        modal.classList.remove('active');
        modal.innerHTML = '';
        document.body.style.overflow = '';
      };

      modal.querySelector('#closeVideoModal').addEventListener('click', window.closeVideoModal);

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          window.closeVideoModal();
        }
      });
    };

    // 7D. In-Card Direct Video Playback Initialization
    const initInCardVideo = () => {
      const inlineVideo = document.getElementById('heritageVideo');
      const inlinePlayBtn = document.getElementById('inlineVideoPlayBtn');
      const inlineBadge = document.getElementById('inlineVideoBadge');

      if (inlineVideo && inlinePlayBtn) {
        const startPlayback = () => {
          inlineVideo.controls = true;
          const playPromise = inlineVideo.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              inlinePlayBtn.style.opacity = '0';
              inlinePlayBtn.style.pointerEvents = 'none';
              if (inlineBadge) {
                inlineBadge.style.opacity = '0';
                inlineBadge.style.transform = 'translateY(12px)';
              }
            }).catch(err => {
              // If unmuted autoplay policy triggers, fallback to muted so it plays on screen instantly
              inlineVideo.muted = true;
              inlineVideo.play().then(() => {
                inlinePlayBtn.style.opacity = '0';
                inlinePlayBtn.style.pointerEvents = 'none';
                if (inlineBadge) {
                  inlineBadge.style.opacity = '0';
                  inlineBadge.style.transform = 'translateY(12px)';
                }
              }).catch(() => {});
            });
          }
        };

        inlinePlayBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          startPlayback();
        });

        inlineVideo.addEventListener('pause', () => {
          if (!inlineVideo.seeking && inlineVideo.currentTime > 0 && !inlineVideo.ended) {
            inlinePlayBtn.style.opacity = '1';
            inlinePlayBtn.style.pointerEvents = 'auto';
            if (inlineBadge) {
              inlineBadge.style.opacity = '1';
              inlineBadge.style.transform = 'translateY(0)';
            }
          }
        });

        inlineVideo.addEventListener('play', () => {
          inlinePlayBtn.style.opacity = '0';
          inlinePlayBtn.style.pointerEvents = 'none';
          if (inlineBadge) {
            inlineBadge.style.opacity = '0';
            inlineBadge.style.transform = 'translateY(12px)';
          }
        });

        inlineVideo.addEventListener('ended', () => {
          inlineVideo.controls = false;
          inlinePlayBtn.style.opacity = '1';
          inlinePlayBtn.style.pointerEvents = 'auto';
          if (inlineBadge) {
            inlineBadge.style.opacity = '1';
            inlineBadge.style.transform = 'translateY(0)';
          }
        });
      }
    };
    initInCardVideo();

    // Bind video modal triggers (excluding inline button which plays directly in-card)
    document.addEventListener('click', (e) => {
      const modalTrigger = e.target.closest('[data-video-modal], .video-theater-btn');
      if (modalTrigger) {
        e.preventDefault();
        window.openVideoModal();
      }
    });

    // Escape key listener for all modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => {
          m.classList.remove('active');
          if (m.id === 'videoModal') m.innerHTML = '';
        });
        document.body.style.overflow = '';
      }
    });
  }

  /**
   * 8. Blog Interactivity (Categories, Pagination, Social Share, Comments)
   */
  function initBlogInteractions() {
    const blogGrid = document.getElementById('blogGrid');
    const blogPagination = document.getElementById('blogPagination');

    const BLOG_POSTS = [
      // Page 1 (1 - 6)
      {
        id: 1,
        title: "The First 24 Hours: Colostrum Protocols for Zero Calf Mortality",
        category: "Calf Management",
        categoryKey: "Calf",
        badgeClass: "badge-secondary",
        image: "assets/images/blog/colostrum-calf-protocols.jpg",
        date: "Oct 28, 2026",
        readTime: "8 min read",
        excerpt: "Critical timing, Brix refractometer scoring, and clean harvesting techniques to ensure passive transfer of maternal immunoglobulins.",
        author: "Dr. Elena Rostova",
        url: "blog-details.html"
      },
      {
        id: 2,
        title: "Detecting & Preventing Subacute Ruminal Acidosis (SARA)",
        category: "Veterinary",
        categoryKey: "Veterinary",
        badgeClass: "badge-warning",
        image: "assets/images/blog/ruminal-acidosis-sara.jpg",
        date: "Oct 20, 2026",
        readTime: "5 min read",
        excerpt: "How ruminal buffers, adequate physically effective fiber (peNDF), and continuous rumination monitoring safeguard herd longevity.",
        author: "Dr. Arthur Sterling",
        url: "blog-details.html"
      },
      {
        id: 3,
        title: "Role of Chelated Zinc & Copper in Hoof Integrity & Reproduction",
        category: "Reproduction",
        categoryKey: "Reproduction",
        badgeClass: "badge-primary",
        image: "assets/images/products/bovimax-mineral.jpg",
        date: "Oct 14, 2026",
        readTime: "7 min read",
        excerpt: "Addressing repeat breeding and digital dermatitis by switching from inorganic sulfates to organic glycinate-chelated mineral packs.",
        author: "Dr. Rebecca Lin",
        url: "blog-details.html"
      },
      {
        id: 4,
        title: "Fractionated Bypass Fats vs. Calcium Salts: Which Fuels Higher Butterfat?",
        category: "Peak Lactation",
        categoryKey: "Lactation",
        badgeClass: "badge-success",
        image: "assets/images/products/bio-bypass-fat.jpg",
        date: "Oct 06, 2026",
        readTime: "6 min read",
        excerpt: "A comparative review of 99% palmitic acid prills versus calcium soaps of fatty acids during early lactation negative energy balance.",
        author: "Dr. Frank Morales",
        url: "blog-details.html"
      },
      {
        id: 5,
        title: "Overcoming Anthelmintic Resistance: Modern Pasture Drenching Rotations",
        category: "Biosecurity",
        categoryKey: "Biosecurity",
        badgeClass: "badge-danger",
        image: "assets/images/products/bovideworm-suspension.jpg",
        date: "Sep 29, 2026",
        readTime: "9 min read",
        excerpt: "Fecal egg count reduction tests (FECRT) and combination therapies to prevent resistant Ostertagia and Fasciola hepatica populations.",
        author: "Dr. Arthur Sterling",
        url: "blog-details.html"
      },
      {
        id: 6,
        title: "Optimizing Shell Calcite Deposition in Late-Cycle Commercial Layer Flocks",
        category: "Silage & Nutrition",
        categoryKey: "Nutrition",
        badgeClass: "badge-secondary",
        image: "assets/images/products/aviplus-poultry-feed.jpg",
        date: "Sep 18, 2026",
        readTime: "5 min read",
        excerpt: "Coarse vs fine particle oyster shell calcium inclusion strategies to prevent egg breakage during automated conveyor packing.",
        author: "Thomas Callahan",
        url: "blog-details.html"
      },

      // Page 2 (7 - 12)
      {
        id: 7,
        title: "Transition Cow Metabolic Profiles: Managing Hypocalcemia & Subclinical Ketosis",
        category: "Veterinary",
        categoryKey: "Veterinary",
        badgeClass: "badge-warning",
        image: "assets/images/products/drycow-metabolic-guard.jpg",
        date: "Sep 12, 2026",
        readTime: "7 min read",
        excerpt: "Dietary Cation-Anion Difference (DCAD) feeding strategies and blood beta-hydroxybutyrate (BHB) monitoring to avert fresh-cow crashes.",
        author: "Dr. Elena Rostova",
        url: "blog-details.html"
      },
      {
        id: 8,
        title: "Bacterial Inoculant Selection for High-Moisture Corn & Alfalfa Baleage",
        category: "Silage & Nutrition",
        categoryKey: "Nutrition",
        badgeClass: "badge-primary",
        image: "assets/images/products/silagepro-inoculant.jpg",
        date: "Sep 04, 2026",
        readTime: "6 min read",
        excerpt: "Heterofermentative Lactobacillus buchneri inoculation benchmarks for stopping aerobic spoilage upon face exposure in bunk silos.",
        author: "Dr. Frank Morales",
        url: "blog-details.html"
      },
      {
        id: 9,
        title: "Automated Calf Feeders: Daily Milk Curve Optimization & Accelerated Weaning",
        category: "Calf Management",
        categoryKey: "Calf",
        badgeClass: "badge-secondary",
        image: "assets/images/products/calf-starter-pellets.jpg",
        date: "Aug 28, 2026",
        readTime: "8 min read",
        excerpt: "Step-up, step-down liquid volume curves to stimulate early rumen papillae growth without nutritional scours or growth checks.",
        author: "Dr. Rebecca Lin",
        url: "blog-details.html"
      },
      {
        id: 10,
        title: "Mitigating Heat Stress & Dropping SCC Through Rumen-Protected Antioxidants",
        category: "Peak Lactation",
        categoryKey: "Lactation",
        badgeClass: "badge-success",
        image: "assets/images/products/rumensafe-bolus.jpg",
        date: "Aug 20, 2026",
        readTime: "6 min read",
        excerpt: "Rumen-protected capsicum, selenium yeast, and high-potassium electrolytes that maintain somatic cell counts below 120,000 in summer.",
        author: "Dr. Arthur Sterling",
        url: "blog-details.html"
      },
      {
        id: 11,
        title: "Timed AI & Embryo Transfer Synchronization for Commercial Beef Operations",
        category: "Reproduction",
        categoryKey: "Reproduction",
        badgeClass: "badge-primary",
        image: "assets/images/blog/beef-timed-ai-synchronization.jpg",
        date: "Aug 11, 2026",
        readTime: "8 min read",
        excerpt: "7-day CO-Synch + CIDR synchronization methods that tighten calving windows and boost weaned calf uniformity across pastures.",
        author: "Dr. Rebecca Lin",
        url: "blog-details.html"
      },
      {
        id: 12,
        title: "Integrated Fly Control & External Parasite Suppression for Pastured Cattle",
        category: "Biosecurity",
        categoryKey: "Biosecurity",
        badgeClass: "badge-danger",
        image: "assets/images/blog/integrated-fly-control-cattle.jpg",
        date: "Aug 02, 2026",
        readTime: "5 min read",
        excerpt: "Combining feed-through insect growth regulators (IGRs), parasitic wasps, and topical ear tags for resistant horn fly suppression.",
        author: "Thomas Callahan",
        url: "blog-details.html"
      },

      // Page 3 (13 - 18)
      {
        id: 13,
        title: "Precision Amino Acid Balancing with Rumen-Protected Lysine & Methionine",
        category: "Silage & Nutrition",
        categoryKey: "Nutrition",
        badgeClass: "badge-primary",
        image: "assets/images/products/ultra-lact-pro.jpg",
        date: "Jul 25, 2026",
        readTime: "7 min read",
        excerpt: "Safely reducing dietary crude protein from 18% to 15.5% while boosting milk true protein yield and lowering nitrogen excretion.",
        author: "Dr. Frank Morales",
        url: "blog-details.html"
      },
      {
        id: 14,
        title: "Broad-Spectrum Mycotoxin Deactivators in Wet Forage Seasons",
        category: "Veterinary",
        categoryKey: "Veterinary",
        badgeClass: "badge-warning",
        image: "assets/images/products/probovi-live-yeast.jpg",
        date: "Jul 17, 2026",
        readTime: "6 min read",
        excerpt: "Yeast cell wall glucomannans and modified phyllosilicates that neutralize DON, zearalenone, and T-2 toxins in dairy TMR.",
        author: "Dr. Arthur Sterling",
        url: "blog-details.html"
      },
      {
        id: 15,
        title: "Pre-Weaning Pneumonia: Early Thoracic Ultrasound Scoring & Intervention",
        category: "Calf Management",
        categoryKey: "Calf",
        badgeClass: "badge-secondary",
        image: "assets/images/products/electrolyte-plus-calf.jpg",
        date: "Jul 08, 2026",
        readTime: "9 min read",
        excerpt: "Point-of-care ultrasound protocols that detect subclinical lung consolidation weeks before coughing or clinical fever manifests.",
        author: "Dr. Elena Rostova",
        url: "blog-details.html"
      },
      {
        id: 16,
        title: "Energy Partitioning & Glucose Sparing in High-Genetic-Merit Dairy Herds",
        category: "Peak Lactation",
        categoryKey: "Lactation",
        badgeClass: "badge-success",
        image: "assets/images/blog/dairy-energy-partitioning.jpg",
        date: "Jun 30, 2026",
        readTime: "8 min read",
        excerpt: "How propionate precursors and rumen-inert bypass fats prevent severe body condition loss in 45-kg daily peak lactation cows.",
        author: "Dr. Frank Morales",
        url: "blog-details.html"
      },
      {
        id: 17,
        title: "Sire Selection for Calving Ease & Gestation Length in Beef-on-Dairy",
        category: "Reproduction",
        categoryKey: "Reproduction",
        badgeClass: "badge-primary",
        image: "assets/images/blog/beef-sire-selection.jpg",
        date: "Jun 21, 2026",
        readTime: "6 min read",
        excerpt: "Capitalizing on terminal beef sire traits while safeguarding cow recovery intervals and preventing dystocia in first-calf heifers.",
        author: "Dr. Rebecca Lin",
        url: "blog-details.html"
      },
      {
        id: 18,
        title: "Closed-Herd Biosecurity: Quarantine Screening & Footbath Chemistry",
        category: "Biosecurity",
        categoryKey: "Biosecurity",
        badgeClass: "badge-danger",
        image: "assets/images/blog/dairy-footbath-biosecurity.jpg",
        date: "Jun 12, 2026",
        readTime: "7 min read",
        excerpt: "Copper sulfate versus acidified zinc protocols for digital dermatitis eradication at automated parlor exit lanes.",
        author: "Thomas Callahan",
        url: "blog-details.html"
      }
    ];

    let currentCategory = 'all';
    let currentPage = 1;
    const itemsPerPage = 6;

    function getFilteredPosts() {
      if (currentCategory === 'all') return BLOG_POSTS;
      return BLOG_POSTS.filter(p => p.categoryKey.toLowerCase() === currentCategory.toLowerCase() || p.category.toLowerCase().includes(currentCategory.toLowerCase()));
    }

    function renderBlogArticles(page = 1, shouldScroll = false) {
      if (!blogGrid) return;

      const filtered = getFilteredPosts();
      const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
      currentPage = Math.min(Math.max(1, page), totalPages);

      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedPosts = filtered.slice(startIndex, startIndex + itemsPerPage);

      if (paginatedPosts.length === 0) {
        blogGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
            <i class="fa-solid fa-file-circle-question" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
            <h4 style="margin-bottom: 0.5rem;">No Articles Found</h4>
            <p style="color: var(--text-muted); max-width: 450px; margin: 0 auto 1.5rem;">There are currently no articles published in this category.</p>
            <button class="btn btn-primary btn-sm" onclick="filterBlogPosts('all')">View All Articles</button>
          </div>
        `;
      } else {
        blogGrid.innerHTML = paginatedPosts.map((post, idx) => `
          <div class="blog-card is-revealed" style="opacity: 1; filter: none !important; transform: translate(0); animation: fadeUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.05}s forwards;">
            <div class="blog-thumb-wrap">
              <img src="${post.image}" alt="${post.title}" loading="lazy">
              <span class="badge ${post.badgeClass} blog-badge">${post.category}</span>
            </div>
            <div class="blog-content">
              <div class="blog-meta">
                <span><i class="fa-regular fa-calendar"></i> ${post.date}</span>
                <span><i class="fa-regular fa-clock"></i> ${post.readTime}</span>
              </div>
              <h4 class="blog-title"><a href="${post.url}">${post.title}</a></h4>
              <p class="blog-excerpt">${post.excerpt}</p>
              <div class="blog-footer">
                <span style="font-size: 0.85rem; color: var(--text-muted);"><i class="fa-solid fa-user-pen"></i> ${post.author}</span>
                <a href="${post.url}" class="read-more-btn">Read <i class="fa-solid fa-arrow-right"></i></a>
              </div>
            </div>
          </div>
        `).join('');
      }

      renderPaginationControls(totalPages);

      if (shouldScroll) {
        const headerOffset = 90;
        const gridTop = blogGrid.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: gridTop, behavior: 'smooth' });
      }
    }

    function renderPaginationControls(totalPages) {
      if (!blogPagination) return;

      if (totalPages <= 1) {
        blogPagination.innerHTML = `
          <button class="btn btn-primary btn-sm" disabled style="min-width: 40px;">1</button>
        `;
        return;
      }

      let html = '';
      // Prev Button
      const prevDisabled = currentPage <= 1 ? 'disabled style="opacity: 0.45; cursor: not-allowed;"' : '';
      html += `<button class="btn btn-outline btn-sm" id="blogPrevBtn" onclick="changeBlogPage('prev')" title="Previous Page" ${prevDisabled}><i class="fa-solid fa-chevron-left"></i></button>`;

      // Page numbers
      for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage ? 'btn-primary' : 'btn-outline';
        html += `<button class="btn ${activeClass} btn-sm" id="blogPageBtn-${i}" onclick="changeBlogPage(${i})">${i}</button>`;
      }

      // Next Button
      const nextDisabled = currentPage >= totalPages ? 'disabled style="opacity: 0.45; cursor: not-allowed;"' : '';
      html += `<button class="btn btn-outline btn-sm" id="blogNextBtn" onclick="changeBlogPage('next')" title="Next Page" ${nextDisabled}><i class="fa-solid fa-chevron-right"></i></button>`;

      blogPagination.innerHTML = html;
    }

    window.filterBlogPosts = function (category, btn) {
      currentCategory = category || 'all';
      currentPage = 1;

      const pills = document.querySelectorAll('.blog-filter-pill');
      pills.forEach(p => {
        p.classList.remove('btn-primary');
        p.classList.add('btn-outline');
      });
      if (btn) {
        btn.classList.remove('btn-outline');
        btn.classList.add('btn-primary');
      } else {
        const matchingBtn = Array.from(pills).find(p => p.getAttribute('onclick')?.includes(category));
        if (matchingBtn) {
          matchingBtn.classList.remove('btn-outline');
          matchingBtn.classList.add('btn-primary');
        }
      }

      const filtered = getFilteredPosts();
      renderBlogArticles(1, true);

      if (window.showToast) {
        const catName = category === 'all' ? 'All Insights' : category;
        window.showToast(`Showing ${filtered.length} articles under ${catName}`, 'info');
      }
    };

    window.changeBlogPage = function (target) {
      const filtered = getFilteredPosts();
      const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

      let nextPg = currentPage;
      if (target === 'prev') {
        nextPg = currentPage - 1;
      } else if (target === 'next') {
        nextPg = currentPage + 1;
      } else {
        nextPg = parseInt(target, 10);
      }

      if (isNaN(nextPg) || nextPg < 1 || nextPg > totalPages) return;

      renderBlogArticles(nextPg, true);

      if (window.showToast) {
        window.showToast(`Page ${nextPg} of ${totalPages} (Articles ${(nextPg - 1) * itemsPerPage + 1}–${Math.min(nextPg * itemsPerPage, filtered.length)})`, 'info');
      }
    };

    // Initialize pagination controls
    if (blogGrid && blogPagination) {
      renderPaginationControls(Math.ceil(BLOG_POSTS.length / itemsPerPage));
    }

    // 8A. Blog Social Share
    document.addEventListener('click', (e) => {
      const shareBtn = e.target.closest('.social-icon-btn, .blog-share-btn');
      if (!shareBtn) return;

      const title = shareBtn.getAttribute('title') || '';
      const shareUrl = encodeURIComponent(window.location.href);
      const shareTitle = encodeURIComponent(document.title);

      if (title.toLowerCase().includes('copy link') || shareBtn.querySelector('.fa-link')) {
        e.preventDefault();
        if (navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href).then(() => {
            if (window.showToast) window.showToast('Article link copied to clipboard!', 'success');
          });
        } else {
          if (window.showToast) window.showToast('Link copied: ' + window.location.href, 'success');
        }
      } else if (title.toLowerCase().includes('facebook') || shareBtn.querySelector('.fa-facebook-f')) {
        e.preventDefault();
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank', 'width=600,height=400');
      } else if (title.toLowerCase().includes('twitter') || shareBtn.querySelector('.fa-x-twitter') || shareBtn.querySelector('.fa-twitter')) {
        e.preventDefault();
        window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`, '_blank', 'width=600,height=400');
      } else if (title.toLowerCase().includes('linkedin') || shareBtn.querySelector('.fa-linkedin-in')) {
        e.preventDefault();
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, '_blank', 'width=600,height=400');
      } else if (shareBtn.querySelector('.fa-youtube')) {
        e.preventDefault();
        window.open('https://youtube.com', '_blank');
      } else if (shareBtn.querySelector('.fa-instagram')) {
        e.preventDefault();
        window.open('https://instagram.com', '_blank');
      } else if (shareBtn.querySelector('.fa-envelope')) {
        e.preventDefault();
        window.location.href = 'mailto:support@bovicurefeeds.com?subject=Inquiry%20from%20Website';
      } else if (shareBtn.getAttribute('href') === '#') {
        e.preventDefault();
        if (window.showToast) window.showToast('Connecting to BoviCure official feed channel...', 'info');
      }
    });

    // 8C. Interactive Comment Form on blog-details.html
    const commentForm = document.getElementById('blogCommentForm');
    const commentList = document.getElementById('commentsContainer');
    if (commentForm && commentList) {
      commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const authorInput = commentForm.querySelector('[name="commentAuthor"]');
        const textInput = commentForm.querySelector('[name="commentText"]');
        
        if (!authorInput || !textInput || !textInput.value.trim()) return;

        const authorName = authorInput.value.trim() || 'Guest Producer';
        const commentText = textInput.value.trim();

        const newComment = document.createElement('div');
        newComment.style.background = 'var(--bg-surface)';
        newComment.style.border = '1px solid var(--border-color)';
        newComment.style.borderRadius = 'var(--radius-md)';
        newComment.style.padding = '1.25rem 1.5rem';
        newComment.style.marginBottom = '1rem';
        newComment.style.animation = 'fadeUp 0.4s ease forwards';

        newComment.innerHTML = `
          <div class="d-flex align-center justify-between" style="margin-bottom: 0.5rem;">
            <div class="d-flex align-center gap-2">
              <div style="width: 38px; height: 38px; border-radius: var(--radius-full); background: var(--primary); color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.95rem;">
                ${authorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h5 style="margin: 0; font-size: 0.95rem;">${authorName}</h5>
                <span style="font-size: 0.75rem; color: var(--text-light);"><i class="fa-regular fa-clock"></i> Just now</span>
              </div>
            </div>
            <span class="badge badge-success">Verified Farm Partner</span>
          </div>
          <p style="margin: 0; font-size: 0.95rem; line-height: 1.6; color: var(--text-main);">${commentText}</p>
        `;

        commentList.prepend(newComment);
        commentForm.reset();

        if (window.showToast) {
          window.showToast('Your comment has been submitted and posted!', 'success');
        }
      });
    }
  }

  /**
   * 9. Livestock Care Matrix & Stage Filter Tabs
   */
  function initLivestockCareTabs() {
    window.filterSeasons = function (season, btn) {
      const tabs = document.querySelectorAll('.season-filter-tab');
      tabs.forEach(t => {
        t.classList.remove('btn-primary');
        t.classList.add('btn-outline');
      });
      if (btn) {
        btn.classList.remove('btn-outline');
        btn.classList.add('btn-primary');
      }
      const cards = document.querySelectorAll('.season-card');
      cards.forEach(card => {
        if (season === 'all' || card.getAttribute('data-season') === season) {
          card.style.display = '';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
      if (window.showToast) {
        window.showToast(`Showing ${season === 'all' ? 'All Seasons' : season.toUpperCase()} Care Protocols`, 'info');
      }
    };

    const stageTabs = document.querySelectorAll('.stage-filter-tab');
    if (!stageTabs.length) return;

    stageTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        stageTabs.forEach(t => {
          t.classList.remove('btn-primary');
          t.classList.add('btn-outline');
        });
        tab.classList.remove('btn-outline');
        tab.classList.add('btn-primary');

        const stage = tab.getAttribute('data-stage') || 'all';
        const rows = document.querySelectorAll('.feeding-table tbody tr, .admin-table tbody tr');

        rows.forEach(row => {
          if (stage === 'all') {
            row.style.display = '';
            row.style.opacity = '1';
            row.style.background = '';
          } else {
            const rowText = row.textContent.toLowerCase();
            if (rowText.includes(stage)) {
              row.style.display = '';
              row.style.opacity = '1';
              row.style.background = 'rgba(var(--primary-rgb), 0.08)';
            } else {
              row.style.display = 'none';
              row.style.background = '';
            }
          }
        });

        if (window.showToast) {
          window.showToast(`Filtered Lifecycle Guide: ${tab.textContent.trim()}`, 'info');
        }
      });
    });
  }

  /**
   * 10. Global Toast Notification System
   */
  window.showToast = function (message, type = 'info', duration = 3500) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconClass = 'fa-solid fa-circle-info';
    if (type === 'success') iconClass = 'fa-solid fa-circle-check';
    if (type === 'warning') iconClass = 'fa-solid fa-triangle-exclamation';
    if (type === 'danger') iconClass = 'fa-solid fa-circle-xmark';

    toast.innerHTML = `
      <i class="${iconClass}" style="font-size: 1.15rem; color: var(--${type === 'info' ? 'primary' : type});"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentElement) toast.parentElement.removeChild(toast);
      }, 400);
    }, duration);
  };
})();
