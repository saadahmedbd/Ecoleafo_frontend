# Quick Implementation Guide - Page Titles

## ✅ Already Implemented (Examples)
The following pages have been updated with page titles:
- ✅ `src/pages/public/HomePage.jsx` - "Home"
- ✅ `src/pages/buyer/Cart.jsx` - "Shopping Cart"
- ✅ `src/pages/seller/SellerProducts.jsx` - "My Products"
- ✅ `src/pages/seller/SellerDashboard.jsx` - "Seller Dashboard"
- ✅ `src/pages/admin/Dashboard.jsx` - "Admin Dashboard"
- ✅ `src/pages/admin/UsersPage.jsx` - "Users Management"

## 🚀 How to Add Titles to Remaining Pages

### Step 1: Import the Hook
Add this import at the top of your component file:
```javascript
import { usePageTitle } from '@/hooks/usePageTitle';
```

### Step 2: Use the Hook
Add this line at the beginning of your component function:
```javascript
export default function YourComponent() {
  usePageTitle('Your Page Title');
  
  // rest of your component code
}
```

## 📋 Complete Title List

### Public Pages (14 files)
```javascript
// src/pages/public/AboutUs.jsx
usePageTitle('About Us');

// src/pages/public/Contact.jsx
usePageTitle('Contact Us');

// src/pages/public/ForgetPassword.jsx
usePageTitle('Forgot Password');

// src/pages/public/HelpCenter.jsx
usePageTitle('Help Center');

// src/pages/public/Login.jsx
usePageTitle('Login');

// src/pages/public/PrivacyPolicy.jsx
usePageTitle('Privacy Policy');

// src/pages/public/ProductDetails.jsx
usePageTitle('Product Details');

// src/pages/public/Returns.jsx
usePageTitle('Returns & Refunds');

// src/pages/public/SearchPage.jsx
usePageTitle('Search Products');

// src/pages/public/SellerProducts.jsx
usePageTitle('Seller Products');

// src/pages/public/ShippingInfo.jsx
usePageTitle('Shipping Information');

// src/pages/public/SignUpPage.jsx
usePageTitle('Sign Up');

// src/pages/public/TermsOfService.jsx
usePageTitle('Terms of Service');
```

### Buyer Pages (17 files)
```javascript
// src/pages/buyer/AccountPage.jsx
usePageTitle('My Account');

// src/pages/buyer/BuyerAddressesPage.jsx
usePageTitle('My Addresses');

// src/pages/buyer/BuyerPasswordPage.jsx
usePageTitle('Change Password');

// src/pages/buyer/BuyerProfilePage.jsx
usePageTitle('My Profile');

// src/pages/buyer/CategoriesPage.jsx
usePageTitle('Categories');

// src/pages/buyer/CategoryProductsPage.jsx
usePageTitle('Category Products');

// src/pages/buyer/CheckoutPage.jsx
usePageTitle('Checkout');

// src/pages/buyer/CreateReview.jsx
usePageTitle('Write Review');

// src/pages/buyer/EditReview.jsx
usePageTitle('Edit Review');

// src/pages/buyer/Messages.jsx
usePageTitle('Messages');

// src/pages/buyer/MessageSeller.jsx
usePageTitle('Message Seller');

// src/pages/buyer/MyOrders.jsx
usePageTitle('My Orders');

// src/pages/buyer/MyReviews.jsx
usePageTitle('My Reviews');

// src/pages/buyer/Orders.jsx
usePageTitle('Orders');

// src/pages/buyer/ProductReviews.jsx
usePageTitle('Product Reviews');

// src/pages/buyer/Wishlist.jsx
usePageTitle('My Wishlist');
```

### Buyer Mobile Pages (21 files)
```javascript
// src/pages/buyer/mobile/AccountPage.jsx
usePageTitle('Account');

// src/pages/buyer/mobile/CartPage.jsx
usePageTitle('Cart');

// src/pages/buyer/mobile/CheckoutPage.jsx
usePageTitle('Checkout');

// src/pages/buyer/mobile/EditProfile.jsx
usePageTitle('Edit Profile');

// src/pages/buyer/mobile/ForgetPassword.jsx
usePageTitle('Forgot Password');

// src/pages/buyer/mobile/HelpSupport.jsx
usePageTitle('Help & Support');

// src/pages/buyer/mobile/HomePage.jsx
usePageTitle('Home');

// src/pages/buyer/mobile/LoginPage.jsx
usePageTitle('Login');

// src/pages/buyer/mobile/ManageAddresses.jsx
usePageTitle('Manage Addresses');

// src/pages/buyer/mobile/NotificationPage.jsx
usePageTitle('Notifications');

// src/pages/buyer/mobile/OrderDetails.jsx
usePageTitle('Order Details');

// src/pages/buyer/mobile/Orderpage.jsx
usePageTitle('Orders');

// src/pages/buyer/mobile/OrderSuccess.jsx
usePageTitle('Order Successful');

// src/pages/buyer/mobile/PaymentMethod.jsx
usePageTitle('Payment Method');

// src/pages/buyer/mobile/ProductDetails.jsx
usePageTitle('Product Details');

// src/pages/buyer/mobile/SearchPage.jsx
usePageTitle('Search');

// src/pages/buyer/mobile/SecuritySettings.jsx
usePageTitle('Security Settings');

// src/pages/buyer/mobile/SignUpPage.jsx
usePageTitle('Sign Up');

// src/pages/buyer/mobile/TrackOrder.jsx
usePageTitle('Track Order');

// src/pages/buyer/mobile/WishlistPage.jsx
usePageTitle('Wishlist');
```

