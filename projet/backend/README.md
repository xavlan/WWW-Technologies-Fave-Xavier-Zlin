# TechInventory Backend API

The backend REST API for TechInventory, built with Express.js, TypeScript, Prisma, and PostgreSQL.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database
npm run db:seed

# Start development server
npm run dev
```

The API will be available at `http://localhost:3001`

##  Prerequisites

- Node.js v20 or higher
- PostgreSQL v15 or higher
- npm v9 or higher

##  Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/techinventory

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

##  API Endpoints

### Authentication

#### POST /api/v1/auth/login
Authenticate user and receive JWT token.

**Request:**
```json
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

**Error (401):**
```json
{
  "success": false,
  "error": {
    "message": "Invalid credentials",
    "code": "INVALID_CREDENTIALS"
  }
}
```

#### POST /api/v1/auth/logout
Logout user (stateless, handled client-side).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

#### GET /api/v1/auth/me
Get current authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clxxx",
    "email": "admin@techinventory.com",
    "name": "Admin User",
    "role": "ADMIN",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Components (Public)

#### GET /api/v1/components
List all components with filtering, sorting, and pagination.

**Query Parameters:**
- `search` (string): Full-text search on name, brand, description
- `category` (string): Filter by category ID or slug
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `inStock` (boolean): Filter for available items only
- `sortBy` (enum): Field to sort by (price, name, createdAt)
- `order` (enum): Sort order (asc, desc)
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 12, max: 100)

**Example:**
```
GET /api/v1/components?search=GPU&category=gpu&minPrice=100&maxPrice=1000&inStock=true&sortBy=price&order=asc&page=1&limit=12
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "clxxx",
      "name": "NVIDIA GeForce RTX 4090",
      "brand": "NVIDIA",
      "model": "RTX 4090",
      "description": "High-performance gaming GPU",
      "price": "1599.99",
      "stock": 25,
      "sku": "GPU-NVIDIA-4090",
      "imageUrl": "https://example.com/image.jpg",
      "specifications": {
        "memory": "24GB",
        "cudaCores": 16384
      },
      "category": {
        "id": "clxxx",
        "name": "GPU",
        "slug": "gpu"
      },
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "totalPages": 9
  }
}
```

#### GET /api/v1/components/:id
Get a single component by ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clxxx",
    "name": "NVIDIA GeForce RTX 4090",
    "brand": "NVIDIA",
    "model": "RTX 4090",
    "description": "High-performance gaming GPU",
    "price": "1599.99",
    "stock": 25,
    "sku": "GPU-NVIDIA-4090",
    "imageUrl": "https://example.com/image.jpg",
    "specifications": {
      "memory": "24GB",
      "cudaCores": 16384
    },
    "category": {
      "id": "clxxx",
      "name": "GPU",
      "slug": "gpu"
    },
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error (404):**
```json
{
  "success": false,
  "error": {
    "message": "Component not found",
    "code": "NOT_FOUND"
  }
}
```

### Components (Admin - Protected)

All admin endpoints require a valid JWT token in the Authorization header.

#### POST /api/v1/components
Create a new component.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
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
  "categoryId": "clxxx"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "clxxx",
    "name": "Intel Core i9-13900K",
    "brand": "Intel",
    "model": "i9-13900K",
    "description": "High-performance desktop processor",
    "price": "599.99",
    "stock": 50,
    "sku": "CPU-INTEL-13900K",
    "imageUrl": "https://example.com/image.jpg",
    "specifications": {
      "cores": 24,
      "threads": 32,
      "baseClock": "3.0 GHz",
      "boostClock": "5.8 GHz"
    },
    "category": {
      "id": "clxxx",
      "name": "CPU",
      "slug": "cpu"
    },
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error (409):**
```json
{
  "success": false,
  "error": {
    "message": "SKU already exists",
    "code": "SKU_CONFLICT"
  }
}
```

#### PUT /api/v1/components/:id
Update an existing component.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "price": 549.99,
  "stock": 45
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clxxx",
    "name": "Intel Core i9-13900K",
    "brand": "Intel",
    "model": "i9-13900K",
    "description": "High-performance desktop processor",
    "price": "549.99",
    "stock": 45,
    "sku": "CPU-INTEL-13900K",
    "imageUrl": "https://example.com/image.jpg",
    "specifications": {
      "cores": 24,
      "threads": 32,
      "baseClock": "3.0 GHz",
      "boostClock": "5.8 GHz"
    },
    "category": {
      "id": "clxxx",
      "name": "CPU",
      "slug": "cpu"
    },
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T01:00:00.000Z"
  }
}
```

