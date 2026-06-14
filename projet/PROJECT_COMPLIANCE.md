# TechInventory — Project Compliance Checklist

**Student:** Xavier Favé  
**Course:** WWW Technologies — Tomas Bata University in Zlín — Spring 2026  
**Project:** TechInventory — Advanced PC Component Management System

---

## 1. Required User Features (PDF §2)

### Public Section — Customer View

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Browse Catalog (responsive grid, stock, pricing) | ✅ | `/components` — `ProductGrid`, `ProductCard`, `StockBadge` |
| Search & Filter (name, category, price range) | ✅ | `CatalogClient`, `FilterBar`, `SearchBar` — client + server |
| Component Detail Page (specs, availability, price) | ✅ | `/components/[id]` — `SpecsTable`, image, stock |

### Admin Section — Private Dashboard

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| JWT Authentication | ✅ | `/admin/login`, HTTP-only cookie, Next.js middleware |
| Full CRUD | ✅ | Create / Read / Update / Delete via REST API + admin UI |
| Inventory Monitoring (badges, low-stock alerts) | ✅ | `StockBadge`, dashboard stats |

---

## 2. Technologies (PDF §3)

| Layer | Required | Used |
|-------|----------|------|
| Frontend | HTML5, CSS3, Tailwind, JavaScript | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Backend | Node.js + Express | Express 4, REST API, JWT + bcrypt |
| Database | PostgreSQL | PostgreSQL (Render + Docker local) |
| Deployment | Render / Vercel | Configured (`vercel.json`, `render.yaml`) |
| CI/CD | GitHub Actions | `.github/workflows/ci.yml`, `deploy.yml` |
| Testing | Jest / Cypress | Backend Jest, E2E Cypress |

---

## 3. Grading Rubric (70 pts)

| Criterion | Points | Status | Evidence |
|-----------|--------|--------|----------|
| Global Styles | 5p | ✅ | Tailwind + `globals.css`, shadcn/ui design system |
| Basic CRUD | 10p | ✅ | `POST/GET/PUT/DELETE /api/v1/components` |
| Sort & Search | 10p | ✅ | Query: `search`, `category`, `minPrice`, `maxPrice`, `sortBy`, `order` |
| Admin & Public | 10p | ✅ | Separate routes, JWT on admin routes |
| Cloud Deployment | 12p | ✅ | Vercel + Render |
| CI/CD Pipeline | 12p | ✅ | GitHub Actions on every push |
| Testing | 5p | ✅ | Jest (backend), Cypress (E2E) |
| Database Script | 6p | ✅ | `backend/database/schema.sql` + `prisma/seed.ts` |
| **TOTAL** | **70p** | **✅ Covered** | |

---

## 4. Bonus Features (not in PDF)

| Feature | Route | Description |
|---------|-------|-------------|
| Comparison | `/compare` | Compare 2 same-category components side-by-side |
| Favorites | `/favorites` | localStorage persistence, navbar counter |
| PC Builder | `/builder` | CPU/GPU/RAM/Storage selector, live total price |
| Component Images | All pages | Real Unsplash hardware photos per SKU |

---

## 5. Demo Account

- **Admin URL:** `/admin/login`
- **Email:** `admin@techinventory.com`
- **Password:** `Admin1234!`

---

## 6. Language

All user-facing UI text is in **English** (Erasmus submission requirement).

---

*Generated for TechInventory final submission — FAVEXAVIER.*