### Seller Pages (19 files)
```javascript
// src/pages/seller/AddPayment.jsx
usePageTitle('Add Payment Method');

// src/pages/seller/AddProduct.jsx
usePageTitle('Add Product');

// src/pages/seller/CompleteProfile.jsx
usePageTitle('Complete Profile');

// src/pages/seller/DashboardTest.jsx
usePageTitle('Dashboard Test');

// src/pages/seller/EditProduct.jsx
usePageTitle('Edit Product');

// src/pages/seller/HomeSellerAccount.jsx
usePageTitle('Seller Home');

// src/pages/seller/PendingApproval.jsx
usePageTitle('Pending Approval');

// src/pages/seller/ProductDetail.jsx
usePageTitle('Product Details');

// src/pages/seller/SellerAccount.jsx
usePageTitle('Seller Account');

// src/pages/seller/SellerInventory.jsx
usePageTitle('Inventory Management');

// src/pages/seller/SellerLogin.jsx
usePageTitle('Seller Login');

// src/pages/seller/SellerMessages.jsx
usePageTitle('Messages');

// src/pages/seller/SellerOrderDetails.jsx
usePageTitle('Order Details');

// src/pages/seller/SellerOrders.jsx
usePageTitle('Orders');

// src/pages/seller/SellerRegister.jsx
usePageTitle('Seller Registration');

// src/pages/seller/SellerReviews.jsx
usePageTitle('Customer Reviews');

// src/pages/seller/SellerSettings.jsx
usePageTitle('Settings');
```

### Admin Pages (30 files)
```javascript
// src/pages/admin/ActivityLogPage.jsx
usePageTitle('Activity Log');

// src/pages/admin/AdminManagementPage.jsx
usePageTitle('Admin Management');

// src/pages/admin/AdminReviews.jsx
usePageTitle('Reviews Management');

// src/pages/admin/AllSellerEarnings.jsx
usePageTitle('All Seller Earnings');

// src/pages/admin/BuyerDetailPage.jsx
usePageTitle('Buyer Details');

// src/pages/admin/BuyersListPage.jsx
usePageTitle('Buyers List');

// src/pages/admin/CategoriesListPage.jsx
usePageTitle('Categories');

// src/pages/admin/CategoryDetailPage.jsx
usePageTitle('Category Details');

// src/pages/admin/CategoryFormPage.jsx
usePageTitle('Category Form');

// src/pages/admin/CategoryTreePage.jsx
usePageTitle('Category Tree');

// src/pages/admin/EarningsPage.jsx
usePageTitle('Earnings');

// src/pages/admin/ForgotPassword.jsx
usePageTitle('Forgot Password');

// src/pages/admin/Invitations.jsx
usePageTitle('Invitations');

// src/pages/admin/Login.jsx
usePageTitle('Admin Login');

// src/pages/admin/OrderDetailPage.jsx
usePageTitle('Order Details');

// src/pages/admin/OrderListPage.jsx
usePageTitle('Orders');

// src/pages/admin/PayoutsPage.jsx
usePageTitle('Payouts');

// src/pages/admin/ProductDetailsPage.jsx
usePageTitle('Product Details');

// src/pages/admin/ProductsListPage.jsx
usePageTitle('Products');

// src/pages/admin/Profile.jsx
usePageTitle('Admin Profile');

// src/pages/admin/Register.jsx
usePageTitle('Admin Registration');

// src/pages/admin/ReportsPage.jsx
usePageTitle('Reports');

// src/pages/admin/ReviewPage.jsx
usePageTitle('Review Details');

// src/pages/admin/SellerDetailPage.jsx
usePageTitle('Seller Details');

// src/pages/admin/SellerEarningsDetail.jsx
usePageTitle('Seller Earnings Details');

// src/pages/admin/SellersListPage.jsx
usePageTitle('Sellers List');

// src/pages/admin/SettingPage.jsx
usePageTitle('Settings');

// src/pages/admin/Users.jsx
usePageTitle('Users');
```

### Auth Pages (1 file)
```javascript
// src/pages/auth/GoogleCallback.jsx
usePageTitle('Authenticating...');
```

## 🎯 Priority Order

1. **High Priority** (User-facing pages):
   - Public pages (Login, SignUp, HomePage, ProductDetails)
   - Buyer pages (Cart, Checkout, MyOrders, Wishlist)

2. **Medium Priority**:
   - Seller pages (Dashboard, Products, Orders)
   - Admin pages (Dashboard, Users, Products)

3. **Low Priority**:
   - Mobile-specific pages
   - Settings and profile pages

## 💡 Tips

- All titles automatically get " | Ecoleafo" appended
- For dynamic titles, use template literals:
  ```javascript
  usePageTitle(`${productName} | Product Details`);
  ```
- The hook handles cleanup automatically when component unmounts
- Test in browser to see titles in the tab

## 🔧 Automated Option

Run the PowerShell script to add titles automatically:
```powershell
cd c:\Users\Saad\treestore-frontend
.\add-page-titles.ps1
```

**Note:** Review changes after running the script!
