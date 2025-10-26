import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import SellerSidebar from "./SellerSidebar";
import SellerBottomNav from "./SellerBottomNav";

export default function SellerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Detect screen resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get current page from URL
  const currentPage = location.pathname.split("/")[2] || "dashboard";

  const handleNavigate = (page) => {
    navigate(`/seller/${page}`);
    if (isMobile) setSidebarOpen(false); // auto-close sidebar on mobile
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <SellerSidebar
          currentPage={currentPage}
          isCollapsed={!sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onNavigate={handleNavigate}
        />
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 z-50 w-64">
            <SellerSidebar
              currentPage={currentPage}
              isCollapsed={false}
              onToggle={() => setSidebarOpen(false)}
              onNavigate={handleNavigate}
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
        <main className="p-4 md:p-6 pb-24 md:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <SellerBottomNav currentPage={currentPage} onNavigate={handleNavigate} />
      )}
    </div>
  );
}
