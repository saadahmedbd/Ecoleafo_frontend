import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Header } from '../Component/Header';
import { Footer } from '../Component/Footer';
import './AllOrders.css';

/* ============================================
   ALL ORDERS COMPONENT
   Display order history with status indicators
   ============================================ */
export function AllOrders  ()  {
  // State for orders - easily replaceable with API data
  const [orders, setOrders] = useState([
    {
      id: '12345',
      date: 'May 15, 2024',
      status: 'Shipped',
      statusColor: 'blue',
      amount: 150.00
    },
    {
      id: '12346',
      date: 'May 10, 2024',
      status: 'Delivered',
      statusColor: 'green',
      amount: 200.00
    },
    {
      id: '12347',
      date: 'May 5, 2024',
      status: 'Cancelled',
      statusColor: 'red',
      amount: 50.00
    },
    {
      id: '12348',
      date: 'April 20, 2024',
      status: 'Delivered',
      statusColor: 'green',
      amount: 120.00
    },
    {
      id: '12349',
      date: 'April 15, 2024',
      status: 'Shipped',
      statusColor: 'blue',
      amount: 180.00
    }
  ]);

  // Handle order click
  const handleOrderClick = (orderId) => {
    console.log('View order details:', orderId);
    // Navigate to order details page
    // window.location.href = `/orders/${orderId}`;
  };

  return (
    <>
        <Header/>
          <div className="all-orders-page">
      <div className="orders-container">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">All Orders</h1>
        </div>

        {/* Orders List */}
        <div className="orders-list">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="order-row"
              onClick={() => handleOrderClick(order.id)}
            >
              {/* Order ID */}
              <div className="order-id">#{order.id}</div>

              {/* Order Date */}
              <div className="order-date">{order.date}</div>

              {/* Order Status */}
              <div className="order-status">
                <span className={`status-indicator ${order.statusColor}`}></span>
                <span className="status-text">{order.status}</span>
              </div>

              {/* Order Amount */}
              <div className="order-amount">${order.amount.toFixed(2)}</div>

              {/* View Details Arrow (optional) */}
              <div className="order-arrow">
                <ChevronRight size={20} />
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3 className="empty-title">No orders yet</h3>
            <p className="empty-text">Your order history will appear here</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="page-footer">
        <p className="footer-text">© 2024 Evergreen. All rights reserved.</p>
      </footer>
    </div>
    </>
  
  );
};

export default AllOrders;