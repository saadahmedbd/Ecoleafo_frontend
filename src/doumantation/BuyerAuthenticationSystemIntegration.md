# Buyer Authentication System - Integration Guide

## 📋 Overview

This is a production-ready buyer authentication system that integrates your existing UI designs with your Go backend API.

### ✨ Features Implemented

1. **User Registration**
   - Frontend validation with real-time feedback
   - Backend API integration
   - Error handling for duplicate emails, weak passwords
   - Terms & conditions acceptance
   - Loading states

2. **User Login**
   - Email and password authentication
   - Remember me functionality
   - Forgot password link
   - Guest continue option
   - Session management

3. **Password Recovery**
   - Forgot password flow
   - Email-based password reset
   - Success/error states
   - Resend functionality

4. **State Management**
   - Redux Toolkit for auth state
   - RTK Query for API calls
   - LocalStorage persistence
   - Token management

---

## 🚀 Quick Start

### 1. File Structure

Ensure you have this structure:

```
src/
├── features/
│   └── auth/
│       ├── authSlice.js          ✅ Updated
│       └── authApi.js             ✅ New
├── pages/
│   └── public/
│       ├── Login.jsx              ✅ Updated
│       ├── SignUp.jsx             ✅ Updated
│       └── ForgotPassword.jsx     ✅ New
├── utils/
│   ├── validation.js              ✅ New
│   └── constants.js               ✅ Existing
└── services/
    └── api.js                     ✅ Existing (base API)
```

### 2. Backend API Requirements

Your Go backend should have these endpoints:

```go
// Registration endpoint
POST /api/auth/register
Request: {
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
Response: {
  "token": "jwt_token_here",
  "user_type": "buyer",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "roles": ["buyer"]
}

// Login endpoint
POST /api/auth/login
Request: {
  "email": "john@example.com",
  "password": "password123"
}
Response: {
  "token": "jwt_token_here",
  "user_type": "buyer",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "roles": ["buyer"]
}

// Forgot password endpoint
POST /api/auth/forgot-password
Request: {
  "email": "john@example.com"
}
Response: {
  "message": "Reset email sent successfully"
}

// Reset password endpoint (optional)
POST /api/auth/reset-password
Request: {
  "token": "reset_token_from_email",
  "new_password": "newpassword123"
}
Response: {
  "message": "Password reset successful"
}
```

---

## 🔧 Backend Integration Steps

### Step 1: Update API Base URL

In `src/utils/constants.js`:

```javascript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
```

In your `.env` file:

```bash
VITE_API_BASE_URL=http://localhost:3000/api
```

### Step 2: Update API Endpoints (if different)

If your backend uses different endpoint paths, update `src/features/auth/authApi.js`:

```javascript
// Example: If your endpoints are /user/register instead of /auth/register
register: builder.mutation({
  query: (credentials) => ({
    url: '/user/register', // ← Change this
    method: 'POST',
    body: { /* ... */ },
  }),
}),
```

### Step 3: Handle Backend Response Format

If your backend response structure is different, update the `transformResponse` functions:

```javascript
// Example: If your backend wraps data in a "data" field
transformResponse: (response) => {
  return {
    token: response.data.token, // ← Add .data
    user: {
      userType: response.data.user_type,
      firstName: response.data.first_name,
      // ... rest of fields
    },
  };
},
```

### Step 4: Error Response Mapping

Update error handling in `authApi.js` based on your backend error format:

```javascript
transformErrorResponse: (response) => {
  // Your backend might return errors like:
  // { "error": "Email already exists", "code": "DUPLICATE_EMAIL" }
  
  const data = response.data;
  
  // Map backend error codes to user-friendly messages
  if (data?.code === 'DUPLICATE_EMAIL') {
    return { message: 'This email is already registered' };
  }
  
  if (data?.code === 'WEAK_PASSWORD') {
    return { message: 'Password is too weak' };
  }
  
  return {
    message: data?.error || 'Something went wrong',
    status: response.status,
  };
},
```

---

## 📱 Frontend Integration

### Using the Auth Pages in Your App

#### Option 1: Direct Page Import

