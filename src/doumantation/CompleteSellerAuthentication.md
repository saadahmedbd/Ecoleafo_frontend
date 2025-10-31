# Seller Authentication System - Setup & Usage Guide

## Overview

This is a complete seller authentication system with multi-step registration, profile completion checks, payment method management, and admin approval workflow.

## Features

✅ **Multi-Step Registration**
- Step 1: Account Creation (Backend API call)
- Step 2: Store Information
- Step 3: Business Details
- Step 4: Payment Method

✅ **Login with Profile Checks**
- Automatic redirect based on profile status
- Admin approval verification
- Profile completion check
- Payment method verification

✅ **Profile Completion Flow**
- Complete business profile page
- Add payment method page
- Pending approval page
- Account rejected page

✅ **Session Persistence**
- Survives page refresh
- Remember me functionality
- Secure token management

✅ **Comprehensive Validation**
- Bangladesh phone number format
- Email validation
- Password strength check
- Business details validation

---

## Installation & Setup

### 1. Environment Variables

Create or update `.env` file in your project root:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 2. Install Dependencies

All required dependencies should already be installed:

```bash
npm install @reduxjs/toolkit react-redux react-router-dom
```

### 3. File Structure

Ensure these files are in place:

```
src/
├── features/
│   └── auth/
│       ├── authSlice.js              # Updated with seller support
│       ├── buyerAuthApi.js           # Existing
│       └── sellerAuthApi.js          # NEW
├── app/
│   ├── store.js                      # Updated with seller API
│   └── hooks.js                      # Existing
├── pages/
│   └── seller/
│       ├── Login.jsx                 # Updated with profile checks
│       ├── Register.jsx              # Updated with backend integration
│       ├── CompleteProfile.jsx       # NEW
│       ├── AddPayment.jsx            # NEW
│       └── PendingApproval.jsx       # NEW
├── guards/
│   ├── AuthGuard.jsx                 # Existing
│   ├── RoleGuard.jsx                 # Existing
│   ├── GuestGuard.jsx                # Existing
│   └── SellerGuard.jsx               # NEW
├── routes/
│   └── index.jsx                     # Updated with seller routes
└── utils/
    └── sellerValidation.js           # NEW
```

---

## Usage Guide

### Registration Flow

1. **User visits `/seller/register`**
2. **Step 1: Account Creation**
   - Fills out: name, email, phone, store name, password
   - Clicks "Next" → API call to `POST /api/seller/register`
   - Token stored, moves to Step 2

3. **Step 2: Store Information**
   - Fills out: store description, business type
   - Clicks "Next" → Local validation only

4. **Step 3: Business Details**
   - Fills out: business email, address, city, state, postal code
   - Clicks "Next" → Local validation only

5. **Step 4: Payment Method**
   - Selects: payment type (bank/mobile banking)
   - Fills out: account details
   - Clicks "Complete Registration"
   - API calls:
     - `POST /api/seller/profile/complete`
     - `POST /api/seller/payment-methods`
   - Redirects to login with success message

### Login Flow

1. **User visits `/seller/login`**
2. **Enters credentials**
3. **Clicks "Login"** → API call to `POST /api/seller/login`
4. **Profile Status Check** → Automatic redirect based on status:
   - ❌ **Not Approved (Pending)** → `/seller/pending-approval`
   - ❌ **Rejected** → `/seller/account-rejected`
   - ❌ **Profile Incomplete** → `/seller/complete-profile`
   - ❌ **No Payment Method** → `/seller/add-payment`
   - ✅ **All Complete & Approved** → `/seller/dashboard`

### Profile Completion (If Incomplete)

1. **User redirected to `/seller/complete-profile`**
2. **Fills out missing information**
3. **Submits** → API call to `POST /api/seller/profile/complete`
4. **Redirects to** `/seller/add-payment`

### Payment Method Addition

1. **User at `/seller/add-payment`**
2. **Selects payment method** (bank transfer, bKash, Nagad, Rocket)
3. **Enters account details**
4. **Submits** → API call to `POST /api/seller/payment-methods`
5. **Redirects to** `/seller/pending-approval`

### Pending Approval

1. **User at `/seller/pending-approval`**
2. **Displays**: Current status, what to expect, support contact
3. **Can refresh status** → Re-checks `GET /api/seller/profile/status`
4. **Once approved** → Automatically redirects to `/seller/dashboard`

---

## API Endpoints Used

### Registration
```
POST /api/seller/register
Body: {
  email, password, confirm_password,
  first_name, last_name, store_name, phone,
  agree_to_terms
}
Response: { token, seller_id, user_id, profile_status }
```

### Login
```
POST /api/seller/login
Body: { email, password, remember_me }
Response: { token, user, profile_status }
```

### Profile Status
```
GET /api/seller/profile/status
Headers: { Authorization: Bearer <token> }
Response: {
  is_approved, is_profile_complete,
  has_business_info, has_address, has_payment_method,
  can_add_products, missing_fields, next_step
}
```

