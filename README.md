# Ecoleafo Frontend

A modern e-commerce platform for buying and selling trees, built with React, Redux Toolkit, and Vite.

## Features

### Multi-Role System
- **Buyer**: Browse products, manage cart/wishlist, place orders, write reviews
- **Seller**: Manage products, inventory, orders, and store profile
- **Admin**: Manage users, categories, and platform operations

### Key Functionality
- Product browsing with categories and search
- Shopping cart and wishlist management
- Secure checkout and order tracking
- Product reviews and ratings
- Real-time messaging system
- Responsive mobile and desktop design

## Tech Stack

- **React 18** - UI framework
- **Redux Toolkit** - State management
- **RTK Query** - API data fetching
- **React Router v6** - Navigation
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Lucide React** - Icons

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Clone repository
git clone <repository-url>
cd treestore-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables
VITE_API_BASE_URL=http://localhost:3000/api
```

### Development

```bash
# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── app/              # Redux store configuration
├── features/         # Feature-based modules (auth, products, cart, etc.)
├── pages/            # Page components (buyer, seller, admin, public)
├── layouts/          # Layout components
├── components/       # Reusable UI components
├── guards/           # Route protection (AuthGuard, RoleGuard)
├── hooks/            # Custom React hooks
├── routes/           # Route configurations
├── services/         # API service layer
└── utils/            # Utility functions
```

## API Integration

Base URL: `http://localhost:3000/api`

### Authentication Endpoints
- `POST /auth/register` - Buyer registration
- `POST /auth/login` - Buyer login
- `POST /seller/register` - Seller registration
- `POST /seller/login` - Seller login
- `POST /admin/login` - Admin login

### Key Features
- Automatic token refresh
- Request/response interceptors
- Centralized error handling
- Optimistic updates

## User Roles & Routes

### Buyer Routes (`/buyer`)
- Homepage with featured products
- Product details and reviews
- Cart and wishlist
- Checkout and orders
- Account management

### Seller Routes (`/seller`)
- Dashboard with analytics
- Product management (CRUD)
- Inventory tracking
- Order fulfillment
- Store settings

### Admin Routes (`/admin`)
- User management
- Category management
- Platform analytics
- System settings

## State Management

Redux store modules:
- `auth` - Authentication state
- `cart` - Shopping cart
- `wishlist` - User wishlist
- RTK Query APIs for data fetching

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/name`)
5. Open Pull Request

## License

MIT License
