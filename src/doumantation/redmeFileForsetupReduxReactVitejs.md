# Redux Setup Guide - React + Vite + JavaScript

Complete Redux Toolkit + RTK Query setup for a React application with Go backend integration.

---

## 📋 Prerequisites

- Node.js 16+ and npm/yarn
- React 18+
- Vite
- Go backend running on `localhost:3000/api`

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install @reduxjs/toolkit react-redux
```

### 2. Install Additional Routing (Optional but Recommended)

```bash
npm install react-router-dom
```

### 3. Setup Environment Variables

Create `.env` file in your project root:

```bash
VITE_API_BASE_URL=http://localhost:3000/api
```

### 4. File Structure

Create the following folder structure:

```
src/
├── app/
│   ├── store.js
│   └── hooks.js
├── features/
│   └── auth/
│       ├── authSlice.js
│       └── authApi.js
├── services/
│   └── api.js
├── utils/
│   ├── constants.js
│   └── errorHandler.js
└── main.jsx
```

### 5. Copy Provided Files

Copy all the provided code files into their respective locations.

### 6. Update main.jsx

Wrap your app with Redux Provider (see `main.jsx` artifact).

### 7. Start Development Server

```bash
npm run dev
```

---

## 🎯 Integration Steps

### Step 1: Update Backend API Endpoints

Update the API endpoints in your feature API files to match your Go backend:

```javascript
// src/features/auth/authApi.js
login: builder.mutation({
  query: (credentials) => ({
    url: '/auth/login',  // Adjust to match your backend route
    method: 'POST',
    body: credentials,
  }),
}),
```

### Step 2: Match Response Structure

Adjust `transformResponse` to match your Go backend response format:

```javascript
// If your Go backend returns: { "data": { "user": {...}, "token": "..." } }
transformResponse: (response) => ({
  user: response.data.user,
  token: response.data.token,
}),
```

### Step 3: Create Feature APIs

For each feature in your app, create a new API file following the pattern in `userApi.js`:

```javascript
// Example: src/features/products/productApi.js
export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => '/products',
      providesTags: ['Products'],
    }),
    // Add more endpoints...
  }),
});
```

### Step 4: Register Feature Slices in Store

Add your feature reducers to the store:

```javascript
// src/app/store.js
import productReducer from '../features/products/productSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    products: productReducer, // Add new feature
  },
  // ...
});
```

---

## 📖 Usage Examples

### Using Queries (GET requests)

```javascript
import { useGetUsersQuery } from '@/features/users/userApi';

function UserList() {
  const { data, isLoading, isError, error } = useGetUsersQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.users?.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Using Mutations (POST/PUT/DELETE requests)

```javascript
import { useCreateUserMutation } from '@/features/users/userApi';

function CreateUser() {
  const [createUser, { isLoading }] = useCreateUserMutation();

  const handleSubmit = async (userData) => {
    try {
      await createUser(userData).unwrap();
      alert('User created!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Using Redux State (Slices)

```javascript
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { selectCurrentUser, logout } from '@/features/auth/authSlice';

function UserProfile() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
```

---

## 🔐 Authentication Flow

### 1. Login

```javascript
import { useLoginMutation } from '@/features/auth/authApi';
import { useAppDispatch } from '@/app/hooks';
import { setCredentials } from '@/features/auth/authSlice';

const [login] = useLoginMutation();
const dispatch = useAppDispatch();

const result = await login({ email, password }).unwrap();
dispatch(setCredentials(result));
```

### 2. Protected Routes

```javascript
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { selectIsAuthenticated } from '@/features/auth/authSlice';

function ProtectedRoute({ children }) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
}
```

### 3. Logout

```javascript
import { useAppDispatch } from '@/app/hooks';
import { logout } from '@/features/auth/authSlice';

const dispatch = useAppDispatch();
dispatch(logout());
```

---

## 🛠️ Customization Guide

### Adding New Features

1. **Create feature folder:**
   ```
   src/features/products/
   ├── productSlice.js    (optional - for local state)
   └── productApi.js      (for API calls)
   ```

2. **Define API endpoints:**
   ```javascript
   // productApi.js
   export const productApi = api.injectEndpoints({
     endpoints: (builder) => ({
       getProducts: builder.query({ /* ... */ }),
       createProduct: builder.mutation({ /* ... */ }),
     }),
   });
   ```

3. **Export hooks:**
   ```javascript
   export const { useGetProductsQuery, useCreateProductMutation } = productApi;
   ```

4. **Use in components:**
   ```javascript
   const { data } = useGetProductsQuery();
   ```

### Adjusting for Your Go Backend

#### Match Go GORM Model Structure

If your Go models use snake_case:

```go
type User struct {
    ID        uint      `json:"id"`
    Email     string    `json:"email"`
    FirstName string    `json:"first_name"`
    CreatedAt time.Time `json:"created_at"`
}
```

Transform the response to camelCase:

```javascript
transformResponse: (response) => ({
  id: response.id,
  email: response.email,
  firstName: response.first_name,
  createdAt: response.created_at,
}),
```

#### Handle Go Response Format

If your Go backend returns:
```json
{
  "success": true,
  "data": { ... },
  "message": "Success"
}
```

Update your transform:
```javascript
transformResponse: (response) => response.data,
```

---

## 🐛 Troubleshooting

### CORS Issues

If you get CORS errors, configure Vite proxy in `vite.config.js`:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
},
```

Or configure your Go backend:

```go
import "github.com/rs/cors"

handler := cors.Default().Handler(mux)
http.ListenAndServe(":3