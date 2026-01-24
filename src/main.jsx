// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import './Styles/globals.css';
import { API_BASE_URL } from './utils/constants';

// Debug: Log API URL being used
console.log('🌐 API Base URL:', API_BASE_URL);
console.log('🌐 Runtime Config:', window.APP_CONFIG);
console.log('🌐 Vite Env:', import.meta.env.VITE_API_BASE_URL);

/**
 * Application Entry Point
 * 
 * Sets up Redux Provider to make store available throughout the app
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);