### Complete Profile
```
POST /api/seller/profile/complete
Headers: { Authorization: Bearer <token> }
Body: {
  business_email, phone, store_description, business_type,
  tax_number, business_license, address, city, state,
  country, postal_code
}
```

### Add Payment Method
```
POST /api/seller/payment-methods
Headers: { Authorization: Bearer <token> }
Body: {
  type, account_name, account_number,
  bank_name (if bank_transfer), bank_code, routing_number,
  is_default
}
```

---

## Validation Rules

### Email
- Required
- Valid email format

### Password
- Minimum 8 characters
- Must match confirmation

### Phone (Bangladesh)
- Format: `01XXXXXXXXX` or `+8801XXXXXXXXX`
- Valid operators: 013-019

### Store Name
- 3-50 characters

### Store Description
- Minimum 50 characters

### Business Type
- Options: `individual`, `nursery`, `company`

### Address
- Minimum 10 characters

### Payment Type
- Options: `bank_transfer`, `bkash`, `nagad`, `rocket`

---

## Protected Routes

### Seller Routes (Require Full Profile Completion)
- `/seller/dashboard`
- `/seller/products`
- `/seller/orders`
- `/seller/analytics`
- `/seller/profile`
- `/seller/settings`

### Seller Onboarding Routes (Profile Incomplete OK)
- `/seller/complete-profile`
- `/seller/add-payment`
- `/seller/pending-approval`
- `/seller/account-rejected`

---

## Guards

### SellerGuard
- Checks authentication
- Verifies seller role
- Checks approval status
- Checks profile completion
- Checks payment method
- Redirects to appropriate page if incomplete

### Usage Example
```jsx
<SellerGuard>
  <SellerDashboard />
</SellerGuard>
```

---

## Redux State

### Auth State
```javascript
{
  isAuthenticated: boolean,
  token: string | null,
  user: object | null,
  role: 'buyer' | 'seller' | 'admin' | null,
  profileStatus: {
    is_approved: boolean,
    is_profile_complete: boolean,
    has_payment_method: boolean,
    can_add_products: boolean,
    ...
  },
  isLoading: boolean,
  error: string | null
}
```

### Accessing State
```javascript
import { useAppSelector } from '../app/hooks';
import { selectIsAuthenticated, selectProfileStatus } from '../features/auth/authSlice';

const isAuthenticated = useAppSelector(selectIsAuthenticated);
const profileStatus = useAppSelector(selectProfileStatus);
```

---

## Testing Checklist

### Registration
- [ ] Can register with valid data
- [ ] Validation errors shown for invalid data
- [ ] Password mismatch error
- [ ] Terms agreement required
- [ ] Phone number format validation
- [ ] Token stored after Step 1
- [ ] Can complete all 4 steps
- [ ] Redirects to login after completion

### Login
- [ ] Can login with valid credentials
- [ ] Error shown for invalid credentials
- [ ] Profile check runs after login
- [ ] Redirects based on profile status
- [ ] Remember me works
- [ ] Token persists after page refresh

### Profile Completion
- [ ] Missing fields displayed
- [ ] Validation works
- [ ] API call successful
- [ ] Redirects to payment page

### Payment Method
- [ ] Can select payment type
- [ ] Bank fields show for bank_transfer
- [ ] Validation works
- [ ] API call successful
- [ ] Redirects to pending approval

### Pending Approval
- [ ] Shows current status
- [ ] Refresh button works
- [ ] Redirects when approved
- [ ] Support info displayed

### Guards
- [ ] Unauthenticated users redirected
- [ ] Non-sellers blocked
- [ ] Incomplete profiles redirected correctly
- [ ] Approved sellers access dashboard

---

## Troubleshooting

### Token Issues
- Check browser console for API errors
- Verify token in localStorage: `auth_token`
- Check token format: Should be Bearer token
- Ensure backend returns token correctly

### Redirect Loops
- Clear localStorage: `localStorage.clear()`
- Check profile status API response
- Verify guard logic in `SellerGuard.jsx`

### Validation Errors
- Check `sellerValidation.js` for rules
- Verify form field names match
- Check console for validation errors

### API Errors
- Verify backend is running on port 3000
- Check `.env` file for correct API URL
- Inspect network tab for API responses
- Verify backend endpoints match documentation

---

## Next Steps

1. **Add Account Rejected Page**
   - Display rejection reason
   - Contact support option
   - Re-apply process

2. **Add Seller Profile Page**
   - View/edit profile info
   - Manage payment methods
   - Upload store logo

3. **Add Product Management**
   - Add new products
   - Edit existing products
   - Inventory management

4. **Add Order Management**
   - View orders
   - Update order status
   - Generate invoices

---

## Support

For issues or questions:
- Email: seller-support@example.com
- Phone: +880 1234 567890
- Documentation: /docs/seller-guide