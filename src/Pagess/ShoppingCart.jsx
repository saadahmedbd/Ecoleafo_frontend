import React, { useState } from 'react';
import { Leaf, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import './ShoppingCart.css';
import { Link } from 'react-router-dom';

/* ============================================
   SHOPPING CART PAGE COMPONENT
   Complete cart with items, order summary, and recommendations
   ============================================ */
export function ShoppingCart  ()  {
  // State management
  const [couponCode, setCouponCode] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [selectedState, setSelectedState] = useState('California');
  const [zipCode, setZipCode] = useState('');

  // Cart items state - easily replaceable with API data
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Juniper Bonsai',
      seller: 'Green Thumb Nursery',
      price: 75.00,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=150'
    },
    {
      id: 2,
      name: 'Japanese Maple',
      seller: "Nature's Best",
      price: 75.00,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=150'
    }
  ]);

  // Recommended products
  const recommendedProducts = [
    {
      id: 3,
      name: 'Chinese Elm Bonsai',
      price: 85.00,
      image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=300'
    },
    {
      id: 4,
      name: 'Ficus Bonsai',
      price: 95.00,
      image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=300'
    },
    {
      id: 5,
      name: 'Azalea Bonsai',
      price: 110.00,
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300'
    },
    {
      id: 6,
      name: 'Pine Bonsai',
      price: 90.00,
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300'
    }
  ];

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Update quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  // Remove item
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Reset cart
  const resetCart = () => {
    setCartItems([]);
  };

  // Apply coupon
  const applyCoupon = () => {
    if (couponCode.trim()) {
      console.log('Applying coupon:', couponCode);
      alert(`Coupon "${couponCode}" applied!`);
    }
  };

  // Proceed to checkout
  const handleCheckout = () => {
  };

  // Add recommended product to cart
  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1, seller: 'Evergreen' }]);
    }
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="cart-page">
      {/* ============================================
          HEADER SECTION
          ============================================ */}
      <header className="cart-header">
        <div className="header-content">
          <div className="brand-logo">
            <Leaf size={28} strokeWidth={2.5} />
            <h1 className="brand-name">Evergreen</h1>
          </div>
          <a href="/" className="continue-shopping">Continue shopping</a>
        </div>
      </header>

      {/* ============================================
          MAIN CART CONTENT
          ============================================ */}
      <div className="cart-container">
        {/* Cart Items Section */}
        <div className="cart-items-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 className="section-title" style={{ margin: 0 }}>Shopping Cart</h2>
            {cartItems.length > 0 && (
              <button onClick={resetCart} style={{ padding: '10px 20px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}>Reset Cart</button>
            )}
          </div>

          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <a href="/" className="btn-shop-now">Start Shopping</a>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-seller">Sold by: {item.seller}</p>
                    <button 
                      className="btn-remove"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button 
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <input 
                        type="number" 
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="qty-input"
                        min="1"
                      />
                      <button 
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary Section */}
        <aside className="order-summary">
          <h2 className="summary-title">Order Summary</h2>

          {/* Price Details */}
          <div className="summary-details">
            <div className="summary-row">
              <span className="summary-label">Subtotal</span>
              <span className="summary-value">${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Shipping</span>
              <span className="summary-value-light">Calculated at next step</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Taxes</span>
              <span className="summary-value-light">Calculated at next step</span>
            </div>
          </div>

          {/* Coupon Section */}
          <div className="coupon-section">
            <h3 className="coupon-title">Apply Coupon</h3>
            <div className="coupon-input-group">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="coupon-input"
              />
              <button 
                className="btn-apply-coupon"
                onClick={applyCoupon}
              >
                Apply
              </button>
            </div>
          </div>

          {/* Shipping Estimate */}
          <div className="shipping-estimate">
            <h3 className="estimate-title">Estimate Shipping</h3>
            <select 
              className="shipping-select"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="Mexico">Mexico</option>
            </select>
            <div className="location-inputs">
              <select 
                className="state-select"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                <option value="California">California</option>
                <option value="New York">New York</option>
                <option value="Texas">Texas</option>
                <option value="Florida">Florida</option>
              </select>
              <input
                type="text"
                placeholder="Zip Code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="zip-input"
              />
            </div>
          </div>

          {/* Total */}
          <div className="order-total">
            <span className="total-label">Total</span>
            <span className="total-amount">${calculateSubtotal().toFixed(2)}</span>
          </div>

          {/* Checkout Button */}
          <Link to="/checkout">
             <button 
            className="btn-checkout"
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
          >
            Proceed to Checkout
            <ArrowRight size={20} />
          </button>
          </Link>
         
        </aside>
      </div>

      {/* ============================================
          RECOMMENDED PRODUCTS SECTION
          ============================================ */}
      <section className="recommended-section">
        <h2 className="recommended-title">You Might Also Like</h2>
        <div className="recommended-grid">
          {recommendedProducts.map((product) => (
            <div key={product.id} className="recommended-card">
              <div className="recommended-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="recommended-info">
                <h3 className="recommended-name">{product.name}</h3>
                <p className="recommended-price">${product.price.toFixed(2)}</p>
                <button 
                  className="btn-add-to-cart"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================
          FOOTER SECTION
          ============================================ */}
      <footer className="cart-footer">
        <div className="footer-content">
          <div className="footer-column">
            <h3 className="footer-heading">Shop</h3>
            <ul className="footer-links">
              <li><a href="/plants">All Plants</a></li>
              <li><a href="/bonsai">Bonsai</a></li>
              <li><a href="/succulents">Succulents</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3 className="footer-heading">About</h3>
            <ul className="footer-links">
              <li><a href="/story">Our Story</a></li>
              <li><a href="/careers">Careers</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3 className="footer-heading">Support</h3>
            <ul className="footer-links">
              <li><a href="/faqs">FAQs</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/shipping">Shipping & Returns</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3 className="footer-heading">Stay Connected</h3>
            <p className="footer-text">Get updates on new arrivals and special offers.</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="copyright">© 2024 Evergreen. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ShoppingCart;