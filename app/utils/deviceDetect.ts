import * as React from 'react';

/**
 * Detects if the current device is a mobile device
 * @returns {boolean} True if the device is a mobile device
 */
export const isMobileDevice = (): boolean => {
  // Check if window is defined (browser environment)
  if (typeof window === 'undefined' || !window.navigator) {
    return false;
  }
  
  const userAgent = 
    window.navigator.userAgent || 
    window.navigator.vendor || 
    (window as any).opera ||
    '';
  
  // Common mobile device regex patterns
  const mobileRegex = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
    /Mobile/i,
    /Tablet/i
  ];

  // Check screen size as a fallback
  const hasTouchScreen = 'ontouchstart' in window || 
    navigator.maxTouchPoints > 0 || 
    (navigator as any).msMaxTouchPoints > 0;

  const isSmallScreen = window.innerWidth <= 768;
  
  // Check if any mobile pattern matches or if it's a small touch device
  return mobileRegex.some(pattern => userAgent.match(pattern)) || 
         (hasTouchScreen && isSmallScreen);
};

/**
 * Custom hook to detect if the current device is mobile
 * @returns {boolean} True if the device is a mobile device
 */
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      // Set initial value
      const checkMobile = () => {
        const mobile = isMobileDevice();
        console.log('Is mobile device:', mobile, 'UserAgent:', navigator.userAgent);
        setIsMobile(mobile);
      };
      
      checkMobile();
      
      // Add resize and orientation change listeners
      window.addEventListener('resize', checkMobile);
      window.addEventListener('orientationchange', checkMobile);
      
      return () => {
        window.removeEventListener('resize', checkMobile);
        window.removeEventListener('orientationchange', checkMobile);
      };
    }
  }, []);

  return isMobile;
};
