// src/hooks/useDeviceDetection.js

import { useState, useEffect } from 'react';

/**
 * Device type detection hook
 * Detects mobile/tablet/desktop and provides manual override
 * 
 * Features:
 * - Auto-detection based on screen width
 * - Manual toggle option
 * - Responsive to window resize
 * - Persists user preference in localStorage
 * 
 * @returns {Object} { isMobile, isTablet, isDesktop, deviceType, toggleView, resetView }
 */
const useDeviceDetection = () => {
  // Breakpoints (adjust based on your design system)
  const BREAKPOINTS = {
    MOBILE: 768,
    TABLET: 1024,
  };

  /**
   * Detect device type based on screen width
   */
  const detectDeviceType = () => {
    const width = window.innerWidth;
    
    if (width < BREAKPOINTS.MOBILE) {
      return 'mobile';
    } else if (width < BREAKPOINTS.TABLET) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  };

  // Check localStorage for user preference
  const getUserPreference = () => {
    try {
      return localStorage.getItem('viewPreference');
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return null;
    }
  };

  // Initialize state with user preference or auto-detected type
  const [deviceType, setDeviceType] = useState(() => {
    const preference = getUserPreference();
    return preference || detectDeviceType();
  });

  const [isManualOverride, setIsManualOverride] = useState(() => {
    return !!getUserPreference();
  });

  /**
   * Handle window resize
   * Only auto-update if user hasn't manually set a preference
   */
  useEffect(() => {
    // Skip auto-detection if user has manual preference
    if (isManualOverride) {
      return;
    }

    const handleResize = () => {
      const newDeviceType = detectDeviceType();
      setDeviceType(newDeviceType);
    };

    // Debounce resize event for performance
    let timeoutId;
    const debouncedHandleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', debouncedHandleResize);
    
    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
      clearTimeout(timeoutId);
    };
  }, [isManualOverride]);

  /**
   * Manually toggle between mobile and desktop view
   * Used for buyer role to switch between views
   */
  const toggleView = () => {
    const newType = deviceType === 'mobile' ? 'desktop' : 'mobile';
    setDeviceType(newType);
    setIsManualOverride(true);
    
    // Persist preference
    try {
      localStorage.setItem('viewPreference', newType);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  /**
   * Reset to auto-detection
   * Removes manual preference and detects device automatically
   */
  const resetView = () => {
    setIsManualOverride(false);
    setDeviceType(detectDeviceType());
    
    try {
      localStorage.removeItem('viewPreference');
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  };

  /**
   * Force a specific view type
   * 
   * @param {string} type - 'mobile', 'tablet', or 'desktop'
   */
  const setView = (type) => {
    if (!['mobile', 'tablet', 'desktop'].includes(type)) {
      console.error('Invalid device type:', type);
      return;
    }
    
    setDeviceType(type);
    setIsManualOverride(true);
    
    try {
      localStorage.setItem('viewPreference', type);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return {
    deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    isManualOverride,
    toggleView,
    resetView,
    setView,
  };
};

export default useDeviceDetection;