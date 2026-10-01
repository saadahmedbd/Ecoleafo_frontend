// src/guards/AuthGuard.jsx
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { selectIsAuthenticated, selectUser } from "@/features/auth/authSlice";
import BuyerAuthService from "@/services/BuyerAuthService";
import SellerAuthService from "@/services/SellerAuthService";
// import AdminAuthService from "@/services/AdminAuthService";
import { useEffect } from "react";

/**
 * Universal AuthGuard
 * Supports Buyer, Seller, and Admin authentication
 */
const AuthGuard = ({ children }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const location = useLocation();
  const navigate = useNavigate();

  // Determine role from user data or from current path
  const userRole = user?.userType || user?.role || 
    (location.pathname.startsWith('/admin') ? 'admin' :
     location.pathname.startsWith('/seller') ? 'seller' : 'buyer');

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/${userRole}/login`}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Optional: Check session on mount (commented out to prevent redirect issues)
  // useEffect(() => {
  //   const checkSession = async () => {
  //     let isValid = true;

  //     try {
  //       if (userRole === "buyer") {
  //         isValid = await BuyerAuthService.refreshSession();
  //       } else if (userRole === "seller") {
  //         isValid = await SellerAuthService.refreshSession();
  //       }

  //       if (!isValid) {
  //         navigate(`/${userRole}/login`, { replace: true });
  //       }
  //     } catch (err) {
  //       console.error("Session check failed:", err);
  //       navigate(`/${userRole}/login`, { replace: true });
  //     }
  //   };

  //   checkSession();
  // }, [userRole, navigate]);

  // Authenticated -> render children
  return children;
};

export default AuthGuard;
