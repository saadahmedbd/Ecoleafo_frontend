// src/guards/RoleGuard.jsx

import { Navigate } from 'react-router-dom';
import useRole from '@/hooks/useRole';
import { ROLE_DEFAULT_ROUTES } from '@/constants/roles';

/**
 * Role-Based Access Control Guard
 * Restricts route access based on user role
 * Redirects unauthorized users to their default dashboard
 * 
 * Usage:
 * <Route 
 *   path="/admin/*" 
 *   element={
 *     <RoleGuard allowedRoles={['admin']}>
 *       <AdminLayout />
 *     </RoleGuard>
 *   } 
 * />
 * 
 * @param {Object} props - Component props
 * @param {Array<string>} props.allowedRoles - Array of allowed role names
 * @param {React.ReactNode} props.children - Child components to protect
 * @param {string} props.fallbackPath - Custom redirect path (optional)
 * @returns {React.ReactNode}
 */
const RoleGuard = ({ 
  allowedRoles = [], 
  children, 
  fallbackPath = null 
}) => {
  const { role, hasAnyRole } = useRole();

  // Check if user has one of the allowed roles
  const hasAccess = hasAnyRole(allowedRoles);

  if (!hasAccess) {
    // Redirect to role-specific default route or custom fallback
    const redirectPath = fallbackPath || ROLE_DEFAULT_ROUTES[role] || '/';
    
    return <Navigate to={redirectPath} replace />;
  }

  // User has required role, render children
  return children;
};

export default RoleGuard;