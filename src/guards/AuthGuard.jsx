// src/guards/AuthGuard.jsx

import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { selectIsAuthenticated } from '@/features/auth/authSlice';

/**
 * Authentication Guard
 * Protects routes that require authentication
 * Redirects to login if user is not authenticated
 * 
 * Usage:
 * <Route path="/protected" element={<AuthGuard><ProtectedPage /></AuthGuard>} />
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to protect
 * @returns {React.ReactNode}
 */
const AuthGuard = ({ children }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();

  // Redirect to login if not authenticated
  // Save current location to redirect back after login
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // User is authenticated, render children
  return children;
};

export default AuthGuard;