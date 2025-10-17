
import { Header } from '../Component/Header';
import { Footer } from '../Component/Footer';
import './HomePage.css'

import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';


/* ============================================
   MAIN APP COMPONENT
   ============================================ */
export function HomePage  ()  {
  // State for managing favorite items
  const [favorites, setFavorites] = useState({});

  // Toggle favorite status
  const toggleFavorite = (id) => {
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  /* Featured Products Data */
  const featuredProducts = [
    { 
      id: 1, 
      name: 'Majestic Oak', 
      price: 45.00, 
      image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400' 
    },
    { 
      id: 2, 
      name: 'Blossoming Cherry', 
      price: 55.00, 
      image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400' 
    },
    { 
      id: 3, 
      name: 'Evergreen Pine', 
      price: 35.00, 
      image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400' 
    },
    { 
      id: 4, 
      name: 'Weeping Willow', 
      price: 65.00, 
      image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400' 
    }
  ];

  /* Category Data */
  const categories = [
    { 
      id: 1, 
      name: 'Fruit Trees', 
      image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=300' 
    },
    { 
      id: 2, 
      name: 'Shade Trees', 
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300' 
    },
    { 
      id: 3, 
      name: 'Ornamental Trees', 
      image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=300' 
    },
    { 
      id: 4, 
      name: 'Native Trees', 
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300' 
    }
  ];

  /* Trending Products Data */
  const trendingProducts = [
    { 
      id: 5, 
      name: 'Japanese Maple', 
      price: 50.00, 
      image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400' 
    },
    { 
      id: 6, 
      name: 'Ginkgo Biloba', 
      price: 80.00, 
      image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400' 
    },
    { 
      id: 7, 
      name: 'Magnolia Tree', 
      price: 135.00, 
      image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400' 
    },
    { 
      id: 8, 
      name: 'Dogwood Tree', 
      price: 90.00, 
      image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400' 
    }
  ];

  return (
    <div className="app">
      <Header />
      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Find Your Perfect Tree</h1>
          <p className="hero-description">
            Discover a wide selection of trees for your home and garden.<br />
            From saplings to mature trees, we have something for every space.
          </p>
          <Link to="all-products"><button className="btn-primary">Shop Now</button></Link>
        </div>
      </section>

      {/* ============================================
          FEATURED PRODUCTS SECTION
          ============================================ */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <a href="#" className="link-green">View All</a>
          </div>
          <div className="product-grid">
            {featuredProducts.map(product => (
              <ProductCard 
                key={product.id}
                product={product}
                isFavorite={favorites[product.id]}
                onToggleFavorite={() => toggleFavorite(product.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          TOP CATEGORIES SECTION
          ============================================ */}
      <section className="section section-gray">
        <div className="container">
          <h2 className="section-title text-center">Top Categories</h2>
          <div className="category-grid">
            {categories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          PROMOTIONAL BANNERS SECTION
          ============================================ */}
      <section className="section">
        <div className="container">
          <div className="promo-grid">
            {/* Summer Sale Banner */}
            <div className="promo-card promo-summer">
              <div className="promo-content">
                <h3 className="promo-title">Summer Sale</h3>
                <p className="promo-text">Up to 40% off on selected trees</p>
                <button className="btn-secondary">Shop Now</button>
              </div>
            </div>
            {/* New Arrivals Banner */}
            <div className="promo-card promo-arrivals">
              <div className="promo-content">
                <h3 className="promo-title">New Arrivals</h3>
                <p className="promo-text">Check out the latest additions to our collection</p>
                <button className="btn-secondary">Explore</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          TRENDING PRODUCTS SECTION
          ============================================ */}
      <section className="section section-gray">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Trending Products</h2>
            <a href="#" className="link-green">View All</a>
          </div>
          <div className="product-grid">
            {trendingProducts.map(product => (
              <ProductCard 
                key={product.id}
                product={product}
                isFavorite={favorites[product.id]}
                onToggleFavorite={() => toggleFavorite(product.id)}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

/* ============================================
   PRODUCT CARD COMPONENT
   Displays individual product with image, name, price, and favorite button
   ============================================ */
const ProductCard = ({ product, isFavorite, onToggleFavorite }) => {
  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img src={product.image} alt={product.name} className="product-image" />
        <button 
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={onToggleFavorite}
          aria-label="Add to favorites"
        >
          <Heart size={20} fill={isFavorite ? '#22c55e' : 'none'} />
        </button>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${product.price.toFixed(2)}</p>
        <button className="btn-cart">Add to Cart</button>
      </div>
    </div>
  );
};

/* ============================================
   CATEGORY CARD COMPONENT
   Displays category with circular image and name
   ============================================ */
const CategoryCard = ({ category }) => {
  return (
    <div className="category-card">
      <div className="category-image-wrapper">
        <img src={category.image} alt={category.name} className="category-image" />
      </div>
      <h3 className="category-name">{category.name}</h3>
    </div>
  );
};

export default HomePage;