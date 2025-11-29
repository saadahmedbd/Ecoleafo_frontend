import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AdminAuthService from '@/services/adminAuthService';
import { setAdminAuth, clearAdminAuth, selectAdminAuth } from '@/features/auth/authSlice';

/**
 * AdminGuard - Protects admin routes
 * Checks:
 * 1. If user is authenticated
 * 2. If user has admin role
 */
export default function AdminGuard({ children }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const adminAuth = useSelector(selectAdminAuth);
  const adminAuthService = new AdminAuthService(dispatch);
  
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    verifyAdminAccess();
  }, []);

  const verifyAdminAccess = async () => {
    setIsVerifying(true);

    try {
      // Check local authentication
      const isLocallyAuthenticated = adminAuthService.isAuthenticated();
      const storedUser = adminAuthService.getStoredUser();

      if (!isLocallyAuthenticated || !storedUser) {
        setIsAuthorized(false);
        setIsVerifying(false);
        return;
      }

      // Verify user is admin
      if (storedUser.userType !== 'admin') {
        console.warn('User is not an admin');
        adminAuthService.clearStoredData();
        dispatch(clearAdminAuth());
        setIsAuthorized(false);
        setIsVerifying(false);
        return;
      }

      // Update Redux state if not already set
      if (!adminAuth.isAuthenticated) {
        dispatch(setAdminAuth({
          user: storedUser,
          token: adminAuthService.getStoredToken(),
          refresh_token: adminAuthService.getStoredRefreshToken(),
        }));
      }

      // Local authentication valid - authorize
      setIsAuthorized(true);
    } catch (error) {
      console.error('Admin verification error:', error);
      setIsAuthorized(false);
    } finally {
      setIsVerifying(false);
    }
  };

  // Loading state
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#FFF5F2] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#064232] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#666666]">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Unauthorized - redirect to login
  if (!isAuthorized) {
    return (
      <Navigate 
        to="/admin/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Authorized - render protected content
  return children;
}