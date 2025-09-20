import { Link } from 'react-router-dom';
import  './Header.css';
export function Header({cart = []}){
    let totalQuantity = 0;
    cart.forEach((cartItem) =>{
        totalQuantity += cartItem.quantity
    })
    return(
    <>
         
        <nav className="nav-bar">
            <div className="nav-container">
                {/* <!-- Logo with tree icon --> */}
                <Link to="/"> <div className='logo'> Tree store</div></Link>
                             
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
                    <span><img src="Icon/shopping-cart.png"/><p>{totalQuantity}</p></span>
                   <Link to="/login">  <span><img src="Icon//user.png"/></span></Link>
                </div>
            </div>
        </nav>
     </>
    )
}