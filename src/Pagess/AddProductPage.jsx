import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import './AddProductPage.css'

const AddProductPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    price: '',
    quantity: '',
    description: '',
    age: '',
    height: '',
    care_instructions: ''
  });
  
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const categories = [
    { id: 1, name: 'Fruit Trees' },
    { id: 2, name: 'Ornamental Trees' },
    { id: 3, name: 'Shade Trees' },
    { id: 4, name: 'Indoor Plants' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem('token');
      
      // Create product
      const productResponse = await fetch('http://localhost:3000/api/addproducts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          category_id: parseInt(formData.category_id),
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity),
          description: formData.description,
          age: formData.age,
          height: formData.height,
          sku: `SKU-${Date.now()}`,
          tree_type: 'ornamental'
        })
      });

      if (!productResponse.ok) throw new Error('Failed to create product');
      
      const productData = await productResponse.json();
      const productId = productData.id;

      // Upload images if any
      if (images.length > 0) {
        const formDataImages = new FormData();
        images.forEach(img => {
          formDataImages.append('images', img.file);
        });

        await fetch(`http://localhost:3000/api/products/${productId}/images/multiple`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataImages
        });
      }

      setMessage({ type: 'success', text: 'Product added successfully!' });
      // Reset form
      setFormData({
        name: '', category_id: '', price: '', quantity: '',
        description: '', age: '', height: '', care_instructions: ''
      });
      setImages([]);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon"></div>
            <span className="logo-text">Evergreen Emporium</span>
          </div>
          <nav className="nav">
            <a href="#" className="nav-link">Shop</a>
            <a href="#" className="nav-link">About</a>
            <a href="#" className="nav-link">Contact</a>
          </nav>
          <div className="header-actions">
            <button className="icon-button">🔍</button>
            <button className="icon-button">🛒</button>
            <div className="avatar"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        <div className="form-container">
          <h1 className="title">Add New Tree Product</h1>
          
          {message.text && (
            <div style={{
              ...styles.message,
              backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
              color: message.type === 'success' ? '#155724' : '#721c24'
            }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Product Name */}
            <div className="form-group">
              <label className="label">
                Product Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Japanese Maple"
                className="input"
                required
              />
              <p className="help-text">This field is required.</p>
            </div>

            {/* Row: Category, Price, Stock */}
            <div className="row">
              <div className="form-group">
                <label className="label">
                  Category <span className="required">*</span>
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className="select"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="label">
                  Price ($) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g., 79.99"
                  step="0.01"
                  className="input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="label">
                  Stock Quantity <span className="required">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="e.g., 15"
                  className="input"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide a detailed description of the tree..."
                className="textarea"
                rows="5"
              />
            </div>

            {/* Row: Age, Size */}
            <div className="row">
              <div className="form-group">
                <label className="label">Tree Age (years)</label>
                <input
                  type="text"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="e.g., 5"
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="label">Size (cm)</label>
                <input
                  type="text"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  placeholder="e.g., 120cm"
                  className="input"
                />
              </div>
            </div>

            {/* Care Instructions */}
            <div className="form-group">
              <label className="label">Care Instructions</label>
              <textarea
                name="care_instructions"
                value={formData.care_instructions}
                onChange={handleInputChange}
                placeholder="e.g., Water weekly, full sun..."
                className="textarea"
                rows="4"
              />
            </div>

            {/* Product Images */}
            <div className="form-group">
              <label className="label">Product Images</label>
              <div className="upload-area">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="upload-label">
                  <Upload size={40} color="#22c55e" />
                  <p className="upload-text">
                    <span className="upload-link">Upload files</span> or drag and drop
                  </p>
                  <p className="upload-hint">PNG, JPG, GIF up to 10MB</p>
                </label>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="image-grid">
                  {images.map((img, index) => (
                    <div key={index} className="image-preview">
                      <img src={img.preview} alt="Preview" className="preview-img" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="remove-btn"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="submit-container">
              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

;

export default AddProductPage;