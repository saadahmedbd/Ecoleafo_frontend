import { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
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

  const currentPage = location.pathname.split('/').pop() || 'home';

  const handleAddToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const handleToggleWishlist = (productId) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
    } else {
      newWishlist.add(productId);
    }
    setWishlist(newWishlist);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    navigate("/mobile/product-details");
  };

  const wishlistProducts = mockProducts.filter((p) => wishlist.has(p.id));
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
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
            onCheckout={() => navigate("/mobile/checkout")}
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
            onOrderClick={(order) => console.log("Order clicked:", order)}
          />
        } />
        <Route path="account" element={
          <AccountPage onHelpClick={() => navigate("/mobile/help")} />
        } />
        <Route path="checkout" element={
          <CheckoutPage
            items={cart}
            onBack={() => navigate("/mobile/cart")}
            onPlaceOrder={() => {
              navigate("/mobile/order-success");
              setCart([]);
            }}
          />
        } />
        <Route path="order-success" element={
          <OrderSuccess onContinueShopping={() => navigate("/mobile/home")} />
        } />
        <Route path="notifications" element={
          <NotificationsPage onBack={() => navigate("/mobile/home")} />
        } />
        <Route path="help" element={
          <HelpSupport onBack={() => navigate("/mobile/account")} />
        } />
      </Routes>

      <BottomNav currentPage={currentPage} onNavigate={(page) => navigate(`/mobile/${page}`)} cartCount={cartCount} />
    </div>
  );
}
