import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { preloadImages } from "../../utils/imagePreloader";

const Smile = React.memo(() => {
  const location = useLocation();
  const [clicks, setClicks] = useState(0);
  const [isHurt, setIsHurt] = useState(false);
  const [isLove, setIsLove] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const [canBlink, setCanBlink] = useState(true);
  const [canFollowMouse, setCanFollowMouse] = useState(true);
  const [draggingTime, setDraggingTime] = useState(0);
  const [draggingInterval, setDraggingInterval] = useState(null);
  

  // usePerformanceMonitor('Smile', { 
  //   isHurt, 
  //   isLove, 
  //   canBlink, 
  //   canFollowMouse, 
  //   clicks 
  // });

  const faceRef = useRef(null);
  const eyeDxRef = useRef(null);
  const eyeSxRef = useRef(null);
  const smileTextRef = useRef(null);
  const constraintsRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const loveIntervalRef = useRef(null);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const mouseSpeedRef = useRef(0);
  const frameIdRef = useRef(null);
  
  const blinkInterval = 5000;
  

  const imagePaths = useMemo(() => [
    "/img/smile-parts/circle.svg",
    "/img/smile-parts/eye.svg",
    "/img/smile-parts/eye-closed.svg",
    "/img/smile-parts/eye-hurt.svg",
    "/img/smile-parts/eye-hurt-sx.svg",
    "/img/smile-parts/eye-love.svg",
    "/img/smile-parts/eye-love-sx.svg",
    "/img/smile-parts/mouth.svg"
  ], []);
  

  const eyeClasses = useMemo(() => ({
    defaultDx: "absolute h-[30px] translate-x-[85px] translate-y-[40px] transition-scale duration-200",
    defaultSx: "absolute h-[30px] translate-x-[24px] translate-y-[42px] transition-scale duration-200"
  }), []);



  useEffect(() => {
    const loadImages = async () => {
      try {
        await preloadImages(imagePaths);
        setImagesLoaded(true);
      } catch (error) {
        console.warn('Some images failed to preload, but component will still work:', error);
        setImagesLoaded(true); // Still set to true to avoid blocking
      }
    };
    
    loadImages();
  }, [imagePaths]);


  const handleMouseMove = useCallback(({ clientX, clientY }) => {

    if (frameIdRef.current) {
      cancelAnimationFrame(frameIdRef.current);
    }
    
    frameIdRef.current = requestAnimationFrame(() => {

      const deltaX = clientX - lastMousePosRef.current.x;
      const deltaY = clientY - lastMousePosRef.current.y;
      const mouseDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      mouseSpeedRef.current = mouseDistance;
      lastMousePosRef.current = { x: clientX, y: clientY };

      if (!canFollowMouse || !faceRef.current || isHurt) return;

      const faceElement = faceRef.current.getBoundingClientRect();
      const centerX = faceElement.left + faceElement.width / 2;
      const centerY = faceElement.top + faceElement.height / 2;

      let dx = clientX - centerX;
      let dy = clientY - centerY;

      const maxDistance = 15;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > maxDistance) {
        const scale = maxDistance / distance;
        dx *= scale;
        dy *= scale;
      }

      faceRef.current.style.transform = `translate(${dx + 6}px, ${dy + 15}px)`;
    });
  }, [canFollowMouse, isHurt]);

  const handleBlink = useCallback(() => {
    if (!canBlink || isHurt || !eyeDxRef.current || !eyeSxRef.current) return;
    
    eyeDxRef.current.src = eyeSxRef.current.src = imagePaths[2]; // eye-closed.svg
    setTimeout(() => {
      if (eyeDxRef.current && eyeSxRef.current) {
        eyeDxRef.current.src = eyeSxRef.current.src = imagePaths[1]; // eye.svg
      }
    }, 200);
  }, [canBlink, isHurt, imagePaths]);

  const displaySmileText = useCallback((text) => {
    if (!smileTextRef.current) return;
    
    smileTextRef.current.innerHTML = text;
    setTimeout(() => {
      if (smileTextRef.current) {
        smileTextRef.current.innerHTML = "";
      }
    }, 1800);
  }, []);

  const faceHurt = useCallback(() => {
    if (isLove) return;
    
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    if (loveIntervalRef.current) {
      clearInterval(loveIntervalRef.current);
      loveIntervalRef.current = null;
    }
    
    setIsHurt(true);
    setCanBlink(false);
    if (eyeDxRef.current && eyeSxRef.current) {
      eyeDxRef.current.src = imagePaths[3]; // eye-hurt.svg
      eyeSxRef.current.src = imagePaths[4]; // eye-hurt-sx.svg
    }
    
    setTimeout(() => {
      if (eyeDxRef.current && eyeSxRef.current) {
        eyeDxRef.current.src = eyeSxRef.current.src = imagePaths[1]; // eye.svg
      }
      setIsHurt(false);
      setCanBlink(true);
    }, 1500);
  }, [isLove, imagePaths]);

  const handleSmileClick = useCallback(() => {
    setClicks((prev) => {
      // const newClicks = prev + 1;
      // if (newClicks >= 20) displaySmileText("please stop");
      // else if (newClicks >= 12) displaySmileText("leave me");
      // else if (newClicks >= 4) displaySmileText("ouch");
      // return newClicks;
    });
    faceHurt();
  }, [displaySmileText, faceHurt]);

  const handleDragStart = useCallback(() => {
    setDraggingTime(0);
    if (draggingInterval) clearInterval(draggingInterval);
    const interval = setInterval(() => {
      setDraggingTime(prev => prev + 1);
    }, 1000);
    setDraggingInterval(interval);
  }, [draggingInterval]);

  const handleDragEnd = useCallback(() => {
    if (draggingInterval) clearInterval(draggingInterval);
    setDraggingInterval(null);
    //console.log(`Dragging time: ${draggingTime} seconds`);
  }, [draggingInterval, draggingTime]);


  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
     
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, [handleMouseMove]);


  useEffect(() => {
    if (!imagesLoaded) return; // Don't start blinking until images are loaded
    
    const blinkTimer = setInterval(handleBlink, blinkInterval);
    return () => clearInterval(blinkTimer);
  }, [canBlink, isHurt, handleBlink, imagesLoaded]);


  const handleMouseEnter = useCallback((e) => {
    if (e.target && e.target.hasAttribute && e.target.hasAttribute('data-smile-loving')) {
      
  
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      const targetElement = e.target;
      
      hoverTimeoutRef.current = setTimeout(() => {
        
        const elementUnderMouse = document.elementFromPoint(lastMousePosRef.current.x, lastMousePosRef.current.y);
        let isStillHovering = elementUnderMouse === targetElement || targetElement.contains(elementUnderMouse);
        

        if (isStillHovering) {
       
          setIsLove(currentIsLove => {
            setIsHurt(currentIsHurt => {
              if (!currentIsHurt && eyeDxRef.current && eyeSxRef.current) {
              
                //  love animation
                setCanBlink(false);
                eyeDxRef.current.src = imagePaths[5]; // eye-love.svg
                eyeSxRef.current.src = imagePaths[6]; // eye-love-sx.svg
                eyeSxRef.current.className = `${eyeClasses.defaultSx} scale-[2.3]`;
                eyeDxRef.current.className = `${eyeClasses.defaultDx} scale-[2.3]`;
                
                let scaleUp = true;
                loveIntervalRef.current = setInterval(() => {
                  if (!eyeDxRef.current || !eyeSxRef.current) return;
                  
                  const scale = scaleUp ? 2 : 2.3;
                  eyeDxRef.current.src = imagePaths[5]; // eye-love.svg
                  eyeSxRef.current.src = imagePaths[6]; // eye-love-sx.svg
                  eyeSxRef.current.className = `${eyeClasses.defaultSx} scale-[${scale}]`;
                  eyeDxRef.current.className = `${eyeClasses.defaultDx} scale-[${scale}]`;
                  scaleUp = !scaleUp;
                }, 300);
                
                return true; // Set isLove to true
              }
              return currentIsLove; 
            });
            return currentIsLove; 
          });
        }
      }, 500);
    }
  }, [imagePaths, eyeClasses]);

  const handleMouseLeave = useCallback((e) => {
    if (e.target && e.target.hasAttribute && e.target.hasAttribute('data-smile-loving')) {
    
       setIsLove(false);
       setIsHurt(false);
      setCanBlink(true);

      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      
      if (loveIntervalRef.current) {
        clearInterval(loveIntervalRef.current);
        loveIntervalRef.current = null;
      }
      
      if (eyeDxRef.current && eyeSxRef.current) {
        eyeDxRef.current.src = eyeSxRef.current.src = imagePaths[1]; // eye.svg
        eyeSxRef.current.className = eyeClasses.defaultSx;
        eyeDxRef.current.className = eyeClasses.defaultDx;
      }
    }
  }, [imagePaths, eyeClasses]);

  useEffect(() => {
    // Use event delegation on document to catch all hover events
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
    };
  }, [handleMouseEnter, handleMouseLeave]);

  // Handle page changes using React Router's useLocation
  useEffect(() => {
    const handlePageChange = () => {
      //console.log("Page changed to:", location.pathname);
      
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      
      if (loveIntervalRef.current) {
        clearInterval(loveIntervalRef.current);
        loveIntervalRef.current = null;
      }
      
      setIsLove(false);
      setCanBlink(true);
      
      if (eyeDxRef.current && eyeSxRef.current) {
        eyeDxRef.current.src = eyeSxRef.current.src = imagePaths[1]; // eye.svg
        eyeSxRef.current.className = eyeClasses.defaultSx;
        eyeDxRef.current.className = eyeClasses.defaultDx;
      }
    };

    handlePageChange(); 
  }, [location, imagePaths, eyeClasses]); 

  // Don't render until images are loaded for better performance
  if (!imagesLoaded) {
    return null;
  }

  return (
    <>
      <motion.div ref={constraintsRef} className="fixed top-0 w-full h-dvh pointer-events-none " />
      <motion.div
       
        whileHover={{ scale: 0.8 }} //8.5
        whileTap={{ scale: 0.7 }} //7
        whileInView={{ scale: 0.75 }} //8
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        drag
        dragConstraints={constraintsRef}
        className="logo__navbar animate-squiggly fixed z-50 sm:right-12 sm:top-20 right-[100% - 100px] top-[15rem] flex h-[150px] w-[150px] cursor-pointer "
        onClick={handleSmileClick}
      >
        <p ref={smileTextRef} className="absolute font-script text-4xl transform -translate-x-16 translate-y-4 -rotate-30 z-10" />
        <img 
          draggable="false" 
          src={imagePaths[0]} 
          alt="circle" 
          className="relative pointer-events-none" 
          loading="eager"
        />
        <div ref={faceRef} style={{ transition: 'all 3.7s cubic-bezier(0.075, 0.82, 0.165, 1)' }} className="absolute w-10 h-10  origin-center ">
          <img 
            draggable="false" 
            ref={eyeSxRef} 
            src={imagePaths[1]} 
            alt="left eye" 
            className={eyeClasses.defaultSx}
            loading="eager"
          />
          <img 
            draggable="false" 
            src={imagePaths[7]} 
            alt="mouth" 
            className="absolute h-[20px] translate-x-[46px] translate-y-[60px]"
            loading="eager"
          />
          <img 
            draggable="false" 
            ref={eyeDxRef} 
            src={imagePaths[1]} 
            alt="right eye" 
            className={eyeClasses.defaultDx}
            loading="eager"
          />
        </div>
      </motion.div>
    </>
  );
});

export default Smile;
