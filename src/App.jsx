import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'

import './App.css'
import './index.css'
import { HomePage } from './Pages/HomePage'
import { Category } from './Pages/Category'
import { Product } from './Pages/Product'
import  { SignUp } from './Pages/SignUp'
import { Login } from './Pages/Login'
import ProductcartPage from './Pages/ProductcartPage'
import BuyerAccountPage from './Pages/BuyerAccountPage'
import  { OrderConfirmation } from './Pages/OrderConfirmation'
import AddProductPage from './Pages/AddProductPage'
import MobileApp from './Component/Mobile/MobileApp'
import SellerApp from './Component/Mobile/SellerApp'  
import AllProducts from './Pages/AllProducts'
import ProductDetail from './Pages/Productdetail'
import ShoppingCart from './Pages/ShoppingCart'
import CheckoutPage from './Pages/CheckoutPage'
import PaymentMethod from './Pages/PaymentMethod'
import OrderTracking from './Pages/OrderTracking'
import ForgotPassword from './Pages/forgotPassword'
import ProfileInformation from './BuyerProfilePages/ProfileInformation'
import MyAddresses from './BuyerProfilePages/MyAddresses'
import PaymentMethods from './BuyerProfilePages/PaymentMethods'
import SecuritySettings from './BuyerProfilePages/SecuritySettings'
import AllOrders from './BuyerProfilePages/AllOrders'
import TrackOrder from './BuyerProfilePages/TrackOrder'
import ReturnRefund from './BuyerProfilePages/ReturnRefund'
import CancelledOrders from './BuyerProfilePages/CancelledOrders'
import Dashboard from './BuyerProfilePages/DashBoard'
import SellerDashboard from './Component/Mobile/Seller/SellerDashboard'
import SellerProducts from './Component/Mobile/Seller/SellerProducts'
import SellerLayout from './Component/Mobile/Seller/SellerLayout'
import SellerOrders from './Component/Mobile/Seller/SellerOrders'
import SellerMessages from './Component/Mobile/Seller/SellerMessages'
import SellerAccount from './Component/Mobile/Seller/SellerAccount'
import SellerInventory from './Component/Mobile/Seller/SellerInventory'
import SellerPayouts from './Component/Mobile/Seller/SellerPayouts'
import SellerSettings from './Component/Mobile/Seller/SellerSettings'


function App() {
  //setup for automatic update mobile screen size 
  // or desktop screen size (screen width ≤ 768px) → automatically redirected to /mobile/home)
  // Desktop devices (screen width > 768px) → stay on desktop view /
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const isMobilePath = location.pathname.startsWith('/mobile');
    
    if (isMobile && !isMobilePath && location.pathname === '/') {
      navigate('/mobile/home');
    } else if (!isMobile && isMobilePath) {
      navigate('/');
    }
  }, []);

  return (
    <>
      <Routes>
        <Route path='' element={<HomePage/>}/>
        <Route path="all-products" element={<AllProducts/>}></Route>
        <Route path="product-detail" element={<ProductDetail/>}></Route>
        <Route path="shopping-cart" element={<ShoppingCart/>}></Route>
        <Route path="checkout" element={<CheckoutPage/>}></Route>
        <Route path="payment-method" element={<PaymentMethod/>}></Route>
        <Route path='order-confirmation' element={<OrderConfirmation/>}></Route>
        <Route path='order-tracking' element={<OrderTracking/>}></Route>
        <Route path='login' element={<Login/>}></Route>
        <Route path='forgot-password' element={<ForgotPassword/>}></Route>
        <Route path="sign-up" element={<SignUp/>}></Route>
        {/* Buyer profile */}
        <Route path="user-dashboard" element={<Dashboard/>}></Route>

        <Route path="profile-information" element={<ProfileInformation/>}></Route>
        <Route path="my-addresses" element={<MyAddresses/>}></Route>
        <Route path="payment-methods" element={<PaymentMethods/>}></Route>
        <Route path="security-setting" element={<SecuritySettings/>}></Route>
        {/* orders */}
        <Route path="all-orders" element={<AllOrders/>}></Route>
        <Route path="track-order" element={<TrackOrder/>}></Route>
        <Route path="return-refund" element={<ReturnRefund/>}></Route>
        <Route path="cancelled-orders" element={<CancelledOrders/>}></Route>

        <Route path='bonsaicategory' element={<Category/>}></Route>
        <Route path='product' element={<Product/>}></Route>
        <Route path='/cart' element={<ProductcartPage/>}></Route>
        <Route path='/buyer-account' element={<BuyerAccountPage/>}></Route>
        <Route path='/add-product' element={<AddProductPage/>}></Route>
        <Route path='/mobile/*' element={<MobileApp/>}></Route>
        {/* <Route path='/seller/*' element={<SellerApp/>}></Route> */}
        
        {/* responsive for mobile and desjtop */}
       <Route path="/seller" element={<SellerLayout />}>
        <Route index element={<SellerDashboard />} />
        <Route path="dashboard" element={<SellerDashboard />} />
        <Route path="products" element={<SellerProducts />} />
        <Route path="orders" element={<SellerOrders />} />
        <Route path="inventory" element={<SellerInventory />} />
        <Route path="payouts" element={<SellerPayouts />} />
        <Route path="messages" element={<SellerMessages />} />
        <Route path="settings" element={<SellerSettings />} />
        <Route path="account" element={<SellerAccount />} />
      </Route>





      </Routes>
    </>
  )
}

export default App
