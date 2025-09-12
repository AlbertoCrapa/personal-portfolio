import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { deviceDetection } from '../../utils/utils';

const Cursor = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [hoverText, setHoverText] = useState('');
    const [hoverColor, setHoverColor] = useState('');
    const [isHovering, setIsHovering] = useState(false);
    const [shouldShowCursor, setShouldShowCursor] = useState(false);
    const cursorRef = useRef(null);
    
    // Smooth spring values for cursor movement
    const springConfig = { damping: 40, stiffness: 1000 };
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const smoothX = useSpring(x, springConfig);
    const smoothY = useSpring(y, springConfig);

    useEffect(() => {
        // Check if device should use custom cursor
        const checkCursorSupport = () => {
            return deviceDetection.shouldUseCustomCursor();
        };

        setShouldShowCursor(checkCursorSupport());

        // If device doesn't support custom cursor, don't set up cursor events
        if (!checkCursorSupport()) {
            return;
        }

        const updatePosition = (e) => {
            x.set(e.clientX);
            y.set(e.clientY);
            
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseLeave = () => {
            setIsVisible(false);
        };

        const handleMouseEnter = () => {
            setIsVisible(true);
        };

                        // Handle hover text from data attributes
        const handleMouseOver = (e) => {
            const target = e.target.closest('[data-cursor-text]');
            if (target) {
                const text = target.getAttribute('data-cursor-text');
                const color = target.getAttribute('data-cursor-color') || 'primary';
                setHoverText(text);
                setHoverColor(color);
                setIsHovering(true);
                
                // // Add subtle haptic feedback with CSS class instead of direct transform
                // target.classList.add('cursor-haptic-feedback');
                // setTimeout(() => {
                //     target.classList.remove('cursor-haptic-feedback');
                // }, 150);
            } else {
                setHoverText('');
                setHoverColor('');
                setIsHovering(false);
            }
        };

        // Handle click feedback
        const handleMouseDown = (e) => {
            const target = e.target.closest('[data-cursor-text]');
            if (target) {
                // Add click feedback effect with CSS class
                target.classList.add('cursor-click-feedback');
                setTimeout(() => {
                    target.classList.remove('cursor-click-feedback');
                }, 100);
            }
        };

        document.addEventListener('mousemove', updatePosition);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mousedown', handleMouseDown);

        // Handle window resize to check if device changes
        const handleResize = () => {
            setShouldShowCursor(checkCursorSupport());
        };
        window.addEventListener('resize', handleResize);

        return () => {
            document.removeEventListener('mousemove', updatePosition);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('resize', handleResize);
        };
    }, [isVisible, x, y]);

    // Don't render anything on mobile/tablet or devices without hover support
    if (!shouldShowCursor) {
        return null;
    }

    return (
        <motion.div
            ref={cursorRef}
            className="fixed top-0 left-0 w-fit z-[99999] pointer-events-none"
            style={{
                x: hoverText ?  smoothX : x,
                y: hoverText ?  smoothY : y,
                transition: 'none'
            }}
        >
            <AnimatePresence>
                {isVisible && !isHovering && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="relative -top-1 -left-1"
                    >
                        {/* Custom SVG Cursor - Simple and clean */}
                        <svg 
                            width="25" 
                            height="25" 
                            viewBox="0 0 25 25" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M3.5728 0.586532C3.35945 0.708802 3.1869 0.891283 3.07676 1.11113C2.96661 1.33099 2.92375 1.57844 2.95355 1.82253L4.84255 22.0943C4.9633 23.0785 6.1273 23.5373 6.8868 22.8998L10.4405 19.9173L12.228 23.0135C13.256 24.7938 15.3205 24.981 17.1005 23.953C18.8813 22.925 19.7513 21.0438 18.7233 19.2635L16.942 16.1783L21.2331 14.617C22.1648 14.2778 22.3496 13.0408 21.5576 12.444L4.94605 0.672032C4.75061 0.525003 4.51634 0.438535 4.27225 0.423338C4.02815 0.40814 3.78496 0.464881 3.5728 0.586532Z" fill="white" />
                            <path d="M3.5728 0.586532C3.35945 0.708802 3.1869 0.891283 3.07676 1.11113C2.96661 1.33099 2.92375 1.57844 2.95355 1.82253L4.84255 22.0943C4.9633 23.0785 6.1273 23.5373 6.8868 22.8998L10.4405 19.9173L12.228 23.0135C13.256 24.7938 15.3206 24.981 17.1006 23.953C18.8813 22.925 19.7513 21.0438 18.7233 19.2635L16.942 16.1783L21.2331 14.617C22.1648 14.2778 22.3496 13.0408 21.5576 12.444L4.94605 0.672032C4.75061 0.525003 4.51634 0.438535 4.27225 0.423338C4.02815 0.40814 3.78496 0.464881 3.5728 0.586532ZM5.7923 4.43853L18.2135 13.0553L13.2853 14.8485L13.3083 14.8843L16.5583 20.5135C16.9153 21.1318 16.4693 21.431 15.8508 21.788C15.2323 22.145 14.7503 22.3818 14.3933 21.7635L11.1433 16.1343L11.1175 16.0848L7.04405 19.504L5.7923 4.43853Z" fill="#2D2D2D" />
                        </svg>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isVisible && isHovering && hoverText && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0, y: 10, rotate: -10 }}
                        animate={{ 
                            scale: 1, 
                            opacity: 1, 
                            y: [0, -2, 0], 
                            rotate: 0,
                            transition: { 
                                type: "spring", 
                                damping: 20, 
                                stiffness: 300,
                                rotate: { duration: 0.3, ease: "easeOut" },
                                y: {
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }
                            }
                        }}
                        exit={{ 
                            scale: 0, 
                            opacity: 0, 
                            y: 10, 
                            rotate: 10,
                            transition: { duration: 0.2, ease: "easeInOut" }
                        }}
                        whileHover={{ 
                            scale: 1.05,
                            transition: { duration: 0.2 }
                        }}
                        className={`absolute -top-6 -left-1 ${hoverColor ? `bg-${hoverColor}` : 'bg-primary'} text-white px-3 py-1 rounded-2xl rounded-bl-none text-md font-bold whitespace-nowrap`}
                        style={{
                            transform: 'translate(8px, 8px)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                            ...(hoverColor && hoverColor.startsWith('#') && {
                                backgroundColor: hoverColor
                            })
                        }}
                    >
                        <motion.span
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                        >
                            {hoverText}
                        </motion.span>
                        
                        {/* Subtle shine effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-2xl rounded-bl-none"
                            initial={{ x: '-100%', opacity: 0 }}
                            animate={{ x: '100%', opacity: 1 }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "linear",
                                delay: 1
                            }}
                        />
                        
                        {/* Glow effect */}
                        <div 
                            className="absolute inset-0 rounded-2xl rounded-bl-none blur-md opacity-30 -z-10"
                            style={{
                                backgroundColor: hoverColor && hoverColor.startsWith('#') ? hoverColor : '#e0ac00',
                                transform: 'scale(1.1)'
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Cursor;
