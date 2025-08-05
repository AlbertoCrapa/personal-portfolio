import React, { createContext, useContext, useState } from 'react';

const AnimationContext = createContext();

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};

export const AnimationProvider = ({ children }) => {
  const [hasPlayedInitialAnimation, setHasPlayedInitialAnimation] = useState(false);

  return (
    <AnimationContext.Provider value={{ 
      hasPlayedInitialAnimation, 
      setHasPlayedInitialAnimation 
    }}>
      {children}
    </AnimationContext.Provider>
  );
};
