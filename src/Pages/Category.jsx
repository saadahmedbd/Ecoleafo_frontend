import { Header } from '../Component/Header';
import './Category.css';
export function Category(){
    return(
        
     <>
        <Header/>

       {/* <!-- Hero Section with forest background --> */}
    <section className="hero">
        <div className="hero-content">
            <h1>Bonsai Trees</h1>
            <p>Discover the ancient art of bonsai and find the perfect miniture tree for your home or gardens.</p>
        </div>
    </section>
  {/* <!-- bonsai images --> */}
    <section className="products-section">
        <div className="container">
        
            
            {/* <!-- Product grid for trending trees --> */}
            <div className="product-grid">
                <div className="product-card">
                    <div className="product-image"><img src="Images/bonsai-6114254_1280.jpg"/></div>
                    <div className="product-info">
                        <h3 className="product-title">Junifer Bonsai</h3>
                        <p className="product-description">Majestic blue-tinged color &#183;3ft &#183; 1 year &#183;</p>
                        <p>  $20</p>
                        <button className="product-cart">Add to Cart</button>
                    </div>
                </div>
                <div className="product-card">
                    <div className="product-image"><img src="Images/bonsai-6114254_1280.jpg"/></div>
                    <div className="product-info">
                        <h3 className="product-title">Coconate tree</h3>
                        <p className="product-description">Majestic blue-tinged color &#183;3ft &#183; 1 year &#183;</p>
                        <p>  $20</p>
                        <button className="product-cart">Add to Cart</button>
                    </div>
                </div>
                <div className="product-card">
                    <div className="product-image"><img src="Images/bonsai-6114254_1280.jpg"/></div>
                    <div className="product-info">
                        <h3 className="product-title">Orange Tree</h3>
                        <p className="product-description">Majestic blue-tinged color &#183;3ft &#183; 1 year &#183;</p>
                        <p>  $20</p>
                        <button className="product-cart">Add to Cart</button>
                    </div>
                </div>
                <div className="product-card">
                    <div className="product-image"><img src="Images/bonsai-6114254_1280.jpg"/></div>
                    <div className="product-info">
                        <h3 className="product-title">Mango tree</h3>
                        <p className="product-description">Majestic blue-tinged color &#183;3ft &#183; 1 year &#183;</p>
                        <p>  $20</p>
                        <button className="product-cart">Add to Cart</button>
                    </div>
                </div>
                 <div className="product-card">
                    <div className="product-image"><img src="Images/bonsai-6114254_1280.jpg"/></div>
                    <div className="product-info">
                        <h3 className="product-title">Rose tree</h3>
                        <p className="product-description">Stunning spring blooms &#183;3ft &#183; 1 year &#183; </p>
                        <p>  $20</p>
                        <button className="product-cart">Add to Cart</button>
                    </div>
                </div>
                 <div className="product-card">
                    <div className="product-image"><img src="Images/bonsai-6114254_1280.jpg"/></div>
                    <div className="product-info">
                        <h3 className="product-title">hibiscus Tree</h3>
                        <p className="product-description">Majestic blue-tinged color &#183;3ft &#183; 1 year &#183;</p>
                        <p>  $20</p>
                        <button className="product-cart">Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
    
        </>
    )
}