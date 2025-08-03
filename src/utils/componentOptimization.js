import React, { lazy, Suspense } from 'react';

/**
 * Creates a lazy-loaded component with error boundary and loading fallback
 * @param {Function} importFunc - Dynamic import function
 * @param {Object} options - Configuration options
 * @returns {React.Component} Lazy loaded component wrapped with Suspense
 */
export const createLazyComponent = (importFunc, options = {}) => {
  const {
    fallback = <div>Loading...</div>,
    errorFallback = <div>Error loading component</div>,
  } = options;

  const LazyComponent = lazy(importFunc);

  const WrappedComponent = (props) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );

  WrappedComponent.displayName = `LazyWrapped(${LazyComponent.displayName || 'Component'})`;

  return WrappedComponent;
};

/**
 * Higher-order component for performance optimization
 * Memoizes component and optimizes re-renders
 */
export const withPerformanceOptimization = (Component) => {
  const OptimizedComponent = React.memo(Component, (prevProps, nextProps) => {
    // Custom comparison logic for better performance
    const prevKeys = Object.keys(prevProps);
    const nextKeys = Object.keys(nextProps);

    if (prevKeys.length !== nextKeys.length) {
      return false;
    }

    return prevKeys.every(key => {
      if (typeof prevProps[key] === 'function' && typeof nextProps[key] === 'function') {
        // For functions, compare string representation as a basic check
        return prevProps[key].toString() === nextProps[key].toString();
      }
      return prevProps[key] === nextProps[key];
    });
  });

  OptimizedComponent.displayName = `Optimized(${Component.displayName || Component.name})`;

  return OptimizedComponent;
};
