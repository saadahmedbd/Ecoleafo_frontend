import React, { useState, useEffect } from 'react';
import './CancelledOrders.css';

/**
 * CancelledOrders Component
 * Displays a list of cancelled orders with pagination
 * Ready for backend API integration
 */
export function CancelledOrders  ()  {
  // State management for orders data
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(3);
  const [itemsPerPage] = useState(5);
  const [totalResults, setTotalResults] = useState(5);

  /**
   * Mock data - Replace with API call
   * Example API endpoint: GET /api/orders/cancelled?page=1&limit=5
   */
  const mockOrders = [
    {
      id: '12345',
      date: 'July 15, 2024',
      items: 2,
      total: 50.00,
      status: 'Cancelled'
    },
    {
      id: '67890',
      date: 'June 20, 2024',
      items: 1,
      total: 25.00,
      status: 'Cancelled'
    },
    {
      id: '11223',
      date: 'May 5, 2024',
      items: 3,
      total: 75.00,
      status: 'Cancelled'
    },
    {
      id: '44556',
      date: 'April 10, 2024',
      items: 1,
      total: 20.00,
      status: 'Cancelled'
    },
    {
      id: '77889',
      date: 'March 1, 2024',
      items: 2,
      total: 40.00,
      status: 'Cancelled'
    }
  ];

  /**
   * Fetch orders from backend
   * TODO: Replace with actual API call
   */
  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const fetchOrders = async (page) => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/orders/cancelled?page=${page}&limit=${itemsPerPage}`);
      // const data = await response.json();
      // setOrders(data.orders);
      // setTotalPages(data.totalPages);
      // setTotalResults(data.totalResults);
      
      // Mock delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      setOrders(mockOrders);
      setTotalResults(mockOrders.length);
      
    } catch (err) {
      setError('Failed to load orders. Please try again later.');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle viewing order details
   * @param {string} orderId - The ID of the order to view
   */
  const handleViewDetails = (orderId) => {
    // TODO: Navigate to order details page or open modal
    // Example: navigate(`/orders/${orderId}`);
    console.log('View details for order:', orderId);
  };

  /**
   * Handle pagination
   * @param {number} page - Page number to navigate to
   */
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top of table
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /**
   * Format currency
   * @param {number} amount - Amount to format
   * @returns {string} Formatted currency string
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  /**
   * Generate pagination numbers
   * @returns {Array} Array of page numbers to display
   */
  const getPaginationNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="cancelled-orders-container">
      {/* Page Header */}
      <header className="page-header">
        <h1 className="page-title">Cancelled Orders</h1>
        <p className="page-subtitle">A list of your cancelled orders.</p>
      </header>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {/* Orders Table */}
      <section className="orders-section">
        <div className="table-container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <p>No cancelled orders found.</p>
            </div>
          ) : (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="order-id">#{order.id}</td>
                    <td className="order-date">{order.date}</td>
                    <td className="order-items">{order.items}</td>
                    <td className="order-total">{formatCurrency(order.total)}</td>
                    <td>
                      <span className="status-badge status-cancelled">
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="view-details-btn"
                        onClick={() => handleViewDetails(order.id)}
                        aria-label={`View details for order ${order.id}`}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Section */}
        {!loading && orders.length > 0 && (
          <div className="pagination-section">
            <p className="results-info">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, totalResults)} of{' '}
              {totalResults} results
            </p>

            <div className="pagination-controls">
              {/* Previous Button */}
              <button
                className="pagination-btn pagination-arrow"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Page Numbers */}
              {getPaginationNumbers().map((page) => (
                <button
                  key={page}
                  className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => handlePageChange(page)}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                className="pagination-btn pagination-arrow"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default CancelledOrders;