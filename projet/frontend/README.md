# TechInventory Frontend

The Next.js 14+ frontend application for TechInventory, built with TypeScript, Tailwind CSS, and shadcn/ui.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 📋 Prerequisites

- Node.js v20 or higher
- npm v9 or higher

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_APP_NAME=TechInventory
```

## 📚 Page Structure

### Public Routes

- `/` - Home page with hero section, featured components, and category links
- `/components` - Component catalog with filtering, search, and pagination
- `/components/[id]` - Component detail page with specifications

### Admin Routes

- `/admin/login` - Admin login page
- `/admin/dashboard` - Admin dashboard with statistics and low stock alerts
- `/admin/inventory` - Inventory management with data table and CRUD operations
- `/admin/inventory/new` - Create new component form
- `/admin/inventory/[id]/edit` - Edit existing component form

## 🎨 Component Library

This project uses [shadcn/ui](https://ui.shadcn.com/) for UI components. All components are located in `components/ui/`.

### Available Components

- Button - Various button styles and sizes
- Input - Text input with validation
- Select - Dropdown select component
- Card - Card container with header and content
- Badge - Status and category badges
- Table - Data table with sorting and pagination
- Dialog - Modal dialogs
- Form - Form components with validation
- Toast - Notification toasts
- Skeleton - Loading skeletons
- DropdownMenu - Dropdown menu component
- Sheet - Side sheet component

### Custom Components

#### Layout Components (`components/layout/`)
- Header - Navigation header with logo and search
- Footer - Footer with links and copyright
- Sidebar - Admin sidebar navigation

#### Catalog Components (`components/catalog/`)
- ProductCard - Product card component
- ProductGrid - Responsive product grid
- FilterBar - Filter controls (category, price, stock)
- SearchBar - Search input with debouncing
- StockBadge - Stock status badge with color coding

#### Admin Components (`components/admin/`)
- DataTable - Admin data table with actions
- InventoryForm - Component creation/edit form
- StatsCard - Dashboard statistics card
- LowStockAlert - Low stock warning component

## 🔐 Authentication

Authentication is handled via JWT tokens stored in httpOnly cookies.

### AuthContext

The `AuthContext` provides authentication state and functions:

```typescript
const { user, isAuthenticated, isLoading, login, logout, refreshUser } = useAuth();
```

### Protected Routes

All admin routes are protected by Next.js middleware (`middleware.ts`). Unauthenticated users are redirected to `/admin/login`.

### API Client

The API client (`lib/api.ts`) handles:
- Axios instance with base URL configuration
- Request interceptor for attaching JWT tokens
- Response interceptor for error handling
- Automatic redirect on 401 errors

## 🧪 Testing

### E2E Tests

E2E tests are located in `cypress/e2e/` and use Cypress.

```bash
# Install Cypress dependencies
npx cypress install

# Run Cypress in interactive mode
npx cypress open

# Run Cypress headlessly
npx cypress run
```

### Test Coverage

- Public catalog functionality
- Search and filtering
- Component detail pages
- Admin authentication
- CRUD operations
- Dashboard statistics

## 🎯 Design System

### Color Palette

- Primary: Blue-600
- Success: Green-600
- Warning: Yellow-600
- Danger: Red-600
- Neutral: Gray-600

### Typography

- Font: Inter (via next/font)
- Headings: Bold, tracking-tight
- Body: Regular, leading-relaxed

### Spacing

- Base unit: 4px (0.25rem)
- Consistent spacing scale (4, 8, 12, 16, 20, 24, 32, 40, 48, 64)

## 📦 Deployment

### Vercel Deployment

The frontend is configured for automatic deployment via Vercel using `vercel.json`.

**Environment Variables (Vercel):**
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_APP_NAME`: Application name

**Build Command:**
```bash
npm run build
```

**Dev Command:**
```bash
npm run dev
```

**Install Command:**
```bash
npm install
```

### Manual Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically deploy on push to main branch

## 🛠 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
```

## 📁 Project Structure

```
frontend/
├── app/
│   ├── (public)/          # Public route group
│   │   ├── page.tsx       # Home page
│   │   └── components/    # Component pages
│   │       ├── page.tsx   # Catalog
│   │       └── [id]/      # Component detail
│   │           └── page.tsx
│   ├── admin/             # Admin route group
│   │   ├── login/         # Login page
│   │   ├── dashboard/     # Dashboard
│   │   └── inventory/     # Inventory management
│   │       ├── page.tsx   # List
│   │       ├── new/       # Create
│   │       │   └── page.tsx
│   │       └── [id]/      # Edit
│   │           └── edit/
│   │               └── page.tsx
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   ├── catalog/          # Catalog components
│   └── admin/            # Admin components
├── lib/                  # Utilities
│   ├── api.ts           # API client
│   ├── auth.ts          # Auth helpers
│   └── validators.ts    # Zod schemas
├── hooks/                # Custom React hooks
├── context/              # React Context providers
├── types/                # TypeScript types
├── middleware.ts         # Next.js middleware
├── next.config.ts        # Next.js configuration
├── tailwind.config.ts    # Tailwind configuration
└── vercel.json           # Vercel configuration
```

## 🔒 Security

- JWT-based authentication with httpOnly cookies
- Protected admin routes via middleware
- Input validation with Zod schemas
- XSS protection via React's built-in escaping
- CSRF protection via httpOnly cookies

## 🎨 Styling

### Tailwind CSS

The project uses Tailwind CSS for styling. Configuration is in `tailwind.config.ts`.

### Custom Styles

Global styles are in `app/globals.css`. Custom utilities and component styles are added as needed.

### Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Responsive grid layouts for product cards

## 📝 License

MIT
