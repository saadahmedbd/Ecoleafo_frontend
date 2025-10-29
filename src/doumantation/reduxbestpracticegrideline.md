# Redux Best Practices & Guidelines

## 🎯 Core Principles

### 1. **Use Redux Toolkit (RTK)**
- Always use `createSlice` instead of manual action creators
- Use RTK Query for API calls instead of manual async thunks
- Leverage built-in middleware and DevTools

### 2. **Keep State Normalized**
```javascript
// ❌ Bad: Nested, denormalized state
const state = {
  users: [
    { id: 1, name: 'John', posts: [{ id: 1, title: 'Hello' }] }
  ]
};

// ✅ Good: Normalized, flat state
const state = {
  users: { 1: { id: 1, name: 'John' } },
  posts: { 1: { id: 1, userId: 1, title: 'Hello' } }
};
```

### 3. **Colocate Related Code**
Organize by feature, not by file type:
```
features/
  users/
    userSlice.js
    userApi.js
    components/
    hooks/
```

---

## 🔄 RTK Query Best Practices

### 1. **Use Proper Cache Invalidation**
```javascript
// Provide tags for data you want to cache
providesTags: (result, error, id) => [{ type: 'User', id }],

// Invalidate tags when data changes
invalidatesTags: [{ type: 'User', id: 'LIST' }],
```

### 2. **Transform Responses**
```javascript
transformResponse: (response) => {
  // Normalize backend response to match frontend structure
  return response.data || response;
}
```

### 3. **Handle Loading States**
```javascript
const { data, isLoading, isFetching, isError, error } = useGetUsersQuery();

// isLoading: First fetch
// isFetching: Any fetch (including refetch)
// isError: Request failed
```

### 4. **Use Lazy Queries for Manual Triggering**
```javascript
const [trigger, result] = useLazyGetUserQuery();

// Trigger manually
const handleClick = () => trigger(userId);
```

---

## 🛡️ Error Handling

### 1. **Centralized Error Handling**
Always use the `handleApiError` utility:
```javascript
try {
  await createUser(data).unwrap();
} catch (err) {
  setError(handleApiError(err));
}
```

### 2. **Handle All Error States**
```javascript
if (isError) {
  return <ErrorComponent message={handleApiError(error)} />;
}
```

### 3. **Provide User Feedback**
- Show loading indicators
- Display error messages
- Confirm successful operations

---

## 🔐 Authentication Best Practices

### 1. **Store Tokens Securely**
- Use `httpOnly` cookies for production (backend implementation)
- For development, localStorage is acceptable
- Never expose tokens in URLs or logs

### 2. **Implement Token Refresh**
Update `baseQueryWithReauth` in `api.js` to handle token refresh:
```javascript
if (result.error?.status === 401) {
  const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);
  if (refreshResult.data) {
    // Update token and retry
  } else {
    // Logout user
  }
}
```

### 3. **Protect Routes**
Always use `ProtectedRoute` component for authenticated pages.

---

## 🎨 Component Integration

### 1. **Use Custom Hooks**
```javascript
// ❌ Bad
import { useDispatch, useSelector } from 'react-redux';

// ✅ Good
import { useAppDispatch, useAppSelector } from '@/app/hooks';
```

### 2. **Keep Components Clean**
- Components should focus on UI
- Move business logic to custom hooks or slice actions
- Use selectors for derived state

### 3. **Avoid Prop Drilling**
Use Redux for global state, not for every piece of data:
```javascript
// ❌ Bad: Using Redux for component-specific state
const [modalOpen, setModalOpen] = useState(false);

// ✅ Good: Use local state for UI-only state
```

---

## 📊 State Management Strategy

### When to Use Redux:
- ✅ Authentication state
- ✅ User profile
- ✅ Global UI state (theme, language)
- ✅ Data needed across multiple routes
- ✅ API cache (via RTK Query)

### When NOT to Use Redux:
- ❌ Form state (use local state or libraries like React Hook Form)
- ❌ Component-specific UI state (modals, tooltips)
- ❌ Temporary/ephemeral data
- ❌ Data that's only used in one component

---

## 🚀 Performance Optimization

### 1. **Use Selectors Wisely**
```javascript
// ❌ Bad: Creates new object every render
const user = useAppSelector(state => ({ 
  name: state.auth.user.name 
}));

// ✅ Good: Use memoized selectors
const userName = useAppSelector(state => state.auth.user?.name);
```

### 2. **Leverage RTK Query Caching**
```javascript
// Configure cache times based on data volatility
keepUnusedDataFor: 60, // Keep data for 60 seconds
refetchOnMountOrArgChange: 30, // Refetch if data is older than 30s
```

### 3. **Use Lazy Loading**
```javascript
// Load feature slices only when needed
const UserModule = lazy(() => import('./features/users'));
```

---

## 🧪 Testing

### 1. **Test Slices**
```javascript
import userReducer, { addUser } from './userSlice';

test('should add user', () => {
  const state = userReducer(undefined, addUser({ id: 1, name: 'John' }));
  expect(state.users).toHaveLength(1);
});
```

### 2. **Test API Endpoints**
```javascript
import { renderHook } from '@testing-library/react';
import { useGetUsersQuery } from './userApi';

test('should fetch users', async () => {
  const { result } = renderHook(() => useGetUsersQuery());
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
});
```

### 3. **Mock Store in Tests**
```javascript
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

const mockStore = configureStore({ reducer: { auth: authReducer } });
render(<Provider store={mockStore}><Component /></Provider>);
```

---

## 📝 Naming Conventions

### Slices
- File: `featureSlice.js`
- Slice name: `'feature'`
- Actions: `addFeature`, `updateFeature`, `deleteFeature`

### API
- File: `featureApi.js`
- Hooks: `useGetFeaturesQuery`, `useCreateFeatureMutation`

### Selectors
- `selectFeature`, `selectFeatureById`, `selectFeatureList`

---

## 🔍 Debugging

### 1. **Use Redux DevTools**
- Automatically enabled in development
- Inspect actions, state, and time-travel debug

### 2. **Log API Calls**
The `logError` utility logs all API errors in development.

### 3. **Monitor Network**
RTK Query integrates with browser DevTools Network tab.

---

## 🌐 Environment Configuration

### Development
```bash
VITE_API_BASE_URL=http://localhost:3000/api
```

### Production
```bash
VITE_API_BASE_URL=https://api.yourdomain.com
```

### Usage
```javascript
const API_URL = import.meta.env.VITE_API_BASE_URL;
```

---

## 🔄 Migration Path

### From Classic Redux
1. Install Redux Toolkit
2. Replace reducers with `createSlice`
3. Replace manual actions with slice actions
4. Migrate API calls to RTK Query

### To TypeScript
1. Rename files to `.ts` / `.tsx`
2. Add type definitions
3. Use typed hooks from `app/hooks.ts`
4. Define `RootState` and `AppDispatch` types

---

## 📚 Additional Resources

- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [RTK Query Docs](https://redux-toolkit.js.org/rtk-query/overview)
- [Redux Style Guide](https://redux.js.org/style-guide/)

---

## ⚠️ Common Pitfalls

1. **Don't mutate state directly** (RTK uses Immer, so it's safe inside reducers)
2. **Don't put non-serializable values in state** (functions, promises, class instances)
3. **Don't overuse Redux** (use local state for UI-only concerns)
4. **Don't forget error handling** (always handle loading and error states)
5. **Don't skip cache invalidation** (keep RTK Query tags up to date)