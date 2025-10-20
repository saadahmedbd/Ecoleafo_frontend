import React from 'react';
import { CheckCircle, Package, Truck, Home } from 'lucide-react';
import './TrackOrder.css';

/* ============================================
   TRACK ORDER COMPONENT
   Display order tracking with progress timeline
   ============================================ */
export function TrackOrder  () {
  // Order data - easily replaceable with API data
  const orderData = {
    orderId: '123456789',
    placedDate: 'July 14, 2024',
    shippingAddress: '123 Maple Street, Anytown, CA 91234',
    paymentMethod: 'Credit Card ending in **** 1234',
    total: 125.00,
    currentStatus: 'shipped', // 'placed', 'shipped', 'delivered'
    timeline: [
      {
        id: 1,
        status: 'placed',
        label: 'Order Placed',
        date: 'July 14, 2024',
        icon: CheckCircle,
        completed: true
      },
      {
        id: 2,
        status: 'shipped',
        label: 'Shipped',
        date: 'July 16, 2024',
        icon: Truck,
        completed: true
      },
      {
        id: 3,
        status: 'delivered',
        label: 'Delivered',
        date: 'Est: July 18, 2024',
        icon: Home,
        completed: false
      }
    ],
    items: [
      {
        id: 1,
        name: 'Japanese Maple',
        quantity: 1,
        price: 75.00,
        image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=150'
      },
      {
        id: 2,
        name: 'Rose Bush',
        quantity: 2,
        price: 50.00,
        image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=150'
      }
    ]
  };

  // Get status index
  const getStatusIndex = (status) => {
    return orderData.timeline.findIndex(item => item.status === status);
  };

  const currentStatusIndex = getStatusIndex(orderData.currentStatus);

  return (
    <div className="track-order-page">
      <div className="track-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <a href="/dashboard" className="breadcrumb-link">Dashboard</a>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Track Order</span>
        </nav>

        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Track Your Order</h1>
          <p className="page-subtitle">
            Follow the journey of your purchase from our nursery to your doorstep.
          </p>
        </div>

        {/* Order Tracking Card */}
        <div className="tracking-card">
          {/* Order Header */}
          <div className="order-header">
            <h2 className="order-number">Order #{orderData.orderId}</h2>
            <p className="order-placed">Placed on: {orderData.placedDate}</p>
          </div>

          {/* Progress Timeline */}
          <div className="progress-timeline">
            {orderData.timeline.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = step.completed;
              const isLast = index === orderData.timeline.length - 1;

              return (
                <div key={step.id} className="timeline-step">
                  <div className="timeline-marker">
                    <div className={`step-icon ${isCompleted ? 'completed' : 'pending'}`}>
                      <StepIcon size={24} />
                    </div>
                    {!isLast && (
                      <div className={`timeline-connector ${isCompleted ? 'completed' : 'pending'}`}></div>
                    )}
                  </div>
                  <div className="timeline-content">
                    <h3 className="step-label">{step.label}</h3>
                    <p className="step-date">{step.date}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Details */}
          <div className="order-details-section">
            <h3 className="section-heading">Order Details</h3>
            <div className="details-grid">
              <div className="detail-item">
                <p className="detail-label">Shipping Address</p>
                <p className="detail-value">{orderData.shippingAddress}</p>
              </div>
              <div className="detail-item">
                <p className="detail-label">Payment Method</p>
                <p className="detail-value">{orderData.paymentMethod}</p>
              </div>
              <div className="detail-item">
                <p className="detail-label">Order Total</p>
                <p className="detail-value total">${orderData.total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="order-items-section">
            <h3 className="section-heading">Items in Your Order</h3>
            <div className="items-list">
              {orderData.items.map((item) => (
                <div key={item.id} className="item-row">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h4 className="item-name">{item.name}</h4>
                    <p className="item-quantity">Qty: {item.quantity}</p>
                  </div>
                  <div className="item-price">${item.price.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;