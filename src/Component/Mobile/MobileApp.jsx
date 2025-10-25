import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2, Heart, X } from "lucide-react";
import "./mobile.css";

// Import Components
import HomePage from "./Components/Hompage";
import BottomNav from "./Components/BottomNav";
import Header from "./Components/Header";
import CartPage from "./Components/CartPage";
import WishlistPage from "./Components/Wishlist";
import OrdersPage from "./Components/Orderpage";
import AccountPage from "./Components/AccountPage";
import SearchPage from "./Components/SearchPage";
import ProductDetails from "./Components/ProductDetils";
import CheckoutPage from "./Components/CheckoutPage";
import OrderSuccess from "./Components/OrderSuccess";
import NotificationsPage from "./Components/Notification";
import HelpSupport from "./Components/HelpSupport";
import OrderDetails from "./Components/OrderDetails";
import PaymentMethod from "./Components/PaymentMethod";
import TrackOrder from "./Components/TrackOrder";
import LoginPage from "./Components/LoginPage";
import SignUpPage from "./Components/SignUpPage";
import ForgotPassword from "./Components/ForgotPassword";
import EditProfile from "./Components/EditProfile";
import ManageAddresses from "./Components/ManageAddresses";
import SecuritySettings from "./Components/SecuritySettings";

// Import API Service
import {
  addToCart as apiAddToCart,
  getCart as apiGetCart,
  updateCartItem as apiUpdateCartItem,
  removeFromCart as apiRemoveFromCart,
  clearCart as apiClearCart,
  incrementQuantity as apiIncrementQuantity,
  decrementQuantity as apiDecrementQuantity,
  addToWishlist as apiAddToWishlist,
  getWishlist as apiGetWishlist,
  removeFromWishlist as apiRemoveFromWishlist,
  moveWishlistToCart as apiMoveWishlistToCart,
  getCartCount as apiGetCartCount,
} from "../../services/apiService";

