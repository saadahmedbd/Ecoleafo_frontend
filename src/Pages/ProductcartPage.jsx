import React, { useState } from 'react';
import { ShoppingCart, Search, User, Minus, Plus, Trash2, ArrowLeft, Lock,  } from 'lucide-react';
import { Link } from 'react-router-dom';

import './ProductCartPage.css';
export function ProductcartPage () {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Miniature Pine',
      description: 'A beautiful, low-maintenance bonsai.',
      price: 25.00,
      quantity: 1,
      image: '/api/placeholder/150/150'
    },
    {
      id: 2,
      name: 'Dwarf Oak',
      description: 'Symbol of strength and endurance.',
      price: 30.00,
      quantity: 2,
      image: '/api/placeholder/150/150'
    }
  ]);

  const [suggestedItems] = useState([
    {
      id: 3,
      name: 'Japanese Maple',
      scientificName: 'Acer palmatum',
      price: 75.00,
      image: '/api/placeholder/300/300'
    },
    {
      id: 4,
      name: 'Weeping Willow',
      scientificName: 'Salix babylonica',
      price: 60.00,
      image: '/api/placeholder/300/300'
    },
    {
      id: 5,
      name: 'Cherry Blossom',
      scientificName: 'Prunus serrulata',
      price: 90.00,
      image: '/api/placeholder/300/300'
    },
    {
      id: 6,
      name: 'Ginkgo Biloba',
      scientificName: 'Maidenhair Tree',
      price: 55.00,
      image: '/api/placeholder/300/300'
    }
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) return;
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 10.00;
  const total = subtotal + shipping;

  return (
    <div className="evergreen-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon"></div>
            <Link to="/"><h1>Tree store</h1></Link>            
          </div>
          
          <nav className="nav">
            <Link to="/"><a href="#" className="nav-link">Shop</a></Link>
            <a href="#" className="nav-link">About</a>
            <a href="#" className="nav-link">Contact</a>
          </nav>
          
          <div className="header-actions">
            <button className="icon-btn">
              <Search size={20} />
            </button>
            <button className="icon-btn cart-btn">
              <ShoppingCart size={20} />
              <span className="cart-badge">{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </button>
            <button className="icon-btn">
              <User size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="cart-layout">
            {/* Cart Items */}
            <div className="cart-section">
              <h2 className="cart-title">Your Cart</h2>
              
              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <div className="cart-items">
                  {cartItems.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="item-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      
                      <div className="item-details">
                        <h3 className="item-name">{item.name}</h3>
                        <p className="item-description">{item.description}</p>
                        <div className="item-price">${item.price.toFixed(2)}</div>
                      </div>
                      
                      <div className="item-controls">
                        <div className="quantity-controls">
                          <button 
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="quantity">{item.quantity}</span>
                          <button 
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        <button 
                          className="remove-btn"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
             <Link to="/"> <button className="continue-shopping">
                <ArrowLeft size={16} />
                Continue Shopping
              </button>
              </Link>
            </div>

            {/* Order Summary */}
            <div className="summary-section">
              <div className="order-summary">
                <h3 className="summary-title">Order Summary</h3>
                
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="summary-row">
                  <span>Estimated Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                
                <div className="summary-row total-row">
                  <span>Grand Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                
                <button className="checkout-btn" disabled={cartItems.length === 0}>
                  <Lock size={16} />
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>

          {/* Suggested Items */}
          <section className="suggestions-section">
            <h2 className="suggestions-title">You might also like</h2>
            
            <div className="suggestions-grid">
              {suggestedItems.map(item => (
                <div key={item.id} className="suggestion-card">
                  <div className="suggestion-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="suggestion-content">
                    <h4 className="suggestion-name">{item.name}</h4>
                    <p className="suggestion-scientific">{item.scientificName}</p>
                    <div className="suggestion-price">${item.price.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ProductcartPage;