```javascript
// src/App.jsx or your router file
import LoginPage from '@/pages/public/Login';
import SignUpPage from '@/pages/public/SignUp';
import ForgotPasswordPage from '@/pages/public/ForgotPassword';

function App() {
  return (
    <Routes>
      <Route path="/login" element={
        <LoginPage 
          onBack={() => navigate(-1)}
          onSignUpClick={() => navigate('/signup')}
          onForgotPasswordClick={() => navigate('/forgot-password')}
          onGuestContinue={() => navigate('/products')}
        />
      } />
      
      <Route path="/signup" element={
        <SignUpPage 
          onBack={() => navigate(-1)}
          onLoginClick={() => navigate('/login')}
        />
      } />
      
      <Route path="/forgot-password" element={
        <ForgotPasswordPage 
          onBack={() => navigate('/login')}
          onLoginClick={() => navigate('/login')}
        />
      } />
    </Routes>
  );
}
```

#### Option 2: With Guards (Recommended)

```javascript
// Wrap with GuestGuard to redirect logged-in users
<Route path="/login" element={
  <GuestGuard>
    <LoginPage 
      onBack={() => navigate('/')}
      onSignUpClick={() => navigate('/signup')}
      onForgotPasswordClick={() => navigate('/forgot-password')}
      onGuestContinue={() => navigate('/products')}
    />
  </GuestGuard>
} />
```

---

## 🧪 Testing the Integration

### Test Registration

1. **Valid Registration**
```bash
# Fill form with:
First Name: John
Last Name: Doe
Email: john@example.com
Password: password123
Terms: Checked

Expected: Redirect to /buyer/dashboard
```

2. **Duplicate Email**
```bash
# Register with existing email

Expected: Error message "This email is already registered"
```

3. **Weak Password**
```bash
# Use password: "123"

Expected: Error message "Password must be at least 6 characters"
```

4. **Invalid Email**
```bash
# Use email: "notanemail"

Expected: Error message "Please enter a valid email address"
```

### Test Login

1. **Valid Login**
```bash
Email: john@example.com
Password: password123

Expected: Redirect to /buyer/dashboard
```

2. **Invalid Credentials**
```bash
Email: john@example.com
Password: wrongpassword

Expected: Error message "Invalid email or password"
```

3. **Remember Me**
```bash
# Check "Remember me" and login
# Refresh page or reopen browser

Expected: Email field pre-filled
```

### Test Forgot Password

1. **Valid Email**
```bash
Email: john@example.com

Expected: Success message and email sent
```

2. **Invalid Email**
```bash
Email: notregistered@example.com

Expected: (Backend dependent - either error or success for security)
```

---

## 🔐 Security Best Practices

### 1. Token Storage

**Current Implementation:** localStorage

For production, consider these improvements:

```javascript
// Option A: Use httpOnly cookies (recommended for production)
// Configure backend to send tokens via cookies

// Option B: Session storage (cleared when tab closes)
sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);

// Option C: Memory only (lost on refresh, most secure)
// Store token only in Redux state, not localStorage
```

### 2. Token Refresh

Update `src/services/api.js` to handle token refresh:

```javascript
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error?.status === 401) {
    // Try to refresh token
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refresh_token: refreshToken },
        },
        api,
        extraOptions
      );
      
      if (refreshResult.data) {
        // Store new token
        const newToken = refreshResult.data.token;
        api.dispatch(updateToken(newToken));
        
        // Retry original request
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed - logout user
        api.dispatch(logout());
        window.location.href = '/login';
      }
    }
  }
  
  return result;
};
```

### 3. XSS Protection

The validation utility already sanitizes inputs. For additional security:

```javascript
// Install DOMPurify
npm install dompurify

// Use in validation.js
import DOMPurify from 'dompurify';

export const sanitizeInput = (input) => {
  return DOMPurify.sanitize(input.trim());
};
```

### 4. CSRF Protection

If using cookies, implement CSRF tokens:

```javascript
// In api.js
prepareHeaders: (headers, { getState }) => {
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
  if (csrfToken) {
    headers.set('X-CSRF-Token', csrfToken);
  }
  return headers;
},
```

---

## 🎨 Customization Guide

### Change Color Scheme

All pages use the color `#059669` (green). To change:

```javascript
// Find and replace in Login.jsx, SignUp.jsx, ForgotPassword.jsx
className="... bg-[#059669] ..."  →  className="... bg-[#YOUR_COLOR] ..."
className="... text-[#059669] ..."  →  className="... text-[#YOUR_COLOR] ..."
className="... ring-[#059669] ..."  →  className="... ring-[#YOUR_COLOR] ..."
```

