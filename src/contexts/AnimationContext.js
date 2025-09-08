import React, { createContext, useContext, useState, useEffect } from 'react';

const AnimationContext = createContext();

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};

export const AnimationProvider = ({ children }) => {
  const [hasPlayedInitialAnimation, setHasPlayedInitialAnimationState] = useState(() => {
    // Read from sessionStorage on first load
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('hasPlayedInitialAnimation') === 'true';
    }
    return false;
  });

  // Wrap setter to also update sessionStorage
  const setHasPlayedInitialAnimation = (value) => {
    setHasPlayedInitialAnimationState(value);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('hasPlayedInitialAnimation', value ? 'true' : 'false');
    }
  };

  useEffect(() => {
    // Sync state with sessionStorage if it changes elsewhere
    const handleStorage = (e) => {
      if (e.key === 'hasPlayedInitialAnimation') {
        setHasPlayedInitialAnimationState(e.newValue === 'true');
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <AnimationContext.Provider value={{ 
      hasPlayedInitialAnimation, 
      setHasPlayedInitialAnimation 
    }}>
      
      {children}
    </AnimationContext.Provider>
  );
};
