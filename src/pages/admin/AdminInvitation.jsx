import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './Login.css';

function AdminInvitation() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    department: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    // Simulate registration
    navigate('/login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="login-page">
      <div className="login-container" style={{ maxWidth: '520px' }}>
        <div className="login-card card">
          <div className="login-logo">
            <div className="logo-icon">🌳</div>
            <h1>Complete Registration</h1>
            <p style={{ color: 'var(--gray-text)', marginTop: '8px' }}>
              Create your admin account to get started
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Invitation Token</label>
              <input
                type="text"
                className="form-input"
                value={token}
                readOnly
                style={{ backgroundColor: 'var(--background-cream)' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="fullName" className="form-label">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="form-input"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-input"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-input"
                placeholder="+1234567890"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="department" className="form-label">Department</label>
              <select
                id="department"
                name="department"
                className="form-select"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                <option value="operations">Operations</option>
                <option value="sales">Sales</option>
                <option value="support">Customer Support</option>
                <option value="finance">Finance</option>
                <option value="it">IT</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-input"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg login-button">
              Complete Registration
            </button>

            <div className="login-footer">
              <Link to="/login" className="forgot-password-link">
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </div>
        
        <p className="login-copyright">
          © 2024 TreeShop Admin. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default AdminInvitation;
