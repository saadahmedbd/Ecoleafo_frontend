# Seller Profile Service - Usage Documentation

## Overview

The Seller Profile Service handles all seller account management, store settings, and profile operations. It's used across multiple seller pages for managing account information, store details, policies, verification, and notifications.

---

## File Location

```
src/
└── services/
    └── sellerProfileService.js
```

---

## Import

```javascript
import SellerProfileService from '../../services/sellerProfileService';
```

---

## Available Methods

### 1. **Get Full Profile**

**Location**: `src/pages/seller/Account.jsx`, `Settings.jsx`

```javascript
const loadProfileData = async () => {
  setIsLoading(true);
  
  try {
    const response = await SellerProfileService.getFullProfile();
    
    if (response.success) {
      const profile = response.data;
      console.log(profile.store_name, profile.business_type);
      setFormData({
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        phone: profile.phone,
        store_name: profile.store_name,
        store_description: profile.store_description
      });
    } else {
      setError(response.error);
    }
  } catch (err) {
    setError('Failed to load profile');
  } finally {
    setIsLoading(false);
  }
};
```

**API Endpoint**: `GET /api/seller/profile`

**Response Data**:
```javascript
{
  first_name: "John",
  last_name: "Doe",
  email: "seller@example.com",
  phone: "+8801712345678",
  store_name: "John's Store",
  store_description: "Quality products",
  business_type: "nursery",
  website: "https://mystore.com",
  address: "123 Main St",
  city: "Dhaka",
  state: "Dhaka Division",
  postal_code: "1200",
  profile_photo: "https://...",
  two_factor_enabled: false
}
```

---

### 2. **Update Account Information**

**Location**: `src/pages/seller/Account.jsx`

```javascript
const handleProfileUpdate = async (e) => {
  e.preventDefault();
  setIsSaving(true);

  try {
    const response = await SellerProfileService.updateAccount({
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone: formData.phone
    });

    if (response.success) {
      setSuccess('Profile updated successfully!');
      // User data is automatically updated in localStorage by the service
    } else {
      setError(response.error);
    }
  } catch (err) {
    setError('Failed to update profile');
  } finally {
    setIsSaving(false);
  }
};
```

**API Endpoint**: `PUT /api/seller/account`

**Request Body**:
```javascript
{
  first_name: "John",
  last_name: "Doe",
  phone: "+8801712345678"
}
```

---

### 3. **Update Store Information**

**Location**: `src/pages/seller/Settings.jsx` (Store Info Tab)

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSaving(true);

  try {
    const response = await SellerProfileService.updateStore({
      store_name: formData.store_name,
      store_description: formData.store_description,
      website: formData.website,
      phone: formData.phone,
      business_email: formData.business_email,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      postal_code: formData.postal_code
    });

    if (response.success) {
      setSuccess('Store information updated!');
    } else {
      setError(response.error);
    }
  } finally {
    setIsSaving(false);
  }
};
```

**API Endpoint**: `PUT /api/seller/store`

---

### 4. **Update Store Branding (Logo & Banner)**

**Location**: `src/pages/seller/Settings.jsx` (Store Info Tab)

```javascript
const handleLogoUpload = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Validate file size
  if (file.size > 2 * 1024 * 1024) {
    setError('Logo must be less than 2MB');
    return;
  }

  const formData = new FormData();
  formData.append('logo', file);

  setIsSaving(true);
  
  try {
    const response = await SellerProfileService.updateBranding(formData);
    
    if (response.success) {
      setSuccess('Logo updated successfully!');
    } else {
      setError(response.error);
    }
  } finally {
    setIsSaving(false);
  }
};

