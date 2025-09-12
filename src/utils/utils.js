import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useSpring, useTransform } from "framer-motion";

let previousItems = [];

export function randomWithoutRepetition(arr) {
  if (arr.length === 0) {
    throw new Error("Array must contain at least one item.");
  }
  if (previousItems.length === arr.length) {
    previousItems = [];
  }
  const availableItems = arr.filter(item => !previousItems.includes(item));
  const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
  previousItems.push(randomItem);

  return randomItem;
}


export function useSmoothTransform(value, springOptions, transformer) {
  return useSpring(useTransform(value, transformer), springOptions);
}
 
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Comprehensive device detection utilities
 */
export const deviceDetection = {
  // Check if device is mobile (phones)
  isMobile: () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = [
      'android', 'webos', 'iphone', 'ipod', 'blackberry', 
      'windows phone', 'opera mini', 'iemobile', 'mobile'
    ];
    return mobileKeywords.some(keyword => userAgent.includes(keyword)) || 
           (window.innerWidth <= 768 && 'ontouchstart' in window);
  },

  // Check if device is tablet
  isTablet: () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIPad = userAgent.includes('ipad') || 
                   (userAgent.includes('macintosh') && 'ontouchstart' in window);
    const isAndroidTablet = userAgent.includes('android') && !userAgent.includes('mobile');
    const isGenericTablet = window.innerWidth > 768 && window.innerWidth <= 1024 && 'ontouchstart' in window;
    
    return isIPad || isAndroidTablet || isGenericTablet;
  },

  // Check if device is desktop
  isDesktop: () => {
    return !deviceDetection.isMobile() && !deviceDetection.isTablet();
  },

  // Check if device has touch capabilities
  isTouchDevice: () => {
    return 'ontouchstart' in window || 
           navigator.maxTouchPoints > 0 || 
           navigator.msMaxTouchPoints > 0;
  },

  // Check if device supports hover (fine pointer)
  supportsHover: () => {
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  },

  // Get device type as string
  getDeviceType: () => {
    if (deviceDetection.isMobile()) return 'mobile';
    if (deviceDetection.isTablet()) return 'tablet';
    return 'desktop';
  },

  // Get screen size category
  getScreenSize: () => {
    const width = window.innerWidth;
    if (width < 640) return 'xs';
    if (width < 768) return 'sm';
    if (width < 1024) return 'md';
    if (width < 1280) return 'lg';
    if (width < 1536) return 'xl';
    return '2xl';
  },

  // Check if device should use custom cursor (desktop with fine pointer)
  shouldUseCustomCursor: () => {
    return deviceDetection.isDesktop() && 
           deviceDetection.supportsHover() && 
           !deviceDetection.isTouchDevice();
  },

  // Get device info object
  getDeviceInfo: () => {
    return {
      type: deviceDetection.getDeviceType(),
      screenSize: deviceDetection.getScreenSize(),
      isMobile: deviceDetection.isMobile(),
      isTablet: deviceDetection.isTablet(),
      isDesktop: deviceDetection.isDesktop(),
      isTouchDevice: deviceDetection.isTouchDevice(),
      supportsHover: deviceDetection.supportsHover(),
      shouldUseCustomCursor: deviceDetection.shouldUseCustomCursor(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }
};






