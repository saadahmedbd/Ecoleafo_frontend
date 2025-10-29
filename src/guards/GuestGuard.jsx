// src/guards/GuestGuard.jsx

import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { selectIsAuthenticated, selectCurrentUser } from '@/features/auth/authSlice';
import { ROLE_DEFAULT_ROUTES } from '@/constants/roles';

/**
 * Guest Guard
 * Protects routes that should only be accessible to non-authenticated users
 * (e.g., login, register pages)
 * Redirects authenticated users to their role-specific dashboard
 * 
 * Usage:
 * <Route 
 *   path="/login" 
 *   element={<GuestGuard><LoginPage /></GuestGuard>} 
 * />
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components (login/register pages)
 * @returns {React.ReactNode}
 */
const GuestGuard = ({ children }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);

  // If user is authenticated, redirect to their dashboard
  if (isAuthenticated && user) {
    const redirectPath = ROLE_DEFAULT_ROUTES[user.role] || '/';
    return <Navigate to={redirectPath} replace />;
  }

  // User is not authenticated, render children
  return children;
};

export default GuestGuard;