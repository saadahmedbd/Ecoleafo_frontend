// ==========================================
// SELLER GUARD COMPONENT
// ==========================================
// Purpose: Protect seller routes with comprehensive profile checks
// Checks: Authentication, Approval Status, Profile Completion, Payment Methods
// Redirects: Based on what's missing in the seller's profile
// ==========================================

import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectIsAuthenticated, selectUserRole } from '../features/auth/authSlice';
import SellerAuthService from '../services/SellerAuthService';
/**
 * Loading component
 */
const LoadingScreen = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Verifying seller access...</p>
    </div>
  </div>
);

/**
 * Seller Guard Component
 * Wraps seller routes to ensure proper authentication and profile completion
 */
export default function SellerGuard({ children }) {
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userRole = useAppSelector(selectUserRole);
  
  const [isChecking, setIsChecking] = useState(true);
  const [profileStatus, setProfileStatus] = useState(null);
  const [redirectTo, setRedirectTo] = useState(null);

  // ==========================================
  // CHECK SELLER STATUS
  // ==========================================
  useEffect(() => {
    checkSellerStatus();
  }, [isAuthenticated, userRole]);

  /**
   * Check if seller has completed all required steps
   */
  const checkSellerStatus = async () => {
    setIsChecking(true);
    console.log('[SellerGuard] Checking seller status...');

    // Check if user is authenticated
    if (!SellerAuthService.isAuthenticated()) {
      console.log('[SellerGuard] Not authenticated, redirecting to login');
      setRedirectTo('/seller/login');
      setIsChecking(false);
      return;
    }

    // Check if user is a seller
    if (userRole !== 'seller') {
      console.log('[SellerGuard] Not a seller role:', userRole);
      setRedirectTo('/unauthorized');
      setIsChecking(false);
      return;
    }

    try {
      // Get fresh profile status
      const response = await SellerAuthService.getProfileStatus();
      console.log('[SellerGuard] Profile status response:', response);
      
      if (!response.success) {
        console.log('[SellerGuard] Failed to get profile status');
        setRedirectTo('/seller/login');
        setIsChecking(false);
        return;
      }

      const status = response.data;
      console.log('[SellerGuard] Profile status:', status);
      setProfileStatus(status);
      
      // Determine redirect based on status and current path
      const redirect = determineRedirect(status, location.pathname);
      console.log('[SellerGuard] Determined redirect:', redirect, 'Current path:', location.pathname);
      setRedirectTo(redirect);

    } catch (err) {
      console.error('[SellerGuard] Seller status check error:', err);
      setRedirectTo('/seller/login');
    } finally {
      setIsChecking(false);
    }
  };

  /**
   * Determine where to redirect based on profile status
   */
  const determineRedirect = (status, currentPath) => {
    console.log('[SellerGuard] determineRedirect called with:', { status, currentPath });
    
    // Allow access to these pages without full profile
    const allowedIncompletePages = [
      '/seller/complete-profile',
      '/seller/add-payment',
      '/seller/pending-approval',
      '/seller/account-rejected',
    ];

    if (allowedIncompletePages.includes(currentPath)) {
      console.log('[SellerGuard] Already on allowed incomplete page');
      return null;
    }

    // Check approval status
    console.log('[SellerGuard] Checking approval status:', status.is_approved);
    if (!status.is_approved) {
      if (status.approval_status === 'rejected') {
        console.log('[SellerGuard] Account rejected');
        return '/seller/account-rejected';
      }
      console.log('[SellerGuard] Account pending approval');
      return '/seller/pending-approval';
    }

    // Check profile completion
    console.log('[SellerGuard] Checking profile completion:', status.is_profile_complete);
    if (!status.is_profile_complete) {
      if (!status.has_business_info || !status.has_address) {
        console.log('[SellerGuard] Profile incomplete');
        return '/seller/complete-profile';
      }
    }

    // Check payment method
    console.log('[SellerGuard] Checking payment method:', status.has_payment_method);
    if (!status.has_payment_method) {
      console.log('[SellerGuard] No payment method');
      return '/seller/add-payment';
    }

    // Check if seller can add products
    console.log('[SellerGuard] Checking can_add_products:', status.can_add_products);
    if (!status.can_add_products) {
      console.log('[SellerGuard] Cannot add products yet');
      return '/seller/pending-approval';
    }

    // All checks passed
    console.log('[SellerGuard] All checks passed, allowing access');
    return null;
  };

  // ==========================================
  // RENDER
  // ==========================================

  // Show loading while checking
  if (isChecking) {
    return <LoadingScreen />;
  }

  // Redirect if necessary
  if (redirectTo) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // All checks passed - render protected content
  return <>{children}</>;
}