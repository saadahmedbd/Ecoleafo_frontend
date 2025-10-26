import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

import SellerSidebar from "./Seller/SellerSidebar";
import SellerTopNav from "./Seller/SellerTopNav";
import SellerBottomNav from "./Seller/SellerBottomNav";
import SellerDashboard from "./Seller/SellerDashboard";
import SellerProducts from "./Seller/SellerProducts";
import SellerOrders from "./Seller/SellerOrders";
import SellerInventory from "./Seller/SellerInventory";
import SellerPayouts from "./Seller/SellerPayouts";
import SellerMessages from "./Seller/SellerMessages";
import SellerSettings from "./Seller/SellerSettings";
import SellerAccount from "./Seller/SellerAccount";
import { Plus } from "lucide-react";

export default function SellerApp() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const location = useLocation();

  // Responsive sidebar toggle
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Navigate to dashboard by default when visiting /seller
  useEffect(() => {
    if (location.pathname === "/seller" || location.pathname === "/seller/") {
      navigate("/seller/dashboard");
    }
  }, [location.pathname]);

  const handleAddProduct = () => {
    navigate("/seller/products");
    toast.success("Opening product creation form");
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Toaster position="top-right" richColors />

      {/* Desktop Sidebar */}
      {!isMobile && (
        <SellerSidebar
          currentPath={location.pathname}
          onNavigate={(path) => navigate(path)}
          isCollapsed={!sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      )}

      {/* Mobile Sidebar */}
      {isMobile && sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
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

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          !isMobile && sidebarOpen ? "lg:ml-64" : !isMobile ? "lg:ml-20" : ""
        }`}
      >
        <SellerTopNav
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          isMobile={isMobile}
        />

        <main className="p-4 md:p-6 pb-24 md:pb-6">
          <Routes>
            <Route path="/" element={<SellerDashboard />} />
            <Route path="dashboard" element={<SellerDashboard />} />
            <Route path="products" element={<SellerProducts />} />
            <Route path="orders" element={<SellerOrders />} />
            <Route path="inventory" element={<SellerInventory />} />
            <Route path="payouts" element={<SellerPayouts />} />
            <Route path="messages" element={<SellerMessages />} />
            <Route path="settings" element={<SellerSettings />} />
            <Route path="account" element={<SellerAccount />} />np
          </Routes>
        </main>
      </div>

      {/* Bottom Navigation for mobile */}
      {isMobile && (
        <SellerBottomNav
          currentPath={location.pathname}
          onNavigate={(path) => navigate(path)}
        />
      )}

      {/* Floating Add Product Button */}
      {isMobile && (
        <button
          onClick={handleAddProduct}
          className="fixed bottom-20 right-4 z-30 w-14 h-14 bg-[#FF9900] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#E68A00] transition-all hover:scale-110"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
