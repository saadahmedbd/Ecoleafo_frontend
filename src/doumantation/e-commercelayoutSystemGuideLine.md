# E-Commerce Layout System - Complete Guide

## 📋 Overview

This is a production-ready, role-based layout system for an e-commerce application with the following features:

### ✨ Key Features

1. **Role-Based Layouts**
   - Public Layout (non-authenticated users)
   - Buyer Layout (desktop & mobile views)
   - Seller Layout (dashboard with sidebar)
   - Admin Layout (full management dashboard)

2. **Buyer Dual-View System**
   - Automatic device detection
   - Manual view toggle (desktop ↔ mobile)
   - Persistent user preference
   - Responsive breakpoints

3. **Security & Access Control**
   - Authentication guards
   - Role-based route protection
   - Permission-based features
   - Automatic redirects

4. **Developer Experience**
   - Clean folder structure
   - Reusable components
   - Comprehensive comments
   - Easy to extend

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install react-router-dom @reduxjs/toolkit react-redux
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. Configure Tailwind CSS

Update `tailwind.config.js`:

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 3. Update `index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. Copy Provided Files

Copy all the provided code files into your project following the folder structure.

### 5. Start Development Server

```bash
npm run dev
```

---

## 📁 Folder Structure

```
src/
├── app/
│   ├── store.js                   # Redux store
│   └── hooks.js                   # Custom Redux hooks
├── layouts/
│   ├── PublicLayout.jsx           # Public pages layout
│   ├── BuyerLayout.jsx            # Buyer desktop layout
│   ├── BuyerMobileLayout.jsx      # Buyer mobile layout
│   ├── BuyerLayoutWrapper.jsx     # Device detection wrapper
│   ├── SellerLayout.jsx           # Seller dashboard
│   ├── AdminLayout.jsx            # Admin dashboard
│   └── components/
│       ├── Header.jsx             # Reusable header
│       ├── Footer.jsx             # Reusable footer
│       ├── Sidebar.jsx            # Dashboard sidebar
│       ├── MobileNav.jsx          # Mobile navigation
│       └── Breadcrumb.jsx         # Breadcrumb trail
├── routes/
│   └── index.jsx                  # Main route configuration
├── guards/
│   ├── AuthGuard.jsx              # Authentication guard
│   ├── RoleGuard.jsx              # Role-based access control
│   └── GuestGuard.jsx             # Guest-only routes
├── hooks/
│   ├── useDeviceDetection.js     # Device type detection
│   └── useRole.js                 # Role management utilities
├── constants/
│   └── roles.js                   # Role definitions & permissions
├── pages/
│   ├── public/                    # Public pages
│   ├── buyer/                     # Buyer pages
│   ├── seller/                    # Seller pages
│   └── admin/                     # Admin pages
└── features/                      # Redux features (auth, etc.)
```

---

## 🎯 How It Works

### 1. Authentication Flow

```javascript
// User logs in
dispatch(setCredentials({ user, token }));

// AuthGuard checks authentication
<AuthGuard><ProtectedPage /></AuthGuard>

// RoleGuard checks user role
<RoleGuard allowedRoles={['buyer']}>
  <BuyerLayout />
</RoleGuard>
```

### 2. Role-Based Routing

```javascript
// Buyer accesses /buyer/dashboard
✅ Allowed - renders BuyerLayout

// Buyer tries to access /admin/users
❌ Blocked - redirects to /buyer/dashboard

// Non-authenticated user tries /buyer/dashboard
❌ Blocked - redirects to /login
```

### 3. Device Detection (Buyer Only)

```javascript
// Automatic detection
const { isMobile, toggleView } = useDeviceDetection();

// Manual toggle
<button onClick={toggleView}>Switch View</button>

// Renders appropriate layout
{isMobile ? <BuyerMobileLayout /> : <BuyerLayout />}
```

---

## 🔐 Role Configuration

### Modifying Roles

Edit `src/constants/roles.js`:

```javascript
export const USER_ROLES = {
  BUYER: 'buyer',
  SELLER: 'seller',
  ADMIN: 'admin',
  MODERATOR: 'moderator', // Add new role
};

