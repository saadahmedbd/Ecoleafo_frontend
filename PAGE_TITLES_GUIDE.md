# Page Titles Implementation Guide for Ecoleafo Frontend

This document contains all the page titles to be added to each page component using the `usePageTitle` hook.

## Hook Usage

```javascript
import { usePageTitle } from '@/hooks/usePageTitle';

// Inside component
usePageTitle('Page Title');
```

## Page Titles by Section

### Public Pages (`src/pages/public/`)
- **HomePage.jsx**: `usePageTitle('Home')`
- **AboutUs.jsx**: `usePageTitle('About Us')`
- **Contact.jsx**: `usePageTitle('Contact Us')`
- **ForgetPassword.jsx**: `usePageTitle('Forgot Password')`
- **HelpCenter.jsx**: `usePageTitle('Help Center')`
- **Login.jsx**: `usePageTitle('Login')`
- **PrivacyPolicy.jsx**: `usePageTitle('Privacy Policy')`
- **ProductDetails.jsx**: `usePageTitle('Product Details')`
- **Returns.jsx**: `usePageTitle('Returns & Refunds')`
- **SearchPage.jsx**: `usePageTitle('Search Products')`
- **SellerProducts.jsx**: `usePageTitle('Seller Products')`
- **ShippingInfo.jsx**: `usePageTitle('Shipping Information')`
- **SignUpPage.jsx**: `usePageTitle('Sign Up')`
- **TermsOfService.jsx**: `usePageTitle('Terms of Service')`

### Buyer Pages (`src/pages/buyer/`)
- **AccountPage.jsx**: `usePageTitle('My Account')`
- **BuyerAddressesPage.jsx**: `usePageTitle('My Addresses')`
- **BuyerPasswordPage.jsx**: `usePageTitle('Change Password')`
- **BuyerProfilePage.jsx**: `usePageTitle('My Profile')`
- **Cart.jsx**: `usePageTitle('Shopping Cart')`
- **CategoriesPage.jsx**: `usePageTitle('Categories')`
- **CategoryProductsPage.jsx**: `usePageTitle('Category Products')`
- **CheckoutPage.jsx**: `usePageTitle('Checkout')`
- **CreateReview.jsx**: `usePageTitle('Write Review')`
- **EditReview.jsx**: `usePageTitle('Edit Review')`
- **Messages.jsx**: `usePageTitle('Messages')`
- **MessageSeller.jsx**: `usePageTitle('Message Seller')`
- **MyOrders.jsx**: `usePageTitle('My Orders')`
- **MyReviews.jsx**: `usePageTitle('My Reviews')`
- **Orders.jsx**: `usePageTitle('Orders')`
- **ProductReviews.jsx**: `usePageTitle('Product Reviews')`
- **Wishlist.jsx**: `usePageTitle('My Wishlist')`

### Buyer Mobile Pages (`src/pages/buyer/mobile/`)
- **AccountPage.jsx**: `usePageTitle('Account')`
- **CartPage.jsx**: `usePageTitle('Cart')`
- **CheckoutPage.jsx**: `usePageTitle('Checkout')`
- **EditProfile.jsx**: `usePageTitle('Edit Profile')`
- **ForgetPassword.jsx**: `usePageTitle('Forgot Password')`
- **HelpSupport.jsx**: `usePageTitle('Help & Support')`
- **HomePage.jsx**: `usePageTitle('Home')`
- **LoginPage.jsx**: `usePageTitle('Login')`
- **ManageAddresses.jsx**: `usePageTitle('Manage Addresses')`
- **NotificationPage.jsx**: `usePageTitle('Notifications')`
- **OrderDetails.jsx**: `usePageTitle('Order Details')`
- **Orderpage.jsx**: `usePageTitle('Orders')`
- **OrderSuccess.jsx**: `usePageTitle('Order Successful')`
- **PaymentMethod.jsx**: `usePageTitle('Payment Method')`
- **ProductDetails.jsx**: `usePageTitle('Product Details')`
- **SearchPage.jsx**: `usePageTitle('Search')`
- **SecuritySettings.jsx**: `usePageTitle('Security Settings')`
- **SignUpPage.jsx**: `usePageTitle('Sign Up')`
- **TrackOrder.jsx**: `usePageTitle('Track Order')`
- **WishlistPage.jsx**: `usePageTitle('Wishlist')`

