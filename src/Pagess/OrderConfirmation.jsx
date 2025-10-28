import React from 'react';
import { Check } from 'lucide-react';
import './OrderConfirmation.css';
import { Link } from 'react-router-dom';

/* ============================================
   ORDER CONFIRMATION PAGE COMPONENT
   Success page with order details and summary
   ============================================ */
export function OrderConfirmation ()  {
  // Mock order data - easily replaceable with API data
  const orderData = {
    orderId: '#123456789',
    estimatedDelivery: 'June 15, 2024',
    items: [
      {
        id: 1,
        name: 'Japanese Maple',
        quantity: 1,
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=150'
      },
      {
        id: 2,
        name: 'White Birch',
        quantity: 2,
        price: 39.99,
        image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=150'
      },
      {
        id: 3,
        name: 'Planting Kit',
        quantity: 1,
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=150'
      }
    ],
    subtotal: 149.96,
    shipping: 9.99,
    tax: 12.75,
    total: 172.70
  };

  // Handle track order button
  const handleTrackOrder = () => {
    console.log('Tracking order:', orderData.orderId);
    alert(`Tracking order ${orderData.orderId}`);
  };

  return (
    <div className="confirmation-page">
      {/* ============================================
          SUCCESS ICON AND HEADER
          ============================================ */}
      <div className="success-header">
        <div className="success-icon">
          <Check size={48} strokeWidth={3} />
        </div>
        <h1 className="success-title">Thank you for your order!</h1>
        <p className="success-message">
          Your order will be shipped soon. Please prepare the exact amount for cash on delivery.
        </p>
      </div>

      {/* ============================================
          ORDER INFO CARDS
          ============================================ */}
      <div className="order-info-cards">
        <div className="info-card">
          <p className="info-label">Order ID</p>
          <p className="info-value">{orderData.orderId}</p>
        </div>
        <div className="info-card">
          <p className="info-label">Estimated Delivery</p>
          <p className="info-value">{orderData.estimatedDelivery}</p>
        </div>
      </div>

      {/* ============================================
          ORDER SUMMARY SECTION
          ============================================ */}
      <div className="order-summary-section">
        <h2 className="summary-heading">Order Summary</h2>

        {/* Order Items Table */}
        <div className="order-table">
          {/* Table Header */}
          <div className="table-header">
            <div className="header-item">ITEM</div>
            <div className="header-quantity">QUANTITY</div>
            <div className="header-price">PRICE</div>
          </div>

          {/* Table Body - Order Items */}
          <div className="table-body">
            {orderData.items.map((item) => (
              <div key={item.id} className="table-row">
                <div className="item-cell">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <span className="item-name">{item.name}</span>
                </div>
                <div className="quantity-cell">{item.quantity}</div>
                <div className="price-cell">${item.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Totals */}
        <div className="order-totals">
          <div className="total-row">
            <span className="total-label">Subtotal</span>
            <span className="total-value">${orderData.subtotal.toFixed(2)}</span>
          </div>
          <div className="total-row">
            <span className="total-label">Shipping</span>
            <span className="total-value">${orderData.shipping.toFixed(2)}</span>
          </div>
          <div className="total-row">
            <span className="total-label">Tax</span>
            <span className="total-value">${orderData.tax.toFixed(2)}</span>
          </div>
          <div className="total-row final-total">
            <span className="total-label-bold">Total (Cash on Delivery)</span>
            <span className="total-value-bold">${orderData.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* ============================================
          TRACK ORDER BUTTON
          ============================================ */}
      <div className="action-container">
        <Link to="/order-tracking">
           <button 
          className="btn-track-order"
          
        >
          Track Order
        </button>
        </Link>
       
      </div>

     
    </div>
  );
};

export default OrderConfirmation;