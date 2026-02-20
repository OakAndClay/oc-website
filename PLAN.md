# Oak and Clay Website E-commerce Build Plan

## Project Goal
Integrate shopping cart, checkout, and authentication functionality into the existing Next.js 16 / App Router / TypeScript / Tailwind CSS v4 site.

## Key Features

### 1. Authentication
- **Provider:** NextAuth.js (Auth.js v5)
- **Methods:** Email/password credentials, Google OAuth, Apple OAuth
- **Terms of Use:**
    - User must accept Terms of Use on signup (checkbox + timestamp stored).
    - Placeholder Terms of Use page at `/terms`.
- **User Profile:** Page showing order history.

### 2. Database
- **Technology:** Supabase (Postgres) via Prisma ORM.
- **Schema:**
    - `Users`: For authentication and profile data.
    - `Products`: Details about kits and plans.
    - `Orders`: Transaction history.
    - `OrderItems`: Details of items within an order.
    - `PricingConfig`: Centralized storage for global pricing variables.
- **API Keys:** All API keys to be managed as environment variables (`.env.example` will document them).

### 3. Global Pricing Configuration
- **Mechanism:** Centralized `PricingConfig` database table (key-value pairs for global rates).
- **Product Pricing Model:**
    - Kit price calculation: `(material_qty × material_rate) + (labor_qty × labor_rate) + other_hard_costs`.
    - `material_rate` and `labor_rate` are global variables stored in `PricingConfig`.
    - `material_qty`, `labor_qty`, and `other_hard_costs` are stored per product.
- **Crypto Fee Markup:**
    - `crypto_fee_percentage` global variable (e.g., 3.5 for 3.5%).
    - If crypto payment selected, `final_price = base_price * (1 + crypto_fee_percentage/100)`.
- **Admin Access:** API route to update `PricingConfig` values.

### 4. Products
- **Types:** "kit" (full timber frame kit) and "plans" (piece drawings / PDF plans).
- **Attributes:** Name, description, images, type, `pricing_config_keys` (to reference global rates).
- **Pages:**
    - Product listing page at `/kits`.
    - Product detail page at `/kits/[slug]` showing options to buy full kit OR plans-only.

### 5. Shopping Cart
- **Persistence:** Stored in DB for logged-in users, localStorage for guests. Merges on login.
- **Display:** Cart page at `/cart` (items, quantities, subtotals).
- **UI:** Cart icon in header with item count badge.
- **Content:** Can add full kit OR plans-only for any kit.

### 6. Checkout Flow
- **Page:** `/checkout` (requires authentication; redirects to login if not authenticated).
- **Payment Selection:** USD (Stripe) or Crypto (NOWPayments).
- **Crypto Price:** Shows adjusted price with fee markup if crypto is chosen.

### 7. Payment Logic
- **For Plans/Drawings:**
    - Full payment required.
    - On successful payment, order marked "paid" and access granted to PDF download.
    - Download page at `/orders/[orderId]/download`.
- **For Kits:**
    - 50% deposit required at checkout.
    - Order statuses: `pending` → `deposit_paid` → `balance_paid` → `fabrication_scheduled` → `shipped`.
    - After deposit, order appears in user dashboard showing balance due.
    - Second payment (remaining 50%) triggered from order dashboard.
    - Balance must be paid before fabrication scheduling.

### 8. Payment Integrations
- **Stripe:** Integration structure with placeholder API keys. Webhook handler at `/api/webhooks/stripe`.
- **NOWPayments:** Integration for BTC, ADA, and other supported currencies. Webhook handler at `/api/webhooks/nowpayments`.
- Both handlers update order status on success.

## Technical Details
- **File Structure:**
    - Modular components: `src/components/cart/`, `src/components/checkout/`, `src/components/auth/`.
    - API routes: `src/app/api/auth/`, `src/app/api/cart/`, `src/app/api/checkout/`, `src/app/api/products/`, `src/app/api/webhooks/`, `src/app/api/admin/pricing/`.
    - Prisma schema at `prisma/schema.prisma`.
- **Styling:** Match existing site design (warm earth tones, Cinzel + Roboto fonts, stone color palette). Mobile responsive.
- **Code Quality:** Clean, production-quality code.
- **Build Verification:** `npm run build` must succeed.
- **Version Control:** All changes committed with descriptive messages.
- **Documentation:** `SETUP.md` documenting environment variables and setup for Supabase/Stripe/NOWPayments.

## Next Steps
- Address API rate limit issue for the sub-agent.
- Resume build once possible.
