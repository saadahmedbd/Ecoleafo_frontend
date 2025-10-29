// src/App.jsx

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import AppRoutes from './routes';
import './index.css';

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
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;