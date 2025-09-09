import './Footer.css';
export function Footer(){
    return(
        <>
    
    <footer className="footer">
        <div className="container">
            {/* <!-- Footer content grid with company info and links --> */}
            <div className="footer-content">
                <div className="footer-section">
                    <div className="logo">Evergreen Emporium</div>
                    <p>Planting roots for generations to come. Creating spaces that nurture both trees and the hearts that tend them.</p>
                </div>
                
                {/* <!-- Shop section links --> */}
                <div className="footer-section">
                    <h3>SHOP</h3>
                    <ul>
                        <li><a href="#">Evergreen</a></li>
                        <li><a href="#">Deciduous</a></li>
                        <li><a href="#">Fruit Trees</a></li>
                        <li><a href="#">Bulk & Saplings</a></li>
                    </ul>
                </div>
                
                {/* <!-- Support section links --> */}
                <div className="footer-section">
                    <h3>SUPPORT</h3>
                    <ul>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="#">FAQs</a></li>
                        <li><a href="#">Shipping & Returns</a></li>
                        <li><a href="#">Care Guides</a></li>
                    </ul>
                </div>
                
                {/* <!-- Company section links --> */}
                <div className="footer-section">
                    <h3>COMPANY</h3>
                    <ul>
                        <li><a href="#">Our Story</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
                    </ul>
                </div>
            </div>
            
            {/* <!-- Footer bottom with copyright and social icons --> */}
            <div className="footer-bottom">
                <p>&copy; 2024 Evergreen Emporium. All rights reserved.</p>
                <div className="social-icons">
                    <span>📘</span>
                    <span>🐦</span>
                    <span>📷</span>
                </div>
            </div>
        </div>
    </footer>
        </>
    )
}