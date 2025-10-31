# Authentication Services - Complete Usage Guide

## Overview

The authentication services encapsulate all authentication logic for buyers and sellers, making components cleaner and more maintainable.

## File Location

```
src/
└── services/
    ├── buyerAuthService.js    # Buyer authentication service
    └── sellerAuthService.js   # Seller authentication service
```

---

## Buyer Authentication Service Usage

### Import

```javascript
import BuyerAuthService from '../services/buyerAuthService';
```

---

### 1. **Buyer Registration (SignUp.jsx)**

**Location**: `src/pages/buyer/SignUp.jsx`

```javascript
import BuyerAuthService from '../../services/buyerAuthService';

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    const response = await BuyerAuthService.register({
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      password: formData.password
    });

    if (response.success) {
      // Registration successful - redirect to dashboard
      navigate('/buyer/dashboard');
    } else {
      // Show error message
      setError(response.error);
    }
  } catch (err) {
    setError('Registration failed. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
```

---

### 2. **Buyer Login (Login.jsx)**

**Location**: `src/pages/buyer/Login.jsx`

```javascript
import BuyerAuthService from '../../services/buyerAuthService';

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    const response = await BuyerAuthService.login({
      email: formData.email,
      password: formData.password,
      remember_me: formData.rememberMe
    });

    if (response.success) {
      // Login successful - redirect to dashboard
      navigate('/buyer/dashboard');
    } else {
      // Show error message
      setError(response.error);
    }
  } catch (err) {
    setError('Login failed. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
```

---

### 3. **Buyer Logout (Header.jsx, Dashboard.jsx)**

**Location**: `src/layouts/components/Header.jsx`

```javascript
import BuyerAuthService from '../../services/buyerAuthService';

const handleLogout = async () => {
  const confirmed = window.confirm('Are you sure you want to logout?');
  
  if (confirmed) {
    await BuyerAuthService.logout();
    navigate('/buyer/login');
  }
};

return (
  <button onClick={handleLogout} className="logout-button">
    Logout
  </button>
);
```

---

### 4. **Forgot Password (ForgotPassword.jsx)**

**Location**: `src/pages/buyer/ForgotPassword.jsx`

```javascript
import BuyerAuthService from '../../services/buyerAuthService';

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');
  setIsLoading(true);

  try {
    const response = await BuyerAuthService.requestPasswordReset(email);

    if (response.success) {
      setSuccess('Password reset email sent! Check your inbox.');
    } else {
      setError(response.error);
    }
  } catch (err) {
    setError('Failed to send reset email.');
  } finally {
    setIsLoading(false);
  }
};
```

---

### 5. **Update Profile (Profile.jsx)**

**Location**: `src/pages/buyer/Profile.jsx`

```javascript
import BuyerAuthService from '../../services/buyerAuthService';

const handleUpdateProfile = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');
  setIsLoading(true);

  try {
    const response = await BuyerAuthService.updateProfile({
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
      address: formData.address
    });

    if (response.success) {
      setSuccess('Profile updated successfully!');
    } else {
      setError(response.error);
    }
  } catch (err) {
    setError('Failed to update profile.');
  } finally {
    setIsLoading(false);
  }
};
```

---

### 6. **Change Password (Profile.jsx)**

**Location**: `src/pages/buyer/Profile.jsx`

```javascript
import BuyerAuthService from '../../services/buyerAuthService';

const handleChangePassword = async (e) => {
  e.preventDefault();
  setPasswordError('');
  setPasswordSuccess('');
  setIsChangingPassword(true);

  try {
    const response = await BuyerAuthService.changePassword({
      old_password: passwordData.oldPassword,
      new_password: passwordData.newPassword,
      confirm_password: passwordData.confirmPassword
    });

    if (response.success) {
      setPasswordSuccess('Password changed successfully!');
      // Clear form
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } else {
      setPasswordError(response.error);
    }
  } catch (err) {
    setPasswordError('Failed to change password.');
  } finally {
    setIsChangingPassword(false);
  }
};
```

---

### 7. **Check Authentication (Any Component)**

**Location**: Any component that needs to check if buyer is logged in

