# PowerShell Script to Add Page Titles to All Pages
# Run this script from the project root directory

$pageTitles = @{
    # Public Pages
    "src\pages\public\AboutUs.jsx" = "About Us"
    "src\pages\public\Contact.jsx" = "Contact Us"
    "src\pages\public\ForgetPassword.jsx" = "Forgot Password"
    "src\pages\public\HelpCenter.jsx" = "Help Center"
    "src\pages\public\Login.jsx" = "Login"
    "src\pages\public\PrivacyPolicy.jsx" = "Privacy Policy"
    "src\pages\public\ProductDetails.jsx" = "Product Details"
    "src\pages\public\Returns.jsx" = "Returns & Refunds"
    "src\pages\public\SearchPage.jsx" = "Search Products"
    "src\pages\public\SellerProducts.jsx" = "Seller Products"
    "src\pages\public\ShippingInfo.jsx" = "Shipping Information"
    "src\pages\public\SignUpPage.jsx" = "Sign Up"
    "src\pages\public\TermsOfService.jsx" = "Terms of Service"
    
    # Buyer Pages
    "src\pages\buyer\AccountPage.jsx" = "My Account"
    "src\pages\buyer\BuyerAddressesPage.jsx" = "My Addresses"
    "src\pages\buyer\BuyerPasswordPage.jsx" = "Change Password"
    "src\pages\buyer\BuyerProfilePage.jsx" = "My Profile"
    "src\pages\buyer\CategoriesPage.jsx" = "Categories"
    "src\pages\buyer\CategoryProductsPage.jsx" = "Category Products"
    "src\pages\buyer\CheckoutPage.jsx" = "Checkout"
    "src\pages\buyer\CreateReview.jsx" = "Write Review"
    "src\pages\buyer\EditReview.jsx" = "Edit Review"
    "src\pages\buyer\Messages.jsx" = "Messages"
    "src\pages\buyer\MessageSeller.jsx" = "Message Seller"
    "src\pages\buyer\MyOrders.jsx" = "My Orders"
    "src\pages\buyer\MyReviews.jsx" = "My Reviews"
    "src\pages\buyer\Orders.jsx" = "Orders"
    "src\pages\buyer\ProductReviews.jsx" = "Product Reviews"
    "src\pages\buyer\Wishlist.jsx" = "My Wishlist"
    
    # Buyer Mobile Pages
    "src\pages\buyer\mobile\AccountPage.jsx" = "Account"
    "src\pages\buyer\mobile\CartPage.jsx" = "Cart"
    "src\pages\buyer\mobile\CheckoutPage.jsx" = "Checkout"
    "src\pages\buyer\mobile\EditProfile.jsx" = "Edit Profile"
    "src\pages\buyer\mobile\ForgetPassword.jsx" = "Forgot Password"
    "src\pages\buyer\mobile\HelpSupport.jsx" = "Help & Support"
    "src\pages\buyer\mobile\HomePage.jsx" = "Home"
    "src\pages\buyer\mobile\LoginPage.jsx" = "Login"
    "src\pages\buyer\mobile\ManageAddresses.jsx" = "Manage Addresses"
    "src\pages\buyer\mobile\NotificationPage.jsx" = "Notifications"
    "src\pages\buyer\mobile\OrderDetails.jsx" = "Order Details"
    "src\pages\buyer\mobile\Orderpage.jsx" = "Orders"
    "src\pages\buyer\mobile\OrderSuccess.jsx" = "Order Successful"
    "src\pages\buyer\mobile\PaymentMethod.jsx" = "Payment Method"
    "src\pages\buyer\mobile\ProductDetails.jsx" = "Product Details"
    "src\pages\buyer\mobile\SearchPage.jsx" = "Search"
    "src\pages\buyer\mobile\SecuritySettings.jsx" = "Security Settings"
    "src\pages\buyer\mobile\SignUpPage.jsx" = "Sign Up"
    "src\pages\buyer\mobile\TrackOrder.jsx" = "Track Order"
    "src\pages\buyer\mobile\WishlistPage.jsx" = "Wishlist"
    
    # Seller Pages
    "src\pages\seller\AddPayment.jsx" = "Add Payment Method"
    "src\pages\seller\AddProduct.jsx" = "Add Product"
    "src\pages\seller\CompleteProfile.jsx" = "Complete Profile"
    "src\pages\seller\DashboardTest.jsx" = "Dashboard Test"
    "src\pages\seller\EditProduct.jsx" = "Edit Product"
    "src\pages\seller\HomeSellerAccount.jsx" = "Seller Home"
    "src\pages\seller\PendingApproval.jsx" = "Pending Approval"
    "src\pages\seller\ProductDetail.jsx" = "Product Details"
    "src\pages\seller\SellerAccount.jsx" = "Seller Account"
    "src\pages\seller\SellerInventory.jsx" = "Inventory Management"
    "src\pages\seller\SellerLogin.jsx" = "Seller Login"
    "src\pages\seller\SellerMessages.jsx" = "Messages"
    "src\pages\seller\SellerOrderDetails.jsx" = "Order Details"
    "src\pages\seller\SellerOrders.jsx" = "Orders"
    "src\pages\seller\SellerRegister.jsx" = "Seller Registration"
    "src\pages\seller\SellerReviews.jsx" = "Customer Reviews"
    "src\pages\seller\SellerSettings.jsx" = "Settings"
    
    # Admin Pages
    "src\pages\admin\ActivityLogPage.jsx" = "Activity Log"
    "src\pages\admin\AdminManagementPage.jsx" = "Admin Management"
    "src\pages\admin\AdminReviews.jsx" = "Reviews Management"
    "src\pages\admin\AllSellerEarnings.jsx" = "All Seller Earnings"
    "src\pages\admin\BuyerDetailPage.jsx" = "Buyer Details"
    "src\pages\admin\BuyersListPage.jsx" = "Buyers List"
    "src\pages\admin\CategoriesListPage.jsx" = "Categories"
    "src\pages\admin\CategoryDetailPage.jsx" = "Category Details"
    "src\pages\admin\CategoryFormPage.jsx" = "Category Form"
    "src\pages\admin\CategoryTreePage.jsx" = "Category Tree"
    "src\pages\admin\EarningsPage.jsx" = "Earnings"
    "src\pages\admin\ForgotPassword.jsx" = "Forgot Password"
    "src\pages\admin\Invitations.jsx" = "Invitations"
    "src\pages\admin\Login.jsx" = "Admin Login"
    "src\pages\admin\OrderDetailPage.jsx" = "Order Details"
    "src\pages\admin\OrderListPage.jsx" = "Orders"
    "src\pages\admin\PayoutsPage.jsx" = "Payouts"
    "src\pages\admin\ProductDetailsPage.jsx" = "Product Details"
    "src\pages\admin\ProductsListPage.jsx" = "Products"
    "src\pages\admin\Profile.jsx" = "Admin Profile"
    "src\pages\admin\Register.jsx" = "Admin Registration"
    "src\pages\admin\ReportsPage.jsx" = "Reports"
    "src\pages\admin\ReviewPage.jsx" = "Review Details"
    "src\pages\admin\SellerDetailPage.jsx" = "Seller Details"
    "src\pages\admin\SellerEarningsDetail.jsx" = "Seller Earnings Details"
    "src\pages\admin\SellersListPage.jsx" = "Sellers List"
    "src\pages\admin\SettingPage.jsx" = "Settings"
    "src\pages\admin\Users.jsx" = "Users"
    
    # Auth Pages
    "src\pages\auth\GoogleCallback.jsx" = "Authenticating..."
}

