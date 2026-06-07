# TechInventory

A production-grade, full-stack PC component inventory management system built with Next.js, Express.js, PostgreSQL, and Prisma.

## 🌐 Live Demo

- **Frontend**: [https://techinventory.vercel.app](https://techinventory.vercel.app)
- **Backend API**: [https://techinventory-api.onrender.com/api/v1](https://techinventory-api.onrender.com/api/v1)

## ✨ Features

### Public Features
- Browse and search PC components (CPUs, GPUs, RAM, Storage, Motherboards, PSUs)
- Filter by category, price range, and stock availability
- Sort by price, name, or date added
- View detailed component specifications
- Responsive design for mobile, tablet, and desktop

### Admin Features
- Secure JWT-based authentication
- Full CRUD operations for components
- Inventory management dashboard with statistics
- Low stock alerts and out-of-stock tracking
- Category management
- Real-time search and filtering in admin panel

## 🛠 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend Framework | Next.js 14+ (App Router) | SSR, routing, React server components |
| Language | TypeScript (strict mode) | Type safety across the entire codebase |
| Styling | Tailwind CSS | Utility-first responsive design |
| UI Components | shadcn/ui | Accessible, composable component library |
| Backend | Express.js (standalone REST API) | RESTful API, business logic |
| ORM | Prisma | Type-safe database access, migrations |
| Database | PostgreSQL | Relational data storage |
| Authentication | JWT + bcrypt | Secure stateless auth with hashed passwords |
| Testing (unit/integration) | Jest + Supertest | Backend and utility testing |
| Testing (E2E) | Cypress | Full browser-based UI and flow testing |
| CI/CD | GitHub Actions | Automated lint, test, and deploy pipelines |
| Frontend Deployment | Vercel | Next.js hosting |
| Backend Deployment | Render | Express.js hosting |

## 📋 Prerequisites

- **Node.js**: v20 or higher
- **PostgreSQL**: v15 or higher
- **npm**: v9 or higher

## 🚀 Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/techinventory.git
cd techinventory
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Set Up Environment Variables

#### Backend (.env)

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/techinventory
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

#### Frontend (.env.local)

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_APP_NAME=TechInventory
```

### 4. Set Up PostgreSQL Database

```bash
# Create database
createdb techinventory

# Or using psql
psql -U postgres
CREATE DATABASE techinventory;
```

### 5. Run Prisma Migrations

```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

### 6. Seed the Database

```bash
cd backend
npm run db:seed
```

This will create:
- 1 superadmin user (email: `admin@techinventory.com`, password: `Admin1234!`)
- 6 categories: CPU, GPU, RAM, Storage, Motherboard, PSU
- 20+ realistic PC components with specifications

### 7. Start the Development Servers

#### Backend (Terminal 1)

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:3001`

#### Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:3000`

### 8. Access the Application

- **Public Catalog**: http://localhost:3000/components
- **Admin Login**: http://localhost:3000/admin/login
- **API Health Check**: http://localhost:3001/health

## 🧪 Running Tests

### Backend Unit Tests

```bash
cd backend
npm test
```

### Backend Integration Tests

```bash
cd backend
npm test
```

### Backend Test Coverage

```bash
cd backend
npm run test:coverage
```

### E2E Tests (Cypress)

```bash
# Install Cypress dependencies
npm install
cd frontend
npx cypress install

# Run Cypress in interactive mode
npx cypress open

# Run Cypress headlessly
npx cypress run
```

## 📦 Deployment

### Backend Deployment (Render)

The backend is configured for automatic deployment via Render using `render.yaml`.

**Required GitHub Secrets:**
- `RENDER_DEPLOY_HOOK_URL`: Your Render deploy hook URL

**Manual Deployment:**
1. Push your code to GitHub
2. The GitHub Actions workflow will trigger the Render deployment
3. Monitor deployment in the Render dashboard

### Frontend Deployment (Vercel)

The frontend is configured for automatic deployment via Vercel.

**Required GitHub Secrets:**
- `VERCEL_TOKEN`: Your Vercel authentication token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

**Manual Deployment:**
1. Push your code to GitHub
2. The GitHub Actions workflow will trigger the Vercel deployment
3. Monitor deployment in the Vercel dashboard

## 📚 API Documentation

### Authentication

#### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@techinventory.com",
  "password": "Admin1234!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "clxxx",
      "email": "admin@techinventory.com",
      "name": "Admin User",
      "role": "ADMIN",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### Get Current User

```http
GET /api/v1/auth/me
Authorization: Bearer <token>
```

### Components (Public)

#### List Components

```http
GET /api/v1/components?search=GPU&category=gpu&minPrice=100&maxPrice=1000&inStock=true&sortBy=price&order=asc&page=1&limit=12
```

**Query Parameters:**
- `search`: Full-text search on name, brand, description
- `category`: Filter by category ID or slug
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `inStock`: Filter for available items only (true/false)
- `sortBy`: Field to sort by (price, name, createdAt)
- `order`: Sort order (asc, desc)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12, max: 100)

**Response (200):**
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "totalPages": 9
  }
}
```

#### Get Component by ID

```http
GET /api/v1/components/:id
```

### Components (Admin - Protected)

#### Create Component

```http
POST /api/v1/components
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Intel Core i9-13900K",
  "brand": "Intel",
  "model": "i9-13900K",
  "description": "High-performance desktop processor",
  "price": 599.99,
  "stock": 50,
  "sku": "CPU-INTEL-13900K",
  "imageUrl": "https://example.com/image.jpg",
  "specifications": {
    "cores": 24,
    "threads": 32,
    "baseClock": "3.0 GHz",
    "boostClock": "5.8 GHz"
  },
  "categoryId": "category-id"
}
```

#### Update Component

```http
PUT /api/v1/components/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 549.99,
  "stock": 45
}
```

#### Delete Component

```http
DELETE /api/v1/components/:id
Authorization: Bearer <token>
```

### Categories

#### List Categories

```http
GET /api/v1/categories
```

#### Create Category (Admin - Protected)

```http
POST /api/v1/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "SSD",
  "slug": "ssd",
  "description": "Solid State Drives"
}
```

### Admin Stats

```http
GET /api/v1/admin/stats
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalComponents": 100,
    "totalCategories": 6,
    "totalInventoryValue": 50000.00,
    "lowStockCount": 5,
    "outOfStockCount": 2,
    "componentsByCategory": [...]
  }
}
```

## 🗄 Database Schema

### Users
- `id`: Primary key (CUID)
- `email`: Unique email address
- `passwordHash`: Bcrypt hashed password
- `name`: User's full name
- `role`: ADMIN or SUPERADMIN
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Categories
- `id`: Primary key (CUID)
- `name`: Category name (unique)
- `slug`: URL-friendly slug (unique)
- `description`: Category description
- `components`: Relation to components
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Components
- `id`: Primary key (CUID)
- `name`: Component name
- `brand`: Manufacturer brand
- `model`: Model number
- `description`: Product description
- `price`: Decimal price (10, 2)
- `stock`: Integer stock count
- `sku`: Unique SKU (uppercase alphanumeric)
- `imageUrl`: Optional product image URL
- `specifications`: JSON field for tech specs
- `isActive`: Boolean for soft delete
- `categoryId`: Foreign key to categories
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

**Indexes:**
- categoryId, isActive, price, name

## 📁 Project Structure

```
techinventory/
├── frontend/                   # Next.js application
│   ├── app/
│   │   ├── (public)/          # Public routes
│   │   │   ├── page.tsx       # Home page
│   │   │   └── components/    # Catalog pages
│   │   ├── admin/             # Admin routes
│   │   │   ├── login/         # Login page
│   │   │   ├── dashboard/     # Dashboard
│   │   │   └── inventory/     # Inventory management
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── layout/           # Layout components
│   │   ├── catalog/          # Catalog components
│   │   └── admin/            # Admin components
│   ├── lib/                  # Utilities
│   │   ├── api.ts           # API client
│   │   ├── auth.ts          # Auth helpers
│   │   └── validators.ts    # Zod schemas
│   ├── hooks/                # Custom React hooks
│   ├── context/              # React Context providers
│   ├── types/                # TypeScript types
│   └── middleware.ts         # Next.js middleware
│
├── backend/                   # Express.js REST API
│   ├── src/
│   │   ├── config/           # Configuration
│   │   │   ├── database.ts   # Prisma client
│   │   │   └── env.ts        # Environment variables
│   │   ├── middleware/       # Express middleware
│   │   ├── modules/          # Feature modules
│   │   │   ├── auth/         # Authentication
│   │   │   ├── components/   # Components CRUD
│   │   │   └── categories/   # Categories CRUD
│   │   ├── utils/            # Utilities
│   │   ├── types/            # TypeScript types
│   │   ├── app.ts            # Express app factory
│   │   └── server.ts         # Entry point
│   ├── prisma/
│   │   ├── schema.prisma     # Prisma schema
│   │   ├── migrations/       # Database migrations
│   │   └── seed.ts           # Seed script
│   └── tests/                # Backend tests
│       ├── unit/             # Unit tests
│       └── integration/      # Integration tests
│
├── cypress/                   # E2E tests
│   ├── e2e/
│   │   ├── public/           # Public feature tests
│   │   └── admin/            # Admin feature tests
│   └── support/              # Cypress support files
│
├── .github/
│   └── workflows/
│       ├── ci.yml            # CI pipeline
│       └── deploy.yml        # Deploy pipeline
│
└── README.md                  # This file
```

## 🔐 Security

- JWT-based stateless authentication
- Bcrypt password hashing (12 rounds)
- Rate limiting on all API endpoints
- CORS configured for frontend origin
- Input validation with Zod schemas
- SQL injection prevention via Prisma
- Helmet.js security headers
- Soft delete for data integrity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Development Guidelines:**
- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database ORM by [Prisma](https://www.prisma.io/)
- Hosted on [Vercel](https://vercel.com/) and [Render](https://render.com/)
