import React from 'react';
import { Package, Truck, MapPin, ChevronRight } from 'lucide-react';
import './OrderTracking.css';
import { Header } from '../Component/Header';


/* ============================================
   ORDER TRACKING PAGE COMPONENT
   Track order status with shipping progress and summary
   ============================================ */
export function OrderTracking () {
  // Mock order data - easily replaceable with API data
  const orderData = {
    orderId: '#12345',
    placedDate: 'July 15, 2024',
    currentStatus: 'processing', // processing, shipped, delivered
    statusHistory: [
      {
        id: 1,
        status: 'processing',
        title: 'Processing',
        description: 'Your order is being processed.',
        date: 'July 15, 2024',
        completed: true,
        icon: Package
      },
      {
        id: 2,
        status: 'shipped',
        title: 'Shipped',
        description: 'Your order has been shipped.',
        date: null,
        completed: false,
        icon: Truck
      },
      {
        id: 3,
        status: 'delivered',
        title: 'Delivered',
        description: 'Your order has been delivered.',
        date: null,
        completed: false,
        icon: MapPin
      }
    ],
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
        quantity: 1,
        price: 39.99,
        image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=150'
      }
    ],
    subtotal: 89.98,
    shipping: 9.99,
    tax: 7.20,
    total: 107.17
  };

  return (
    <div className="tracking-page">
      
      <Header/>
      {/* ============================================
          BREADCRUMB NAVIGATION
          ============================================ */}
      <nav className="breadcrumb-navigation">
        <a href="/" className="breadcrumb-link">Home</a>
        <ChevronRight size={16} className="breadcrumb-separator" />
        <a href="/orders" className="breadcrumb-link">Orders</a>
        <ChevronRight size={16} className="breadcrumb-separator" />
        <span className="breadcrumb-current">Order {orderData.orderId}</span>
      </nav>

      {/* ============================================
          ORDER HEADER
          ============================================ */}
      <div className="order-header">
        <h2 className="order-title">Order {orderData.orderId}</h2>
        <p className="order-date">Placed on {orderData.placedDate}</p>
      </div>

      {/* ============================================
          MAIN CONTENT
          ============================================ */}
      <div className="tracking-container">
        {/* Shipping Progress Section */}
        <div className="shipping-progress-section">
          <h3 className="section-heading">Shipping Progress</h3>

          <div className="progress-timeline">
            {orderData.statusHistory.map((status, index) => {
              const IconComponent = status.icon;
              const isLast = index === orderData.statusHistory.length - 1;
              
              return (
                <div key={status.id} className="timeline-item">
                  <div className="timeline-marker">
                    <div className={`status-icon ${status.completed ? 'completed' : 'pending'}`}>
                      <IconComponent size={24} />
                    </div>
                    {!isLast && (
                      <div className={`timeline-line ${status.completed ? 'completed' : 'pending'}`}></div>
                    )}
                  </div>
                  <div className="timeline-content">
                    <h4 className="status-title">{status.title}</h4>
                    <p className="status-description">{status.description}</p>
                    {status.date && (
                      <p className="status-date">{status.date}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="order-summary-section">
          <h3 className="section-heading">Order Summary</h3>

          {/* Order Items Table */}
          <div className="summary-table">
            {/* Table Header */}
            <div className="table-header-row">
              <div className="header-cell item-header">ITEM</div>
              <div className="header-cell quantity-header">QUANTITY</div>
              <div className="header-cell price-header">PRICE</div>
            </div>

            {/* Table Body */}
            <div className="table-body">
              {orderData.items.map((item) => (
                <div key={item.id} className="table-data-row">
                  <div className="item-data-cell">
                    <div className="item-image-container">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <span className="item-name-text">{item.name}</span>
                  </div>
                  <div className="quantity-data-cell">{item.quantity}</div>
                  <div className="price-data-cell">${item.price.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Totals */}
          <div className="summary-totals">
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
            <div className="total-row final-row">
              <span className="total-label-bold">Total</span>
              <span className="total-value-bold">${orderData.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default OrderTracking;