#### DELETE /api/v1/components/:id
Soft delete a component (sets isActive to false).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Component deleted successfully"
  }
}
```

### Categories

#### GET /api/v1/categories
List all categories.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "clxxx",
      "name": "CPU",
      "slug": "cpu",
      "description": "Central Processing Units",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST /api/v1/categories (Admin - Protected)
Create a new category.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "name": "SSD",
  "slug": "ssd",
  "description": "Solid State Drives"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "clxxx",
    "name": "SSD",
    "slug": "ssd",
    "description": "Solid State Drives",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT /api/v1/categories/:id (Admin - Protected)
Update a category.

**Headers:**
```
Authorization: Bearer <token>
```

#### DELETE /api/v1/categories/:id (Admin - Protected)
Delete a category.

**Headers:**
```
Authorization: Bearer <token>
```

### Admin Stats

#### GET /api/v1/admin/stats (Admin - Protected)
Get inventory statistics.

**Headers:**
```
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
    "componentsByCategory": [
      {
        "category": "CPU",
        "count": 20
      },
      {
        "category": "GPU",
        "count": 15
      }
    ]
  }
}
```

## 🔐 Authentication Flow

1. **Login**: User sends email and password to `/api/v1/auth/login`
2. **Verification**: Server verifies credentials using bcrypt
3. **Token Generation**: Server generates JWT token with user ID, email, and role
4. **Token Storage**: Client stores token (httpOnly cookie or localStorage)
5. **Authenticated Requests**: Client includes token in Authorization header: `Bearer <token>`
6. **Token Verification**: Middleware verifies token on protected routes
7. **User Attachment**: Decoded user info is attached to `req.user`

##  Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

**Common Error Codes:**
- `UNAUTHORIZED` (401): Authentication failed or missing
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Request validation failed
- `CONFLICT` (409): Resource conflict (e.g., duplicate SKU)
- `INTERNAL_ERROR` (500): Server error

##  Testing

### Unit Tests

```bash
npm test
```

### Integration Tests

```bash
npm test
```

### Test Coverage

```bash
npm run test:coverage
```

### Watch Mode

```bash
npm run test:watch
```

## 🗄 Database

### Prisma Commands

```bash
# Generate Prisma client
npx prisma generate

# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio

# Seed the database
npm run db:seed

# Reset database (development only)
npx prisma migrate reset
```

### Database Schema

See `prisma/schema.prisma` for the complete schema definition.

**Tables:**
- `User`: Admin accounts
- `Category`: Component categories
- `Component`: PC components with specifications

## Architecture

### Layered Structure

```
src/
├── config/           # Configuration (database, environment)
├── middleware/       # Express middleware (auth, validation, error handling)
├── modules/          # Feature modules (auth, components, categories)
│   ├── auth/
│   │   ├── auth.routes.ts      # Route definitions
│   │   ├── auth.controller.ts  # Request handlers
│   │   ├── auth.service.ts     # Business logic
│   │   └── auth.validator.ts    # Request validation
│   ├── components/
│   │   ├── component.routes.ts
│   │   ├── component.controller.ts
│   │   ├── component.service.ts
│   │   ├── component.repository.ts
│   │   └── component.validator.ts
│   └── categories/
│       ├── category.routes.ts
│       ├── category.controller.ts
│       ├── category.service.ts
│       └── category.repository.ts
├── utils/            # Utilities (errors, JWT, pagination)
├── types/            # TypeScript type definitions
├── app.ts            # Express app factory
└── server.ts         # Entry point
```

### Middleware Stack

1. Helmet - Security headers
2. CORS - Cross-origin resource sharing
3. express.json - Body parsing
4. Rate limiter - Request rate limiting
5. Morgan (dev) - Request logging
6. API routes - Route handlers
7. 404 handler - Not found
8. Error handler - Global error handling

## 🔒 Security

- JWT-based stateless authentication
- Bcrypt password hashing (12 rounds)
- Rate limiting (100 requests per 15 minutes)
- CORS configured for frontend origin
- Input validation with Zod schemas
- SQL injection prevention via Prisma
- Helmet.js security headers
- Soft delete for data integrity

##  Deployment

### Render Deployment

The backend is configured for automatic deployment via Render using `render.yaml`.

**Environment Variables (Render):**
- `DATABASE_URL`: PostgreSQL connection string (from Render database)
- `JWT_SECRET`: Auto-generated by Render
- `JWT_EXPIRES_IN`: 7d
- `NODE_ENV`: production
- `CORS_ORIGIN`: https://techinventory.vercel.app
- `PORT`: 3001

**Build Command:**
```bash
npm install && npx prisma generate && npx prisma migrate deploy && npm run build
```

**Start Command:**
```bash
npm start
```

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build TypeScript to JavaScript
npm start           # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
npm test            # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run Prisma migrations
npm run db:migrate:deploy # Deploy migrations (production)
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
```
