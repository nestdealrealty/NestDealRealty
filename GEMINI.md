# 🏗️ Nest Deal Realty - Master Project Context

This document is the **absolute source of truth** and primary context for the Nest Deal Realty project. It provides the deep technical, architectural, and design context required to maintain, extend, or rebuild the system from scratch.

---

## 1. Project Overview
*   **What it is:** A premium, multi-tenant real estate platform.
*   **Purpose:** To facilitate high-end property brokerage, project marketing (new launches), and automated lead management.
*   **Target Users:** Luxury property buyers, real estate developers, and specialized administrators.
*   **Core Value:** A "Premium Gold" aesthetic combined with robust data management for complex real estate operations.

---

## 2. Tech Stack
*   **Frontend:** React 19 (Strict Mode), Vite 7, React Router DOM v7.
*   **Backend/Database:** Supabase (PostgreSQL, Auth, Storage).
*   **Styling:** Tailwind CSS 4, Custom Scoped CSS Modules, PostCSS.
*   **Form Management:** React Hook Form + Native State for complex nested JSONB arrays.
*   **Icons:** Lucide React (Standardized across the entire UI).
*   **Utilities:** Lodash.

---

## 3. Project Structure & Critical Paths
```text
/
├── src/
│   ├── App.jsx                # ROOT: Routes & Layout Wrapper
│   ├── index.css              # GLOBAL: Design System Foundations & CSS Variables
│   ├── supabase.js            # CLIENT: Singleton Instance for DB interaction
│   ├── context/
│   │   └── AuthContext.jsx    # AUTH: Global session, profile state, and user context
│   ├── components/            # ATOMIC: Reusable UI components (Header, Footer, Sliders, Modals)
│   ├── pages/                 # PAGES: Main application views
│   │   ├── AdminDashboard.jsx # ADMIN: High-density management logic (~75k lines)
│   │   ├── PostProject.jsx    # COMPLEX: Multi-step JSONB uploader (~130k lines)
│   │   └── Home.jsx           # UI: Premium landing page
│   └── data/
│       └── properties.js      # DATA: Static fallback data and helpers
├── root/
│   ├── .env                   # CONFIG: VITE_ prefixed variables
│   └── *.sql                  # SCHEMA: Pure PostgreSQL definitions and RLS policies
└── vercel.json                # DEPLOY: Single Page Application rewrite rules
```

---

## 4. Key Features
*   **Dynamic Listings:** Specialized support for individual resale properties and large-scale new project launches.
*   **Complex Project Uploaders:** Multi-step forms handling towers, unit configurations, and amenities via nested JSONB.
*   **Admin Command Center:** Unified dashboard for listing approvals, lead management, audit trails, and homepage curation.
*   **Automated Lead Capture:** Integrated inquiry forms (Valuation, Loan, Inquiry) that auto-sync to the admin dashboard.
*   **Seller Portal:** Interface for users to manage profiles and post their own properties/projects.
*   **EMI Calculator:** Interactive client-side tool for mortgage estimations.

---

## 5. Database Schema & Security (Supabase)
### Tables & JSONB Specifications
*   **`profiles`**: Tracks user identity (`id`, `full_name`, `phone`, `enroll_code`).
*   **`projects`**: Complex fields use JSONB for flexibility:
    *   `towers` (JSONB): `[{ type: string, bhk: string, total_units: int, ... }]`
    *   `configurations` (JSONB): `[{ bedrooms: int, area: string, price: string, map_url: string, ... }]`
    *   `landmarks` (JSONB): `[{ title: string, items: string[] }]`
    *   `amenities` (JSONB): Array of selected amenity names.
*   **`properties`**: Standard relational fields for resale listings.
*   **`leads`**: Joins `properties` and `projects` for inquiry tracking.
*   **`home_slides`**: Manages the homepage hero slideshow.

### Security (RLS)
*   **Public:** `SELECT` is restricted by `status = 'approved'`.
*   **Users:** `INSERT` is restricted by `auth.uid() = user_id`.
*   **Admin Overrides:** Policies strictly check `auth.jwt() ->> 'email' = 'minecraftxbox1389@gmail.com'`.

---

## 6. Design System (NON-NEGOTIABLE)
The "Premium Gold" aesthetic is mandatory. Do not deviate from these constants.

### 🎨 Color Palette
*   **Background (Deep):** `#0C1512`
*   **Card/Surface:** `#1A1F1D`
*   **Input/Secondary:** `#252B29`
*   **Text (High Contrast):** `#E6ECE9`
*   **Text (Muted):** `#8E9CA3`
*   **Core Gold (Brand):** `#E3BC5A`
*   **Secondary Gold:** `#D4AF37`
*   **Accent Green:** `#1B4D3E`
*   **Error Red:** `#FF5252`
*   **Borders:** `#2A2F2D`

### ✍️ Typography
*   **Headings:** `Outfit` (Weight 600+)
*   **Body:** `Inter` (Weight 400-500)

### ✨ UI Philosophy
*   **Glassmorphism:** Use `backdrop-filter: blur(12px)` with `rgba(18, 26, 22, 0.6)`.
*   **Borders:** Use `1px solid rgba(212, 175, 55, 0.2)` for delicate gold accents.
*   **Buttons:** `.gold-btn` MUST use `transform: scale(1)` default and `scale(1.05)` on hover.

---

## 7. UI/UX & Development Rules
1.  **NO REDESIGN:** Do not simplify the theme into generic light or dark modes.
2.  **CONSISTENCY:** Use 0.3s ease-out for all transitions. Custom dark scrollbars are mandatory.
3.  **LOGIC ISOLATION:** Business logic resides in Page components; UI presentation is delegated to Atomic Components.
4.  **PROTECTED ROUTES:** All protected routes MUST check `useAuth().user` and redirect to `/login` if null.
5.  **STATE MANAGEMENT:** Use React Context for global Auth and local state for components. Avoid introducing new libraries like Redux.

---

## 8. Building, Running & Environment
*   **Commands:**
    *   `npm run dev`: Start development server.
    *   `npm run build`: Production build.
    *   `npm run lint`: Run ESLint.
*   **Environment:** `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are required in `.env`.
*   **Rebuild:** Initialize Vite (React + JS), install dependencies (`@supabase/supabase-js`, `lucide-react`, `react-router-dom`, `react-hook-form`), and apply SQL schema to Supabase.

---

## 9. Critical Constraints
*   **Vite Module Type:** Project is `type: module`. No CommonJS.
*   **Asset Handling:** Local images MUST be in `public/` or imported. External images via Supabase Storage URLs only.
*   **RLS Policies:** Modifying SQL policies can break visibility or security. Exercise extreme caution.

---

## 10. AI Behavioral Mandates
*   **STRICT CONSISTENCY:** You are forbidden from changing THEME constant colors or typography.
*   **NO SIMPLIFICATION:** Preserve complexity to maintain the "Premium" feel.
*   **SECURITY FIRST:** Protect `.env` and respect RLS logic in all queries.
*   **PRODUCTION READY:** Always handle `loading` and `error` states gracefully.
*   **SURGICAL EDITS:** Prefer targeted changes that respect existing monolithic structures unless refactoring is explicitly requested.