Write-Host "Starting to add page titles..." -ForegroundColor Green
Write-Host ""

$successCount = 0
$errorCount = 0
$skippedCount = 0

foreach ($file in $pageTitles.Keys) {
    $fullPath = Join-Path $PSScriptRoot $file
    $title = $pageTitles[$file]
    
    if (-not (Test-Path $fullPath)) {
        Write-Host "⚠️  File not found: $file" -ForegroundColor Yellow
        $skippedCount++
        continue
    }
    
    try {
        $content = Get-Content $fullPath -Raw
        
        # Check if already has usePageTitle
        if ($content -match "usePageTitle\(") {
            Write-Host "⏭️  Already has title: $file" -ForegroundColor Cyan
            $skippedCount++
            continue
        }
        
        # Add import if not present
        if ($content -notmatch "import.*usePageTitle") {
            # Find the last import statement
            $lines = $content -split "`n"
            $lastImportIndex = -1
            
            for ($i = 0; $i -lt $lines.Count; $i++) {
                if ($lines[$i] -match "^import ") {
                    $lastImportIndex = $i
                }
            }
            
            if ($lastImportIndex -ge 0) {
                $lines = $lines[0..$lastImportIndex] + 
                         "import { usePageTitle } from '@/hooks/usePageTitle';" + 
                         $lines[($lastImportIndex + 1)..($lines.Count - 1)]
                $content = $lines -join "`n"
            }
        }
        
        # Add usePageTitle call after function declaration
        # Match: export default function ComponentName() {
        $pattern = "(export\s+default\s+function\s+\w+\s*\([^)]*\)\s*\{)"
        if ($content -match $pattern) {
            $replacement = "`$1`n  usePageTitle('$title');"
            $content = $content -replace $pattern, $replacement
            
            Set-Content -Path $fullPath -Value $content -NoNewline
            Write-Host "✅ Added title to: $file" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "⚠️  Could not find function declaration in: $file" -ForegroundColor Yellow
            $skippedCount++
        }
    }
    catch {
        Write-Host "❌ Error processing: $file - $_" -ForegroundColor Red
        $errorCount++
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "✅ Successfully updated: $successCount files" -ForegroundColor Green
Write-Host "⏭️  Skipped: $skippedCount files" -ForegroundColor Cyan
Write-Host "❌ Errors: $errorCount files" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: Please review the changes and test your application." -ForegroundColor Yellow
