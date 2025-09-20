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


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path='' element={<HomePage/>}/>
        <Route path='bonsaicategory' element={<Category/>}></Route>
        <Route path='product' element={<Product/>}></Route>
        <Route path="registation" element={<RegistrationPage/>}></Route>
        <Route path='/login' element={<LoginPage/>}></Route>
        <Route path='/cart' element={<ProductcartPage/>}></Route>

      </Routes>
    </>
  )
}

export default App
