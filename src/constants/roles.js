// src/constants/roles.js

/**
 * User Role Definitions
 * Centralized role configuration for the e-commerce application
 */

export const USER_ROLES = {
  BUYER: 'buyer',
  SELLER: 'seller',
  ADMIN: 'admin',
};

/**
 * Role display names for UI
 */
export const ROLE_LABELS = {
  [USER_ROLES.BUYER]: 'Buyer',
  [USER_ROLES.SELLER]: 'Seller',
  [USER_ROLES.ADMIN]: 'Administrator',
};

/**
 * Default redirect paths after login for each role
 */
export const ROLE_DEFAULT_ROUTES = {
  [USER_ROLES.BUYER]: '/buyer/dashboard',
  [USER_ROLES.SELLER]: '/seller/dashboard',
  [USER_ROLES.ADMIN]: '/admin/dashboard',
};

/**
 * Role-based permissions
 * Define what each role can access/do
 */
export const ROLE_PERMISSIONS = {
  [USER_ROLES.BUYER]: {
    canViewProducts: true,
    canPurchase: true,
    canViewOwnOrders: true,
    canManageCart: true,
    canReview: true,
  },
  [USER_ROLES.SELLER]: {
    canManageOwnProducts: true,
    canViewOwnOrders: true,
    canManageInventory: true,
    canViewAnalytics: true,
  },
  [USER_ROLES.ADMIN]: {
    canManageAllUsers: true,
    canManageAllProducts: true,
    canViewAllOrders: true,
    canManageCategories: true,
    canViewSystemAnalytics: true,
    canManageSettings: true,
  },
};

/**
 * Check if user has specific permission
 * 
 * @param {string} role - User role
 * @param {string} permission - Permission key
 * @returns {boolean}
 */
export const hasPermission = (role, permission) => {
  return ROLE_PERMISSIONS[role]?.[permission] || false;
};

/**
 * Route access configuration
 * Define which roles can access which route patterns
 */
export const ROUTE_ACCESS = {
  '/buyer/*': [USER_ROLES.BUYER],
  '/seller/*': [USER_ROLES.SELLER],
  '/admin/*': [USER_ROLES.ADMIN],
  '/products/*': [USER_ROLES.BUYER, USER_ROLES.SELLER, USER_ROLES.ADMIN], // Shared
};

/**
 * Check if role has access to a route
 * 
 * @param {string} role - User role
 * @param {string} path - Route path
 * @returns {boolean}
 */
export const canAccessRoute = (role, path) => {
  // Check exact match
  if (ROUTE_ACCESS[path]) {
    return ROUTE_ACCESS[path].includes(role);
  }
  
  // Check wildcard match
  const wildcardPath = Object.keys(ROUTE_ACCESS).find(route => {
    if (route.endsWith('/*')) {
      const basePath = route.slice(0, -2);
      return path.startsWith(basePath);
    }
    return false;
  });
  
  if (wildcardPath) {
    return ROUTE_ACCESS[wildcardPath].includes(role);
  }
  
  return false;
};