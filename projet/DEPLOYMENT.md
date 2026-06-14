# TechInventory — Deployment Guide

This guide walks you through publishing **TechInventory** online using **Render** (backend + PostgreSQL) and **Vercel** (frontend).

Your repository: `https://github.com/xavlan/WWW-Technologies-Fave-Xavier-Zlin`

---

## Prerequisites

- GitHub account with the project pushed to `main`
- [Render](https://render.com) account (free tier works)
- [Vercel](https://vercel.com) account (free tier works)

---

## Step 1 — Push your latest code to GitHub

```powershell
cd C:\aaaCours\zlin\WWW-Technologies-Fave-Xavier-Zlin\projet
git add .
git commit -m "Final TechInventory: real images, English UI, deployment ready"
git push origin main
```

---

## Step 2 — Deploy the backend on Render

### Option A: Blueprint (recommended)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Blueprint**
3. Connect your GitHub repo `WWW-Technologies-Fave-Xavier-Zlin`
4. Render reads `backend/render.yaml` and creates:
   - Web service: `techinventory-api`
   - PostgreSQL database: `techinventory-db`
5. Click **Apply** and wait for the first deploy (~5–10 min)

The build automatically runs migrations and seeds demo data (admin + 24 components with real images).

### Option B: Manual setup

1. **New PostgreSQL** → name: `techinventory-db`
2. **New Web Service** → connect repo, root directory: `backend`
   - Build: `npm install && npx prisma generate && npx prisma migrate deploy && npm run db:seed && npm run build`
   - Start: `npm start`
3. Environment variables:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | *(from Render Postgres dashboard)* |
| `JWT_SECRET` | *(Generate — min 32 chars)* |
| `JWT_EXPIRES_IN` | `7d` |
| `NODE_ENV` | `production` |
| `CORS_ORIGIN` | `https://YOUR-VERCEL-URL.vercel.app` |
| `PORT` | `3001` |

4. Note your API URL, e.g. `https://techinventory-api.onrender.com`

### Verify backend

Open: `https://YOUR-API-URL.onrender.com/health`  
You should see: `{"success":true,"data":{"status":"ok",...}}`

Test catalog: `https://YOUR-API-URL.onrender.com/api/v1/components`

---

## Step 3 — Deploy the frontend on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. **Add New Project** → import `WWW-Technologies-Fave-Xavier-Zlin`
3. Set **Root Directory** to `frontend`
4. Environment variables:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://YOUR-API-URL.onrender.com/api/v1` |
| `NEXT_PUBLIC_APP_NAME` | `TechInventory` |
| `JWT_SECRET` | *(same value as backend)* |
| `JWT_EXPIRES_IN` | `7d` |

5. Click **Deploy**

### Update Render CORS

After Vercel gives you a URL (e.g. `https://techinventory.vercel.app`):

1. Render → `techinventory-api` → **Environment**
2. Set `CORS_ORIGIN` to your exact Vercel URL (no trailing slash)
3. Save → service redeploys

---

## Step 4 — GitHub Actions (optional CI/CD)

For automatic deploys on every push to `main`, add these **GitHub Secrets**  
(Repo → Settings → Secrets and variables → Actions):

| Secret | Where to get it |
|--------|-----------------|
| `RENDER_DEPLOY_HOOK_URL` | Render → service → Settings → Deploy Hook |
| `VERCEL_TOKEN` | Vercel → Account Settings → Tokens |

Workflows already exist:
- `.github/workflows/ci.yml` — lint + tests on every push
- `.github/workflows/deploy.yml` — deploy on push to `main`

---

## Step 5 — Demo credentials (for your professor)

| Field | Value |
|-------|-------|
| Public site | `https://your-app.vercel.app` |
| Admin login | `/admin/login` |
| Email | `admin@techinventory.com` |
| Password | `Admin1234!` |

---

## Local development (before deploying)

```powershell
# 1. Start PostgreSQL
cd backend
docker compose up -d

# 2. Copy env file (if not done)
copy .env.example .env

# 3. Setup database
npx prisma generate
npx prisma migrate deploy
npm run db:seed

# 4. Start backend
npm run dev

# 5. In another terminal — frontend
cd ../frontend
copy .env.example .env.local
npm run dev
```

- Frontend: http://localhost:3000  
- API: http://localhost:3001  

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| 500 errors on catalog | Backend not running or wrong `NEXT_PUBLIC_API_URL` |
| CORS errors | `CORS_ORIGIN` on Render must match Vercel URL exactly |
| No images | Run `npm run db:seed` on Render shell or redeploy |
| Admin login fails | Check `JWT_SECRET` matches on frontend and backend |
| Render cold start | Free tier sleeps after 15 min — first request may take ~30s |

---

## URLs to submit (example)

- **Live app:** https://techinventory.vercel.app  
- **API:** https://techinventory-api.onrender.com/api/v1  
- **GitHub:** https://github.com/xavlan/WWW-Technologies-Fave-Xavier-Zlin  

Replace with your actual URLs after deployment.
