// src/hooks/useRole.js

import { useAppSelector } from '@/app/hooks';
import { selectUser, selectUserRole } from '@/features/auth/authSlice';
import { USER_ROLES, hasPermission, canAccessRoute } from '@/constants/roles';

/**
 * Role management hook
 * Provides role-based utilities and permission checks
 * 
 * @returns {Object} Role utilities and checks
 */
const useRole = () => {
  const user = useAppSelector(selectUser);
  const role = useAppSelector(selectUserRole);

  /**
   * Check if user has a specific role
   * 
   * @param {string} targetRole - Role to check
   * @returns {boolean}
   */
  const isRole = (targetRole) => {
    return role === targetRole;
  };

  /**
   * Check if user has any of the specified roles
   * 
   * @param {Array<string>} roles - Array of roles to check
   * @returns {boolean}
   */
  const hasAnyRole = (roles) => {
    return roles.includes(role);
  };

  /**
   * Check if user has a specific permission
   * 
   * @param {string} permission - Permission key
   * @returns {boolean}
   */
  const checkPermission = (permission) => {
    if (!role) return false;
    return hasPermission(role, permission);
  };

  /**
   * Check if user can access a specific route
   * 
   * @param {string} path - Route path
   * @returns {boolean}
   */
  const canAccess = (path) => {
    if (!role) return false;
    return canAccessRoute(role, path);
  };

  /**
   * Get role display information
   * 
   * @returns {Object} Role info
   */
  const getRoleInfo = () => {
    return {
      role,
      isBuyer: role === USER_ROLES.BUYER,
      isSeller: role === USER_ROLES.SELLER,
      isAdmin: role === USER_ROLES.ADMIN,
    };
  };

  return {
    role,
    isBuyer: role === USER_ROLES.BUYER,
    isSeller: role === USER_ROLES.SELLER,
    isAdmin: role === USER_ROLES.ADMIN,
    isRole,
    hasAnyRole,
    checkPermission,
    canAccess,
    getRoleInfo,
  };
};

export default useRole;