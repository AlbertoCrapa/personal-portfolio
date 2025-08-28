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
    // Read from localStorage on first load
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hasPlayedInitialAnimation') === 'true';
    }
    return false;
  });

  // Wrap setter to also update localStorage
  const setHasPlayedInitialAnimation = (value) => {
    setHasPlayedInitialAnimationState(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasPlayedInitialAnimation', value ? 'true' : 'false');
    }
  };

  useEffect(() => {
    // Sync state with localStorage if it changes elsewhere
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