export const ROLE_DEFAULT_ROUTES = {
  [USER_ROLES.BUYER]: '/buyer/dashboard',
  [USER_ROLES.SELLER]: '/seller/dashboard',
  [USER_ROLES.ADMIN]: '/admin/dashboard',
  [USER_ROLES.MODERATOR]: '/moderator/dashboard', // Add route
};
```

### Adding Permissions

```javascript
export const ROLE_PERMISSIONS = {
  [USER_ROLES.BUYER]: {
    canViewProducts: true,
    canPurchase: true,
  },
  [USER_ROLES.MODERATOR]: {
    canModerateReviews: true,
    canBanUsers: true,
  },
};
```

---

## 🎨 Adding New Layouts

### Example: Adding Moderator Layout

1. **Create Layout Component**

```javascript
// src/layouts/ModeratorLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';

const ModeratorLayout = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/moderator/dashboard', icon: <Icon /> },
    { name: 'Reviews', path: '/moderator/reviews', icon: <Icon /> },
  ];

  return (
    <div className="flex">
      <Sidebar menuItems={menuItems} role="moderator" />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};
```

2. **Add Routes**

```javascript
// src/routes/index.jsx
<Route
  path="/moderator/*"
  element={
    <AuthGuard>
      <RoleGuard allowedRoles={[USER_ROLES.MODERATOR]}>
        <ModeratorLayout />
      </RoleGuard>
    </AuthGuard>
  }
>
  <Route path="dashboard" element={<ModeratorDashboard />} />
  <Route path="reviews" element={<ReviewModeration />} />
</Route>
```

---

## 📱 Customizing Device Detection

### Adjusting Breakpoints

```javascript
// src/hooks/useDeviceDetection.js
const BREAKPOINTS = {
  MOBILE: 768,    // Change to your preference
  TABLET: 1024,   // Change to your preference
};
```

### Tablet Handling

```javascript
// src/layouts/BuyerLayoutWrapper.jsx

// Treat tablets as mobile
const shouldUseMobileLayout = isMobile || isTablet;

// Or treat tablets as desktop
const shouldUseMobileLayout = isMobile && !isTablet;
```

### Disable Manual Toggle

Remove the toggle button from layouts:

```javascript
// In BuyerLayout.jsx and BuyerMobileLayout.jsx
// Comment out or remove this block:
/*
<button onClick={toggleView}>
  Switch View
</button>
*/
```

---

## 🛡️ Security Best Practices

### 1. Backend Validation

**Always validate roles on the backend:**

```go
// Go backend example
func AdminOnlyHandler(w http.ResponseWriter, r *http.Request) {
    user := getUserFromToken(r)
    if user.Role != "admin" {
        http.Error(w, "Forbidden", http.StatusForbidden)
        return
    }
    // Handle request
}
```

### 2. Token Management

Update `authSlice.js` to handle token expiry:

```javascript
export const setCredentials = (state, action) => {
  const { user, token, expiresAt } = action.payload;
  state.user = user;
  state.token = token;
  state.expiresAt = expiresAt;
  
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt);
};
```

### 3. Refresh Tokens

Implement token refresh in `api.js`:

```javascript
if (result.error?.status === 401) {
  const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  if (refreshToken) {
    const refreshResult = await baseQuery(
      { url: '/auth/refresh', method: 'POST', body: { refreshToken } },
      api,
      extraOptions
    );
    
    if (refreshResult.data) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, refreshResult.data.token);
      result = await baseQuery(args, api, extraOptions);
    }
  }
}
```

---

## 🎨 Styling Customization

### Changing Colors

1. **Update Tailwind Config**

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
        secondary: '#your-color',
      },
    },
  },
};
```

2. **Update Components**

```javascript
// Replace bg-blue-600 with bg-primary
<button className="bg-primary text-white">Button</button>
```

### Custom Sidebar Colors

