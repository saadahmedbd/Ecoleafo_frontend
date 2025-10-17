import { useState } from 'react'
import { Routes,Route } from 'react-router-dom'

import './App.css'
import './index.css'
import { HomePage } from './Pages/HomePage'
import { Category } from './Pages/Category'
import { Product } from './Pages/Product'
import RegistrationPage from './Pages/RegistationPage'
import LoginPage from './Pages/LoginPage'
import ProductcartPage from './Pages/ProductcartPage'
import BuyerAccountPage from './Pages/BuyerAccountPage'
import OrderPage from './Pages/OrderPage'
import AddProductPage from './Pages/AddProductPage'
import AllProducts from './Pages/AllProducts'
import ProductDetail from './Pages/Productdetail'
import ShoppingCart from './Pages/ShoppingCart'
import CheckoutPage from './Pages/CheckoutPage'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path='' element={<HomePage/>}/>
        <Route path="all-products" element={<AllProducts/>}></Route>
        <Route path="product-detail" element={<ProductDetail/>}></Route>
        <Route path="shopping-cart" element={<ShoppingCart/>}></Route>
        <Route path="checkout" element={<CheckoutPage/>}></Route>


        <Route path='bonsaicategory' element={<Category/>}></Route>
        <Route path='product' element={<Product/>}></Route>
        <Route path="registation" element={<RegistrationPage/>}></Route>
        <Route path='/login' element={<LoginPage/>}></Route>
        <Route path='/cart' element={<ProductcartPage/>}></Route>
        <Route path='/buyer-account' element={<BuyerAccountPage/>}></Route>
        <Route path='/order' element={<OrderPage/>}></Route>
        <Route path='/add-product' element={<AddProductPage/>}></Route>


      </Routes>
    </>
  )
}

export default App
