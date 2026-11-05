/**
 * BOVICURE & FEEDS™ – PRODUCTS & CATALOG ENGINE
 * Catalog data, filters, sorting, quick-view modal, and wishlist state
 */

(function () {
  'use strict';

  // Comprehensive Product Dataset
  const PRODUCTS_DATA = [
    {
      id: 1,
      name: "Ultra-Lact Pro High-Yield Dairy Feed",
      category: "Dairy Feed",
      categorySlug: "dairy-feed",
      price: 42.50,
      oldPrice: 48.00,
      rating: 4.9,
      reviewsCount: 142,
      badge: "Bestseller",
      badgeType: "primary",
      image: "assets/images/products/ultra-lact-pro.jpg",
      description: "Scientifically formulated 22% crude protein pellet feed enriched with bypass fat and live rumen yeast cultures for maximum milk output and butterfat yield.",
      specs: {
        "Crude Protein": "22.0%",
        "Crude Fat": "4.5%",
        "Crude Fiber": "8.5%",
        "Calcium": "1.2%",
        "Phosphorus": "0.7%",
        "Packaging": "50 kg HDPE Bag"
      },
      stock: "In Stock (120+ bags)",
      dosage: "1 kg per 2.5 kg milk yield + 1.5 kg maintenance"
    },
    {
      id: 2,
      name: "BoviMax Fortified Mineral Mixture (Chelated)",
      category: "Mineral Mixtures",
      categorySlug: "mineral-mixtures",
      price: 28.00,
      oldPrice: 34.00,
      rating: 5.0,
      reviewsCount: 98,
      badge: "Chelated",
      badgeType: "secondary",
      image: "assets/images/products/bovimax-mineral.jpg",
      description: "Organic chelated trace minerals with coated vitamins A, D3, and E. Improves fertility, reduces repeat breeding, and strengthens hooves.",
      specs: {
        "Chelated Zinc": "9,600 mg/kg",
        "Chelated Copper": "1,200 mg/kg",
        "Vitamin A": "700,000 IU/kg",
        "Vitamin D3": "70,000 IU/kg",
        "Packaging": "5 kg Bucket & 25 kg Bag"
      },
      stock: "In Stock (85 buckets)",
      dosage: "50g per adult cow daily"
    },
    {
      id: 3,
      name: "Calf Starter Growth Booster Pellets",
      category: "Cattle Feed",
      categorySlug: "cattle-feed",
      price: 36.00,
      oldPrice: null,
      rating: 4.8,
      reviewsCount: 74,
      badge: "Growth+",
      badgeType: "success",
      image: "assets/images/products/calf-starter-pellets.jpg",
      description: "Palatable, highly digestible starter pellets formulated for calves from day 14 to month 4. Accelerates rumen papillae development.",
      specs: {
        "Crude Protein": "24.0%",
        "Digestible Energy": "3.2 Mcal/kg",
        "Probiotics": "Yes (Bacillus subt.)",
        "Packaging": "25 kg Bag"
      },
      stock: "In Stock (50 bags)",
      dosage: "Ad libitum up to 1.5 kg/day"
    },
    {
      id: 4,
      name: "RumenSafe Advanced Rumen Buffer Bolus",
      category: "Feed Supplements",
      categorySlug: "feed-supplements",
      price: 19.50,
      oldPrice: 22.00,
      rating: 4.7,
      reviewsCount: 63,
      badge: "Anti-Acidosis",
      badgeType: "warning",
      image: "assets/images/products/rumensafe-bolus.jpg",
      description: "Dual-action sustained release bolus buffering ruminal pH between 6.2 - 6.8 for up to 72 hours, preventing subacute ruminal acidosis (SARA).",
      specs: {
        "Sodium Bicarbonate": "Active matrix",
        "Magnesium Oxide": "High bio-availability",
        "Release Duration": "72 Hours",
        "Packaging": "Box of 12 Boluses"
      },
      stock: "In Stock (200 boxes)",
      dosage: "1-2 boluses post high-concentrate feeding"
    },
    {
      id: 5,
      name: "BoviSeptic Broad Spectrum Topical Wound Spray",
      category: "Veterinary Medicines",
      categorySlug: "veterinary-medicines",
      price: 14.80,
      oldPrice: null,
      rating: 4.9,
      reviewsCount: 112,
      badge: "Vet Approved",
      badgeType: "primary",
      image: "assets/images/products/boviseptic-wound-spray.jpg",
      description: "Veterinary disinfectant and fly-repellent wound spray containing chlorhexidine and natural citronella oil for rapid wound healing and maggot protection.",
      specs: {
        "Active Ingredient": "Chlorhexidine 0.5%",
        "Insect Repellent": "Citronella & Eucalyptus",
        "Format": "500 ml Aerosol Spray"
      },
      stock: "In Stock (310 cans)",
      dosage: "Spray directly onto clean wound twice daily"
    },
    {
      id: 6,
      name: "BoviDeworm Broad Spectrum Anthelmintic Suspension",
      category: "Animal Health Products",
      categorySlug: "animal-health-products",
      price: 32.00,
      oldPrice: 38.00,
      rating: 4.9,
      reviewsCount: 85,
      badge: "Essential",
      badgeType: "secondary",
      image: "assets/images/products/bovideworm-suspension.jpg",
      description: "Comprehensive oral drench for eradication of liver flukes, gastrointestinal roundworms, and lungworms in adult cattle and growing heifers.",
      specs: {
        "Oxyclozanide": "3.0% w/v",
        "Levamisole HCl": "1.5% w/v",
        "Bottle Size": "1 Liter Dispenser"
      },
      stock: "In Stock (90 bottles)",
      dosage: "5 ml per 10 kg body weight orally"
    },
    {
      id: 7,
      name: "SilagePro Microbial Inoculant & Fermentation Starter",
      category: "Livestock Nutrition",
      categorySlug: "livestock-nutrition",
      price: 54.00,
      oldPrice: 62.00,
      rating: 4.8,
      reviewsCount: 52,
      badge: "Bio-Ferment",
      badgeType: "success",
      image: "assets/images/products/silagepro-inoculant.jpg",
      description: "Multi-strain lactic acid bacteria inoculant ensuring rapid pH drop in corn and grass silage, preserving dry matter and protein quality.",
      specs: {
        "Colony Forming Units": "1x10^11 CFU/g",
        "Strains": "L. plantarum, E. faecium",
        "Treats": "Up to 50 Metric Tons Silage"
      },
      stock: "In Stock (45 packs)",
      dosage: "1 pack dissolved in 20L water for 50T silage"
    },
    {
      id: 8,
      name: "AviPlus Layer Mash Feed Concentrate",
      category: "Poultry Feed",
      categorySlug: "poultry-feed",
      price: 39.00,
      oldPrice: null,
      rating: 4.6,
      reviewsCount: 41,
      badge: "High Calcium",
      badgeType: "warning",
      image: "assets/images/products/aviplus-poultry-feed.jpg",
      description: "Balanced poultry layer ration packed with amino acids, oyster shell calcium, and yolk pigment enhancers for strong shells and high laying rate.",
      specs: {
        "Crude Protein": "17.5%",
        "Calcium": "3.8%",
        "Packaging": "50 kg Woven Sack"
      },
      stock: "In Stock (70 bags)",
      dosage: "115g to 125g per laying bird daily"
    },
    {
      id: 9,
      name: "Dry Cow Metabolic Guard Pellets",
      category: "Dairy Feed",
      categorySlug: "dairy-feed",
      price: 45.00,
      oldPrice: 50.00,
      rating: 4.9,
      reviewsCount: 67,
      badge: "Transition",
      badgeType: "primary",
      image: "assets/images/products/drycow-metabolic-guard.jpg",
      description: "Specially formulated anionic salt-enriched transition feed to balance DCAD in pregnant dairy cows 21 days pre-calving to prevent milk fever.",
      specs: {
        "DCAD": "-150 mEq/kg",
        "Magnesium": "1.4%",
        "Packaging": "40 kg Bag"
      },
      stock: "In Stock (38 bags)",
      dosage: "3 kg daily during close-up dry period"
    },
    {
      id: 10,
      name: "Electrolyte Plus Calf Rehydration Salts",
      category: "Veterinary Medicines",
      categorySlug: "veterinary-medicines",
      price: 18.00,
      oldPrice: null,
      rating: 5.0,
      reviewsCount: 120,
      badge: "Emergency Care",
      badgeType: "danger",
      image: "assets/images/products/electrolyte-plus-calf.jpg",
      description: "Isotonic oral electrolyte formulation with dextrose and glycine for fast recovery of calves suffering from neonatal scours and dehydration.",
      specs: {
        "Electrolytes": "Na+, K+, Cl-, HCO3-",
        "Energy Source": "Dextrose monohydrate",
        "Packaging": "10 x 100g sachets"
      },
      stock: "In Stock (160 packs)",
      dosage: "Dissolve 1 sachet in 2L warm water, feed twice daily"
    },
    {
      id: 11,
      name: "Bio-Bypass Fat 99% Energy Booster",
      category: "Feed Supplements",
      categorySlug: "feed-supplements",
      price: 68.00,
      oldPrice: 75.00,
      rating: 4.8,
      reviewsCount: 55,
      badge: "Dense Energy",
      badgeType: "secondary",
      image: "assets/images/products/bio-bypass-fat.jpg",
      description: "Fractionated palm fatty acid distillate (PFAD) inert to rumen fermentation. Supplies high net energy of lactation without depressing fiber digestion.",
      specs: {
        "Total Fat": "99.0%",
        "NEL": "6.5 Mcal/kg",
        "Packaging": "25 kg Bag"
      },
      stock: "In Stock (95 bags)",
      dosage: "250g - 400g per high-producing cow/day"
    },
    {
      id: 12,
      name: "Pro-Bovi Live Yeast Concentrate (S. cerevisiae)",
      category: "Livestock Nutrition",
      categorySlug: "livestock-nutrition",
      price: 49.00,
      oldPrice: null,
      rating: 4.9,
      reviewsCount: 88,
      badge: "Gut Health",
      badgeType: "success",
      image: "assets/images/products/probovi-live-yeast.jpg",
      description: "Thermally stable micro-encapsulated live yeast cultures designed to consume oxygen in the rumen and stimulate cellulolytic fiber-digesting bacteria.",
      specs: {
        "Potency": "2x10^10 CFU/g",
        "Shelf Life": "24 Months",
        "Packaging": "1 kg Pouch & 10 kg Tub"
      },
      stock: "In Stock (75 tubs)",
      dosage: "5g to 10g per cow daily in TMR"
    }
  ];

  const WISHLIST_STORAGE_KEY = 'bovicure_wishlist';

  function getWishlist() {
    try {
      const w = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return w ? JSON.parse(w) : [1, 2]; // default 2 favorites for sample
    } catch (e) {
      return [1, 2];
    }
  }

  function saveWishlist(list) {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {}
    updateWishlistUI();
  }

  function toggleWishlist(id, btn) {
    let list = getWishlist();
    const index = list.indexOf(id);
    const prod = PRODUCTS_DATA.find(p => p.id === id);
    const prodName = prod ? prod.name : 'Product';
    let isAdded = false;

    if (index > -1) {
      list.splice(index, 1);
      isAdded = false;
    } else {
      list.push(id);
      isAdded = true;
    }

    saveWishlist(list);

    if (btn) {
      btn.classList.remove('heart-pop');
      void btn.offsetWidth;
      btn.classList.add('heart-pop');
    }

    if (window.showToast) {
      window.showToast(
        isAdded ? `Added "${prodName}" to your Farm Wishlist!` : `Removed "${prodName}" from Wishlist`,
        isAdded ? 'success' : 'info'
      );
    }
  }

  function updateWishlistUI() {
    const list = getWishlist();
    document.querySelectorAll('.wishlist-btn, [data-wishlist-id]').forEach(btn => {
      const id = parseInt(btn.getAttribute('data-id') || btn.getAttribute('data-wishlist-id'), 10);
      const isFav = list.includes(id);
      const icon = btn.querySelector('i');
      if (isFav) {
        btn.classList.add('active');
        if (icon) icon.className = 'fa-solid fa-heart';
      } else {
        btn.classList.remove('active');
        if (icon) icon.className = 'fa-regular fa-heart';
      }
    });
  }

  function addToCartById(id, quantity = 1) {
    const prod = PRODUCTS_DATA.find(p => p.id === id);
    if (prod && window.addToCart) {
      window.addToCart(prod, quantity);
    } else if (window.showToast) {
      window.showToast('Product added to order queue', 'success');
    }
  }

  let currentCategory = 'all';
  let currentSearchQuery = '';
  let currentMaxPrice = 100;
  let currentSort = 'featured';

  document.addEventListener('DOMContentLoaded', () => {
    // Read category parameter from URL (e.g. products.html?category=dairy-feed)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const categoryParam = urlParams.get('category');
      if (categoryParam) {
        currentCategory = categoryParam;
        const catItems = document.querySelectorAll('.category-filter-item');
        catItems.forEach(i => {
          if (i.getAttribute('data-category') === categoryParam) {
            catItems.forEach(x => x.classList.remove('active'));
            i.classList.add('active');
          }
        });
      }
    } catch (e) {}

    renderProductCards();
    initFilters();
    initQuickViewModal();
    updateWishlistUI();
  });

  /**
   * Render Product Grid
   */
  function renderProductCards() {
    const gridContainer = document.getElementById('productsGrid');
    if (!gridContainer) return;

    let filtered = PRODUCTS_DATA.filter(prod => {
      const matchCat = currentCategory === 'all' || prod.categorySlug === currentCategory;
      const matchSearch = prod.name.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
                          prod.description.toLowerCase().includes(currentSearchQuery.toLowerCase());
      const matchPrice = prod.price <= currentMaxPrice;
      return matchCat && matchSearch && matchPrice;
    });

    // Sorting
    if (currentSort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (currentSort === 'title') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Update count display
    const countDisplay = document.getElementById('productsCount');
    if (countDisplay) {
      countDisplay.textContent = `Showing ${filtered.length} products`;
    }

    if (!filtered.length) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
          <div style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;">
            <i class="fa-solid fa-cow"></i>
          </div>
          <h3>No products match your criteria</h3>
          <p>Try resetting your filters or adjusting your search term.</p>
          <button class="btn btn-primary" onclick="window.resetCatalogFilters()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    gridContainer.innerHTML = filtered.map(prod => `
      <div class="product-card reveal-up" data-id="${prod.id}">
        <div class="product-thumb-wrap">
          <img src="${prod.image}" alt="${prod.name}" loading="lazy">
          <div class="product-badges">
            ${prod.badge ? `<span class="badge badge-${prod.badgeType}">${prod.badge}</span>` : ''}
          </div>
          <div class="product-actions-floating">
            <button class="action-float-btn quick-view-btn" data-id="${prod.id}" title="Quick View">
              <i class="fa-regular fa-eye"></i>
            </button>
            <button class="action-float-btn wishlist-btn" data-id="${prod.id}" title="Add to Wishlist">
              <i class="fa-regular fa-heart"></i>
            </button>
          </div>
        </div>
        <div class="product-content">
          <span class="product-category-tag">${prod.category}</span>
          <h4 class="product-title">
            <a href="javascript:void(0)" class="quick-view-trigger" data-id="${prod.id}">${prod.name}</a>
          </h4>
          <div class="product-rating">
            ${getStarRatingHTML(prod.rating)}
            <span class="rating-count">(${prod.reviewsCount})</span>
          </div>
          <p class="product-short-desc">${prod.description}</p>
          <div class="product-meta-row">
            <div class="product-price">
              <span class="current-price">$${prod.price.toFixed(2)}</span>
              ${prod.oldPrice ? `<span class="oldPrice old-price">$${prod.oldPrice.toFixed(2)}</span>` : ''}
            </div>
            <button class="btn btn-primary btn-sm add-to-cart-btn" data-id="${prod.id}">
              <i class="fa-solid fa-cart-shopping"></i> Add
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Attach listeners
    attachCardListeners(gridContainer);
    updateWishlistUI();
    if (window.initScrollReveal) {
      window.initScrollReveal();
    }
    if (window.initCardSpotlight) {
      window.initCardSpotlight();
    }
  }

  function getStarRatingHTML(rating) {
    let stars = '';
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    for (let i = 0; i < full; i++) stars += '<i class="fa-solid fa-star"></i>';
    if (half) stars += '<i class="fa-solid fa-star-half-stroke"></i>';
    return stars;
  }

  function attachCardListeners(container) {
    // Quick View
    container.querySelectorAll('.quick-view-btn, .quick-view-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = parseInt(btn.getAttribute('data-id'), 10);
        openQuickView(id);
      });
    });

    // Wishlist Toggle
    container.querySelectorAll('.wishlist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = parseInt(btn.getAttribute('data-id'), 10);
        toggleWishlist(id, btn);
      });
    });

    // Add to cart
    container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = parseInt(btn.getAttribute('data-id'), 10);
        addToCartById(id, 1);
      });
    });
  }

  /**
   * Filter controls
   */
  function initFilters() {
    // Category items
    const catItems = document.querySelectorAll('.category-filter-item');
    catItems.forEach(item => {
      item.addEventListener('click', () => {
        catItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        currentCategory = item.getAttribute('data-category') || 'all';
        renderProductCards();
      });
    });

    // Price slider
    const priceSlider = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValueDisplay');
    if (priceSlider && priceValue) {
      priceSlider.addEventListener('input', (e) => {
        currentMaxPrice = parseFloat(e.target.value);
        priceValue.textContent = `$${currentMaxPrice.toFixed(0)}`;
        renderProductCards();
      });
    }

    // Search input
    const searchInput = document.getElementById('catalogSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearchQuery = e.target.value.trim();
        renderProductCards();
      });
    }

    // Sort select
    const sortSelect = document.getElementById('catalogSortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderProductCards();
      });
    }
  }

  window.resetCatalogFilters = function () {
    currentCategory = 'all';
    currentSearchQuery = '';
    currentMaxPrice = 100;
    currentSort = 'featured';

    const catItems = document.querySelectorAll('.category-filter-item');
    catItems.forEach(i => i.classList.remove('active'));
    const allCat = document.querySelector('.category-filter-item[data-category="all"]');
    if (allCat) allCat.classList.add('active');

    const searchInput = document.getElementById('catalogSearchInput');
    if (searchInput) searchInput.value = '';

    const priceSlider = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValueDisplay');
    if (priceSlider && priceValue) {
      priceSlider.value = 100;
      priceValue.textContent = '$100';
    }

    const sortSelect = document.getElementById('catalogSortSelect');
    if (sortSelect) sortSelect.value = 'featured';

    renderProductCards();
  };

  /**
   * Quick View Modal
   */
  function initQuickViewModal() {
    const modal = document.getElementById('quickViewModal');
    if (!modal) return;

    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  function openQuickView(id) {
    const modal = document.getElementById('quickViewModal');
    if (!modal) return;

    const prod = PRODUCTS_DATA.find(p => p.id === id);
    if (!prod) return;

    const modalBody = modal.querySelector('.quickview-body');
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div class="quickview-grid">
        <div class="quickview-image-wrap">
          <img src="${prod.image}" alt="${prod.name}" loading="lazy" style="width: 100%; border-radius: var(--radius-lg); object-fit: cover;">
        </div>
        <div class="quickview-info">
          <span class="product-category-tag">${prod.category}</span>
          <h2 style="font-size: 1.6rem; margin-bottom: 0.5rem;">${prod.name}</h2>
          <div class="product-rating" style="margin-bottom: 0.8rem;">
            ${getStarRatingHTML(prod.rating)}
            <span class="rating-count">(${prod.reviewsCount} customer reviews)</span>
          </div>
          <div class="product-price" style="margin-bottom: 1.25rem;">
            <span class="current-price" style="font-size: 1.8rem;">$${prod.price.toFixed(2)}</span>
            ${prod.oldPrice ? `<span class="old-price" style="font-size: 1.1rem;">$${prod.oldPrice.toFixed(2)}</span>` : ''}
          </div>
          <p style="font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">${prod.description}</p>
          
          <div style="background: var(--bg-body); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.25rem;">
            <h5 style="margin-bottom: 0.5rem; font-size: 0.9rem; text-transform: uppercase;">Nutritional Specs & Profile:</h5>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.85rem;">
              ${Object.entries(prod.specs).map(([key, val]) => `
                <div><strong>${key}:</strong> <span style="color: var(--text-muted);">${val}</span></div>
              `).join('')}
            </div>
          </div>

          <p style="font-size: 0.85rem; margin-bottom: 1.5rem;">
            <strong>Recommended Feeding Rate:</strong> <span style="color: var(--text-muted);">${prod.dosage}</span>
          </p>

          <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
            <div class="quantity-control" style="height: 44px;">
              <button class="qty-btn" id="modalQtyMinus" style="width: 36px; height: 100%; font-size: 1rem;">-</button>
              <span class="qty-val" id="modalQtyVal" style="font-size: 1.1rem; padding: 0 1.2rem;">1</span>
              <button class="qty-btn" id="modalQtyPlus" style="width: 36px; height: 100%; font-size: 1rem;">+</button>
            </div>
            <button class="btn btn-primary" id="modalAddToCartBtn" style="flex-grow: 1;">
              <i class="fa-solid fa-cart-shopping"></i> Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;

    // Modal Qty
    let modalQty = 1;
    const qtyVal = modalBody.querySelector('#modalQtyVal');
    modalBody.querySelector('#modalQtyMinus').addEventListener('click', () => {
      if (modalQty > 1) {
        modalQty--;
        qtyVal.textContent = modalQty;
      }
    });
    modalBody.querySelector('#modalQtyPlus').addEventListener('click', () => {
      modalQty++;
      qtyVal.textContent = modalQty;
    });

    modalBody.querySelector('#modalAddToCartBtn').addEventListener('click', () => {
      if (window.addToCart) {
        window.addToCart(prod, modalQty);
        modal.classList.remove('active');
      }
    });

    modal.classList.add('active');
  }

  // Export
  window.PRODUCTS_DATA = PRODUCTS_DATA;
  window.openQuickView = openQuickView;
  window.addToCartById = addToCartById;
  window.toggleWishlist = toggleWishlist;
  window.updateWishlistUI = updateWishlistUI;
})();