```javascript
import BuyerAuthService from '../../services/buyerAuthService';

// Check if authenticated
const isLoggedIn = BuyerAuthService.isAuthenticated();

// Get current user
const currentUser = BuyerAuthService.getCurrentUser();
console.log(currentUser?.first_name, currentUser?.email);

// Get token
const token = BuyerAuthService.getToken();
```

---

### 8. **Session Validation (App.jsx)**

**Location**: `src/App.jsx`

```javascript
import BuyerAuthService from './services/buyerAuthService';
import SellerAuthService from './services/sellerAuthService';

function App() {
  useEffect(() => {
    // Validate session on app start
    const validateAuth = async () => {
      // Check buyer session
      await BuyerAuthService.validateSession();
      
      // Check seller session
      await SellerAuthService.validateSession();
    };

    validateAuth();
  }, []);

  return <RouterProvider router={router} />;
}
```

---

### 9. **Refresh Session (AuthGuard.jsx)**

**Location**: `src/guards/AuthGuard.jsx`

```javascript
import BuyerAuthService from '../services/buyerAuthService';

useEffect(() => {
  const checkSession = async () => {
    if (userRole === 'buyer') {
      const isValid = await BuyerAuthService.refreshSession();
      if (!isValid) {
        navigate('/buyer/login');
      }
    }
  };

  checkSession();
}, []);
```

---

## Seller Authentication Service Usage

### Import

```javascript
import SellerAuthService from '../services/sellerAuthService';
```

---

### 1. **Seller Registration (Register.jsx)**

**Location**: `src/pages/seller/Register.jsx`

```javascript
import SellerAuthService from '../../services/sellerAuthService';

// Step 1: Account Creation
const handleAccountRegistration = async () => {
  setError('');
  setIsLoading(true);

  try {
    const response = await SellerAuthService.register({
      email: formData.email,
      password: formData.password,
      confirm_password: formData.confirm_password,
      first_name: formData.first_name,
      last_name: formData.last_name,
      store_name: formData.store_name,
      phone: formData.phone,
      agree_to_terms: formData.agree_to_terms
    });

    if (response.success) {
      // Store token for subsequent steps
      setRegistrationToken(response.token);
      
      // Move to next step
      setCurrentStep(2);
    } else {
      setError(response.error);
    }
  } catch (err) {
    setError('Registration failed. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
```

---

### 2. **Seller Login (Login.jsx)**

**Location**: `src/pages/seller/Login.jsx`

```javascript
import SellerAuthService from '../../services/sellerAuthService';

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    const response = await SellerAuthService.login({
      email: formData.email,
      password: formData.password,
      remember_me: formData.remember_me
    });

    if (response.success) {
      // Login successful - redirect based on profile status
      if (response.redirectTo) {
        navigate(response.redirectTo);
      } else {
        navigate('/seller/dashboard');
      }
    } else {
      setError(response.error);
    }
  } catch (err) {
    setError('Login failed. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
```

---

### 3. **Complete Profile (CompleteProfile.jsx)**

**Location**: `src/pages/seller/CompleteProfile.jsx`

```javascript
import SellerAuthService from '../../services/sellerAuthService';

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    const response = await SellerAuthService.completeProfile({
      business_email: formData.business_email,
      phone: formData.phone,
      store_description: formData.store_description,
      business_type: formData.business_type,
      tax_number: formData.tax_number,
      business_license: formData.business_license,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      postal_code: formData.postal_code
    });

    if (response.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/seller/add-payment');
      }, 2000);
    } else {
      setError(response.error);
    }
  } catch (err) {
    setError('Failed to complete profile.');
  } finally {
    setIsLoading(false);
  }
};
```

---

### 4. **Add Payment Method (AddPayment.jsx)**

**Location**: `src/pages/seller/AddPayment.jsx`

```javascript
import SellerAuthService from '../../services/sellerAuthService';

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    const response = await SellerAuthService.addPaymentMethod({
      type: formData.payment_type,
      account_name: formData.account_name,
      account_number: formData.account_number,
      bank_name: formData.bank_name, // for bank_transfer
      bank_code: formData.bank_code,
      routing_number: formData.routing_number,
      is_default: true
    });

    if (response.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/seller/pending-approval');
      }, 2000);
    } else {
      setError(response.error);
    }
  } catch (err) {
    setError('Failed to add payment method.');
  } finally {
    setIsLoading(false);
  }
};
```

