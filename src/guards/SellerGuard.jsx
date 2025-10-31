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

    // Check if user is authenticated
    if (!SellerAuthService.isAuthenticated) {
      setRedirectTo('/seller/login');
      setIsChecking(false);
      return;
    }
    try {
    // Get fresh profile status
    const response = await SellerAuthService.getProfileStatus();
    
    if (!response.success) {
      setRedirectTo('/seller/login');
      setIsChecking(false);
      return;
    }

    const status = response.data;
    
    // Determine redirect based on status
    if (!status.is_approved) {
      if (status.approval_status === 'rejected') {
        setRedirectTo('/seller/account-rejected');
      } else {
        setRedirectTo('/seller/pending-approval');
      }
    } else if (!status.is_profile_complete) {
      setRedirectTo('/seller/complete-profile');
    } else if (!status.has_payment_method) {
      setRedirectTo('/seller/add-payment');
    } else {
      // All good - no redirect needed
      setRedirectTo(null);
    }
    } catch (err) {
        console.error('Seller status check error:', err);
        setRedirectTo('/seller/login');
    } finally {
        setIsChecking(false);
    }


    // Check if user is a seller
    if (userRole !== 'seller') {
      setRedirectTo('/unauthorized');
      setIsChecking(false);
      return;
    }

    // Get token
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setRedirectTo('/seller/login');
      setIsChecking(false);
      return;
    }

    try {
      // Fetch profile status from backend
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/seller/profile/status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          setRedirectTo('/seller/login');
          setIsChecking(false);
          return;
        }
        throw new Error('Failed to fetch profile status');
      }

      const status = await response.json();
      setProfileStatus(status);

      // Determine redirect based on profile status
      const redirect = determineRedirect(status, location.pathname);
      setRedirectTo(redirect);

    } catch (error) {
      console.error('Seller status check error:', error);
      // On error, allow access but log the issue
      setRedirectTo(null);
    } finally {
      setIsChecking(false);
    }
  };

  /**
   * Determine where to redirect based on profile status
   */
  const determineRedirect = (status, currentPath) => {
    // Allow access to these pages without full profile
    const allowedIncompletePages = [
      '/seller/complete-profile',
      '/seller/add-payment',
      '/seller/pending-approval',
      '/seller/account-rejected',
    ];

    if (allowedIncompletePages.includes(currentPath)) {
      // Already on an allowed page
      return null;
    }

    // Check approval status
    if (!status.is_approved) {
      if (status.approval_status === 'rejected') {
        return '/seller/account-rejected';
      }
      return '/seller/pending-approval';
    }

    // Check profile completion
    if (!status.is_profile_complete) {
      if (!status.has_business_info || !status.has_address) {
        return '/seller/complete-profile';
      }
    }

    // Check payment method
    if (!status.has_payment_method) {
      return '/seller/add-payment';
    }

    // Check if seller can add products
    if (!status.can_add_products) {
      return '/seller/pending-approval';
    }

    // All checks passed
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