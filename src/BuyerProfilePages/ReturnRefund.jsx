import React, { useState } from 'react';
import './ReturnRefund.css';

export function ReturnRefund ()  {
  const [requests] = useState([
    {
      id: 1,
      orderNumber: '#789012',
      item: 'Maple Tree Sapling',
      status: 'Pending',
      requestedOn: 'July 16, 2024'
    },
    {
      id: 2,
      orderNumber: '#345678',
      item: 'Oak Tree Seedlings',
      status: 'Approved',
      requestedOn: 'July 10, 2024'
    },
    {
      id: 3,
      orderNumber: '#901234',
      item: 'Birch Tree',
      status: 'Completed',
      requestedOn: 'June 25, 2024'
    }
  ]);

  const getStatusClass = (status) => {
    switch(status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'approved':
        return 'status-approved';
      case 'completed':
        return 'status-completed';
      default:
        return '';
    }
  };

  return (
    <div className="return-refund-container">
      <h1 className="page-title">Return / Refund Requests</h1>
      
      {/* Initiate New Request Section */}
      <section className="new-request-section">
        <h2 className="section-title">Initiate a New Request</h2>
        
        <div className="order-card">
          <div className="order-info">
            <h3 className="order-number">Order #123456</h3>
            <p className="order-details">Date: July 15, 2024 | Total: $150</p>
            <button className="request-button">
              Request Return / Refund
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
          <div className="order-image">
            <img 
              src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&h=300&fit=crop" 
              alt="Plant sapling" 
            />
          </div>
        </div>
      </section>

      {/* Manage Existing Requests Section */}
      <section className="existing-requests-section">
        <h2 className="section-title">Manage Existing Requests</h2>
        
        <div className="requests-table-container">
          <table className="requests-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Item</th>
                <th>Status</th>
                <th>Requested On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td className="order-col">{request.orderNumber}</td>
                  <td className="item-col">{request.item}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="date-col">{request.requestedOn}</td>
                  <td>
                    <button className="view-details-button">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ReturnRefund;