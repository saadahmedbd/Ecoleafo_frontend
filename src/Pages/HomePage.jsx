import { Link } from 'react-router-dom';
import { Footer } from '../Component/Footer';
import { Header } from '../Component/Header';
import './HomePage.css'
export function HomePage(){
    return(
        <>
       <Header/>
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
    <section className="categories">
        <div className="container">
            <h2 className="section-title">Shop By Categories</h2>
            
            {/* <!-- Category grid with icons and labels --> */}
            <div className="category-grid">
                <div className="category-item">
                   <Link to="/bonsaiCategory"> <img className="category-image" src="Images/bonsai-6114254_1280.jpg"/></Link>
                    <Link to="/bonsaiCategory"> <h3> Bonsia Tree</h3></Link>
                </div>
                <div className="category-item">
                    <img className="category-image" src="Images/little-bonsai-tree-with-pink-flowers.jpg"/>
                    <h3>Indoor plane</h3>
                </div>
                <div className="category-item">
                    <img className="category-image" src="Images/cute-small-plants-shelf.jpg"/>
                    <h3>Fruits plane and trees</h3>
                </div>
                <div className="category-item">
                    <img className="category-image" src="Images/garlic-3673513_1280.jpg"/>
                    <h3>Vegetables plant</h3>
                </div>
                <div className="category-item">
                    <img className="category-image" src="Images/greenhouse-still-life.jpg"/>
                    <h3>Outdoor plant</h3>
                </div>
              
            </div>
        </div>
    </section>

     {/* <!-- Trending Trees Section --> */}
    <section className="products-section">
        <div className="container">
            <h2 className="section-title">Trending Trees</h2>
        
            
            {/* <!-- Product grid for trending trees --> */}
            <div className="product-grid">
                <div className="product-card">
                    <div className="product-image"><img src="Images/ernest-porzi-Z-Y6I45f9kQ-unsplash.jpg"/></div>
                    <div className="product-info">
                        <h3 className="product-title">Lemon Tree</h3>
                        <p className="product-description">Majestic blue-tinged color &#183;3ft &#183; 1 year &#183; $20</p>
                    </div>
                </div>
                <div className="product-card">
                    <div className="product-image"><img src="Images/ernest-porzi-Z-Y6I45f9kQ-unsplash.jpg"/></div>
                    <div className="product-info">
                        <h3 className="product-title">Coconate tree</h3>
                        <p className="product-description">Majestic blue-tinged color &#183;3ft &#183; 1 year &#183; $20</p>
                    </div>
                </div>
                <div className="product-card">
                    <div className="product-image"><img src="Images/ernest-porzi-Z-Y6I45f9kQ-unsplash.jpg"/></div>
                    <div className="product-info">
                        <h3 className="product-title">Orange Tree</h3>
                        <p className="product-description">Majestic blue-tinged color &#183;3ft &#183; 1 year &#183; $20</p>
                    </div>
                </div>
                <div className="product-card">
                    <div className="product-image"><img src="Images/ernest-porzi-Z-Y6I45f9kQ-unsplash.jpg"/></div>
                    <div className="product-info">
                        <h3 className="product-title">Mango tree</h3>
                        <p className="product-description">Majestic blue-tinged color &#183;3ft &#183; 1 year &#183; $20</p>
                    </div>
                </div>
                 <div className="product-card">
                    <div className="product-image"><img src="Images/ernest-porzi-Z-Y6I45f9kQ-unsplash.jpg"/></div>
                    <div className="product-info">
                        <h3 className="product-title">Rose tree</h3>
                        <p className="product-description">Stunning spring blooms &#183;3ft &#183; 1 year &#183; $20</p>
                    </div>
                </div>
                 <div className="product-card">
                    <div className="product-image"><img src="Images/ernest-porzi-Z-Y6I45f9kQ-unsplash.jpg"/></div>
                    <div className="product-info">
                        <h3 className="product-title">hibiscus Tree</h3>
                        <p className="product-description">Majestic blue-tinged color &#183;3ft &#183; 1 year &#183; $20</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

 

    {/* <!-- Top Selling Section --> */}
         <section className="products-section">
        <div className="container">
            <h2 className="section-title">Top Selling</h2>
            <p className="section-subtitle">Customer favorites that have found a special place in gardens everywhere.</p>
            
            {/* <!-- Product grid for top selling trees --> */}
            <div className="product-grid">
                <div className="product-card">
                    <div className="product-image"><img src="Images/bonsai-6114254_1280.jpg"/></div>
                    <div className="product-info">
                        <h3 className="product-title">Bonsai</h3>
                        <p className="product-description">A symbol of strength</p>
                    </div>
                </div>
                <div className="product-card">
                    <div className="product-image" ><img src="Images/cute-small-plants-shelf.jpg"/></div>
                    <div className="product-info">
                        <h3 className="product-title">Cherry Blossom</h3>
                        <p className="product-description">Fleeting beautiful blooms</p>
                    </div>
                </div>
                <div className="product-card">
                    <div className="product-image" ><img src="Images/bonsai-6114254_1280.jpg"/></div>
                    <div className="product-info">
                        <h3 className="product-title">Lemon Cypress</h3>
                        <p className="product-description">Crisp fragrance and color</p>
                    </div>
                </div>
                <div className="product-card">
                    <div className="product-image"><img src="Images/cute-small-plants-shelf.jpg"/></div>
                    <div className="product-info">
                        <h3 className="product-title">Fiddle Leaf Fig</h3>
                        <p className="product-description">An indoor statement piece</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/* <!-- Footer Section --> */}
    
        <Footer/>
        </>
    )
}