### Seller Pages (`src/pages/seller/`)
- **AddPayment.jsx**: `usePageTitle('Add Payment Method')`
- **AddProduct.jsx**: `usePageTitle('Add Product')`
- **CompleteProfile.jsx**: `usePageTitle('Complete Profile')`
- **DashboardTest.jsx**: `usePageTitle('Dashboard Test')`
- **EditProduct.jsx**: `usePageTitle('Edit Product')`
- **HomeSellerAccount.jsx**: `usePageTitle('Seller Home')`
- **PendingApproval.jsx**: `usePageTitle('Pending Approval')`
- **ProductDetail.jsx**: `usePageTitle('Product Details')`
- **SellerAccount.jsx**: `usePageTitle('Seller Account')`
- **SellerDashboard.jsx**: `usePageTitle('Seller Dashboard')`
- **SellerInventory.jsx**: `usePageTitle('Inventory Management')`
- **SellerLogin.jsx**: `usePageTitle('Seller Login')`
- **SellerMessages.jsx**: `usePageTitle('Messages')`
- **SellerOrderDetails.jsx**: `usePageTitle('Order Details')`
- **SellerOrders.jsx**: `usePageTitle('Orders')`
- **SellerProducts.jsx**: `usePageTitle('My Products')`
- **SellerRegister.jsx**: `usePageTitle('Seller Registration')`
- **SellerReviews.jsx**: `usePageTitle('Customer Reviews')`
- **SellerSettings.jsx**: `usePageTitle('Settings')`

### Admin Pages (`src/pages/admin/`)
- **ActivityLogPage.jsx**: `usePageTitle('Activity Log')`
- **AdminManagementPage.jsx**: `usePageTitle('Admin Management')`
- **AdminReviews.jsx**: `usePageTitle('Reviews Management')`
- **AllSellerEarnings.jsx**: `usePageTitle('All Seller Earnings')`
- **BuyerDetailPage.jsx**: `usePageTitle('Buyer Details')`
- **BuyersListPage.jsx**: `usePageTitle('Buyers List')`
- **CategoriesListPage.jsx**: `usePageTitle('Categories')`
- **CategoryDetailPage.jsx**: `usePageTitle('Category Details')`
- **CategoryFormPage.jsx**: `usePageTitle('Category Form')`
- **CategoryTreePage.jsx**: `usePageTitle('Category Tree')`
- **Dashboard.jsx**: `usePageTitle('Admin Dashboard')`
- **EarningsPage.jsx**: `usePageTitle('Earnings')`
- **ForgotPassword.jsx**: `usePageTitle('Forgot Password')`
- **Invitations.jsx**: `usePageTitle('Invitations')`
- **Login.jsx**: `usePageTitle('Admin Login')`
- **OrderDetailPage.jsx**: `usePageTitle('Order Details')`
- **OrderListPage.jsx**: `usePageTitle('Orders')`
- **PayoutsPage.jsx**: `usePageTitle('Payouts')`
- **ProductDetailsPage.jsx**: `usePageTitle('Product Details')`
- **ProductsListPage.jsx**: `usePageTitle('Products')`
- **Profile.jsx**: `usePageTitle('Admin Profile')`
- **Register.jsx**: `usePageTitle('Admin Registration')`
- **ReportsPage.jsx**: `usePageTitle('Reports')`
- **ReviewPage.jsx**: `usePageTitle('Review Details')`
- **SellerDetailPage.jsx**: `usePageTitle('Seller Details')`
- **SellerEarningsDetail.jsx**: `usePageTitle('Seller Earnings Details')`
- **SellersListPage.jsx**: `usePageTitle('Sellers List')`
- **SettingPage.jsx**: `usePageTitle('Settings')`
- **Users.jsx**: `usePageTitle('Users')`
- **UsersPage.jsx**: `usePageTitle('Users Management')`

### Auth Pages (`src/pages/auth/`)
- **GoogleCallback.jsx**: `usePageTitle('Authenticating...')`

## Implementation Steps

1. Import the hook at the top of each component:
   ```javascript
   import { usePageTitle } from '@/hooks/usePageTitle';
   ```

2. Add the hook call at the beginning of the component function:
   ```javascript
   export default function ComponentName() {
     usePageTitle('Page Title');
     // rest of component code
   }
   ```

## Example Implementation

```javascript
import { usePageTitle } from '@/hooks/usePageTitle';
import { useState } from 'react';

export default function MyOrders() {
  usePageTitle('My Orders');
  
  const [orders, setOrders] = useState([]);
  // rest of component logic
  
  return (
    <div>
      {/* component JSX */}
    </div>
  );
}
```

## Notes

- The hook automatically appends " | Ecoleafo" to all titles
- If no title is provided, it defaults to "Ecoleafo - Buy and Sell Trees"
- The hook cleans up the title when the component unmounts
- For dynamic titles (e.g., product names), you can pass variables:
  ```javascript
  usePageTitle(productName || 'Product Details');
  ```