const handleBannerUpload = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('banner', file);

  const response = await SellerProfileService.updateBranding(formData);
  // Handle response...
};
```

**API Endpoint**: `PUT /api/seller/store/branding`

**Request**: FormData with `logo` or `banner` file

---

### 5. **Change Password**

**Location**: `src/pages/seller/Account.jsx`

```javascript
const handlePasswordUpdate = async (e) => {
  e.preventDefault();

  // Validation
  if (passwordData.newPassword !== passwordData.confirmPassword) {
    setError('Passwords do not match');
    return;
  }

  if (passwordData.newPassword.length < 8) {
    setError('Password must be at least 8 characters');
    return;
  }

  setIsSaving(true);

  try {
    const response = await SellerProfileService.changePassword({
      current_password: passwordData.currentPassword,
      new_password: passwordData.newPassword,
      confirm_password: passwordData.confirmPassword
    });

    if (response.success) {
      setSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } else {
      setError(response.error);
    }
  } finally {
    setIsSaving(false);
  }
};
```

**API Endpoint**: `POST /api/seller/password/change`

---

### 6. **Update Store Policies**

**Location**: `src/pages/seller/Settings.jsx` (Policies Tab)

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSaving(true);

  try {
    const response = await SellerProfileService.updatePolicies({
      return_policy: policies.return_policy,
      shipping_policy: policies.shipping_policy,
      faq: policies.faq
    });

    if (response.success) {
      setSuccess('Policies updated successfully!');
    } else {
      setError(response.error);
    }
  } finally {
    setIsSaving(false);
  }
};
```

**API Endpoint**: `PUT /api/seller/store/policies`

---

### 7. **Get & Update Notification Preferences**

**Location**: `src/pages/seller/Settings.jsx` (Notifications Tab)

```javascript
// Load preferences
const loadNotificationPreferences = async () => {
  try {
    const response = await SellerProfileService.getNotificationPreferences();
    
    if (response.success) {
      setNotifications(response.data);
    }
  } catch (err) {
    console.error('Failed to load preferences');
  }
};

// Update preferences
const handleToggle = async (key) => {
  const newNotifications = { 
    ...notifications, 
    [key]: !notifications[key] 
  };
  
  setNotifications(newNotifications);

  try {
    const response = await SellerProfileService.updateNotificationPreferences(
      newNotifications
    );
    
    if (response.success) {
      setSuccess('Preferences updated!');
    } else {
      // Revert on error
      setNotifications(notifications);
      setError(response.error);
    }
  } catch (err) {
    setNotifications(notifications);
  }
};
```

**API Endpoints**: 
- `GET /api/seller/notifications/preferences`
- `PUT /api/seller/notifications/preferences`

**Notification Keys**:
```javascript
{
  order_email: boolean,
  order_sms: boolean,
  order_push: boolean,
  message_email: boolean,
  message_sms: boolean,
  message_push: boolean,
  marketing_email: boolean,
  marketing_sms: boolean,
  marketing_push: boolean
}
```

---

### 8. **Verification Management**

**Location**: `src/pages/seller/Settings.jsx` (Verification Tab)

```javascript
// Get verification status
const loadVerificationStatus = async () => {
  try {
    const response = await SellerProfileService.getVerificationStatus();
    
    if (response.success) {
      setVerificationStatus(response.data);
      // data: { identity: 'verified', tax: 'pending', bank: 'not-submitted' }
    }
  } catch (err) {
    console.error('Failed to load status');
  }
};

// Upload verification document
const handleDocumentUpload = async (documentType, file) => {
  if (!file) return;

  // Validate file size
  if (file.size > 5 * 1024 * 1024) {
    setError('File must be less than 5MB');
    return;
  }

  const formData = new FormData();
  formData.append('document_type', documentType); // 'identity', 'tax', 'bank'
  formData.append('document', file);

  setIsUploading(true);

  try {
    const response = await SellerProfileService.uploadVerificationDocument(
      formData
    );
    
    if (response.success) {
      setSuccess('Document uploaded successfully!');
      loadVerificationStatus(); // Reload status
    } else {
      setError(response.error);
    }
  } finally {
    setIsUploading(false);
  }
};
```

**API Endpoints**:
- `GET /api/seller/verification/status`
- `POST /api/seller/verification/upload`

**Verification Status Values**: `verified`, `pending`, `rejected`, `not-submitted`

---

### 9. **Two-Factor Authentication**

**Location**: `src/pages/seller/Account.jsx`

```javascript
const handleToggle2FA = async () => {
  setIsSaving(true);

  try {
    const response = await SellerProfileService.toggle2FA(!twoFactorEnabled);
    
    if (response.success) {
      setTwoFactorEnabled(!twoFactorEnabled);
      setSuccess(response.message);
      // Message: "2FA enabled successfully" or "2FA disabled successfully"
    } else {
      setError(response.error);
    }
  } catch (err) {
    setError('Failed to update 2FA');
  } finally {
    setIsSaving(false);
  }
};
```

