import { useEffect, useRef } from 'react';

/**
 * Performance monitoring hook for React components
 * @param {string} componentName - Name of the component to monitor
 * @param {Object} dependencies - Dependencies to monitor for re-renders
 */
export const usePerformanceMonitor = (componentName, dependencies = {}) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      console.log(`🎯 ${componentName} mounted`);
      return;
    }

    renderCount.current++;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    lastRenderTime.current = now;

    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 ${componentName} re-rendered (#${renderCount.current}) - ${timeSinceLastRender}ms since last render`);
      
      if (timeSinceLastRender < 16) {
        console.warn(`⚠️ ${componentName} rendering too frequently (${timeSinceLastRender}ms)`);
      }
    }
  });

  // Log dependency changes
  const dependencyKeys = Object.keys(dependencies);
  const dependencyValues = Object.values(dependencies);
  
  useEffect(() => {
    if (mounted.current && process.env.NODE_ENV === 'development') {
      console.log(`📦 ${componentName} dependencies changed:`, dependencyKeys);
    }
  }, dependencyValues);
};

/**
 * Performance timing hook for measuring function execution
 * @param {string} label - Label for the timing measurement  
 */
export const usePerformanceTiming = (label) => {
  const startTiming = (operationLabel = '') => {
    const fullLabel = operationLabel ? `${label}-${operationLabel}` : label;
    performance.mark(`${fullLabel}-start`);
  };

  const endTiming = (operationLabel = '') => {
    const fullLabel = operationLabel ? `${label}-${operationLabel}` : label;
    performance.mark(`${fullLabel}-end`);
    performance.measure(fullLabel, `${fullLabel}-start`, `${fullLabel}-end`);
    
    if (process.env.NODE_ENV === 'development') {
      const measure = performance.getEntriesByName(fullLabel)[0];
      console.log(`⏱️ ${fullLabel}: ${measure.duration.toFixed(2)}ms`);
    }
  };

  return { startTiming, endTiming };
};
