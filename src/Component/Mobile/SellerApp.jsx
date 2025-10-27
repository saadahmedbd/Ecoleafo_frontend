// ==========================================
// SELLER APP - MAIN COMPONENT
// ==========================================
// Purpose: Main seller application with routing and layout
// Features: Authentication routes, protected dashboard routes, responsive layout
// ==========================================

import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

// Auth Components
import SellerLogin from "./Seller/SellerLogin";
import SellerRegister from "./Seller/SellerRegister";

// Layout Components
import SellerSidebar from "./Seller/SellerSidebar";
import SellerTopNav from "./Seller/SellerTopNav";
import SellerBottomNav from "./Seller/SellerBottomNav";

// Page Components
import SellerDashboard from "./Seller/SellerDashboard";
import SellerProducts from "./Seller/SellerProducts";
import SellerProductForm from "./Seller/SellerProductForm";
import SellerOrders from "./Seller/SellerOrders";
import SellerInventory from "./Seller/SellerInventory";
import SellerPayouts from "./Seller/SellerPayouts";
import SellerMessages from "./Seller/SellerMessages";
import SellerSettings from "./Seller/SellerSettings";
import SellerAccount from "./Seller/SellerAccount";

// Icons
import { Plus } from "lucide-react";

// ==========================================
// PROTECTED ROUTE WRAPPER
// ==========================================
/**
 * Protects routes that require authentication
 * Redirects to login if user is not authenticated
 */
function ProtectedRoute({ children }) {
  // TODO: Replace with actual auth check from context/localStorage
  const isAuthenticated = localStorage.getItem('seller_token');
  
  if (!isAuthenticated) {
    return <Navigate to="/seller/login" replace />;
  }
  
  return children;
}

// ==========================================
// PUBLIC ROUTE WRAPPER
// ==========================================
/**
 * Routes accessible without authentication
 * Redirects to dashboard if already authenticated
 */
function PublicRoute({ children }) {
  // TODO: Replace with actual auth check from context/localStorage
  const isAuthenticated = localStorage.getItem('seller_token');
  
  if (isAuthenticated) {
    return <Navigate to="/seller/dashboard" replace />;
  }
  
  return children;
}

