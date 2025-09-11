import { useEffect, useState } from "react";
import { Header } from "../Component/Header";
import './Category.css'
import axios from "axios";

export function Product(){
    const [products,setPoducts]=useState([])
    useEffect(() => {
    axios.get("http://localhost:3000/getproduct")
        .then((response) => {
        setPoducts(response.data);
        })
        .catch((err) => console.error("Error fetching products:", err));
    }, []);  //  runs only once
   
    return(
        <>
            <Header/>

             <section className="products-section">
        <div className="container">
          <div className="product-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image|| "Images/bonsai-6114254_1280.jpg"} alt={product.name} />
                </div>
                <div className="product-info">
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <p>${product.price}</p>
                  <button className="product-cart">Add to Cart</button>
                  
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
        </>
    )
}