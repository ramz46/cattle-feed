/**
 * BOVICURE & FEEDS™ – SHOPPING CART ENGINE
 * Persistent LocalStorage cart, slide-over drawer, quantity controls, free shipping tier & checkout bridge
 */

(function () {
  'use strict';

  const CART_STORAGE_KEY = 'bovicure_shopping_cart';
  const FREE_SHIPPING_THRESHOLD = 150.00;

  let cart = [];

  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    cart = savedCart ? JSON.parse(savedCart) : [
      // Pre-populate with 1 realistic sample item so new visitors see a working cart right away
      {
        id: 1,
        name: "Ultra-Lact Pro High-Yield Dairy Feed",
        price: 42.50,
        image: "assets/images/products/ultra-lact-pro.jpg",
        quantity: 2
      }
    ];
  } catch (e) {
    cart = [];
  }

  document.addEventListener('DOMContentLoaded', () => {
    initCartDrawer();
    updateCartUI();
  });

  function saveCart() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
    updateCartUI();
  }

  /**
   * Cart Drawer Open / Close Controls
   */
  function initCartDrawer() {
    const cartTriggers = document.querySelectorAll('.cart-toggle-btn');
    const drawer = document.getElementById('cartDrawer');
    const backdrop = document.getElementById('cartBackdrop');
    const closeBtn = document.getElementById('closeCartDrawer');

    if (!drawer) return;

    cartTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openCartDrawer();
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeCartDrawer);
    }

    if (backdrop) {
      backdrop.addEventListener('click', closeCartDrawer);
    }
  }

  function openCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const backdrop = document.getElementById('cartBackdrop');
    if (drawer && backdrop) {
      drawer.classList.add('active');
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const backdrop = document.getElementById('cartBackdrop');
    if (drawer && backdrop) {
      drawer.classList.remove('active');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  /**
   * Add Item to Cart
   */
  function addToCart(product, quantity = 1) {
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      });
    }

    saveCart();
    openCartDrawer();

    // Animate badge
    document.querySelectorAll('.cart-count-badge').forEach(b => {
      b.classList.remove('badge-pop');
      void b.offsetWidth;
      b.classList.add('badge-pop');
    });

    if (window.showToast) {
      window.showToast(`Added ${quantity}x "${product.name}" to your farm cart!`, 'success');
    }
  }

  /**
   * Remove Item from Cart
   */
  function removeFromCart(productId) {
    const item = cart.find(i => i.id === productId);
    const itemName = item ? item.name : 'Item';
    cart = cart.filter(item => item.id !== productId);
    saveCart();

    if (window.showToast) {
      window.showToast(`"${itemName}" removed from cart`, 'info');
    }
  }

  /**
   * Update Item Quantity
   */
  function updateQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      saveCart();
    }
  }

  /**
   * Clear Cart
   */
  function clearCart() {
    cart = [];
    saveCart();
  }

  /**
   * Render Cart List & Calculate Totals
   */
  function updateCartUI() {
    // 1. Update count badges
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-count-badge');
    badges.forEach(b => {
      b.textContent = totalCount;
    });

    // 2. Render Drawer List
    const itemsContainer = document.getElementById('cartItemsList');
    const subtotalEl = document.getElementById('cartSubtotal');
    const freeShippingText = document.getElementById('freeShippingText');
    const freeShippingProgress = document.getElementById('freeShippingProgress');

    if (!itemsContainer) return;

    if (!cart.length) {
      itemsContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem;">
          <div style="font-size: 2.8rem; color: var(--text-light); margin-bottom: 0.75rem;">
            <i class="fa-solid fa-basket-shopping"></i>
          </div>
          <h4 style="margin-bottom: 0.5rem;">Your Farm Cart is Empty</h4>
          <p style="font-size: 0.9rem; color: var(--text-muted);">Explore our premium cattle feed and veterinary catalog.</p>
          <a href="products.html" class="btn btn-primary btn-sm" style="margin-top: 1rem;" onclick="window.closeCartDrawer()">Browse Products</a>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = '$0.00';
      if (freeShippingText) freeShippingText.textContent = `Add $${FREE_SHIPPING_THRESHOLD.toFixed(2)} for Free Farm Delivery!`;
      if (freeShippingProgress) freeShippingProgress.style.width = '0%';
      return;
    }

    let subtotal = 0;

    itemsContainer.innerHTML = cart.map(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      return `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img" loading="lazy">
          <div class="cart-item-details">
            <h5 class="cart-item-title">${item.name}</h5>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            <div class="quantity-control">
              <button class="qty-btn" onclick="window.updateCartQty(${item.id}, -1)">-</button>
              <span class="qty-val">${item.quantity}</span>
              <button class="qty-btn" onclick="window.updateCartQty(${item.id}, 1)">+</button>
            </div>
          </div>
          <button class="cart-item-remove" onclick="window.removeCartItem(${item.id})" title="Remove item">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `;
    }).join('');

    if (subtotalEl) {
      subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    }

    // Free shipping bar progress
    if (freeShippingText && freeShippingProgress) {
      if (subtotal >= FREE_SHIPPING_THRESHOLD) {
        freeShippingText.innerHTML = `<span style="color: var(--success);"><i class="fa-solid fa-circle-check"></i> Free Farm Dispatch Unlocked!</span>`;
        freeShippingProgress.style.width = '100%';
        freeShippingProgress.style.background = 'var(--success)';
      } else {
        const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
        const percent = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
        freeShippingText.textContent = `Add $${remaining.toFixed(2)} more for Free Farm Delivery!`;
        freeShippingProgress.style.width = `${percent}%`;
        freeShippingProgress.style.background = 'var(--primary)';
      }
    }
  }

  // Window Exports
  window.addToCart = addToCart;
  window.removeCartItem = removeFromCart;
  window.updateCartQty = updateQuantity;
  window.clearCart = clearCart;
  window.getCart = function () { return cart; };
  window.openCartDrawer = openCartDrawer;
  window.closeCartDrawer = closeCartDrawer;
})();