**API Endpoint**: `PUT /api/seller/security/2fa`

**Request Body**: `{ enabled: true/false }`

---

### 10. **Get Login Activity**

**Location**: `src/pages/seller/Account.jsx`

```javascript
const loadLoginActivity = async () => {
  try {
    const response = await SellerProfileService.getLoginActivity();
    
    if (response.success) {
      setLoginActivity(response.data.activities);
      // activities: [
      //   { device: 'Chrome on MacOS', location: 'Dhaka, BD', time_ago: '2 hours ago', is_current: true },
      //   { device: 'Safari on iPhone', location: 'Dhaka, BD', time_ago: 'Yesterday', is_current: false }
      // ]
    }
  } catch (err) {
    console.error('Failed to load activity');
  }
};
```

**API Endpoint**: `GET /api/seller/security/activity`

---

### 11. **Upload Profile Photo**

**Location**: `src/pages/seller/Account.jsx`

```javascript
const handlePhotoUpload = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Validate file
  if (file.size > 2 * 1024 * 1024) {
    setError('Photo must be less than 2MB');
    return;
  }

  if (!file.type.match(/^image\/(png|jpg|jpeg)$/)) {
    setError('Only PNG and JPG files allowed');
    return;
  }

  setIsSaving(true);

  try {
    const response = await SellerProfileService.uploadProfilePhoto(file);
    
    if (response.success) {
      setFormData(prev => ({ 
        ...prev, 
        profile_photo: response.data.photo_url 
      }));
      setSuccess('Profile photo updated!');
    } else {
      setError(response.error);
    }
  } finally {
    setIsSaving(false);
  }
};
```

**API Endpoint**: `POST /api/seller/account/photo`

**Request**: FormData with `photo` file

**Response**: `{ photo_url: "https://..." }`

---

### 12. **Account Deactivation**

**Location**: `src/pages/seller/Account.jsx`

```javascript
const handleDeactivate = async () => {
  if (!window.confirm('Deactivate your account? You can reactivate later.')) {
    return;
  }

  setIsSaving(true);

  try {
    const response = await SellerProfileService.deactivateAccount();
    
    if (response.success) {
      // Automatically logs out and clears localStorage
      navigate('/seller/login', {
        state: { message: 'Account deactivated successfully' }
      });
    } else {
      setError(response.error);
    }
  } finally {
    setIsSaving(false);
  }
};
```

**API Endpoint**: `POST /api/seller/account/deactivate`

**Note**: Service automatically clears localStorage

---

### 13. **Account Deletion**

**Location**: `src/pages/seller/Account.jsx`

```javascript
const handleDelete = async () => {
  const password = window.prompt('Enter password to confirm deletion:');
  
  if (!password) return;

  if (!window.confirm('⚠️ WARNING: This permanently deletes all data!')) {
    return;
  }

  setIsSaving(true);

  try {
    const response = await SellerProfileService.deleteAccount(password);
    
    if (response.success) {
      // Automatically logs out and clears localStorage
      navigate('/seller/login', {
        state: { message: 'Account deleted successfully' }
      });
    } else {
      setError(response.error);
    }
  } finally {
    setIsSaving(false);
  }
};
```

**API Endpoint**: `DELETE /api/seller/account/delete`

**Request Body**: `{ password: "current_password" }`

**Note**: Service automatically clears localStorage

---

### 14. **Get Seller Statistics**

**Location**: `src/pages/seller/Profile.jsx`, `Dashboard.jsx`

```javascript
const loadStatistics = async () => {
  try {
    const response = await SellerProfileService.getStatistics();
    
    if (response.success) {
      const stats = response.data;
      console.log(stats.total_sales, stats.total_orders, stats.rating);
      setStatistics(stats);
    }
  } catch (err) {
    console.error('Failed to load statistics');
  }
};
```

**API Endpoint**: `GET /api/seller/statistics`

**Response Data**:
```javascript
{
  total_sales: 15000,
  total_orders: 120,
  active_products: 45,
  rating: 4.8,
  total_reviews: 89,
  pending_orders: 5,
  completed_orders: 115
}
```