Or use Tailwind config:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#059669', // Your brand color
      },
    },
  },
};

// Then use: className="bg-primary text-primary ring-primary"
```

### Add Password Strength Indicator

```javascript
// In SignUp.jsx
import { checkPasswordStrength } from '@/utils/validation';

const [passwordStrength, setPasswordStrength] = useState(null);

const handlePasswordChange = (e) => {
  const value = e.target.value;
  setFormData(prev => ({ ...prev, password: value }));
  
  // Check strength
  const strength = checkPasswordStrength(value);
  setPasswordStrength(strength);
};

// In JSX
{passwordStrength && (
  <div className="mt-2">
    <div className="flex gap-1">
      {[1, 2, 3].map(level => (
        <div
          key={level}
          className={`h-1 flex-1 rounded-full ${
            passwordStrength.score >= level * 2
              ? 'bg-green-500'
              : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
    <p className="text-xs text-gray-600 mt-1">
      {passwordStrength.feedback}
    </p>
  </div>
)}
```

### Add Email Verification Flow

```javascript
// After registration, show verification message
const [needsVerification, setNeedsVerification] = useState(false);

try {
  const result = await register(formData).unwrap();
  
  // Check if verification is required
  if (result.requiresVerification) {
    setNeedsVerification(true);
  } else {
    dispatch(setCredentials(result));
    navigate("/buyer/dashboard");
  }
} catch (err) {
  // Handle error
}

// Show verification UI
{needsVerification && (
  <div className="p-4 bg-blue-50 rounded-lg">
    <p>Check your email to verify your account</p>
  </div>
)}
```

---

## 🐛 Troubleshooting

### Issue: CORS Errors

**Solution:** Configure your Go backend to allow CORS:

```go
import "github.com/rs/cors"

func main() {
    mux := http.NewServeMux()
    
    // Configure CORS
    c := cors.New(cors.Options{
        AllowedOrigins: []string{"http://localhost:5173"},
        AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowedHeaders: []string{"Content-Type", "Authorization"},
        AllowCredentials: true,
    })
    
    handler := c.Handler(mux)
    http.ListenAndServe(":3000", handler)
}
```

### Issue: Token Not Persisting

**Solution:** Check localStorage in browser DevTools:

```javascript
// Application > Local Storage > http://localhost:5173
// Should see: auth_token and user_data

// If missing, check console for errors
console.log('Token:', localStorage.getItem('auth_token'));
```

### Issue: Login Redirects to Wrong Page

**Solution:** Check user_type in response:

```javascript
// In authSlice.js, verify this check:
if (user.userType !== 'buyer') {
  state.error = 'Invalid user type';
  return;
}

// Make sure backend returns user_type: "buyer"
```

### Issue: Validation Not Working

**Solution:** Check field names match:

```javascript
// Form input name should match validation
<input name="firstName" ... />  // ← Must be "firstName"

// In validation
validateName(formData.firstName, 'First name')  // ← Match here
```

---

## 📊 Monitoring & Analytics

### Track Authentication Events

```javascript
// In Login.jsx and SignUp.jsx
const trackEvent = (eventName, data) => {
  // Google Analytics
  if (window.gtag) {
    window.gtag('event', eventName, data);
  }
  
  // Custom analytics
  if (window.analytics) {
    window.analytics.track(eventName, data);
  }
};

// Track registration
try {
  const result = await register(formData).unwrap();
  trackEvent('user_registered', {
    method: 'email',
    timestamp: new Date().toISOString(),
  });
} catch (err) {
  trackEvent('registration_failed', {
    error: err.message,
  });
}
```

---

## 🚀 Production Checklist

- [ ] Update API_BASE_URL to production endpoint
- [ ] Enable HTTPS in production
- [ ] Implement token refresh logic
- [ ] Add rate limiting for auth endpoints
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Test all auth flows on mobile devices
- [ ] Verify email validation rules match backend
- [ ] Test password reset email delivery
- [ ] Check CORS configuration
- [ ] Add analytics tracking
- [ ] Test with real user scenarios
- [ ] Verify localStorage fallback behavior
- [ ] Test remember me functionality
- [ ] Check error messages are user-friendly
- [ ] Verify loading states work correctly

---

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Verify backend is running and accessible
3. Test API endpoints with Postman/cURL
4. Check network tab for request/response
5. Verify all environment variables are set

---

**Happy Coding! 🎉**