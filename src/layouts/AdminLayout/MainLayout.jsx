import React, { useState } from 'react';
import TopNav from './TopNav';
import Sidebar from './Sidebar';

export default function MainLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F2]">
      <TopNav toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1920px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
