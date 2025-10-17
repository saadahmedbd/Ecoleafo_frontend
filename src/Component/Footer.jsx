import './Footer.css';
import React, { useState } from 'react';
import { Instagram, Twitter, Facebook, Leaf } from 'lucide-react';
/* ============================================
   FOOTER COMPONENT
   Modern, responsive footer with newsletter subscription
   ============================================ */
export function Footer  () {
  // State for email input
  const [email, setEmail] = useState('');

  // Handle newsletter subscription
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      console.log('Subscribing email:', email);
      // Add your subscription logic here
      alert(`Thank you for subscribing with: ${email}`);
      setEmail('');
    }
  };

  // Handle email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <footer className="footer-container">
      {/* Main Footer Content */}
      <div className="footer-content">
        <div className="footer-grid">
          
          {/* ============================================
              BRAND SECTION - Logo, Description, Social Icons
              ============================================ */}
          <div className="footer-brand">
            <div className="footer-logo">
              <Leaf className="logo-icon" size={32} strokeWidth={2.5} />
              <h2 className="brand-name">GreenLeaf</h2>
            </div>
            <p className="brand-description">
              Your source for the finest trees and plants.
            </p>
            
            {/* Social Media Icons */}
            <div className="social-links">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* ============================================
              QUICK LINKS SECTION
              ============================================ */}
          <div className="footer-links">
            <h3 className="footer-heading">QUICK LINKS</h3>
            <ul className="links-list">
              <li>
                <a href="#about" className="footer-link">About Us</a>
              </li>
              <li>
                <a href="#support" className="footer-link">Support</a>
              </li>
              <li>
                <a href="#privacy" className="footer-link">Privacy Policy</a>
              </li>
              <li>
                <a href="#contact" className="footer-link">Contact Us</a>
              </li>
            </ul>
          </div>

          {/* ============================================
              NEWSLETTER SECTION
              ============================================ */}
          <div className="footer-newsletter">
            <h3 className="footer-heading">JOIN OUR NEWSLETTER</h3>
            <p className="newsletter-description">
              Get updates on new arrivals and special offers.
            </p>
            
            {/* Newsletter Subscription Form */}
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={handleEmailChange}
                className="email-input"
                required
                aria-label="Email address for newsletter"
              />
              <button 
                type="submit" 
                className="subscribe-btn"
                aria-label="Subscribe to newsletter"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* ============================================
          COPYRIGHT SECTION
          ============================================ */}
      <div className="footer-bottom">
        <div className="footer-content">
          <p className="copyright-text">
            © 2024 GreenLeaf Nursery. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;