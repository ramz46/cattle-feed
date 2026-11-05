# BoviCure & Feeds™ – Cattle Feed & Veterinary Supplies Website Template

A commercial-quality, modern, fully responsive website template designed specifically for **Cattle Feed Manufacturers, Feed Mills, Agricultural Suppliers, Ruminant Nutritionists, and Bovine Veterinary Care Providers**.

Built with **100% Pure HTML5, Modern CSS3, and Vanilla JavaScript** — strictly zero heavy frameworks, zero npm dependencies, and zero build steps required.

---

## 🌟 Key Highlights & Features

- **Zero Framework Dependency**: Engineered entirely using vanilla HTML5, CSS3, and modern JavaScript (ES6+).
- **Two Unique Homepage Designs**:
  - `index.html`: Modern Agricultural Landing Page with cinematic hero slider, trusted brand marquee, featured feeds showcase, why choose us, split nutrition layout, animated counter statistics, testimonials carousel, and blog preview.
  - `index-2.html`: Specialized Livestock & Veterinary Health Landing Page with storytelling layout, stage-by-stage feed showcases, scientific comparison matrix, real farm ROI case studies, and an **Interactive Live Cattle Ration & Nutrition Calculator**.
- **10 Core Storefront HTML Pages**:
  1. `index.html` – Modern Agricultural Landing Page
  2. `index-2.html` – Niche Livestock Nutrition & Veterinary Care Landing
  3. `about.html` – About Us, Mill Story, 30-Year Milestones Timeline, and Veterinary Team
  4. `products.html` – Complete Products Catalog with category filter sidebar, price range slider, real-time search, sorting, wishlist toggle, and quick view modal
  5. `livestock-care.html` – Educational Bovine Health Guide, Seasonal Care Matrix, Lifecycle Feeding Schedules, and FAQ Accordions
  6. `services.html` – Agricultural & Farm Services Grid with 4-step process timeline
  7. `service-details.html` – Comprehensive Service Detail Page with benefits, CNCPS modeling process, and pricing tiers
  8. `blog.html` – Modern Blog Listing with category tags, featured study, and pagination
  9. `blog-details.html` – Scientific Reading Experience with sticky Table of Contents, author bio, social sharing, and related research
  10. `contact.html` – Interactive Contact & Bulk Order Inquiry Form with live validation, Google Maps card, and emergency veterinary helpline
- **Interactive Features & Micro-Interactions**:
  - **Slide-Over Shopping Cart Drawer** with live quantity adjustments, subtotal computation, and free delivery progress bar.
  - **Quick Search Modal** with instant live product matching.
  - **Product Quick View Modal** displaying full nutritional profiles, crude protein, bypass fat %, and feeding dosages.
  - **Interactive Cattle Ration Calculator** computing dry matter intake (DMI), crude protein, and concentrate requirements based on body weight and milk yield.
  - **Complete Dark & Light Mode System** with instant CSS variable switching and `localStorage` persistence.
  - **Full RTL (Right-to-Left) Support** for Arabic and Hebrew layouts with one-click navbar toggle.
  - **Accessible Animations & Transitions**: IntersectionObserver scroll reveals, animated number counters, floating parallax elements, and magnetic buttons with full `prefers-reduced-motion` support.

---

## 📁 Project Folder Structure

```
cattle-feed-template/
│
├── index.html                   # Home 1: Modern Agricultural Landing Page
├── index-2.html                 # Home 2: Niche Livestock & Veterinary Landing
├── about.html                   # About Us, Mill Heritage & Veterinary Team
├── products.html                # Product Catalog with Sidebar Filters & Search
├── livestock-care.html          # Educational Bovine Guide & Feeding Schedules
├── services.html                # Farm Services & Logistics Grid
├── service-details.html         # Service Details with CNCPS Modeling & Pricing
├── blog.html                    # Blog Listing with Search & Filters
├── blog-details.html            # Article Reading Page with Sticky TOC
├── contact.html                 # Contact Us & Bulk Order Quotation Form
│
├── assets/
│   ├── css/
│   │   ├── style.css            # Core Design System, Variables & Components
│   │   ├── responsive.css       # Fluid Breakpoints & Mobile Nav Drawer
│   │   └── animations.css       # Keyframes, Scroll Reveals & Micro-motions
│   │
│   ├── js/
│   │   ├── main.js              # Sticky Header, Drawer, Toast System & Accordions
│   │   ├── animations.js        # IntersectionObserver & Animated Counters
│   │   ├── slider.js            # Vanilla JS Hero Slider & Touch Carousels
│   │   ├── products.js          # Catalog Dataset, Filters, Sorting & Quick View
│   │   ├── cart.js              # Persistent Shopping Cart & Slide-Over Drawer
│   │   ├── forms.js             # Validation & Interactive Nutrition Calculator
│   │   └── theme.js             # Dark/Light Mode & RTL/LTR Controller
│   │
│   └── images/                  # Structured image assets directory
│       ├── hero/
│       ├── products/
│       ├── livestock/
│       ├── team/
│       └── blog/
│
└── README.md
```

---

## 🎨 Design System & Customization

### Color Palette Tokens (`assets/css/style.css`)
Easily customize brand colors by modifying the CSS variables in `:root`:

```css
:root {
  --primary: #1e5631;          /* Deep pasture green */
  --primary-dark: #143d22;     /* Forest shadow */
  --primary-light: #2b7a46;    /* Vibrant foliage */
  --secondary: #d97706;        /* Warm harvest amber / golden corn */
  --earth: #5c4033;            /* Rich fertile soil */
  --vet-blue: #0284c7;         /* Clinical veterinary blue */
  --bg-body: #faf8f5;          /* Warm organic cream background */
}
```

### Typography
- Headings: `Manrope` (Google Font)
- Body text: `DM Sans` (Google Font)
- Editorial highlights: `Playfair Display` (Google Font)

---

## 🚀 How to Run & Deploy

1. **No Installation Needed**: Simply open `index.html` in any web browser directly (double-click or right-click -> Open with Chrome/Safari/Firefox/Edge).
2. **Local Development Server** (Optional):
   ```bash
   # Using Python 3 built-in server:
   python3 -m http.server 8000
   
   # Or using Node npx:
   npx serve .
   ```
3. **Deployment**: Upload all files to any web host (Netlify, Vercel, GitHub Pages, Apache, Nginx, or cPanel hosting) without any build process.

---

## 📄 License & Credits
- **Icons**: Font Awesome Free 6.5.1 via CDN
- **Fonts**: Google Fonts (`Manrope`, `DM Sans`, `Playfair Display`)
- **Images**: High-resolution agriculture & veterinary photography via Unsplash (Creative Commons Zero / Unsplash License)
- Designed and built for professional commercial sale and direct client handover.
