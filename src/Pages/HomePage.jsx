import './HomePage.css';
export function HomePage(){
    return(
        <>
             {/* <!-- Navigation Header --> */}
    <nav className="nav-bar">
        <div className="nav-container">
            {/* <!-- Logo with tree icon --> */}
            <div className="logo">Tree Store</div>
            
            {/* <!-- Main navigation menu --> */}
            <ul className="nav-menu">
                <li><a href="#shop">Shop</a></li>
                <li><a href="#guides">Care Guides</a></li>
                <li><a href="#story">Our Story</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
            
            {/* <!-- Navigation icons for cart, search, profile --> */}
            <div className="nav-icons">
                <span><img src="Icon/search.png"/></span>
                <span><img src="Icon/shopping-cart.png"/></span>
                <span><img src="Icon//user.png"/></span>
            </div>
        </div>
    </nav>
      {/* <!-- Hero Section with forest background --> */}
    <section className="hero">
        <div className="hero-content">
            
            <h1>Cultivate Your Legacy</h1>
            <p>Discover a curated selection of timeless trees, from majestic oaks to elegant maples. Begin your story with us.</p>
            
            {/* <!-- Hero action buttons --> */}
            <div className="hero-buttons">
                
                <a href="#" className="btn btn-primary">Find Tree</a>
            </div>
        </div>
    </section>

    {/* <!-- Categories Section --> */}
    
    {/* <!-- Trending Trees Section --> */}
  
 

    {/* <!-- Top Selling Section --> */}
  

    {/* <!-- Footer Section --> */}
    
        </>
    )
}