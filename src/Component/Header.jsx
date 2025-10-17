import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import './Header.css';
import { Link } from 'react-router-dom';

/**
 * Evergreen E-commerce Header Component
 * A responsive header with logo, search bar, cart, and user authentication
 */
export function Header() {
  // State for mobile menu toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State for mobile search visibility
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
  // State for cart item count
  const [cartCount] = useState(3);

  /**
   * Toggle mobile menu visibility
   */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsMobileSearchOpen(false);
  };

  /**
   * Toggle mobile search visibility
   */
  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          {/* Logo Section */}
          <div className="logo-section">
            <div className="logo">
              <div className="logo-icon"></div>
            </div>
            <Link to={'/'} className='nav-link'><h1 className="brand-name">Evergreen</h1></Link>
          </div>

          {/* Search Bar - Desktop Only */}
          <div className="search-container desktop-search">
            <input
              type="text"
              className="search-input"
              placeholder="Search for products, brands and more..."
              aria-label="Search products"
            />
            <button className="search-button" aria-label="Search">
              <Search size={22} strokeWidth={2.5} />
            </button>
          </div>

          {/* Right Section - Cart and User */}
          <div className="right-section">
            {/* Mobile Search Icon */}
            <button 
              className="icon-button mobile-search-icon"
              onClick={toggleMobileSearch}
              aria-label="Search"
            >
              <Search size={24} />
            </button>

            {/* Shopping Cart */}
            <button className="icon-button cart-button" aria-label="Shopping cart">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </button>

            {/* User Authentication - Desktop */}
            <button className="auth-button desktop-auth">
              <User size={20} />
              <span className="auth-text">Sign In / Register</span>
            </button>

            {/* User Icon - Mobile */}
            <button className="icon-button mobile-user-icon" aria-label="User account">
              <User size={24} />
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-menu-toggle"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className={`mobile-search-container ${isMobileSearchOpen ? 'active' : ''}`}>
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search for products, brands and more..."
              aria-label="Search products"
            />
            <button className="search-button" aria-label="Search">
              <Search size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <nav className="mobile-nav">
            <a href="#" className="mobile-nav-item">
              <User size={20} />
              <span>Sign In / Register</span>
            </a>
            <a href="#" className="mobile-nav-item">
              <ShoppingCart size={20} />
              <span>My Cart ({cartCount})</span>
            </a>
          </nav>
        </div>
      </header>

      {/* Overlay for mobile menu */}
      {(isMobileMenuOpen || isMobileSearchOpen) && (
        <div className="overlay" onClick={() => {
          setIsMobileMenuOpen(false);
          setIsMobileSearchOpen(false);
        }}></div>
      )}
    </>
  );
}

export default Header;

// import { Link } from 'react-router-dom';
// import  './Header.css';
// export function Header({cart = []}){
//     let totalQuantity = 0;
//     cart.forEach((cartItem) =>{
//         totalQuantity += cartItem.quantity
//     })
//     return(
//     <>
         
//         <nav className="nav-bar">
//             <div className="nav-container">
//                 {/* <!-- Logo with tree icon --> */}
//                 <Link to="/"> <div className='logo'> Tree store</div></Link>
                             
//                 {/* <!-- Main navigation menu --> */}
//                 <ul className="nav-menu">
//                     <li><a href="#shop">Shop</a></li>
//                     <li><a href="#guides">Care Guides</a></li>
//                     <li><a href="#story">Our Story</a></li>
//                     <li><a href="#contact">Contact</a></li>
//                 </ul>
                
//                 {/* <!-- Navigation icons for cart, search, profile --> */}
//                 <div className="nav-icons">
//                     <span><img src="Icon/search.png"/></span>
//                     <Link to= "/cart"><span><img src="Icon/shopping-cart.png"/><p>{totalQuantity}</p></span></Link>
//                    <Link to="/login">  <span><img src="Icon//user.png"/></span></Link>
//                 </div>
//             </div>
//         </nav>
//      </>
//     )
// }