```javascript
// src/layouts/components/Sidebar.jsx
const getSidebarColor = () => {
  switch (role) {
    case 'admin':
      return 'bg-purple-900 text-white';
    case 'seller':
      return 'bg-indigo-900 text-white';
    default:
      return 'bg-gray-800 text-white';
  }
};
```

---

## 🧪 Testing Routes

### Test Authentication

```bash
# Not authenticated
Visit: /buyer/dashboard
Expected: Redirect to /login

# Login as buyer
Expected: Redirect to /buyer/dashboard
```

### Test Role Access

```bash
# Buyer tries admin route
Visit: /admin/users
Expected: Redirect to /buyer/dashboard

# Admin accesses admin route
Visit: /admin/users
Expected: Renders AdminLayout with Users page
```

### Test Device Detection

```bash
# Desktop browser
Visit: /buyer/dashboard
Expected: Renders BuyerLayout (desktop)

# Resize to mobile width
Expected: Auto-switches to BuyerMobileLayout

# Click toggle button
Expected: Switches to opposite view
```

---

## 📚 API Integration

### Fetch User Role on Login

```javascript
// src/features/auth/authApi.js
login: builder.mutation({
  query: (credentials) => ({
    url: '/auth/login',
    method: 'POST',
    body: credentials,
  }),
  transformResponse: (response) => ({
    user: {
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
      role: response.user.role, // ← Important!
    },
    token: response.token,
  }),
}),
```

### Backend Response Format

Your Go backend should return:

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "buyer"
  },
  "token": "jwt_token_here"
}
```

---

## 🐛 Troubleshooting

### Issue: Infinite Redirect Loop

**Cause:** Role mismatch or missing role in user object

**Solution:**
```javascript
// Check Redux state
console.log(user.role); // Should be 'buyer', 'seller', or 'admin'

// Verify ROLE_DEFAULT_ROUTES includes all roles
```

### Issue: Layout Not Switching on Device Change

**Cause:** Manual preference override

**Solution:**
```javascript
// Reset user preference
localStorage.removeItem('viewPreference');
// Or call resetView()
const { resetView } = useDeviceDetection();
resetView();
```

### Issue: 404 on Direct URL Access

**Cause:** React Router not handling refresh

**Solution:** Configure your build tool/server:

```javascript
// vite.config.js
export default {
  server: {
    historyApiFallback: true,
  },
};
```

---

## 📈 Performance Optimization

### 1. Lazy Load Routes

```javascript
import { lazy, Suspense } from 'react';

const BuyerDashboard = lazy(() => import('@/pages/buyer/Dashboard'));

<Suspense fallback={<div>Loading...</div>}>
  <BuyerDashboard />
</Suspense>
```

### 2. Memoize Layout Components

```javascript
import { memo } from 'react';

export default memo(BuyerLayout);
```

### 3. Code Splitting by Role

```javascript
const BuyerRoutes = lazy(() => import('./routes/BuyerRoutes'));
const SellerRoutes = lazy(() => import('./routes/SellerRoutes'));
const AdminRoutes = lazy(() => import('./routes/AdminRoutes'));
```

---

## 🚀 Deployment Checklist

- [ ] Remove console.logs from production code
- [ ] Enable HTTPS for token security
- [ ] Configure CORS properly on backend
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Test all role transitions
- [ ] Test device detection on real devices
- [ ] Verify token refresh logic
- [ ] Check responsive design on all breakpoints
- [ ] Test deep linking (direct URL access)
- [ ] Set up monitoring for unauthorized access attempts

---

## 💡 Best Practices

1. **Always validate roles on the backend**
2. **Use HTTPS in production**
3. **Implement proper token refresh**
4. **Handle edge cases (expired tokens, network errors)**
5. **Test with real user scenarios**
6. **Keep layouts modular and reusable**
7. **Document custom modifications**
8. **Use environment variables for configuration**

---

## 📞 Need Help?

Check these resources:
- React Router Docs: https://reactrouter.com
- Redux Toolkit Docs: https://redux-toolkit.js.org
- Tailwind CSS Docs: https://tailwindcss.com

---

**Happy Coding! 🎉**