---

### 5. **Check Profile Status (PendingApproval.jsx)**

**Location**: `src/pages/seller/PendingApproval.jsx`

```javascript
import SellerAuthService from '../../services/sellerAuthService';

const handleRefreshStatus = async () => {
  setIsRefreshing(true);

  try {
    const response = await SellerAuthService.getProfileStatus();

    if (response.success) {
      const status = response.data;
      
      // Check if approved
      if (status.is_approved) {
        navigate('/seller/dashboard', {
          state: { message: 'Your account has been approved!' }
        });
      } else if (status.approval_status === 'rejected') {
        navigate('/seller/account-rejected', {
          state: { reason: status.rejection_reason }
        });
      }
    }
  } catch (err) {
    console.error('Failed to refresh status:', err);
  } finally {
    setIsRefreshing(false);
  }
};
```

---

### 6. **Get Payment Methods (SellerSettings.jsx)**

**Location**: `src/pages/seller/Settings.jsx` or `PaymentMethods.jsx`

```javascript
import SellerAuthService from '../../services/sellerAuthService';

useEffect(() => {
  loadPaymentMethods();
}, []);

const loadPaymentMethods = async () => {
  setIsLoading(true);

  try {
    const response = await SellerAuthService.getPaymentMethods();

    if (response.success) {
      setPaymentMethods(response.data);
    } else {
      setError(response.error);
    }
  } catch (err) {
    setError('Failed to load payment methods.');
  } finally {
    setIsLoading(false);
  }
};

// Delete payment method
const handleDelete = async (id) => {
  const confirmed = window.confirm('Delete this payment method?');
  
  if (confirmed) {
    const response = await SellerAuthService.deletePaymentMethod(id);
    
    if (response.success) {
      // Reload payment methods
      loadPaymentMethods();
    }
  }
};

// Set default
const handleSetDefault = async (id) => {
  const response = await SellerAuthService.setDefaultPaymentMethod(id);
  
  if (response.success) {
    loadPaymentMethods();
  }
};
```

---

### 7. **Update Store Info (SellerProfile.jsx)**

**Location**: `src/pages/seller/Profile.jsx`

```javascript
import SellerAuthService from '../../services/sellerAuthService';

const handleUpdateStore = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');
  setIsLoading(true);

  try {
    const response = await SellerAuthService.updateStore({
      store_name: formData.storeName,
      store_description: formData.storeDescription
    });

    if (response.success) {
      setSuccess('Store information updated!');
    } else {
      setError(response.error);
    }
  } catch (err) {
    setError('Failed to update store.');
  } finally {
    setIsLoading(false);
  }
};
```

---

### 8. **Check Seller Status (Any Component)**

**Location**: Any seller component

```javascript
import SellerAuthService from '../../services/sellerAuthService';

// Check if authenticated
const isLoggedIn = SellerAuthService.isAuthenticated();

// Get current seller
const currentSeller = SellerAuthService.getCurrentUser();
console.log(currentSeller?.seller_id, currentSeller?.email);

// Check profile status
const isProfileComplete = SellerAuthService.isProfileComplete();
const isApproved = SellerAuthService.isApproved();
const canSell = SellerAuthService.canAddProducts();

// Use in UI
{canSell && (
  <button onClick={handleAddProduct}>
    Add New Product
  </button>
)}
```

---

### 9. **Seller Guard Usage (SellerGuard.jsx)**

**Location**: `src/guards/SellerGuard.jsx`

