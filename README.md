# 🚗 Orange Cab - Premium Cab Booking Website & Admin Console (MERN Stack)

> A modern, luxury, production-ready full-stack cab booking monorepo built with the **MERN** stack (MongoDB, Express.js, React 18 with Vite, and Node.js). Featuring glassmorphism UI, glowing orange accents, 60fps animations, floating AI chat assistant, real-time driver dispatch, and an executive administration dashboard.

---

## 🎨 Design System

- **Primary Orange (Accent & Glow):** `#FF7A1A` with hover glow `#FF9A4D`
- **Midnight Navy (Dark Canvas & Surfaces):** `#0B1220` (background) and `#121B2E` (surface cards)
- **Soft White (Typography & Translucent Glass):** `#F8FAFC`
- **Glassmorphism Layers:** `backdrop-filter: blur(16-24px)`, `background: rgba(255,255,255,0.08)`, `1px border rgba(255,255,255,0.18)`, and soft orange glow shadows.
- **Typography:** **Poppins** for headings, **Inter** for body text.

---

## 🌐 Application Architecture & Port Mapping

| Application | Production Domain | Local Development URL | Description |
|---|---|---|---|
| **Public Website** | `https://orangecab.vercel.app` (`orangecabs.in` when configured) | [http://localhost:5173](http://localhost:5173) | Customer booking portal, price calculator, tour packages, tracking |
| **Admin Console** | `https://orangecab.vercel.app/admin/login` (`orangecabs.in/admin/login` when configured) | [http://localhost:5174/login](http://localhost:5174/login) | Fleet management, bookings dispatch, analytics, CRM, CMS |
| **Backend REST API** | `https://orangecab.vercel.app/api` | [http://localhost:5000/api](http://localhost:5000/api) | Express + Mongoose API; same-origin serverless functions on Vercel |

The public website, admin console, and API share one production origin on Vercel. In local development the website/admin remain separate Vite servers and call the Express API on port 5000.

---

## 🔐 Admin Login Setup

Admin accounts use credentials configured for each installation; the application does not ship with a default admin password.

1. Copy `server/.env.example` to `server/.env` and configure the MongoDB URI, a unique `JWT_SECRET`, admin name/email, and a strong `ADMIN_PASSWORD` (at least 6 characters).
2. Start MongoDB, then create the first administrator without clearing any application data:
   ```bash
   npm run create-admin
   ```
3. Start the apps with `npm run dev`, then sign in at [http://localhost:5174/login](http://localhost:5174/login).

The separate `npm run seed` command clears and repopulates demo content. It preserves existing administrator accounts and only creates one from the configured admin environment values if that email does not already exist. Do not use demo seed data in production.

---

## 📁 Monorepo Folder Structure

```
orange_cabs/
├── client/                     # Public customer web app (React 18 + Vite)
│   ├── src/
│   │   ├── components/         # Navbar, Footer, FloatingWidgets, BookingWidget, Preloader, AuthModal
│   │   ├── pages/              # Home, Services, Fleet, Tariff, Tour Packages, Book, Track, About, Contact, Blog, Legal, MyBookings
│   │   ├── context/            # AuthContext (Dark/Light mode, User session)
│   │   └── services/           # Axios API service
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
├── admin/                      # Executive Operations Admin Panel (React 18 + Vite)
│   ├── src/
│   │   ├── components/         # AdminLayout, Sidebar, Navbar, Notifications
│   │   ├── pages/              # Dashboard, Bookings, Vehicles, Drivers, Customers, Tariff, Routes, Coupons, Enquiries, Reviews, Blogs, Settings, Logs
│   │   ├── context/            # AdminAuthContext (Socket.io notifications, Dark/Light mode)
│   │   └── services/           # Admin Axios API service
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
├── server/                     # Express REST API & Real-time WebSockets
│   ├── src/
│   │   ├── config/             # MongoDB Mongoose connection
│   │   ├── models/             # 13 Mongoose models (User, Admin, Booking, Vehicle, Driver, Route, Package, Coupon, Review, Enquiry, ChatMessage, Blog, Setting, ActivityLog)
│   │   ├── controllers/        # Centralized business logic & stats aggregations
│   │   ├── middleware/         # JWT Auth, Admin RBAC roles, Error handler
│   │   ├── routes/             # Express API endpoints mounted under /api
│   │   ├── seeds/              # Rich seed script with 20 bookings, 8 cars, 10 drivers, 12 routes, 6 packages, 6 coupons, 12 reviews, 8 blogs
│   │   ├── app.js              # Shared Express API app and middleware for local/Vercel
│   │   └── server.js           # Local HTTP and Socket.io server entry point
│   ├── .env.example
│   └── package.json
│
├── api/                        # Vercel serverless API entry point
│   ├── [...path].js
│   └── package.json
├── design/
│   └── reference-assets/
│       └── assets_source/      # Original design and reference images
├── deployment/
│   └── nginx.conf              # Nginx reverse proxy configuration
├── legacy/
│   └── static-site/
│       ├── assets/             # Static-site assets
│       ├── build_full_page.py  # Generator for the standalone legacy home page
│       ├── fleet.html
│       └── index.html
├── archive/
│   └── skbtours-public_html.zip
├── vercel.json                 # Kept at repository root for Vercel auto-detection
├── package.json                # Root monorepo scripts
└── README.md
```

The standalone HTML site is kept separate from the active React apps. To regenerate its home page, run `python build_full_page.py` from `legacy/static-site/`. Vercel's `vercel.json` remains at the repository root so the platform can detect it.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v24 tested)
- **MongoDB**: Running locally at `mongodb://127.0.0.1:27017/orangecab` (or URI configured in `server/.env`)

### 2. Install All Dependencies
Run from the root directory:
```bash
npm run install:all
```

### 3. Create an Admin Account
Create an administrator using the credentials configured in `server/.env`:
```bash
npm run create-admin
```
Use `npm run seed` only when you intentionally want to clear and repopulate demo content.

### 4. Start All Apps Concurrently
A single command runs the Server, Public Website, and Admin Console simultaneously:
```bash
npm run dev
```

Output:
- **Server:** Listening on `http://localhost:5000` (API: `http://localhost:5000/api`)
- **Client (Public Web):** `http://localhost:5173`
- **Admin Panel:** `http://localhost:5174/login`

### Vercel: Website, Admin, and API on One Domain

Connect the repository to Vercel with the repository root (`.`) as the project root. The root `vercel.json` configures the app builds and output:

- Install command: `npm run install:vercel`
- Build command: `npm run build:vercel`
- Output directory: `deployment/vercel-output/client`

The build produces the public app at the output root and copies the admin app into `deployment/vercel-output/client/admin`. The admin Vite base path is `/admin/`. In `vercel.json`, the `/api/*` pass-through rewrite is listed first so API requests reach the `api/[...path].js` Vercel Function instead of the public SPA fallback; the function forwards them to the reusable Express app in `server/src/app.js`. Admin rewrites follow, and the public SPA fallback is last. Static files are served from the configured output, and both apps support direct route refresh. The dedicated output folder keeps local tracked `dist` directories untouched.

#### Required Vercel environment variables

- `MONGODB_URI` — production MongoDB connection string (for example, a MongoDB Atlas URI).
- `JWT_SECRET` — unique random secret of at least 32 characters.

Add these optional Vercel **Production** variables if needed:

- `JWT_EXPIRES_IN` — token lifetime (defaults to the existing server behavior).
- `CLIENT_URL`, `ADMIN_URL`, `CORS_ORIGINS` — additional browser origins if the site/admin use custom or separate domains. Same-origin Vercel requests need no CORS configuration.
- `VITE_SOCKET_URL` — URL of a separately hosted persistent Socket.IO service, only if real-time booking notifications are required. Vercel serverless functions do not provide a persistent Socket.IO server; HTTP booking and admin APIs continue to work without it.

Vercel provides `VERCEL_URL` and `VERCEL_PROJECT_PRODUCTION_URL` automatically and the API uses them for origin validation. Do not set `VITE_API_URL` in production: both frontend builds use the same-origin `/api` path. `VITE_API_URL` is only an optional local-development override; local defaults continue to use `http://localhost:5000/api`. The serverless function reuses a cached Mongoose connection across warm invocations and returns a JSON 503 if the production database is not configured or available.

#### Deploy and verify

1. In Vercel, import this repository and keep the **Root Directory** as `.`. Use the commands and output directory above (already defined in `vercel.json`).
2. Set `MONGODB_URI` and `JWT_SECRET` in **Project Settings → Environment Variables** for Production (and Preview/Development if those deployments need the API). Add any optional variables above, then redeploy.
3. Check `https://orangecab.vercel.app/api/health` for a JSON response with `"status":"online"` and `"database":"connected"`.
4. Check `https://orangecab.vercel.app/api/settings`, `https://orangecab.vercel.app/api/services`, and `https://orangecab.vercel.app/api/vehicles?status=available` for JSON responses. Empty service/vehicle arrays are valid when the database has no records.
5. Open `https://orangecab.vercel.app/` and `https://orangecab.vercel.app/admin/login`, then verify public booking and admin login with a configured database and admin account.

If API requests return 503, verify the Production `MONGODB_URI`, Atlas network access, and `JWT_SECRET` in Vercel, then inspect the Function logs. Production data and credentials are not included in this repository. Do not commit `.env` files.

#### Local production build

Install all three app dependencies with `npm run install:vercel`, then run `npm run build:vercel`. The combined static output is `deployment/vercel-output/client`.

---

## ✨ Features Checklist

### Public Website (`orangecabs.in`)
- [x] **Page-Load Preloader:** Animated cab moving across road with glowing logo reveal.
- [x] **Hero Section:** Animated headline reveal, moving cab on road line, floating glass cards.
- [x] **Booking Widget:** Tabs for *Outstation One-Way*, *Round Trip*, *Airport Transfer*, and *Local Rental* with live price calculator.
- [x] **Why Choose Us:** Glassmorphism 3D cards with hover lift and glow borders.
- [x] **Popular Corridors:** Bangalore to Mysore, Coorg, Ooty, Chikmagalur, Tirupati, Airport with instant rates.
- [x] **Fleet Showcase:** Sedan, SUV, Innova Crysta, Tempo Traveller, Luxury with specs and features.
- [x] **Step-by-Step Guide:** 3 animated steps from booking to arrival.
- [x] **Coupons & Promo Codes:** Copyable promo banners (e.g. `ORANGE250`, `LUXURY15`).
- [x] **Live Animated Counters:** 50,000+ completed rides, 120+ cities, 4.9/5 verified rating.
- [x] **Testimonials & Blog previews:** Authentic verified passenger reviews and travel articles.
- [x] **Floating Widgets:**
  - **Left Side:** AI-style glass Chatbot with quick-reply chips, rule-based answers, message logging, and WhatsApp fallback.
  - **Right Side:** Floating WhatsApp button (pulsing green glass), Floating Call button (orange), and Back-To-Top button.
- [x] **Customer Accounts:** Login, Register, OTP option, My Bookings history, trip cancellations, post-trip review rating, and printable PDF invoices.
- [x] **Footer:** Real brand colors for socials (Facebook, Instagram gradient, X, YouTube, LinkedIn, WhatsApp, Telegram, Pinterest) and credit link to `bookmywebsite.in`.

### Operations Admin Console (`orangecabs.in/admin`)
- [x] **Dashboard:** KPI cards (Revenue, Bookings, Active Trips, Fleet counts), Recharts monthly revenue line chart, cab type distribution donut chart, recent reservations, and live audit feed.
- [x] **Bookings Dispatcher:** Status transition workflow (`Pending` -> `Confirmed` -> `Assigned` -> `On Trip` -> `Completed` -> `Cancelled`), driver & vehicle assignment, CSV export, printable invoice.
- [x] **Fleet & Vehicle Manager:** CRUD operations, per-km rates, fuel types, capacities, registration plates.
- [x] **Driver Management:** Experience, rating, license authentication, availability toggles.
- [x] **Customer CRM:** Rider list, booking counts, block/activate account toggles.
- [x] **Tariff Engine:** Configure base kilometers, night charges, driver daily allowances, toll estimates, and GST percentage.
- [x] **Routes & Packages:** Manage fixed-rate intercity routes and holiday itineraries.
- [x] **Real-time Notifications:** Local Socket.io alerts admins of incoming bookings; Vercel deployments need a separately hosted persistent socket service configured with `VITE_SOCKET_URL`.
