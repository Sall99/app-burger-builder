# 🍔 Burger Builder

A production-grade, full-stack e-commerce web application for building custom burgers online. Users can visually stack ingredients with drag-and-drop, apply coupons, earn loyalty rewards, pay via Stripe, and track orders — all in English or French.

**🌐 Live:** [app-burger-builder.vercel.app](https://app-burger-builder.vercel.app)

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Admin Panel](#admin-panel)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5.5 |
| **Styling** | Tailwind CSS 3 + CSS Animations |
| **State Management** | Redux Toolkit + Redux Persist |
| **Database** | MongoDB Atlas (via Prisma ORM) |
| **Authentication** | NextAuth.js (GitHub + Google OAuth + Credentials) |
| **Payments** | Stripe (React Stripe.js + Webhooks) |
| **Internationalization** | next-intl (English + French) |
| **Analytics** | Vercel Analytics, Speed Insights, Google Analytics, GTM |
| **Live Chat** | Tawk.to |
| **Form Validation** | Yup + React Hook Form |
| **Data Fetching** | Axios + SWR |
| **Drag & Drop** | dnd-kit |
| **Icons** | Lucide React, Heroicons, React Icons |
| **Unit Testing** | Jest + React Testing Library |
| **E2E Testing** | Playwright |
| **CI / DX** | Husky, lint-staged, Commitizen, Commitlint, ESLint, Prettier |
| **Deployment** | Vercel |
| **Node** | ≥ 22.0.0 |

---

## Features

### 🍔 Interactive Burger Builder
- Visual burger stacking with animated ingredient additions/removals
- Drag-and-drop reordering via dnd-kit
- Undo / redo build history
- Real-time price calculation
- Responsive layout (desktop + mobile total views)
- Saved burger templates & share functionality

### 🛒 E-Commerce Flow
- Ingredient controls with quantity management
- Meal deals & combo bundles
- Coupon system (validation, usage limits, min order values, per-user limits)
- Shipping address form with Yup validation
- Stripe Checkout with payment intent + webhook processing
- Post-purchase order tracking

### 👤 User System
- GitHub + Google OAuth sign-in
- Email / password credentials with bcrypt
- Role-based access control: `USER`, `ADMIN`, `SUPER_ADMIN`
- Profile management page

### ⭐ Loyalty Program
- Points accumulation based on spending
- Tiered rewards: Bronze → Silver → Gold → Platinum
- Reward redemption with expiry tracking
- Dedicated loyalty dashboard

### 🔐 Admin Panel
- Route-protected via middleware (ADMIN / SUPER_ADMIN only)
- Dashboard with stat cards
- Order, user, and coupon management
- Multi-language admin interface

### 🌍 Internationalization (i18n)
- English + French (25K+ chars each)
- Locale-aware routing via `[locales]` dynamic segment
- Automatic locale detection in middleware
- Locale switcher component

### 🔍 SEO & Performance
- OpenGraph & Twitter Card meta tags
- Schema.org structured data (Organization, Restaurant, Menu)
- Dynamic sitemap generation (next-sitemap)
- robots.txt
- Google Search Console verification
- Web Vitals monitoring
- Bundle analyzer (`npm run analyze`)
- Image optimization (AVIF, WebP)

### 🔒 Security
- HSTS, X-Frame-Options, X-Content-Type-Options
- XSS Protection, Referrer Policy, Permissions Policy
- Rate limiting on API routes
- Async error handler wrapper
- Error logging service

### ♿ Accessibility
- Skip-to-main link
- Keyboard shortcuts
- ARIA-compliant components
- Focus management utilities

### 💬 Live Chat & Notifications
- Tawk.to widget with user context (email, name)
- Push notifications utility
- React Hot Toast in-app notifications

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Client (Browser)                                           │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │  React UI   │→ │ Redux Store  │→ │ Redux Persist     │  │
│  │  Components │  │ (7 slices)   │  │ (localStorage)    │  │
│  └─────────────┘  └──────────────┘  └───────────────────┘  │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│  Next.js 14 Server                                          │
│  ┌──────────────┐  ┌───────────────┐  ┌─────────────────┐  │
│  │  Middleware   │  │ Server Actions│  │  API Routes     │  │
│  │  (Auth+i18n) │  │ (5 modules)   │  │  (8 endpoints)  │  │
│  └──────────────┘  └───────┬───────┘  └────────┬────────┘  │
│                            │                    │           │
│                            ▼                    ▼           │
│                    ┌──────────────────────────────┐         │
│                    │      Prisma ORM              │         │
│                    └──────────────┬───────────────┘         │
└───────────────────────────────────┼─────────────────────────┘
                                    │
        ┌───────────────────────────┼──────────────────┐
        ▼                          ▼                   ▼
 ┌──────────────┐       ┌──────────────┐     ┌──────────────┐
 │ MongoDB Atlas│       │  Stripe API  │     │  OAuth       │
 │ (7 models)   │       │  (Payments)  │     │(GitHub/Google)│
 └──────────────┘       └──────────────┘     └──────────────┘
```

### State Management (Redux Slices)

| Slice | Purpose | Persisted |
|---|---|---|
| `ingredients` | Burger ingredients state | ✅ |
| `ingredients-enhanced` | Undo/redo, templates | ❌ |
| `combo` | Meal deal selections | ❌ |
| `coupon` | Applied coupon state | ❌ |
| `loyalty` | Loyalty points / rewards | ❌ |
| `shipping-address` | Shipping form data | ✅ |
| `substitutions` | Ingredient substitution options | ❌ |

---

## Project Structure

```
app-burger-builder/
├── prisma/
│   └── schema.prisma            # MongoDB schema (7 models)
├── locales/
│   ├── en.json                  # English translations
│   └── fr.json                  # French translations
├── i18n/                        # next-intl configuration
├── libs/                        # Auth options, session wrapper
├── e2e/                         # Playwright E2E tests
│   ├── authentication.spec.ts
│   ├── burger-builder.spec.ts
│   └── navigation.spec.ts
├── src/
│   ├── middleware.ts             # Auth + i18n + security middleware
│   ├── actions/                  # Server actions
│   │   ├── auth/                 #   Auth actions
│   │   ├── loyalty/              #   Loyalty program
│   │   ├── orders/               #   Order management
│   │   ├── payments/             #   Payment processing
│   │   └── users/                #   User management
│   ├── app/
│   │   ├── [locales]/            # Locale-aware pages
│   │   │   ├── layout.tsx        #   Root layout + SEO + Schema.org
│   │   │   ├── page.tsx          #   🏠 Burger Builder (home)
│   │   │   ├── admin/            #   🔐 Admin dashboard
│   │   │   ├── auth/             #   🔑 Sign in / Sign up
│   │   │   ├── profile/          #   👤 User profile
│   │   │   ├── history/          #   📋 Order history
│   │   │   ├── loyalty/          #   ⭐ Loyalty program
│   │   │   ├── success/          #   ✅ Payment success
│   │   │   ├── cancel/           #   ❌ Payment cancel
│   │   │   ├── track-order/      #   📦 Order tracking
│   │   │   ├── locations/        #   📍 Store locations
│   │   │   ├── help/             #   ❓ Help / FAQ
│   │   │   └── notifications/    #   🔔 Notifications
│   │   └── api/                  # API routes
│   │       ├── auth/             #   NextAuth handler
│   │       ├── admin/            #   Admin endpoints
│   │       ├── orders/           #   Order CRUD
│   │       ├── coupons/          #   Coupon validation
│   │       ├── loyalty/          #   Loyalty endpoints
│   │       ├── create-payment-intent/  # Stripe payment intent
│   │       ├── stripe/           #   Stripe webhooks
│   │       └── user/             #   User endpoints
│   ├── components/
│   │   ├── admin/                # Admin nav, stat cards
│   │   ├── chat/                 # Tawk.to integration
│   │   ├── error-boundary/       # Error boundaries
│   │   ├── layout/               # Header, Footer, Popover
│   │   └── ui/                   # 23 reusable UI components
│   ├── redux/                    # Redux Toolkit store
│   │   ├── store.ts              #   Store with persistence
│   │   ├── slices/               #   7 state slices
│   │   └── selectors/            #   Memoized selectors
│   ├── lib/                      # Core utilities
│   │   ├── rate-limit.ts         #   API rate limiting
│   │   ├── error-logger.ts       #   Error logging
│   │   ├── performance.ts        #   Performance monitoring
│   │   ├── accessibility.ts      #   A11y helpers
│   │   ├── metadata.ts           #   SEO metadata helpers
│   │   ├── async-handler.ts      #   Async error wrapper
│   │   └── env.ts                #   Env validation
│   ├── config/                   # App + SEO config
│   ├── hooks/                    # Custom hooks
│   ├── providers/                # React providers
│   ├── types/                    # TypeScript definitions
│   ├── utils/                    # Utilities
│   └── styles/                   # CSS animations
```

---

## Database Schema

**Prisma + MongoDB** with 7 models:

```
User ──┬── Account         (OAuth providers)
       ├── Order ── Address (Shipping)
       ├── CouponUsage ── Coupon
       ├── Loyalty         (Points & tiers)
       └── RedeemedReward  (Reward history)
```

**Enums:**
- `UserRole` — `USER` · `ADMIN` · `SUPER_ADMIN`
- `OrderStatus` — `PENDING` · `PROCESSING` · `COMPLETED` · `DELIVERED` · `CANCELLED`
- `LoyaltyTier` — `BRONZE` · `SILVER` · `GOLD` · `PLATINUM`

### Prisma Commands

```bash
npx prisma generate        # Generate Prisma Client
npx prisma db push          # Push schema to database
npx prisma studio           # Open database GUI
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 22.0.0
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/Sall99/app-burger-builder.git
    cd app-burger-builder
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**

    ```bash
    cp env.example .env.local
    ```

    See [Environment Variables](#environment-variables) for details.

4. **Set up the database:**

    ```bash
    npx prisma generate
    npx prisma db push
    ```

### Running the Application

```bash
npm run dev          # Development server → http://localhost:3000
npm run build        # Production build (prisma generate + next build)
npm start            # Start production server
npm run analyze      # Bundle analyzer
```

---

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | ✅ | MongoDB Atlas connection string |
| `NEXTAUTH_SECRET` | ✅ | NextAuth encryption key |
| `GITHUB_ID` | ⬜ | GitHub OAuth client ID |
| `GITHUB_SECRET` | ⬜ | GitHub OAuth client secret |
| `GOOGLE_ID` | ⬜ | Google OAuth client ID |
| `GOOGLE_SECRET` | ⬜ | Google OAuth client secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ⬜ | Stripe publishable key |
| `NEXT_STRIPE_SECRET_KEY` | ⬜ | Stripe server-side secret key |
| `GOOGLE_ANALYTICS` | ⬜ | GA4 tracking ID |
| `NEXT_PUBLIC_TAWK_PROPERTY_ID` | ⬜ | Tawk.to property |
| `NEXT_PUBLIC_TAWK_WIDGET_ID` | ⬜ | Tawk.to widget |

### Quick Setup

```bash
cp env.example .env.local
# or pull from Vercel:
vercel env pull .env.local
```

### Test Credentials

- **Admin:** `admin@test.com` / `admin123`
- **User:** `user@test.com` / `user123`

---

## Testing

| Type | Tool | Command |
|---|---|---|
| Unit / Integration | Jest + Testing Library | `npm test` |
| Coverage report | Jest | `npm run test:coverage` |
| CI mode | Jest | `npm run test:ci` |
| E2E | Playwright | `npm run test:e2e` |
| E2E (UI mode) | Playwright | `npm run test:e2e:ui` |
| All tests | Jest + Playwright | `npm run test:all` |

### E2E Test Suites

- `authentication.spec.ts` — Sign in / sign up flows
- `burger-builder.spec.ts` — Builder interactions & ordering
- `navigation.spec.ts` — Route navigation & locale switching

---

## Admin Panel

Accessible at `/admin` for `ADMIN` and `SUPER_ADMIN` roles only.

| Route | Feature |
|---|---|
| `/admin` | Dashboard with key metrics |
| `/admin/orders` | Order management & filtering |
| `/admin/users` | User account & role management |
| `/admin/coupons` | Coupon creation & management |

Protected by middleware — unauthorized users are redirected to the sign-in page.

---

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in the Vercel dashboard
4. Deploy!

Automatic sitemap generation runs post-build via `next-sitemap`.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit using Conventional Commits (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- TypeScript throughout
- ESLint + Prettier enforced via Husky pre-commit hooks
- Conventional Commits via Commitizen (`npm run commit`)
- Write tests for new features

---

## License

This project is licensed under the MIT License.

---

## Acknowledgments

- [Next.js](https://nextjs.org/) · [Prisma](https://www.prisma.io/) · [MongoDB](https://www.mongodb.com/) · [NextAuth.js](https://next-auth.js.org/) · [Stripe](https://stripe.com/) · [Tailwind CSS](https://tailwindcss.com/) · [dnd-kit](https://dndkit.com/) · [next-intl](https://next-intl-docs.vercel.app/)

---

Made with ❤️ by the Burger Builder Team
