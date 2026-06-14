# TechInventory

Erasmus UTB project — PC component catalog with admin panel.



**Live site:** [techinventory.vercel.app](https://techinventory-six.vercel.app/)  
**API:** [techinventory-api.onrender.com](https://techinventory-4ocd.onrender.com/api/v1)



## Stack

- Frontend: Next.js + TypeScript + Tailwind
- Backend: Express + Prisma + PostgreSQL
- Auth: JWT (cookie HTTP-only)

## Local setup

```bash
# backend
cd backend
cp .env.example .env   # then edit DATABASE_URL, JWT_SECRET
npm install
npx prisma migrate dev
npm run seed
npm run dev            # http://localhost:3001

# frontend (new terminal)
cd frontend
cp .env.example .env.local
npm install
npm run dev            # http://localhost:3000
```

Demo admin: `admin@techinventory.com` / `Admin1234!`

## Deploy updates

Push to GitHub → Vercel and Render rebuild automatically (if connected to the repo).

```bash
git add .
git commit -m "your message"
git push origin main
```

## Project structure

```
frontend/     Next.js app (catalog, admin, compare, favorites, PC builder)
backend/      Express API + Prisma
cypress/      E2E tests
```