```javascript
import SellerAuthService from '../services/sellerAuthService';

const checkSellerStatus = async () => {
  setIsChecking(true);

  // Check if authenticated
  if (!SellerAuthService.isAuthenticated()) {
    setRedirectTo('/seller/login');
    setIsChecking(false);
    return;
  }

  try {
    // Get fresh profile status
    const response = await SellerAuthService.getProfileStatus();
    
    if (!response.success) {
      setRedirectTo('/seller/login');
      setIsChecking(false);
      return;
    }

    const status = response.data;
    
    // Determine redirect based on status
    if (!status.is_approved) {
      if (status.approval_status === 'rejected') {
        setRedirectTo('/seller/account-rejected');
      } else {
        setRedirectTo('/seller/pending-approval');
      }
    } else if (!status.is_profile_complete) {
      setRedirectTo('/seller/complete-profile');
    } else if (!status.has_payment_method) {
      setRedirectTo('/seller/add-payment');
    } else {
      // All good - no redirect needed
      setRedirectTo(null);
    }
  } catch (err) {
    console.error('Seller status check error:', err);
    setRedirectTo('/seller/login');
  } finally {
    setIsChecking(false);
  }
};
```

---

### 10. **Seller Logout (Header.jsx, PendingApproval.jsx)**

**Location**: `src/layouts/SellerLayout.jsx` or header component

```javascript
import SellerAuthService from '../../services/sellerAuthService';

const handleLogout = async () => {
  const confirmed = window.confirm('Are you sure you want to logout?');
  
  if (confirmed) {
    await SellerAuthService.logout();
    navigate('/seller/login');
  }
};
```

---

## Benefits of Using Services

### 1. **Separation of Concerns**
- Business logic separated from UI components
- Components focus on rendering and user interaction
- Services handle data and authentication logic

### 2. **Reusability**
- Same service methods used across multiple components
- No duplicate authentication code
- Easy to maintain and update

### 3. **Testability**
- Services can be tested independently
- Mock services for component testing
- Unit tests for service methods

### 4. **Consistency**
- Uniform error handling across the app
- Consistent response format
- Centralized token management

### 5. **Maintainability**
- Single source of truth for auth logic
- Easy to add new features
- Clear API documentation

---

## Error Handling Pattern

All service methods return a consistent response format:

```javascript
{
  success: boolean,
  data: Object,      // Response data (if successful)
  error: string,     // Error message (if failed)
  message: string    // User-friendly message
}
```

### Usage Example

```javascript
const response = await SellerAuthService.login(credentials);

if (response.success) {
  // Handle success
  console.log(response.message); // "Login successful"
  console.log(response.data);    // { user, token, profile_status }
} else {
  // Handle error
  setError(response.error);      // Display error to user
}
```

---

## Best Practices

1. **Always check `response.success`** before proceeding
2. **Handle errors gracefully** with user-friendly messages
3. **Use loading states** during async operations
4. **Clear sensitive data** after logout
5. **Validate input** before calling service methods
6. **Use try-catch** for additional safety
7. **Refresh status** when needed (approval checks)

---

## Quick Reference

### Buyer Service Methods
- `register()` - Register new buyer
- `login()` - Login buyer
- `logout()` - Logout buyer
- `requestPasswordReset()` - Request password reset
- `resetPassword()` - Reset password with token
- `updateProfile()` - Update buyer profile
- `changePassword()` - Change password
- `verifyEmail()` - Verify email with token
- `isAuthenticated()` - Check if authenticated
- `getCurrentUser()` - Get current user data
- `getToken()` - Get auth token
- `refreshSession()` - Refresh session
- `validateSession()` - Validate session on app start

### Seller Service Methods
- `register()` - Register new seller
- `login()` - Login seller
- `logout()` - Logout seller
- `getProfileStatus()` - Get profile completion status
- `completeProfile()` - Complete business profile
- `getProfile()` - Get full profile
- `updateStore()` - Update store information
- `getPaymentMethods()` - Get all payment methods
- `addPaymentMethod()` - Add payment method
- `updatePaymentMethod()` - Update payment method
- `deletePaymentMethod()` - Delete payment method
- `setDefaultPaymentMethod()` - Set default payment
- `isAuthenticated()` - Check if authenticated
- `getCurrentUser()` - Get current seller data
- `getToken()` - Get auth token
- `getProfileStatusFromState()` - Get status from Redux
- `isProfileComplete()` - Check profile completion
- `isApproved()` - Check approval status
- `canAddProducts()` - Check if can sell
- `refreshSession()` - Refresh session
- `validateSession()` - Validate session on app start