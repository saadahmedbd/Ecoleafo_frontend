
import { Header } from '../Component/Header';
import { Footer } from '../Component/Footer';
import './AllProducts.css';

import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react';

/* ============================================
   MAIN PRODUCT PAGE COMPONENT
   Displays filterable product grid with sidebar filters
   ============================================ */
export function AllProducts  () {
  // State management for filters and products
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [priceRange, setPriceRange] = useState([10, 100]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Mock product data - easily replaceable with API data
  const productsData = [
    {
      id: 1,
      name: 'Majestic Oak',
      category: 'Outdoor',
      brand: 'Evergreen Co.',
      price: 49.99,
      rating: 4.0,
      reviews: 23,
      image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400'
    },
    {
      id: 2,
      name: 'Elegant Birch',
      category: 'Indoor',
      brand: 'Bloomscape',
      price: 39.99,
      rating: 5.0,
      reviews: 18,
      image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400'
    },
    {
      id: 3,
      name: 'Sturdy Pine',
      category: 'Outdoor',
      brand: 'The Sill',
      price: 29.99,
      rating: 3.0,
      reviews: 45,
      image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400'
    },
    {
      id: 4,
      name: 'Graceful Willow',
      category: 'Flowering',
      brand: 'Evergreen Co.',
      price: 59.99,
      rating: 5.0,
      reviews: 8,
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400'
    },
    {
      id: 5,
      name: 'Vibrant Maple',
      category: 'Outdoor',
      brand: 'Bloomscape',
      price: 69.99,
      rating: 4.2,
      reviews: 31,
      image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400'
    },
    {
      id: 6,
      name: 'Resilient Cedar',
      category: 'Outdoor',
      brand: 'The Sill',
      price: 34.99,
      rating: 4.5,
      reviews: 52,
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400'
    },
    {
      id: 7,
      name: 'Delicate Cherry Blossom',
      category: 'Flowering',
      brand: 'Bloomscape',
      price: 79.99,
      rating: 4.8,
      reviews: 12,
      image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400'
    },
    {
      id: 8,
      name: 'Towering Redwood',
      category: 'Outdoor',
      brand: 'Evergreen Co.',
      price: 99.99,
      rating: 5.0,
      reviews: 2,
      image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=400'
    }
  ];

  // Filter and sort products based on selected criteria
  useEffect(() => {
    let filtered = productsData.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesBrand = selectedBrand === 'All' || product.brand === selectedBrand;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesRating = selectedRating === 0 || product.rating >= selectedRating;
      
      return matchesCategory && matchesBrand && matchesPrice && matchesRating;
    });

    // Sort products
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, selectedBrand, priceRange, selectedRating, sortBy]);

  // Handle add to cart action
  const handleAddToCart = (product) => {
    console.log('Adding to cart:', product);
    // Add your cart logic here
    alert(`${product.name} added to cart!`);
  };

  return (
    <>
        <Header/>
   
    <div className="product-page">
      {/* ============================================
          SIDEBAR FILTERS
          ============================================ */}
      <aside className="filters-sidebar">
        <h2 className="filters-title">Filters</h2>

        {/* Category Filter */}
        <div className="filter-section">
          <h3 className="filter-heading">Category</h3>
          <div className="filter-options">
            {['All', 'Indoor', 'Outdoor', 'Flowering'].map(category => (
              <label key={category} className="filter-option">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === category}
                  onChange={() => setSelectedCategory(category)}
                  className="filter-radio"
                />
                <span className="filter-label">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Brand Filter */}
        <div className="filter-section">
          <h3 className="filter-heading">Brand</h3>
          <div className="filter-options">
            {['All', 'Evergreen Co.', 'Bloomscape', 'The Sill'].map(brand => (
              <label key={brand} className="filter-option">
                <input
                  type="radio"
                  name="brand"
                  checked={selectedBrand === brand}
                  onChange={() => setSelectedBrand(brand)}
                  className="filter-radio"
                />
                <span className="filter-label">{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="filter-section">
          <h3 className="filter-heading">Price</h3>
          <div className="price-range">
            <input
              type="range"
              min="10"
              max="100"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([10, parseInt(e.target.value)])}
              className="price-slider"
            />
            <div className="price-labels">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="filter-section">
          <h3 className="filter-heading">Rating</h3>
          <div className="rating-filter">
            {[5, 4, 3, 2, 1].map(rating => (
              <label key={rating} className="rating-option">
                <input
                  type="radio"
                  name="rating"
                  checked={selectedRating === rating}
                  onChange={() => setSelectedRating(rating)}
                  className="filter-radio"
                />
                <div className="rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < rating ? '#fbbf24' : 'none'}
                      stroke={i < rating ? '#fbbf24' : '#d1d5db'}
                    />
                  ))}
                </div>
              </label>
            ))}
            <label className="rating-option">
              <input
                type="radio"
                name="rating"
                checked={selectedRating === 0}
                onChange={() => setSelectedRating(0)}
                className="filter-radio"
              />
              <span className="filter-label">All Ratings</span>
            </label>
          </div>
        </div>
      </aside>

      {/* ============================================
          MAIN CONTENT AREA
          ============================================ */}
      <main className="products-main">
        {/* Header with title and sort dropdown */}
        <div className="products-header">
          <h1 className="page-title">All Trees</h1>
          <div className="sort-section">
            <label htmlFor="sort" className="sort-label">Sort by:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button className="pagination-btn" aria-label="Previous page">
            <ChevronLeft size={20} />
          </button>
          <div className="pagination-numbers">
            <button className="pagination-number active">1</button>
            <button className="pagination-number desktop-only">2</button>
            <button className="pagination-number desktop-only">3</button>
            <span className="pagination-dots desktop-only">...</span>
            <button className="pagination-number desktop-only">8</button>
          </div>
          <button className="pagination-btn" aria-label="Next page">
            <ChevronRight size={20} />
          </button>
        </div>
      </main>
    </div>
    <Footer />
    </>
  );
};

/* ============================================
   PRODUCT CARD COMPONENT
   Individual product card with image, details, and add to cart
   ============================================ */
const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />
      </div>
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <div className="product-rating">
          <div className="rating-stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < Math.floor(product.rating) ? '#fbbf24' : 'none'}
                stroke={i < Math.floor(product.rating) ? '#fbbf24' : '#d1d5db'}
              />
            ))}
          </div>
          <span className="rating-text">
            {product.rating.toFixed(1)} ({product.reviews})
          </span>
        </div>
        <p className="product-price">${product.price.toFixed(2)}</p>
        <button
          className="add-to-cart-btn"
          onClick={() => onAddToCart(product)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default AllProducts;