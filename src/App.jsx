import { useState } from 'react'
import { Routes,Route } from 'react-router-dom'

import './App.css'
import './index.css'
import { HomePage } from './Pages/HomePage'
import { Category } from './Pages/Category'
import { Product } from './Pages/Product'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path='' element={<HomePage/>}/>
        <Route path='bonsaicategory' element={<Category/>}></Route>
        <Route path='product' element={<Product/>}></Route>
      </Routes>
    </>
  )
}

export default App
