import React, { useState } from 'react';
import {
  User, MapPin, CreditCard, Shield, ShoppingBag, Package, RotateCcw, 
  XCircle, Heart, AlertCircle, ShoppingCart, Bookmark, MessageCircle, 
  Bell, Wallet, Receipt, Gift, Tag, FileText, Download, Lock, 
  Settings, HelpCircle, Phone, AlertTriangle, LogOut, ChevronDown, 
  ChevronRight, X
} from 'lucide-react';
import './BuyerSidebar.css';

/* ============================================
   BUYER SIDEBAR COMPONENT
   Complete sidebar for buyer role with collapsible sections
   ============================================ */
export function BuyerSidebar () {
  // State for mobile sidebar
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState({
    account: true,
    orders: false,
    wishlist: false,
    cart: false,
    messages: false,
    payment: false,
    coupons: false,
    invoices: false,
    privacy: false,
    support: false
  });

  // Active menu item state
  const [activeItem, setActiveItem] = useState('profile');

  // User data - replace with actual user data from backend
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://i.pravatar.cc/150?img=12'
  };

  // Toggle section expand/collapse
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle menu item click
  const handleMenuClick = (itemKey) => {
    setActiveItem(itemKey);
    setIsMobileOpen(false);
    console.log('Navigating to:', itemKey);
    // Add navigation logic here
  };

  // Handle logout
  const handleLogout = () => {
    console.log('Logging out...');
    if (window.confirm('Are you sure you want to logout?')) {
      // Add logout logic here
      alert('Logged out successfully!');
    }
  };

  // Menu structure
  const menuSections = [
    {
      key: 'account',
      title: 'My Account',
      icon: User,
      items: [
        { key: 'profile', label: 'Profile Information', icon: User },
        { key: 'addresses', label: 'Manage Addresses', icon: MapPin },
        { key: 'payment-methods', label: 'Payment Methods', icon: CreditCard },
        { key: 'security', label: 'Security Settings', icon: Shield }
      ]
    },
    {
      key: 'orders',
      title: 'My Orders',
      icon: ShoppingBag,
      items: [
        { key: 'all-orders', label: 'All Orders', icon: Package },
        { key: 'track-order', label: 'Track Order', icon: MapPin },
        { key: 'returns', label: 'Return / Refund Requests', icon: RotateCcw },
        { key: 'cancelled', label: 'Cancelled Orders', icon: XCircle }
      ]
    },
    {
      key: 'wishlist',
      title: 'My Wishlist',
      icon: Heart,
      items: [
        { key: 'saved-items', label: 'Saved Items', icon: Bookmark },
        { key: 'stock-alerts', label: 'Back in Stock Alerts', icon: AlertCircle }
      ]
    },
    {
      key: 'cart',
      title: 'My Cart',
      icon: ShoppingCart,
      items: [
        { key: 'view-cart', label: 'View Cart', icon: ShoppingCart },
        { key: 'saved-later', label: 'Saved for Later', icon: Bookmark }
      ]
    },
    {
      key: 'messages',
      title: 'Messages / Notifications',
      icon: MessageCircle,
      items: [
        { key: 'chat-seller', label: 'Chat with Seller', icon: MessageCircle },
        { key: 'notifications', label: 'System Notifications', icon: Bell }
      ]
    },
    {
      key: 'payment',
      title: 'Payment & Wallet',
      icon: Wallet,
      items: [
        { key: 'wallet-balance', label: 'Wallet Balance', icon: Wallet },
        { key: 'transactions', label: 'Transaction History', icon: Receipt }
      ]
    },
    {
      key: 'coupons',
      title: 'Coupons & Offers',
      icon: Gift,
      items: [
        { key: 'my-coupons', label: 'My Coupons', icon: Tag },
        { key: 'offers', label: 'Available Offers', icon: Gift }
      ]
    },
    {
      key: 'invoices',
      title: 'Invoices & Downloads',
      icon: FileText,
      items: [
        { key: 'order-invoices', label: 'Order Invoices', icon: Download }
      ]
    },
    {
      key: 'privacy',
      title: 'Privacy & Settings',
      icon: Lock,
      items: [
        { key: 'notification-prefs', label: 'Notification Preferences', icon: Bell },
        { key: 'privacy-settings', label: 'Privacy Settings', icon: Settings }
      ]
    },
    {
      key: 'support',
      title: 'Help & Support',
      icon: HelpCircle,
      items: [
        { key: 'faqs', label: 'FAQs', icon: HelpCircle },
        { key: 'contact-support', label: 'Contact Support', icon: Phone },
        { key: 'report-problem', label: 'Report a Problem', icon: AlertTriangle }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button 
        className="mobile-menu-toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X size={24} /> : <User size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="sidebar-overlay active"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`buyer-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
      {/* ============================================
          USER PROFILE SECTION
          ============================================ */}
      <div className="sidebar-header">
        <div className="user-profile">
          <div className="user-avatar">
            <img src={userData.avatar} alt={userData.name} />
          </div>
          <div className="user-info">
            <h3 className="user-name">{userData.name}</h3>
            <p className="user-email">{userData.email}</p>
          </div>
        </div>
      </div>

      {/* ============================================
          MENU SECTIONS
          ============================================ */}
      <nav className="sidebar-nav">
        {menuSections.map((section) => {
          const SectionIcon = section.icon;
          const isExpanded = expandedSections[section.key];

          return (
            <div key={section.key} className="menu-section">
              {/* Section Header */}
              <button
                className={`section-header ${isExpanded ? 'expanded' : ''}`}
                onClick={() => toggleSection(section.key)}
              >
                <div className="section-header-content">
                  <SectionIcon size={20} className="section-icon" />
                  <span className="section-title">{section.title}</span>
                </div>
                {isExpanded ? (
                  <ChevronDown size={18} className="chevron-icon" />
                ) : (
                  <ChevronRight size={18} className="chevron-icon" />
                )}
              </button>

              {/* Section Items */}
              {isExpanded && (
                <div className="section-items">
                  {section.items.map((item) => {
                    const ItemIcon = item.icon;
                    const isActive = activeItem === item.key;

                    return (
                      <button
                        key={item.key}
                        className={`menu-item ${isActive ? 'active' : ''}`}
                        onClick={() => handleMenuClick(item.key)}
                      >
                        <ItemIcon size={18} className="item-icon" />
                        <span className="item-label">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* ============================================
          LOGOUT BUTTON
          ============================================ */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} className="logout-icon" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
    </>
  );
};

export default BuyerSidebar;