---

## Response Format

All service methods return a consistent response format:

```javascript
{
  success: boolean,
  data: Object | null,
  error: string | null,
  message: string
}
```

---

## Error Handling Pattern

```javascript
const handleOperation = async () => {
  setIsLoading(true);
  setError('');
  setSuccess('');

  try {
    const response = await SellerProfileService.someMethod(data);

    if (response.success) {
      // Handle success
      setSuccess(response.message);
      // Update UI state
    } else {
      // Handle failure
      setError(response.error);
    }
  } catch (err) {
    // Handle unexpected errors
    setError('Operation failed. Please try again.');
    console.error('Error:', err);
  } finally {
    setIsLoading(false);
  }
};
```

---

## Routes Using This Service

### 1. `/seller/account` - Account.jsx
- Get full profile
- Update account info
- Upload profile photo
- Change password
- Toggle 2FA
- Get login activity
- Deactivate account
- Delete account

### 2. `/seller/settings` - Settings.jsx

**Store Info Tab**:
- Get full profile
- Update store info
- Upload logo
- Upload banner

**Policies Tab**:
- Get policies
- Update policies

**Verification Tab**:
- Get verification status
- Upload documents

**Notifications Tab**:
- Get notification preferences
- Update notification preferences

### 3. `/seller/profile` - Profile.jsx (To be created)
- Get full profile
- Get statistics
- Display public profile view

---

## File Upload Guidelines

### Profile Photo
- **Max Size**: 2MB
- **Formats**: PNG, JPG, JPEG
- **Recommended**: 200x200px or larger (square)

### Store Logo
- **Max Size**: 2MB
- **Formats**: PNG, JPG, JPEG
- **Recommended**: 200x200px (square)

### Store Banner
- **Max Size**: 5MB
- **Formats**: PNG, JPG, JPEG
- **Recommended**: 1200x300px (4:1 ratio)

### Verification Documents
- **Max Size**: 5MB
- **Formats**: PNG, JPG, JPEG, PDF
- **Types**: identity, tax, bank

---

## Best Practices

1. **Always check response.success** before proceeding
2. **Show loading states** during operations
3. **Display user-friendly error messages**
4. **Clear success messages** after a few seconds
5. **Validate files** before uploading (size, type)
6. **Confirm destructive actions** (delete, deactivate)
7. **Keep forms in sync** with loaded data
8. **Handle network errors** gracefully

---

## Integration with Seller Auth Service

The Profile Service works alongside the Seller Auth Service:

```javascript
import SellerAuthService from '../../services/sellerAuthService';
import SellerProfileService from '../../services/sellerProfileService';

// Auth operations (login, logout, profile status)
await SellerAuthService.login(credentials);
await SellerAuthService.getProfileStatus();

// Profile operations (account, store, settings)
await SellerProfileService.updateAccount(data);
await SellerProfileService.updateStore(data);
```

---

## Quick Reference

| Method | Endpoint | Used In |
|--------|----------|---------|
| `getFullProfile()` | GET /seller/profile | Account, Settings |
| `updateAccount()` | PUT /seller/account | Account |
| `updateStore()` | PUT /seller/store | Settings (Store) |
| `updateBranding()` | PUT /seller/store/branding | Settings (Store) |
| `changePassword()` | POST /seller/password/change | Account |
| `updatePolicies()` | PUT /seller/store/policies | Settings (Policies) |
| `getNotificationPreferences()` | GET /seller/notifications/preferences | Settings (Notifications) |
| `updateNotificationPreferences()` | PUT /seller/notifications/preferences | Settings (Notifications) |
| `getVerificationStatus()` | GET /seller/verification/status | Settings (Verification) |
| `uploadVerificationDocument()` | POST /seller/verification/upload | Settings (Verification) |
| `toggle2FA()` | PUT /seller/security/2fa | Account |
| `getLoginActivity()` | GET /seller/security/activity | Account |
| `uploadProfilePhoto()` | POST /seller/account/photo | Account |
| `deactivateAccount()` | POST /seller/account/deactivate | Account |
| `deleteAccount()` | DELETE /seller/account/delete | Account |
| `getStatistics()` | GET /seller/statistics | Profile, Dashboard |