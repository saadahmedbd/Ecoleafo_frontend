import React, { useState, useEffect } from 'react';
import { Header } from '../Component/Header';
import { BuyerSidebar } from '../Component/BuyerSidebar';
import './Dashboard.css';

/**
 * Dashboard Component
 * Main user dashboard with account overview, orders, wallet, coupons, and notifications
 * Ready for backend API integration
 */
export function Dashboard  ()  {
  // User state
  const [user, setUser] = useState({
    name: 'Sophia Carter',
    email: 'sophia.carter@email.com'
  });

  // Dashboard statistics state
  const [stats, setStats] = useState({
    totalOrders: 25,
    pendingOrders: 3,
    deliveredOrders: 20,
    cancelledOrders: 2
  });

  // Recent orders state
  const [recentOrders, setRecentOrders] = useState([]);
  
  // Wallet state
  const [wallet, setWallet] = useState({
    balance: 250.00
  });

  // Wishlist state
  const [wishlist, setWishlist] = useState([]);

  // Coupons state
  const [coupons, setCoupons] = useState([]);

  // Notifications state
  const [notifications, setNotifications] = useState([]);

  // Loading states
  const [loading, setLoading] = useState(false);

  /**
   * Mock data for demonstration
   * TODO: Replace with actual API calls
   */
  const mockRecentOrders = [
    {
      id: '12345',
      product: 'Japanese Maple',
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=100&h=100&fit=crop',
      date: '2024-07-20',
      amount: 75.00,
      status: 'Delivered'
    },
    {
      id: '12346',
      product: 'Cherry Blossom',
      image: 'https://images.unsplash.com/photo-1522057306775-665d5817ecf2?w=100&h=100&fit=crop',
      date: '2024-07-15',
      amount: 120.00,
      status: 'Delivered'
    },
    {
      id: '12347',
      product: 'Bonsai Tree',
      image: 'https://images.unsplash.com/photo-1603614428142-159eb6868665?w=100&h=100&fit=crop',
      date: '2024-07-10',
      amount: 50.00,
      status: 'Cancelled'
    }
  ];

  const mockWishlist = [
    {
      id: 1,
      name: 'Dwarf Citrus Tree',
      price: 45.00,
      image: 'https://images.unsplash.com/photo-1557800634-7bf3c7305596?w=100&h=100&fit=crop'
    },
    {
      id: 2,
      name: 'Olive Tree',
      price: 80.00,
      image: 'https://images.unsplash.com/photo-1591958911259-bee2173bdfc5?w=100&h=100&fit=crop'
    },
    {
      id: 3,
      name: 'Lavender Bush',
      price: 25.00,
      image: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=100&h=100&fit=crop'
    }
  ];

  const mockCoupons = [
    {
      id: 1,
      title: '10% off on all trees',
      validUntil: '31 Aug 2024',
      image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=250&fit=crop'
    },
    {
      id: 2,
      title: '20% off on all plants',
      validUntil: '15 Sep 2024',
      image: 'https://images.unsplash.com/photo-1463620910506-d0458143143e?w=400&h=250&fit=crop'
    },
    {
      id: 3,
      title: 'Free shipping',
      validUntil: '30 Sep 2024',
      image: 'https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?w=400&h=250&fit=crop'
    }
  ];

  const mockNotifications = [
    {
      id: 1,
      type: 'delivery',
      message: 'Your order #12345 has been delivered',
      time: '2 hours ago',
      icon: '📦'
    },
    {
      id: 2,
      type: 'coupon',
      message: 'New coupon available: 10% off',
      time: '1 day ago',
      icon: '🏷️'
    }
  ];

  /**
   * Fetch dashboard data on component mount
   * TODO: Replace with actual API calls
   */
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API calls
      // const [ordersRes, walletRes, wishlistRes, couponsRes, notificationsRes] = await Promise.all([
      //   fetch('/api/orders/recent'),
      //   fetch('/api/wallet'),
      //   fetch('/api/wishlist'),
      //   fetch('/api/coupons/active'),
      //   fetch('/api/notifications')
      // ]);
      
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setRecentOrders(mockRecentOrders);
      setWishlist(mockWishlist);
      setCoupons(mockCoupons);
      setNotifications(mockNotifications);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle viewing order details
   * @param {string} orderId - Order ID
   */
  const handleViewOrderDetails = (orderId) => {
    // TODO: Navigate to order details page
    console.log('View order:', orderId);
  };

  /**
   * Handle adding money to wallet
   */
  const handleAddMoney = () => {
    // TODO: Open add money modal
    console.log('Add money to wallet');
  };

  /**
   * Handle viewing transactions
   */
  const handleViewTransactions = () => {
    // TODO: Navigate to transactions page
    console.log('View transactions');
  };

  /**
   * Handle applying coupon
   * @param {string} couponId - Coupon ID
   */
  const handleApplyCoupon = (couponId) => {
    // TODO: Apply coupon logic
    console.log('Apply coupon:', couponId);
  };

  /**
   * Handle adding item to cart from wishlist
   * @param {number} itemId - Wishlist item ID
   */
  const handleAddToCart = (itemId) => {
    // TODO: Add to cart logic
    console.log('Add to cart:', itemId);
  };

  /**
   * Format currency
   * @param {number} amount - Amount to format
   * @returns {string} Formatted currency
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  /**
   * Format date
   * @param {string} dateString - Date string
   * @returns {string} Formatted date
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  /**
   * Get status class
   * @param {string} status - Order status
   * @returns {string} CSS class name
   */
  const getStatusClass = (status) => {
    switch(status.toLowerCase()) {
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      case 'pending':
        return 'status-pending';
      default:
        return '';
    }
  };

  return (
    <>
      <Header />
      <div className="dashboard-wrapper">
        <BuyerSidebar />
        <div className="dashboard-container">
      {/* Welcome Section */}
      <section className="welcome-section">
        <h1 className="welcome-title">
          Welcome back, {user.name.split(' ')[0]} 👋
        </h1>
        <p className="welcome-subtitle">Here's what's happening with your account today.</p>
      </section>

      {/* Statistics Cards */}
      <section className="stats-section">
        <div className="stat-card">
          <p className="stat-label">Total Orders</p>
          <h2 className="stat-value">{stats.totalOrders}</h2>
        </div>
        <div className="stat-card">
          <p className="stat-label">Pending Orders</p>
          <h2 className="stat-value">{stats.pendingOrders}</h2>
        </div>
        <div className="stat-card">
          <p className="stat-label">Delivered Orders</p>
          <h2 className="stat-value">{stats.deliveredOrders}</h2>
        </div>
        <div className="stat-card">
          <p className="stat-label">Cancelled Orders</p>
          <h2 className="stat-value">{stats.cancelledOrders}</h2>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="left-column">
          {/* Recent Orders */}
          <section className="dashboard-card recent-orders-card">
            <h3 className="card-title">Recent Orders</h3>
            <div className="orders-table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Product</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="order-id">#{order.id}</td>
                      <td className="product-cell">
                        <div className="product-info">
                          <img src={order.image} alt={order.product} className="product-image" />
                          <span>{order.product}</span>
                        </div>
                      </td>
                      <td className="order-date">{formatDate(order.date)}</td>
                      <td className="order-amount">{formatCurrency(order.amount)}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="view-details-btn"
                          onClick={() => handleViewOrderDetails(order.id)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Wallet Summary */}
          <section className="dashboard-card wallet-card">
            <div className="wallet-content">
              <div className="wallet-info">
                <h3 className="card-title">Wallet Summary</h3>
                <p className="wallet-label">Current Balance</p>
                <h2 className="wallet-balance">{formatCurrency(wallet.balance)}</h2>
                <div className="wallet-actions">
                  <button className="btn-primary" onClick={handleAddMoney}>
                    Add Money
                  </button>
                  <button className="btn-secondary" onClick={handleViewTransactions}>
                    View Transactions
                  </button>
                </div>
              </div>
              <div className="wallet-illustration">
                <div className="wallet-icon">
                  <svg viewBox="0 0 200 200" fill="none">
                    <rect x="50" y="80" width="100" height="70" rx="8" fill="#8B7355"/>
                    <rect x="55" y="85" width="90" height="60" rx="6" fill="#A0826D"/>
                    <rect x="60" y="110" width="30" height="20" rx="3" fill="#6B5744"/>
                  </svg>
                </div>
              </div>
            </div>
          </section>

          {/* Active Coupons */}
          <section className="dashboard-card coupons-card">
            <h3 className="card-title">Active Coupons / Offers</h3>
            <div className="coupons-grid">
              {coupons.map((coupon) => (
                <div key={coupon.id} className="coupon-item">
                  <div className="coupon-image">
                    <img src={coupon.image} alt={coupon.title} />
                  </div>
                  <div className="coupon-info">
                    <h4 className="coupon-title">{coupon.title}</h4>
                    <p className="coupon-validity">Valid until: {coupon.validUntil}</p>
                    <button 
                      className="btn-apply"
                      onClick={() => handleApplyCoupon(coupon.id)}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Wishlist Preview */}
          <section className="dashboard-card wishlist-card">
            <h3 className="card-title">Wishlist Preview</h3>
            <div className="wishlist-items">
              {wishlist.map((item) => (
                <div key={item.id} className="wishlist-item">
                  <img src={item.image} alt={item.name} className="wishlist-image" />
                  <div className="wishlist-info">
                    <h4 className="wishlist-name">{item.name}</h4>
                    <p className="wishlist-price">{formatCurrency(item.price)}</p>
                  </div>
                  <button 
                    className="btn-cart"
                    onClick={() => handleAddToCart(item.id)}
                    aria-label="Add to cart"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M7 18C7.55228 18 8 17.5523 8 17C8 16.4477 7.55228 16 7 16C6.44772 16 6 16.4477 6 17C6 17.5523 6.44772 18 7 18Z" fill="currentColor"/>
                      <path d="M16 18C16.5523 18 17 17.5523 17 17C17 16.4477 16.5523 16 16 16C15.4477 16 15 16.4477 15 17C15 17.5523 15.4477 18 16 18Z" fill="currentColor"/>
                      <path d="M2 2H3.5L5.5 13H16.5L18.5 6H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Notifications */}
          <section className="dashboard-card notifications-card">
            <h3 className="card-title">Notifications</h3>
            <div className="notifications-list">
              {notifications.map((notification) => (
                <div key={notification.id} className="notification-item">
                  <div className="notification-icon">
                    <span>{notification.icon}</span>
                  </div>
                  <div className="notification-content">
                    <p className="notification-message">{notification.message}</p>
                    <span className="notification-time">{notification.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      </div>
    </div>
    </>
  );
};

export default Dashboard;