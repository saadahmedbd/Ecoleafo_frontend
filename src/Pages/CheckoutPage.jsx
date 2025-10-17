import React, { useState } from 'react';
import { Lock, ShoppingCart } from 'lucide-react';
import './CheckoutPage.css';
import { Link, Links } from 'react-router-dom';

/* Checkout page component for processing customer orders */
const CheckoutPage = () => {
  /* Form state management */
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apt: '',
    city: '',
    state: '',
    zipCode: '',
    shippingOption: 'home',
    deliveryMethod: 'standard'
  });

  /* Handle form input changes */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /* Handle form submission */
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Checkout data:', formData);
  };

  return (
    <div className="checkout-page">


      {/* Breadcrumb navigation */}
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/shopping-cart">Cart</Link> / <span>Checkout</span>
      </div>

      <div className="checkout-container">
        {/* Main checkout form */}
        <div className="checkout-form">
          <h2 className="checkout-title">Checkout</h2>

          <form onSubmit={handleSubmit}>
            {/* Section 1: Billing & Shipping Info */}
            <section className="form-section">
              <h3>1. Billing & Shipping Info</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>First name</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Last name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Phone number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
              </div>
            </section>

            {/* Section 2: Shipping Address */}
            <section className="form-section">
              <h3>2. Shipping Address</h3>
              {/* Predefined shipping options */}
              <div className="shipping-options">
                <label className={`shipping-option ${formData.shippingOption === 'home' ? 'selected' : ''}`}>
                  <input type="radio" name="shippingOption" value="home" checked={formData.shippingOption === 'home'} onChange={handleInputChange} />
                  <div>
                    <strong>Home</strong>
                    <span>123 Greenleaf Lane, CA</span>
                  </div>
                </label>
                <label className={`shipping-option ${formData.shippingOption === 'work' ? 'selected' : ''}`}>
                  <input type="radio" name="shippingOption" value="work" checked={formData.shippingOption === 'work'} onChange={handleInputChange} />
                  <div>
                    <strong>Work</strong>
                    <span>456 Business Rd, CA</span>
                  </div>
                </label>
              </div>
              <div className="form-group">
                <label>Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Apt, suite, etc. (optional)</label>
                <input type="text" name="apt" value={formData.apt} onChange={handleInputChange} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Zip code</label>
                  <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required />
                </div>
              </div>
            </section>

            {/* Section 3: Delivery Method */}
            <section className="form-section">
              <h3>3. Delivery Method</h3>
              {/* Standard vs Express delivery */}
              <div className="delivery-options">
                <label className={`delivery-option ${formData.deliveryMethod === 'standard' ? 'selected' : ''}`}>
                  <input type="radio" name="deliveryMethod" value="standard" checked={formData.deliveryMethod === 'standard'} onChange={handleInputChange} />
                  <div>
                    <strong>Standard Delivery</strong>
                    <span>Arrives in 5-7 business days. Free.</span>
                  </div>
                </label>
                <label className={`delivery-option ${formData.deliveryMethod === 'express' ? 'selected' : ''}`}>
                  <input type="radio" name="deliveryMethod" value="express" checked={formData.deliveryMethod === 'express'} onChange={handleInputChange} />
                  <div>
                    <strong>Express Delivery</strong>
                    <span>Arrives in 2-3 business days. $15.00</span>
                  </div>
                </label>
              </div>
            </section>
          </form>
        </div>

        {/* Order summary sidebar */}
        <aside className="order-summary">
          <h3>Order Summary</h3>
          {/* Order item details */}
          <div className="order-item">
            <div className="item-info">
              <strong>Fiddle Leaf Fig</strong>
              <p>Size: Medium</p>
              <p>Qty: 1</p>
            </div>
            <span className="item-price">$79.00</span>
          </div>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>$79.00</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-row">
            <span>Estimated Tax</span>
            <span>$6.54</span>
          </div>
          <div className="summary-total">
            <strong>Total</strong>
            <strong>$85.54</strong>
          </div>
          <button className="btn-payment" onClick={handleSubmit}>
            <Lock size={18} />
            Proceed to Payment
          </button>
        </aside>
      </div>

      {/* Recommended products section
      <section className="recommended">
        <h2>You Might Also Like</h2>
        <div className="recommended-grid">
          {['Monstera Deliciosa', 'Snake Plant', 'ZZ Plant', 'Pothos'].map((name, i) => (
            <div key={i} className="product-card">
              <div className="product-image"></div>
              <h4>{name}</h4>
              <p className="price">${[65, 45, 55, 35][i]}.00</p>
              <button className="btn-add">Add to Cart</button>
            </div>
          ))}
        </div>
      </section> */}
    </div>
  );
};

export default CheckoutPage;
