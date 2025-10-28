import React, { useState } from 'react';
import { Star, Heart, ChevronRight } from 'lucide-react';
import './ProductDetail.css';

import { Header } from '../Component/Header';

/* ============================================
   PRODUCT DETAIL PAGE COMPONENT
   Complete product page with image gallery, details, reviews, and Q&A
   ============================================ */
export function ProductDetail  ()  {
  // State management
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock product data - easily replaceable with API
  const product = {
    id: 1,
    name: 'Japanese Maple Bonsai',
    price: 250.00,
    rating: 4.5,
    reviewCount: 125,
    stock: 'In Stock',
    quantity: 6,
    seller: 'The Bonsai Master',
    shortDescription: 'An exquisite Japanese Maple Bonsai, a living masterpiece of miniaturization. Perfect for both beginners and seasoned enthusiasts, it brings serenity and elegance to any space.',
    images: [
      'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600',
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600',
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600',
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600'
    ]
  };

  // Product full description
  const fullDescription = `This exquisite Japanese Maple Bonsai is a testament to the art of miniaturization. With its vibrant foliage and meticulously shaped branches, it brings a touch of serenity and elegance to any space. The deep red and orange hues of its leaves create a stunning visual display that changes with the seasons, offering a dynamic and engaging natural spectacle. Perfect for both beginners and seasoned enthusiasts, this bonsai is a living masterpiece that evolves with time, rewarding its caretaker with its ever-growing beauty. It comes in a handcrafted ceramic pot that complements its aesthetic, making it a ready-to-display piece of art.`;

  // Specifications data
  const specifications = [
    { label: 'Age', value: '5 years' },
    { label: 'Height', value: '12 inches' },
    { label: 'Pot Material', value: 'Ceramic' },
    { label: 'Care Level', value: 'Moderate' },
    { label: 'Sunlight', value: 'Partial Sun' }
  ];

  // Reviews data
  const reviews = [
    {
      id: 1,
      name: 'Sophia Clark',
      rating: 5,
      date: '2 months ago',
      comment: 'Absolutely stunning bonsai! The craftsmanship is impeccable, and it arrived in perfect condition. It\'s a beautiful addition to my home and a joy to care for.',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
      id: 2,
      name: 'Ethan Bennett',
      rating: 4,
      date: '3 months ago',
      comment: 'A lovely bonsai with great potential. The shape is well-defined, and the leaves are healthy. It requires a bit of attention, but it\'s a rewarding experience.',
      avatar: 'https://i.pravatar.cc/150?img=2'
    }
  ];

  // Rating distribution
  const ratingDistribution = [
    { stars: 5, percentage: 40 },
    { stars: 4, percentage: 30 },
    { stars: 3, percentage: 18 },
    { stars: 2, percentage: 10 },
    { stars: 1, percentage: 2 }
  ];

  // Q&A data
  const questions = [
    {
      id: 1,
      user: 'Olivia Harper',
      question: 'How often should I water this bonsai?',
      date: '1 month ago',
      answer: {
        user: 'The Bonsai Master',
        text: 'Water when the top inch of soil feels dry. Ensure proper drainage to prevent root rot.',
        date: '1 month ago'
      },
      avatar: 'https://i.pravatar.cc/150?img=5'
    }
  ];

  // Related products
  const relatedProducts = [
    {
      id: 2,
      name: 'Ficus Ginseng Bonsai',
      price: 180.00,
      image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400'
    },
    {
      id: 3,
      name: 'Juniper Bonsai',
      price: 220.00,
      image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400'
    },
    {
      id: 4,
      name: 'Chinese Elm Bonsai',
      price: 150.00,
      image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400'
    },
    {
      id: 5,
      name: 'Azalea Bonsai',
      price: 200.00,
      image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400'
    }
  ];

  // Handle add to cart
  const handleAddToCart = () => {
    console.log('Adding to cart:', product);
    alert('Product added to cart!');
  };

  // Handle buy now
  const handleBuyNow = () => {
    console.log('Buy now:', product);
    alert('Proceeding to checkout!');
  };

  return (
    
    <>
        <Header/>
        <div className="product-detail-page">
      {/* ============================================
          BREADCRUMB NAVIGATION
          ============================================ */}
      <nav className="breadcrumb">
        <a href="/">Home</a>
        <ChevronRight size={16} />
        <a href="/trees">Trees</a>
        <ChevronRight size={16} />
        <span>{product.name}</span>
      </nav>

      {/* ============================================
          PRODUCT MAIN SECTION
          ============================================ */}
      <div className="product-main">
        {/* Image Gallery */}
        <div className="product-gallery">
          <div className="main-image">
            <img src={product.images[selectedImage]} alt={product.name} />
            <button 
              className="next-image-btn"
              onClick={() => setSelectedImage((prev) => (prev + 1) % product.images.length)}
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          <div className="thumbnail-images">
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={image} alt={`${product.name} ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          
          {/* Rating and Reviews */}
          <div className="product-rating-section">
            <div className="rating-stars">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  fill={i < Math.floor(product.rating) ? '#fbbf24' : 'none'}
                  stroke={i < Math.floor(product.rating) ? '#fbbf24' : '#d1d5db'}
                />
              ))}
            </div>
            <span className="rating-text">({product.reviewCount} reviews)</span>
            <span className="seller-badge">By {product.seller}</span>
          </div>

          {/* Price */}
          <div className="product-price">${product.price.toFixed(2)}</div>

          {/* Stock Status */}
          <div className="stock-info">
            <span className="in-stock">{product.stock}</span>
            <span className="quantity-left">Only {product.quantity} left!</span>
          </div>

          {/* Action Buttons */}
          <div className="product-actions">
            <button className="btn-add-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="btn-buy-now" onClick={handleBuyNow}>
              Buy Now
            </button>
            <button 
              className={`btn-favorite ${isFavorite ? 'active' : ''}`}
              onClick={() => setIsFavorite(!isFavorite)}
              aria-label="Add to favorites"
            >
              <Heart size={20} fill={isFavorite ? '#22c55e' : 'none'} />
            </button>
          </div>

          {/* Short Description */}
          <div className="short-description">
            <h3>Short Description</h3>
            <p>{product.shortDescription}</p>
          </div>
        </div>
      </div>

      {/* ============================================
          TABS SECTION
          ============================================ */}
      <div className="product-tabs">
        <div className="tabs-header">
          <button
            className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button
            className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('specifications')}
          >
            Specifications
          </button>
          <button
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({product.reviewCount})
          </button>
          <button
            className={`tab-btn ${activeTab === 'qa' ? 'active' : ''}`}
            onClick={() => setActiveTab('qa')}
          >
            Q&A
          </button>
        </div>

        <div className="tabs-content">
          {/* Description Tab */}
          {activeTab === 'description' && (
            <div className="tab-panel">
              <h2>Product Description</h2>
              <p>{fullDescription}</p>
            </div>
          )}

          {/* Specifications Tab */}
          {activeTab === 'specifications' && (
            <div className="tab-panel">
              <h2>Specifications</h2>
              <table className="specifications-table">
                <tbody>
                  {specifications.map((spec, index) => (
                    <tr key={index}>
                      <td className="spec-label">{spec.label}</td>
                      <td className="spec-value">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="tab-panel">
              <h2>Customer Reviews</h2>
              
              {/* Rating Summary */}
              <div className="rating-summary">
                <div className="rating-average">
                  <div className="average-score">{product.rating}</div>
                  <div className="average-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < Math.floor(product.rating) ? '#fbbf24' : 'none'}
                        stroke={i < Math.floor(product.rating) ? '#fbbf24' : '#d1d5db'}
                      />
                    ))}
                  </div>
                  <div className="review-count">Based on {product.reviewCount} reviews</div>
                </div>

                <div className="rating-bars">
                  {ratingDistribution.map((dist) => (
                    <div key={dist.stars} className="rating-bar-row">
                      <span className="star-label">{dist.stars}</span>
                      <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
                      <div className="bar-container">
                        <div className="bar-fill" style={{ width: `${dist.percentage}%` }}></div>
                      </div>
                      <span className="percentage-label">{dist.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <img src={review.avatar} alt={review.name} className="reviewer-avatar" />
                      <div className="reviewer-info">
                        <h4 className="reviewer-name">{review.name}</h4>
                        <span className="review-date">{review.date}</span>
                      </div>
                    </div>
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < review.rating ? '#fbbf24' : 'none'}
                          stroke={i < review.rating ? '#fbbf24' : '#d1d5db'}
                        />
                      ))}
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Q&A Tab */}
          {activeTab === 'qa' && (
            <div className="tab-panel">
              <h2>Questions & Answers</h2>
              <div className="qa-list">
                {questions.map((qa) => (
                  <div key={qa.id} className="qa-card">
                    <div className="question-section">
                      <img src={qa.avatar} alt={qa.user} className="user-avatar" />
                      <div className="question-content">
                        <h4 className="user-name">{qa.user}</h4>
                        <span className="qa-date">{qa.date}</span>
                        <p className="question-text">{qa.question}</p>
                      </div>
                    </div>
                    {qa.answer && (
                      <div className="answer-section">
                        <img src="https://i.pravatar.cc/150?img=10" alt={qa.answer.user} className="user-avatar" />
                        <div className="answer-content">
                          <h4 className="user-name">{qa.answer.user}</h4>
                          <span className="qa-date">{qa.answer.date}</span>
                          <p className="answer-text">{qa.answer.text}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button className="btn-ask-question">Ask a Question</button>
            </div>
          )}
        </div>
      </div>

      {/* ============================================
          RELATED PRODUCTS SECTION
          ============================================ */}
      <div className="related-products">
        <h2>You Might Also Like</h2>
        <div className="related-grid">
          {relatedProducts.map((item) => (
            <div key={item.id} className="related-card">
              <div className="related-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="related-info">
                <h3 className="related-name">{item.name}</h3>
                <p className="related-price">${item.price.toFixed(2)}</p>
                <button className="btn-view-product">View Product</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>

    
    
  );

};

export default ProductDetail;