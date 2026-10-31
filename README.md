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
| **Public Website** | `https://orangecabs.in` | [http://localhost:5173](http://localhost:5173) | Customer booking portal, price calculator, tour packages, tracking |
| **Admin Console** | `https://orangecabs.in/admin/login` | [http://localhost:5174/login](http://localhost:5174/login) | Fleet management, bookings dispatch, analytics, CRM, CMS |
| **Backend REST API** | `https://api.orangecab.in` | [http://localhost:5000/api](http://localhost:5000/api) | Express + Mongoose + Socket.io API |

The public website and admin console share one production domain. In local development they remain separate Vite servers; opening `/admin` on the public server redirects to the admin dev server.

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
│   │   └── server.js           # Server entry point with Socket.io & security middlewares
│   ├── .env
│   ├── .env.example
│   └── package.json
│
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

### Vercel: Public Website and Admin on One Domain

Connect the repository to Vercel with the repository root (`.`) as the project root and attach `orangecabs.in`. The root `vercel.json` configures the app builds and output:

- Install command: `npm run install:apps`
- Build command: `npm run build:vercel`
- Output directory: `deployment/vercel-output/client`

The build produces the public app at the output root and copies the admin app into `deployment/vercel-output/client/admin`. The admin Vite base path is `/admin/`; Vercel routes `/admin` and `/admin/*` to that app before the public SPA fallback. Static files are served from the output when present, and both apps support direct route refresh. The dedicated output folder keeps local tracked `dist` directories untouched.

Set this Vercel **Production** environment variable for both frontend builds:

- `VITE_API_URL` — backend API base URL. The current documented backend is `https://api.orangecab.in/api`.

The API remains on the existing backend host; this deployment does not move MongoDB or Express to Vercel. Configure backend-only variables on the backend host, never in the frontend: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT`, `NODE_ENV`, `CLIENT_URL`, `ADMIN_URL`, `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`. `.env.example` files contain names and safe local defaults; do not commit real `.env` files.

For a local production build, install app dependencies once with `npm run install:apps`, then run `npm run build:vercel`. The combined static output is `deployment/vercel-output/client`.

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
- [x] **Real-time Notifications:** WebSockets via Socket.io alerting admins of incoming customer bookings instantly.
