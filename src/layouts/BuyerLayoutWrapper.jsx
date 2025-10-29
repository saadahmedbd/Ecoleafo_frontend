// src/layouts/BuyerLayoutWrapper.jsx

import useDeviceDetection from '@/hooks/useDeviceDetection';
import BuyerLayout from './BuyerLayout';
import BuyerMobileLayout from './BuyerMobileLayout';

/**
 * Buyer Layout Wrapper
 * Automatically switches between mobile and desktop layouts
 * based on device detection or user preference
 * 
 * Features:
 * - Auto-detects device type
 * - Respects user's manual preference
 * - Seamlessly switches between layouts
 * - Maintains state across layout changes
 * 
 * @returns {React.ReactNode}
 */
const BuyerLayoutWrapper = () => {
  const { isMobile, isTablet } = useDeviceDetection();

  // Treat tablets as desktop for better experience
  // You can adjust this logic based on your requirements
  const shouldUseMobileLayout = isMobile && !isTablet;

  return shouldUseMobileLayout ? <BuyerMobileLayout /> : <BuyerLayout />;
};

export default BuyerLayoutWrapper;