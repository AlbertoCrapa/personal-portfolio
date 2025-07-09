import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const Smile = () => {
  const location = useLocation();
  const [clicks, setClicks] = useState(0);
  const [isHurt, setIsHurt] = useState(false);
  const [isLove, setIsLove] = useState(false);

  const [canBlink, setCanBlink] = useState(true);
  const [canFollowMouse, setCanFollowMouse] = useState(true);
  const [draggingTime, setDraggingTime] = useState(0);
  const [draggingInterval, setDraggingInterval] = useState(null);
  const targetRef = useRef(null);
  const faceRef = useRef(null);
  const eyeDxRef = useRef(null);
  const eyeSxRef = useRef(null);
  const smileTextRef = useRef(null);
  const constraintsRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const loveIntervalRef = useRef(null);
  const blinkInterval = 5000;
  let lastMousePos = { x: 0, y: 0 };
  let mouseSpeed = 0;
  const defaultDxEyeClass = "absolute h-[30px] translate-x-[85px] translate-y-[40px] transition-scale  duration-200";
  const defaultSxEyeClass = "absolute h-[30px] translate-x-[24px] translate-y-[42px] transition-scale  duration-200";



  const handleMouseMove = ({ clientX, clientY }) => {
    // Calculate mouse speed
    const currentTime = Date.now();
    const deltaX = clientX - lastMousePos.x;
    const deltaY = clientY - lastMousePos.y;
    const mouseDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    mouseSpeed = mouseDistance;
    lastMousePos = { x: clientX, y: clientY };

    if (!canFollowMouse) return;
    if (!faceRef.current || isHurt) return;

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
  };

  const handleBlink = () => {
    if (!canBlink || isHurt) return;
    eyeDxRef.current.src = eyeSxRef.current.src = "/img/smile-parts/eye-closed.svg";
    setTimeout(() => {
      eyeDxRef.current.src = eyeSxRef.current.src = "/img/smile-parts/eye.svg";
    }, 200);
  };

  const displaySmileText = (text) => {

    smileTextRef.current.innerHTML = text;
    setTimeout(() => (smileTextRef.current.innerHTML = ""), 1800);
  };

  const faceHurt = () => {
    if (isLove) return;
    
    // Clear any pending hover timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    // Clear love interval
    if (loveIntervalRef.current) {
      clearInterval(loveIntervalRef.current);
      loveIntervalRef.current = null;
    }
    
    setIsHurt(true);
    setCanBlink(false);
    eyeDxRef.current.src = "/img/smile-parts/eye-hurt.svg";
    eyeSxRef.current.src = "/img/smile-parts/eye-hurt-sx.svg";
    setTimeout(() => {
      eyeDxRef.current.src = eyeSxRef.current.src = "/img/smile-parts/eye.svg";
      setIsHurt(false);
      setCanBlink(true);
    }, 1500);
  };



  const handleSmileClick = () => {
    setClicks((prev) => prev + 1);
    if (clicks >= 20) displaySmileText("please stop");
    else if (clicks >= 12) displaySmileText("leave me");
    else if (clicks >= 4) displaySmileText("ouch");
    faceHurt();
  };


  const handleDragStart = () => {
    setDraggingTime(0);
    if (draggingInterval) clearInterval(draggingInterval);
    const interval = setInterval(() => {
      setDraggingTime(prev => prev + 1);
    }, 1000);
    setDraggingInterval(interval);
  };

  const handleDragEnd = () => {
    if (draggingInterval) clearInterval(draggingInterval);
    setDraggingInterval(null);
    console.log(`Dragging time: ${draggingTime} seconds`);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const blinkTimer = setInterval(handleBlink, blinkInterval);
    return () => clearInterval(blinkTimer);
  }, [canBlink, isHurt]);


  useEffect(() => {
    const handleMouseEnter = (e) => {
      if (e.target && e.target.hasAttribute && e.target.hasAttribute('data-smile-loving')) {
        
        // Clear any existing timeout
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
        }
        const targetElement = e.target;
        
        hoverTimeoutRef.current = setTimeout(() => {
          // Check if mouse is still on the same element
          const elementUnderMouse = document.elementFromPoint(lastMousePos.x, lastMousePos.y);
          let isStillHovering = elementUnderMouse === targetElement || targetElement.contains(elementUnderMouse);
          

          if (isStillHovering) {
         
            setIsLove(currentIsLove => {
              setIsHurt(currentIsHurt => {
                if (!currentIsHurt) {
                
                  //  love animation
                  setCanBlink(false);
                  eyeDxRef.current.src = "/img/smile-parts/eye-love.svg";
                  eyeSxRef.current.src = "/img/smile-parts/eye-love-sx.svg";
                  eyeSxRef.current.className = `${defaultSxEyeClass} scale-[2.3]`;
                  eyeDxRef.current.className = `${defaultDxEyeClass} scale-[2.3]`;
                  
                  let scaleUp = true;
                  loveIntervalRef.current = setInterval(() => {
                    const scale = scaleUp ? 2 : 2.3;
                    eyeDxRef.current.src = "/img/smile-parts/eye-love.svg";
                    eyeSxRef.current.src = "/img/smile-parts/eye-love-sx.svg";
                    eyeSxRef.current.className = `${defaultSxEyeClass} scale-[${scale}] `;
                    eyeDxRef.current.className = `${defaultDxEyeClass} scale-[${scale}] `;
                    scaleUp = !scaleUp;
                  }, 300);
                  
                  return true; // Set isLove to true
                }
                return currentIsLove; // Return current state unchanged
              });
              return currentIsLove; // This won't be used since we're setting it in the nested function
            });
          }
        }, 500);
      }
    };

    const handleMouseLeave = (e) => {
      if (e.target && e.target.hasAttribute && e.target.hasAttribute('data-smile-loving')) {
        // Clear the timeout if mouse leaves before 500ms
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
        
        eyeDxRef.current.src = eyeSxRef.current.src = "/img/smile-parts/eye.svg";
       
      
        eyeSxRef.current.className = defaultSxEyeClass;
        eyeDxRef.current.className = defaultDxEyeClass;
      }
    };    // Use event delegation on document to catch all hover events
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
    };
  }, []);

  // Handle page changes using React Router's useLocation
  useEffect(() => {
    const handlePageChange = () => {
      console.log("Page changed to:", location.pathname);
      
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
      eyeDxRef.current.src = eyeSxRef.current.src = "/img/smile-parts/eye.svg";
      eyeSxRef.current.className = defaultSxEyeClass;
      eyeDxRef.current.className = defaultDxEyeClass;
    };

    handlePageChange(); 
  }, [location]); 




  return (
    <>
      <motion.div ref={constraintsRef} className="fixed top-0 w-full h-dvh pointer-events-none " />
      <motion.div
       
        whileHover={{ scale: 0.85 }}
        whileTap={{ scale: 0.7 }}
        whileInView={{ scale: 0.8 }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        drag
        dragConstraints={constraintsRef}
        className="logo__navbar animate-squiggly fixed z-50 sm:right-0 sm:top-16 right-[100% - 100px] top-[15rem] flex h-[150px] w-[150px] cursor-pointer "
        onClick={handleSmileClick}
      >
        <p ref={smileTextRef} className="absolute font-script text-4xl transform -translate-x-16 translate-y-4 -rotate-30 z-10" />
        <img draggable="false" src="/img/smile-parts/circle.svg" alt="circle" className="relative pointer-events-none" />
        <div ref={faceRef} style={{ transition: 'all 3.7s cubic-bezier(0.075, 0.82, 0.165, 1)' }} className="absolute w-10 h-10  origin-center ">
          <img draggable="false" ref={eyeSxRef} src="/img/smile-parts/eye.svg" alt="left eye" className="absolute h-[30px] translate-x-[24px] translate-y-[42px] " />
          <img draggable="false" src="/img/smile-parts/mouth.svg" alt="mouth" className="absolute h-[20px] translate-x-[46px] translate-y-[60px]" />
          <img draggable="false" ref={eyeDxRef} src="/img/smile-parts/eye.svg" alt="right eye" className="absolute h-[30px] translate-x-[85px] translate-y-[40px]" />
        </div>
      </motion.div>
    </>
  );
};

export default Smile;
