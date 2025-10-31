// src/App.jsx

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import React, { useEffect } from 'react';

import AppRoutes from './routes/index';
import './index.css';
import BuyerAuthService from './services/BuyerAuthService';
import SellerAuthService from './services/SellerAuthService';

/**
 * Main Application Component
 * Sets up Redux Provider and React Router
 * 
 * Features:
 * - Redux state management
 * - React Router for navigation
 * - Role-based routing
 * - Device-aware layouts
 * 
 * @returns {React.ReactNode}
 */
function App() {
  useEffect(() => {
    // Validate session on app start
    const validateAuth = async () => {
      // Check buyer session
      await BuyerAuthService.validateSession();
      
      // Check seller session
      await SellerAuthService.validateSession();
    };

    validateAuth();
  }, []);
  
  return (
    <Provider store={store}>
        <AppRoutes />
    
    </Provider>
  );
}

export default App;