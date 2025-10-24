import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2, Heart, X } from "lucide-react";
import "./mobile.css";
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
 * Main mobile app component
 */
export default function MobileApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [lastOrderId, setLastOrderId] = useState(null);
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
 
  
// Update the useEffect to load profile data properly
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

  const generateOrderId = () => {
    return "ORD" + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const showToast = (message, type = "cart") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const currentPage = location.pathname.split('/').pop() || 'home';

  const handleAddToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    showToast("Added to cart successfully!", "cart");
  };

  const handleToggleWishlist = (productId) => {
    const newWishlist = new Set(wishlist);
    const isAdding = !newWishlist.has(productId);
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
    } else {
      newWishlist.add(productId);
    }
    setWishlist(newWishlist);
    showToast(
      isAdding ? "Added to wishlist!" : "Removed from wishlist!",
      "wishlist"
    );
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    navigate("/mobile/product-details");
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    navigate("/mobile/order-details");
  };

  const handleReorder = (order) => {
    order.items.forEach((item) => {
      handleAddToCart(item);
    });
  };

  const wishlistProducts = mockProducts.filter((p) => wishlist.has(p.id));
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={`max-w-md mx-auto min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {!['mobile', 'home', 'orders', 'wishlist', 'cart', 'account'].includes(currentPage) && (
        <Header
          title={currentPage === "search" ? "Search" : currentPage === "product-details" ? "Product Details" : currentPage === "checkout" ? "Checkout" : currentPage === "order-success" ? "Order Placed" : currentPage === "notifications" ? "Notifications" : currentPage === "help" ? "Help & Support" : ""}
          onBack={() => navigate("/mobile/home")}
          onNotificationClick={() => navigate("/mobile/notifications")}
        />
      )}

      <Routes>
        <Route path="home" element={
          <HomePage
            products={mockProducts}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            onProductClick={handleProductClick}
            wishlistIds={wishlist}
            onSearchClick={() => navigate("/mobile/search")}
            onWishlistClick={() => navigate("/mobile/wishlist")}
          />
        } />
        <Route path="search" element={
          <SearchPage
            products={mockProducts}
            onBack={() => navigate("/mobile/home")}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            onProductClick={handleProductClick}
            wishlistIds={wishlist}
          />
        } />
        <Route path="product-details" element={
          selectedProduct && <ProductDetails
            key={selectedProduct.id}
            product={selectedProduct}
            onBack={() => navigate("/mobile/home")}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isInWishlist={wishlist.has(selectedProduct.id)}
            relatedProducts={mockProducts}
            onProductClick={handleProductClick}
          />
        } />
        <Route path="cart" element={
          <CartPage
            items={cart}
            onUpdateQuantity={(id, quantity) => {
              if (quantity === 0) {
                setCart(cart.filter((item) => item.id !== id));
              } else {
                setCart(cart.map((item) => item.id === id ? { ...item, quantity } : item));
              }
            }}
            onRemoveItem={(id) => setCart(cart.filter((item) => item.id !== id))}
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
        <Route path="wishlist" element={
          <WishlistPage
            products={wishlistProducts}
            onAddToCart={handleAddToCart}
            onRemoveFromWishlist={handleToggleWishlist}
            onProductClick={handleProductClick}
          />
        } />
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
        / Update the logout function in AccountPage route
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

        
      // Update the login route to properly set profile
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
        <Route path="forgot-password" element={
          <ForgotPassword
            onBack={() => navigate("/mobile/login")}
            onResetSuccess={() => {
              showToast("Password reset successful!", "cart");
              navigate("/mobile/login");
            }}
          />
        } />
                // Update the edit-profile route with proper prop passing
          <Route path="edit-profile" element={
            <EditProfile
              onBack={() => {
                // Reload profile data when going back
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
                console.log("Profile saved:", updatedProfile);
                // Update all state with new profile data
                setUserProfile({
                  firstName: updatedProfile.firstName || "",
                  lastName: updatedProfile.lastName || "",
                  email: updatedProfile.email || "",
                  phone: updatedProfile.phone || "",
                  profileImage: updatedProfile.profileImage || null
                });
                setUserName(updatedProfile.firstName || "User");
                // Show success toast
                showToast("Profile updated successfully!", "cart");
              }}
              showToast={showToast}
            />
          } />
       
        <Route path="manage-addresses" element={
          <ManageAddresses
            onBack={() => navigate("/mobile/account")}
            showToast={showToast}
          />
        } />
        <Route path="security-settings" element={
          <SecuritySettings
            onBack={() => navigate("/mobile/account")}
            onSave={(securityData) => {
              console.log("Security updated:", securityData);
              showToast("Security settings updated!", "cart");
            }}
          />
        } />
        <Route path="checkout" element={
          <CheckoutPage
            items={cart}
            
            onBack={() => navigate("/mobile/cart")}
            onPlaceOrder={() => navigate("/mobile/payment")}
            onAddAddress={() => navigate("/mobile/manage-addresses")}
          />
        } />
        <Route path="payment" element={
          <PaymentMethod
            total={cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 5}
            onBack={() => navigate("/mobile/checkout")}
            onConfirmPayment={(method) => {
              const orderId = generateOrderId();
              setLastOrderId(orderId);
              console.log("Payment method:", method, "Order ID:", orderId);
              navigate("/mobile/order-success");
              setCart([]);
            }}
          />
        } />
        <Route path="order-success" element={
          <OrderSuccess
            orderId={lastOrderId || "ORD12347"}
            onBackToHome={() => navigate("/mobile/home")}
            onViewOrders={() => navigate("/mobile/track-order")}
          />
        } />
        <Route path="track-order" element={
          <TrackOrder
            orderId={lastOrderId}
            onBack={() => navigate("/mobile/orders")}
          />
        } />
        <Route path="notifications" element={
          <NotificationsPage onBack={() => navigate("/mobile/home")} />
        } />
        <Route path="help" element={
          <HelpSupport onBack={() => navigate("/mobile/account")} />
        } />
      </Routes>

      <BottomNav currentPage={currentPage} onNavigate={(page) => navigate(`/mobile/${page}`)} cartCount={cartCount} />

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-md ${
            toast.type === "cart" ? "bg-[#059669] text-white" : "bg-pink-500 text-white"
          }`}>
            {toast.type === "cart" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <Heart className="w-5 h-5 fill-white" />
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