// Mock products for browsing (replace with actual product API later)
const mockProducts = [
  { id: 1, name: "Oak Tree", price: 89, originalPrice: 120, image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=200&h=200&fit=crop", category: "Oak", inStock: true, rating: 4.5, reviews: 120 },
  { id: 2, name: "Pine Tree", price: 65, image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=200&h=200&fit=crop", category: "Pine", inStock: true, rating: 4.3, reviews: 85 },
  { id: 3, name: "Bonsai Tree", price: 150, originalPrice: 200, image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=200&h=200&fit=crop", category: "Bonsai", inStock: true, rating: 4.8, reviews: 200 },
  { id: 4, name: "Palm Tree", price: 120, image: "https://images.unsplash.com/photo-1509937528035-ad76254b0356?w=200&h=200&fit=crop", category: "Palm", inStock: true, rating: 4.6, reviews: 150 },
  { id: 5, name: "Maple Tree", price: 95, originalPrice: 130, image: "https://images.unsplash.com/photo-1511497584788-876760111969?w=200&h=200&fit=crop", category: "Maple", inStock: true, rating: 4.7, reviews: 95 },
  { id: 6, name: "Cherry Blossom", price: 180, image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=200&h=200&fit=crop", category: "Fruit", inStock: true, rating: 4.9, reviews: 210 },
  { id: 7, name: "Willow Tree", price: 110, image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=200&h=200&fit=crop", category: "Willow", inStock: true, rating: 4.4, reviews: 78 },
  { id: 8, name: "Birch Tree", price: 75, originalPrice: 100, image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop", category: "Birch", inStock: true, rating: 4.6, reviews: 112 },
  { id: 9, name: "Olive Tree", price: 140, image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200&h=200&fit=crop", category: "Olive", inStock: true, rating: 4.5, reviews: 88 },
  { id: 10, name: "Cypress Tree", price: 105, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop", category: "Cypress", inStock: true, rating: 4.3, reviews: 67 },
];

/**
 * Main mobile app component with backend integration
 */
export default function MobileApp() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State management
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [lastOrderId, setLastOrderId] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // User authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('authToken');
  });
  const [userName, setUserName] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [userProfile, setUserProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profileImage: null
  });

  // Load user profile on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const userData = localStorage.getItem('userData');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setUserProfile({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            phone: user.phone || "",
            profileImage: user.profileImage || null
          });
          setUserName(user.firstName || "User");
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
  }, []);

  // Load cart and wishlist data on mount and when login status changes
  useEffect(() => {
    if (isLoggedIn) {
      loadCartData();
      loadWishlistData();
      loadCartCount();
    } else {
      // Clear data when logged out
      setCart([]);
      setWishlist([]);
      setWishlistIds(new Set());
      setCartCount(0);
    }
  }, [isLoggedIn]);

  /**
   * Load cart data from backend
   */
  const loadCartData = async () => {
    try {
      setLoading(true);
      const cartData = await apiGetCart();
      
      // Transform backend cart data to frontend format
      if (cartData && cartData.items) {
        const transformedCart = cartData.items.map(item => ({
          id: item.product_id,
          name: item.product_name || item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || item.product_image,
          seller: item.seller_name,
          size: item.size,
          inStock: item.in_stock !== false
        }));
        setCart(transformedCart);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      showToast("Error loading cart data", "error");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load wishlist data from backend
   */
  const loadWishlistData = async () => {
    try {
      const wishlistData = await apiGetWishlist();
      
      // Transform backend wishlist data to frontend format
      if (Array.isArray(wishlistData)) {
        const transformedWishlist = wishlistData.map(item => ({
          id: item.product_id,
          name: item.product_name || item.name,
          price: item.price,
          originalPrice: item.original_price,
          image: item.image || item.product_image,
          category: item.category,
          inStock: item.in_stock !== false,
          rating: item.rating,
          reviews: item.reviews
        }));
        setWishlist(transformedWishlist);
        
        // Create Set of wishlist IDs for quick lookup
        const ids = new Set(wishlistData.map(item => item.product_id));
        setWishlistIds(ids);
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
      showToast("Error loading wishlist data", "error");
    }
  };

  /**
   * Load cart item count from backend
   */
  const loadCartCount = async () => {
    try {
      const countData = await apiGetCartCount();
      if (countData && typeof countData.count === 'number') {
        setCartCount(countData.count);
      }
    } catch (error) {
      console.error("Error loading cart count:", error);
    }
  };

  /**
   * Show toast notification
   */
  const showToast = (message, type = "cart") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const currentPage = location.pathname.split('/').pop() || 'home';

  /**
   * Add product to cart - Backend integrated
   */
  const handleAddToCart = async (product) => {
    if (!isLoggedIn) {
      showToast("Please login to add items to cart", "error");
      navigate("/mobile/login");
      return;
    }

    try {
      setLoading(true);
      
      // Call backend API to add to cart
      await apiAddToCart(product.id, 1, false, '');
      
      // Reload cart data from backend
      await loadCartData();
      await loadCartCount();
      
      showToast("Added to cart successfully!", "cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      showToast(error.message || "Failed to add to cart", "error");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggle wishlist - Backend integrated
   */
  const handleToggleWishlist = async (productId) => {
    if (!isLoggedIn) {
      showToast("Please login to manage wishlist", "error");
      navigate("/mobile/login");
      return;
    }

    try {
      setLoading(true);
      const isAdding = !wishlistIds.has(productId);
      
      if (isAdding) {
        // Add to wishlist
        await apiAddToWishlist(productId);
        showToast("Added to wishlist!", "wishlist");
      } else {
        // Remove from wishlist
        await apiRemoveFromWishlist(productId);
        showToast("Removed from wishlist!", "wishlist");
      }
      
      // Reload wishlist data from backend
      await loadWishlistData();
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      showToast(error.message || "Failed to update wishlist", "error");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update cart item quantity - Backend integrated
   */
  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity === 0) {
      // Remove item if quantity is 0
      await handleRemoveFromCart(productId);
      return;
    }

    try {
      setLoading(true);
      
      // Call backend API to update quantity
      await apiUpdateCartItem(productId, newQuantity, false, '');
      
      // Reload cart data
      await loadCartData();
      await loadCartCount();
      
      showToast("Cart updated", "cart");
    } catch (error) {
      console.error("Error updating cart:", error);
      showToast(error.message || "Failed to update cart", "error");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remove item from cart - Backend integrated
   */
  const handleRemoveFromCart = async (productId) => {
    try {
      setLoading(true);
      
      // Call backend API to remove item
      await apiRemoveFromCart(productId);
      
      // Reload cart data
      await loadCartData();
      await loadCartCount();
      
      showToast("Item removed from cart", "cart");
    } catch (error) {
      console.error("Error removing from cart:", error);
      showToast(error.message || "Failed to remove item", "error");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Move wishlist item to cart - Backend integrated
   */
  const handleMoveWishlistToCart = async (productId) => {
    try {
      setLoading(true);
      
      // Call backend API to move item
      await apiMoveWishlistToCart(productId);
      
      // Reload both cart and wishlist
      await loadCartData();
      await loadWishlistData();
      await loadCartCount();
      
      showToast("Moved to cart successfully!", "cart");
    } catch (error) {
      console.error("Error moving to cart:", error);
      showToast(error.message || "Failed to move item to cart", "error");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle product click
   */
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    navigate("/mobile/product-details");
  };

  /**
   * Handle order click
   */
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    navigate("/mobile/order-details");
  };

  /**
   * Handle reorder
   */
  const handleReorder = (order) => {
    order.items.forEach(async (item) => {
      await handleAddToCart(item);
    });
  };

  /**
   * Generate order ID
   */
  const generateOrderId = () => {
    return "ORD" + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  return (
    <div className={`max-w-md mx-auto min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#059669]"></div>
          </div>
        </div>
      )}

      {/* Header for non-main pages */}
      {!['mobile', 'home', 'orders', 'wishlist', 'cart', 'account'].includes(currentPage) && (
        <Header
          title={currentPage === "search" ? "Search" : currentPage === "product-details" ? "Product Details" : currentPage === "checkout" ? "Checkout" : currentPage === "order-success" ? "Order Placed" : currentPage === "notifications" ? "Notifications" : currentPage === "help" ? "Help & Support" : ""}
          onBack={() => navigate("/mobile/home")}
          onNotificationClick={() => navigate("/mobile/notifications")}
        />
      )}

      <Routes>
        {/* Home Page */}
        <Route path="home" element={
          <HomePage
            products={mockProducts}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            onProductClick={handleProductClick}
            wishlistIds={wishlistIds}
            onSearchClick={() => navigate("/mobile/search")}
            onWishlistClick={() => navigate("/mobile/wishlist")}
          />
        } />

        {/* Search Page */}
        <Route path="search" element={
          <SearchPage
            products={mockProducts}
            onBack={() => navigate("/mobile/home")}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            onProductClick={handleProductClick}
            wishlistIds={wishlistIds}
          />
        } />

        {/* Product Details Page */}
        <Route path="product-details" element={
          selectedProduct && <ProductDetails
            key={selectedProduct.id}
            product={selectedProduct}
            onBack={() => navigate("/mobile/home")}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isInWishlist={wishlistIds.has(selectedProduct.id)}
            relatedProducts={mockProducts}
            onProductClick={handleProductClick}
          />
        } />

        {/* Cart Page - Backend Integrated */}
        <Route path="cart" element={
          <CartPage
            items={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromCart}
            onCheckout={() => {
              if (isLoggedIn) {
                navigate("/mobile/checkout");
              } else {
                navigate("/mobile/login");
              }
            }}
            isLoggedIn={isLoggedIn}
          />
        } />

        {/* Wishlist Page - Backend Integrated */}
        <Route path="wishlist" element={
          <WishlistPage
            products={wishlist}
            onAddToCart={handleMoveWishlistToCart}
            onRemoveFromWishlist={handleToggleWishlist}
            onProductClick={handleProductClick}
          />
        } />

        {/* Orders Page */}
        <Route path="orders" element={
          <OrdersPage
            orders={[
              { id: "ORD12345", date: "Dec 15, 2024", status: "delivered", items: mockProducts.slice(0, 2), total: 154 },
              { id: "ORD12346", date: "Dec 18, 2024", status: "in-progress", items: mockProducts.slice(2, 3), total: 150 },
            ]}
            onOrderClick={handleOrderClick}
            onReorder={handleReorder}
          />
        } />

        {/* Order Details Page */}
        <Route path="order-details" element={
          selectedOrder && <OrderDetails
            order={selectedOrder}
            onBack={() => navigate("/mobile/orders")}
            onReorder={(order) => {
              handleReorder(order);
              navigate("/mobile/cart");
            }}
            onProductClick={handleProductClick}
          />
        } />

        {/* Account Page */}
        <Route path="account" element={
          <AccountPage
            onHelpClick={() => navigate("/mobile/help")}
            onLoginClick={() => navigate("/mobile/login")}
            onSignUpClick={() => navigate("/mobile/signup")}
            onGuestContinue={() => navigate("/mobile/home")}
            onEditProfileClick={() => navigate("/mobile/edit-profile")}
            onManageAddressesClick={() => navigate("/mobile/manage-addresses")}
            onSecurityClick={() => navigate("/mobile/security-settings")}
            onLogout={() => {
              // Clear all auth data
              localStorage.removeItem('authToken');
              localStorage.removeItem('userData');
              setIsLoggedIn(false);
              setUserName("");
              setUserProfile({ 
                firstName: "", 
                lastName: "", 
                email: "", 
                phone: "", 
                profileImage: null 
              });
              // Clear cart and wishlist
              setCart([]);
              setWishlist([]);
              setWishlistIds(new Set());
              setCartCount(0);
              showToast("Logged out successfully!", "cart");
              navigate("/mobile/home");
            }}
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
            isLoggedIn={isLoggedIn}
            userName={userName}
            userProfile={userProfile}
          />
        } />

        {/* Login Page */}
        <Route path="login" element={
          <LoginPage
            onBack={() => navigate("/mobile/account")}
            onLogin={(userData) => {
              localStorage.setItem('authToken', userData.token);
              const profile = {
                firstName: userData.firstName || "",
                lastName: userData.lastName || "",
                email: userData.email || "",
                phone: userData.phone || "",
                profileImage: userData.profileImage || null
              };
              localStorage.setItem('userData', JSON.stringify(profile));
              setIsLoggedIn(true);
              setUserName(userData.firstName || "User");
              setUserProfile(profile);
              showToast("Login successful!", "cart");
              navigate("/mobile/home");
            }}
            onSignUpClick={() => navigate("/mobile/signup")}
            onForgotPasswordClick={() => navigate("/mobile/forgot-password")}
            onGuestContinue={() => navigate("/mobile/home")}
            showToast={showToast}
          />
        } />

        {/* Sign Up Page */}
        <Route path="signup" element={
          <SignUpPage
            onBack={() => navigate("/mobile/account")}
            onSignUp={(userData) => {
              const profile = {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                phone: "",
                profileImage: null
              };
              localStorage.setItem('userData', JSON.stringify(profile));
              setIsLoggedIn(true);
              setUserName(userData.firstName || "User");
              setUserProfile(profile);
              navigate("/mobile/account");
            }}
            onLoginClick={() => navigate("/mobile/login")}
            showToast={showToast}
          />
        } />

        {/* Forgot Password Page */}
        <Route path="forgot-password" element={
          <ForgotPassword
            onBack={() => navigate("/mobile/login")}
            onResetSuccess={() => {
              showToast("Password reset successful!", "cart");
              navigate("/mobile/login");
            }}
          />
        } />

        {/* Edit Profile Page */}
        <Route path="edit-profile" element={
          <EditProfile
            onBack={() => {
              const userData = localStorage.getItem('userData');
              if (userData) {
                try {
                  const user = JSON.parse(userData);
                  setUserProfile(user);
                  setUserName(user.firstName || "User");
                } catch (error) {
                  console.error("Error loading profile:", error);
                }
              }
              navigate("/mobile/account");
            }}
            userProfile={userProfile}
            onSave={(updatedProfile) => {
              setUserProfile({
                firstName: updatedProfile.firstName || "",
                lastName: updatedProfile.lastName || "",
                email: updatedProfile.email || "",
                phone: updatedProfile.phone || "",
                profileImage: updatedProfile.profileImage || null
              });
              setUserName(updatedProfile.firstName || "User");
              showToast("Profile updated successfully!", "cart");
            }}
            showToast={showToast}
          />
        } />

        {/* Manage Addresses Page */}
        <Route path="manage-addresses" element={
          <ManageAddresses
            onBack={() => navigate("/mobile/account")}
            showToast={showToast}
          />
        } />

        {/* Security Settings Page */}
        <Route path="security-settings" element={
          <SecuritySettings
            onBack={() => navigate("/mobile/account")}
            onSave={(securityData) => {
              console.log("Security updated:", securityData);
              showToast("Security settings updated!", "cart");
            }}
          />
        } />

        {/* Checkout Page - Backend Integrated */}
        <Route path="checkout" element={
          <CheckoutPage
            items={cart}
            onBack={() => navigate("/mobile/cart")}
            onPlaceOrder={() => navigate("/mobile/payment")}
            onAddAddress={() => navigate("/mobile/manage-addresses")}
          />
        } />

        {/* Payment Method Page */}
        <Route path="payment" element={
          <PaymentMethod
            total={cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 5}
            onBack={() => navigate("/mobile/checkout")}
            onConfirmPayment={async (method) => {
              const orderId = generateOrderId();
              setLastOrderId(orderId);
              console.log("Payment method:", method, "Order ID:", orderId);
              
              // Clear cart after successful order
              try {
                await apiClearCart();
                setCart([]);
                setCartCount(0);
              } catch (error) {
                console.error("Error clearing cart:", error);
              }
              
              navigate("/mobile/order-success");
            }}
          />
        } />

        {/* Order Success Page */}
        <Route path="order-success" element={
          <OrderSuccess
            orderId={lastOrderId || "ORD12347"}
            onBackToHome={() => navigate("/mobile/home")}
            onViewOrders={() => navigate("/mobile/track-order")}
          />
        } />

        {/* Track Order Page */}
        <Route path="track-order" element={
          <TrackOrder
            orderId={lastOrderId}
            onBack={() => navigate("/mobile/orders")}
          />
        } />

        {/* Notifications Page */}
        <Route path="notifications" element={
          <NotificationsPage onBack={() => navigate("/mobile/home")} />
        } />

        {/* Help & Support Page */}
        <Route path="help" element={
          <HelpSupport onBack={() => navigate("/mobile/account")} />
        } />
      </Routes>

      {/* Bottom Navigation */}
      <BottomNav 
        currentPage={currentPage} 
        onNavigate={(page) => navigate(`/mobile/${page}`)} 
        cartCount={cartCount} 
      />

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-md ${
            toast.type === "cart" ? "bg-[#059669] text-white" : 
            toast.type === "wishlist" ? "bg-pink-500 text-white" :
            "bg-red-500 text-white"
          }`}>
            {toast.type === "cart" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : toast.type === "wishlist" ? (
              <Heart className="w-5 h-5 fill-white" />
            ) : (
              <X className="w-5 h-5" />
            )}
            <span className="font-medium">{toast.message}</span>
            <button onClick={() => setToast({ show: false, message: "", type: "" })} className="ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}