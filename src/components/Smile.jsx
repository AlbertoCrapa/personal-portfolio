import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const Smile = () => {
  const [clicks, setClicks] = useState(0);
  const [isHurt, setIsHurt] = useState(false);
  const [canBlink, setCanBlink] = useState(true);
  const [canFollowMouse, setCanFollowMouse] = useState(true);
  const [draggingTime, setDraggingTime] = useState(0);
  const [draggingInterval, setDraggingInterval] = useState(null);

  const faceRef = useRef(null);
  const eyeDxRef = useRef(null);
  const eyeSxRef = useRef(null);
  const smileTextRef = useRef(null);
  const constraintsRef = useRef(null);

  const blinkInterval = 5000;

  const handleMouseMove = ({ clientX, clientY }) => {
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



  return (
    <>
      <motion.div ref={constraintsRef} className="fixed top-0 w-full h-dvh pointer-events-none" />
      <motion.div
        whileHover={{ scale: 0.85 }}
        whileTap={{ scale: 0.7 }}
        whileInView={{ scale: 0.8 }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        drag
        dragConstraints={constraintsRef}
        className="logo__navbar animate-squiggly fixed z-50 right-0 top-0 flex h-[150px] w-[150px] cursor-pointer "
        onClick={handleSmileClick}
      >
        <p ref={smileTextRef} className="absolute text-2xl transform -translate-x-36 translate-y-4 -rotate-30" />
        <img draggable="false" src="/img/smile-parts/circle.svg" alt="circle" className="relative pointer-events-none" />
        <div ref={faceRef} style={{ transition: 'all 3.7s cubic-bezier(0.075, 0.82, 0.165, 1)' }} className="absolute w-10 h-10  origin-center">
          <img draggable="false" ref={eyeSxRef} src="/img/smile-parts/eye.svg" alt="left eye" className="absolute h-[30px] translate-x-[24px] translate-y-[42px] " />
          <img draggable="false" src="/img/smile-parts/mouth.svg" alt="mouth" className="absolute h-[20px] translate-x-[46px] translate-y-[60px]" />
          <img draggable="false" ref={eyeDxRef} src="/img/smile-parts/eye.svg" alt="right eye" className="absolute h-[30px] translate-x-[85px] translate-y-[40px]" />
        </div>
      </motion.div>
    </>
  );
};

export default Smile;
