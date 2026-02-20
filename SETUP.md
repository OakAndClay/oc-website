# Oak and Clay — Setup Guide

## Prerequisites
- Node.js 20+
- PostgreSQL database (Supabase recommended)

## 1. Environment Variables

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

### Database (Supabase)
1. Create a project at [supabase.com](https://supabase.com)
2. Go to Settings → Database → Connection string (URI)
3. Set `DATABASE_URL` in `.env.local`

### NextAuth Secret
```bash
openssl rand -base64 32
```
Set the output as `AUTH_SECRET`.

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 credentials
3. Add redirect URI: `https://yourdomain.com/api/auth/callback/google`
4. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

### Apple OAuth
1. Go to [Apple Developer](https://developer.apple.com/account/resources/identifiers/list/serviceId)
2. Create a Services ID and configure Sign in with Apple
3. Add redirect URI: `https://yourdomain.com/api/auth/callback/apple`
4. Set `APPLE_CLIENT_ID` and `APPLE_CLIENT_SECRET`

### Stripe
1. Sign up at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard → Developers → API keys
3. Set `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY`
4. Set up webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Events to listen for: `checkout.session.completed`
5. Set `STRIPE_WEBHOOK_SECRET` from the webhook signing secret

### NOWPayments (Crypto)
1. Sign up at [nowpayments.io](https://nowpayments.io)
2. Get API key from Dashboard → API Keys
3. Set IPN callback URL: `https://yourdomain.com/api/webhooks/nowpayments`
4. Set `NOWPAYMENTS_API_KEY` and `NOWPAYMENTS_IPN_SECRET`
5. Supported currencies include BTC, ADA, ETH, LTC, XMR, and [many more](https://nowpayments.io/help/what-payments-does-nowpayments-support)

## 2. Database Setup

Generate Prisma client and push schema:

```bash
npx prisma generate
npx prisma db push
```

### Seed Pricing Config

After the database is set up, seed the initial pricing rates. You can do this via Prisma Studio or SQL:

```sql
INSERT INTO "PricingConfig" (id, key, value, description, "updatedAt") VALUES
  (gen_random_uuid(), 'material_rate_per_unit', 12.50, 'Cost per unit of timber material', NOW()),
  (gen_random_uuid(), 'labor_rate_per_hour', 45.00, 'Labor cost per hour', NOW()),
  (gen_random_uuid(), 'crypto_fee_percentage', 3.5, 'Percentage markup for crypto payments', NOW()),
  (gen_random_uuid(), 'plan_price_cottage', 299.00, 'Flat price for cottage plan set', NOW()),
  (gen_random_uuid(), 'plan_price_sauna', 199.00, 'Flat price for sauna plan set', NOW());
```

### Seed Products

```sql
-- Example: Cottage kit
INSERT INTO "Product" (id, name, slug, description, images, type, "materialQty", "laborQty", "otherHardCosts", "materialRateKey", "laborRateKey", "planPriceKey", active, "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'Cottage Kit', 'cottage', 'A beautiful timber frame cottage kit with traditional joinery.', ARRAY['/img/cottage.jpg'], 'kit', 200, 80, 500, 'material_rate_per_unit', 'labor_rate_per_hour', NULL, true, NOW(), NOW()),
  (gen_random_uuid(), 'Cottage Plans', 'cottage-plans', 'Complete piece drawings for the cottage timber frame.', ARRAY['/img/cottage-plans.jpg'], 'plans', 0, 0, 0, 'material_rate_per_unit', 'labor_rate_per_hour', 'plan_price_cottage', true, NOW(), NOW());
```

**Pricing formula for kits:**
`price = (materialQty × material_rate_per_unit) + (laborQty × labor_rate_per_hour) + otherHardCosts`

**Pricing for plans:** Flat price from the referenced `planPriceKey` in PricingConfig.

## 3. Run Development Server

```bash
npm run dev
```

## 4. Admin Access

To make a user an admin (for pricing config management), update the database directly:

```sql
UPDATE "User" SET "isAdmin" = true WHERE email = 'your@email.com';
```

Admin API endpoint: `PUT /api/admin/pricing` — update global pricing rates.

## 5. Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables from `.env.example`
4. Set `NEXT_PUBLIC_APP_URL` to your production URL
5. Deploy

## Architecture Notes

### Pricing System
- Global rates stored in `PricingConfig` table (key-value pairs)
- Products store quantities (`materialQty`, `laborQty`, `otherHardCosts`) and rate keys
- Final price computed dynamically: `(materialQty × rate) + (laborQty × rate) + hardCosts`
- Plans use a flat price from a config key
- Changing a global rate instantly updates all product prices

### Payment Flow
- **Plans**: Full payment → order completed → download access
- **Kits**: 50% deposit → order status `deposit_paid` → pay balance from profile → `balance_paid` → fabrication
- **Crypto**: Base price × (1 + crypto_fee_percentage/100)
