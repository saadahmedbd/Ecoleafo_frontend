import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import './PaymentMethod.css';
import { Link } from 'react-router-dom';

/* ============================================
   PAYMENT METHOD PAGE COMPONENT
   Payment selection with recommended products
   ============================================ */
export function PaymentMethod  ()  {
  // State for selected payment method
  const [selectedPayment, setSelectedPayment] = useState('nagad');

  // Payment methods data
  const paymentMethods = [
    { id: 'nagad', label: 'Mobile Banking (Nagad)' },
    { id: 'bkash', label: 'Mobile Banking (Bkash)' },
    { id: 'rocket', label: 'Mobile Banking (Rocket)' },
    { id: 'cod', label: 'Cash on Delivery' }
  ];

 
  // Handle payment method selection
  const handlePaymentChange = (paymentId) => {
    setSelectedPayment(paymentId);
  };

  // Handle continue button
  const handleContinue = () => {
    const selectedMethod = paymentMethods.find(method => method.id === selectedPayment);
    console.log('Selected payment method:', selectedMethod);
    alert(`Proceeding with ${selectedMethod.label}`);
  };

  // Handle add to cart from recommendations
  const handleAddToCart = (product) => {
    console.log('Adding to cart:', product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="payment-page">
      {/* ============================================
          BREADCRUMB NAVIGATION
          ============================================ */}
      <nav className="breadcrumb-nav">
        <Link to={"/"} className="breadcrumb-link">Home</Link>
        <ChevronRight size={16} className="breadcrumb-separator" />
        <Link to={"/shopping-cart"} className="breadcrumb-link">Cart</Link>
        <ChevronRight size={16} className="breadcrumb-separator" />
        <span className="breadcrumb-current">Payment Method</span>
      </nav>

      {/* ============================================
          PAYMENT METHOD SECTION
          ============================================ */}
      <div className="payment-container">
        <h1 className="page-title">Payment Method</h1>

        <div className="payment-options">
          {paymentMethods.map((method) => (
            <label
              key={method.id}
              className={`payment-option ${selectedPayment === method.id ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="payment"
                value={method.id}
                checked={selectedPayment === method.id}
                onChange={() => handlePaymentChange(method.id)}
                className="payment-radio"
              />
              <span className="radio-custom"></span>
              <span className="payment-label">{method.label}</span>
            </label>
          ))}
        </div>

        <div className="button-container">
          <Link to="/order-confirmation">
            <button className="btn-continue">
              Continue
            </button>
          </Link>
        </div>
      </div>



    
    </div>
  );
};

export default PaymentMethod;