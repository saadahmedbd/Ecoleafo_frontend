// PlantifyDashboard.jsx
import React, { useState } from 'react';
import { 
  Home, 
  Package, 
  User, 
  Heart, 
  HelpCircle, 
  Settings, 
  Eye,
  Leaf 
} from 'lucide-react';
import './BuyerAccountPage.css';
import { Link } from 'react-router-dom';

const PlantifyDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sample data
  const orders = [
    {
      id: '#12345',
      date: 'July 15, 2024',
      plant: 'Fiddle Leaf Fig',
      status: 'Shipped',
      amount: '$75.00',
      statusColor: 'shipped'
    },
    {
      id: '#12346',
      date: 'June 20, 2024',
      plant: 'Snake Plant',
      status: 'Delivered',
      amount: '$120.00',
      statusColor: 'delivered'
    },
    {
      id: '#12347',
      date: 'May 5, 2024',
      plant: 'Monstera Deliciosa',
      status: 'Cancelled',
      amount: '$50.00',
      statusColor: 'cancelled'
    }
  ];

  const wishlistItems = [
    {
      name: 'Japanese Maple',
      image: '🍁'
    },
    {
      name: 'Cherry Blossom',
      image: '🌸'
    },
    {
      name: 'Dogwood',
      image: '🌿'
    }
  ];

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'orders', icon: Package, label: 'Orders' },
    { id: 'account', icon: User, label: 'Account' },
    { id: 'wishlist', icon: Heart, label: 'Wishlist' },
    { id: 'help', icon: HelpCircle, label: 'Help' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  const handleNavItemClick = (itemId) => {
    setActiveSection(itemId);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleUpdateAccount = () => {
    // Handle account update logic here
    console.log('Account updated');
  };

  return (
    <div className="plantify-dashboard">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <Leaf className="logo-icon" />
          <Link to="/" ><span className="logo-text">Tree store</span></Link> 
        </div>
        
        <nav className="sidebar-nav">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => handleNavItemClick(item.id)}
                aria-label={`Navigate to ${item.label}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Mobile Header */}
        <header className="mobile-header">
          <button 
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <div className="hamburger">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
          <div className="mobile-logo">
            <Leaf className="logo-icon" />
            <span>Plantify</span>
          </div>
        </header>

        <div className="content-wrapper">
          <h1 className="page-title">My Account</h1>

          {/* Order History Section */}
          <section className="section">
            <div className="section-header">
              <h2>Order History</h2>
              <button className="view-all-btn" aria-label="View all orders">
                <Eye size={16} />
                View all
              </button>
            </div>

            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-image">
                    <div className="plant-icon">🌱</div>
                  </div>
                  <div className="order-details">
                    <div className="order-info">
                      <h3>Order {order.id}</h3>
                      <p className="order-date">{order.date}</p>
                      <p className="plant-name">{order.plant}</p>
                    </div>
                    <div className="order-status">
                      <span className={`status-badge ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="order-amount">
                    {order.amount}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Account Settings Section */}
          <section className="section">
            <h2>Account Settings</h2>
            
            <div className="account-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input 
                    id="name"
                    type="text" 
                    defaultValue="John Doe"
                    aria-label="Full name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input 
                    id="email"
                    type="email" 
                    defaultValue="john.doe@example.com"
                    aria-label="Email address"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input 
                    id="phone"
                    type="tel" 
                    defaultValue="(123) 456-7890"
                    aria-label="Phone number"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input 
                    id="address"
                    type="text" 
                    defaultValue="123 Green Lane, Plant City, FL"
                    aria-label="Address"
                  />
                </div>
              </div>
              
              <button 
                className="update-btn"
                onClick={handleUpdateAccount}
                aria-label="Update account information"
              >
                Update Account
              </button>
            </div>
          </section>

          {/* Wishlist Section */}
          <section className="section">
            <h2>Wishlist</h2>
            
            <div className="wishlist-grid">
              {wishlistItems.map((item, index) => (
                <div 
                  key={index} 
                  className="wishlist-card"
                  tabIndex={0}
                  role="button"
                  aria-label={`View ${item.name}`}
                >
                  <div className="wishlist-image">
                    <span 
                      className="plant-emoji" 
                      role="img" 
                      aria-label={item.name}
                    >
                      {item.image}
                    </span>
                  </div>
                  <h3 className="wishlist-name">{item.name}</h3>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PlantifyDashboard;