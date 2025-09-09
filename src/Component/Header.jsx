import  './Header.css';
export function Header(){
    return(
    <>
        
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
     </>
    )
}