// ==========================================
// MAIN SELLER APP COMPONENT
// ==========================================
export default function SellerApp() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Check if current route requires authentication
  const isAuthRoute = location.pathname.includes('/login') || 
                      location.pathname.includes('/register');

  // ==========================================
  // RESPONSIVE LAYOUT HANDLER
  // ==========================================
  /**
   * Handle window resize for responsive sidebar
   */
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-collapse sidebar on mobile, expand on desktop
      setSidebarOpen(!mobile);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ==========================================
  // DEFAULT ROUTE HANDLER
  // ==========================================
  /**
   * Redirect /seller to /seller/dashboard
   */
  useEffect(() => {
    if (location.pathname === "/seller" || location.pathname === "/seller/") {
      navigate("/seller/dashboard");
    }
  }, [location.pathname, navigate]);

  // ==========================================
  // ACTION HANDLERS
  // ==========================================
  
  /**
   * Handle add product button click
   */
  const handleAddProduct = () => {
    navigate("/seller/products");
    toast.success("Opening product creation form");
  };

  // ==========================================
  // RENDER AUTH PAGES (No Layout)
  // ==========================================
  if (isAuthRoute) {
    return (
      <>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="login" element={
            <PublicRoute>
              <SellerLogin />
            </PublicRoute>
          } />
          <Route path="register" element={
            <PublicRoute>
              <SellerRegister />
            </PublicRoute>
          } />
        </Routes>
      </>
    );
  }

  // ==========================================
  // RENDER DASHBOARD PAGES (With Layout)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Toaster position="top-right" richColors />

      {/* ==========================================
          DESKTOP SIDEBAR
          ========================================== */}
      {!isMobile && (
        <SellerSidebar
          currentPath={location.pathname}
          onNavigate={(path) => navigate(path)}
          isCollapsed={!sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      )}

      {/* ==========================================
          MOBILE SIDEBAR WITH OVERLAY
          ========================================== */}
      {isMobile && sidebarOpen && (
        <>
          {/* Dark overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          
          {/* Sidebar */}
          <div className="fixed left-0 top-0 bottom-0 z-50 w-64">
            <SellerSidebar
              currentPath={location.pathname}
              onNavigate={(path) => {
                navigate(path);
                setSidebarOpen(false);
              }}
              isCollapsed={false}
            />
          </div>
        </>
      )}

      {/* ==========================================
          MAIN CONTENT AREA
          ========================================== */}
      <div
        className={`transition-all duration-300 ${
          !isMobile && sidebarOpen ? "lg:ml-64" : !isMobile ? "lg:ml-20" : ""
        }`}
      >
        {/* Top Navigation Bar */}
        <SellerTopNav
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          isMobile={isMobile}
        />

        {/* Main Content */}
        <main className="p-4 md:p-6 pb-24 md:pb-6">
          <Routes>
            {/* Default redirect */}
            <Route path="/" element={
              <ProtectedRoute>
                <SellerDashboard />
              </ProtectedRoute>
            } />
            
            {/* Dashboard Routes (Protected) */}
            <Route path="dashboard" element={
              <ProtectedRoute>
                <SellerDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="products" element={
              <ProtectedRoute>
                <SellerProducts />
              </ProtectedRoute>
            } />
            
            <Route path="orders" element={
              <ProtectedRoute>
                <SellerOrders />
              </ProtectedRoute>
            } />
            
            <Route path="inventory" element={
              <ProtectedRoute>
                <SellerInventory />
              </ProtectedRoute>
            } />
            
            <Route path="payouts" element={
              <ProtectedRoute>
                <SellerPayouts />
              </ProtectedRoute>
            } />
            
            <Route path="messages" element={
              <ProtectedRoute>
                <SellerMessages />
              </ProtectedRoute>
            } />
            
            <Route path="settings" element={
              <ProtectedRoute>
                <SellerSettings />
              </ProtectedRoute>
            } />
            
            <Route path="account" element={
              <ProtectedRoute>
                <SellerAccount />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>

      {/* ==========================================
          MOBILE BOTTOM NAVIGATION
          ========================================== */}
      {isMobile && (
        <SellerBottomNav
          currentPath={location.pathname}
          onNavigate={(path) => navigate(path)}
        />
      )}

      {/* ==========================================
          FLOATING ADD PRODUCT BUTTON (Mobile Only)
          ========================================== */}
      {isMobile && !isAuthRoute && (
        <button
          onClick={handleAddProduct}
          className="fixed bottom-20 right-4 z-30 w-14 h-14 bg-[#FF9900] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#E68A00] transition-all hover:scale-110 active:scale-95"
          aria-label="Add Product"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

// ==========================================
// USAGE NOTES
// ==========================================
/**
 * Directory Structure:
 * 
 
 * Routes:
 * - /seller/login - Login page (public)
 * - /seller/register - Registration page (public)
 * - /seller/dashboard - Main dashboard (protected)
 * - /seller/products - Products management (protected)
 * - /seller/orders - Orders management (protected)
 * - /seller/inventory - Inventory management (protected)
 * - /seller/payouts - Payouts & earnings (protected)
 * - /seller/messages - Customer messages (protected)
 * - /seller/settings - Seller settings (protected)
 * - /seller/account - Account settings (protected)
 * 
 * Authentication Flow:
 * 1. User visits /seller/register
 * 2. Completes 4-step registration
 * 3. Account created, pending admin approval
 * 4. User can login at /seller/login
 * 5. After approval, user can access dashboard
 * 
 * TODO: Backend Integration
 * - Replace localStorage auth check with proper auth context/provider
 * - Connect login API endpoint
 * - Connect registration API endpoint
 * - Implement token refresh logic
 * - Add profile completion status check
 * - Handle admin approval status
 */