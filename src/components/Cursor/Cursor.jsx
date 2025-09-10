import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Cursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const [hoverText, setHoverText] = useState('');
    const [isHovering, setIsHovering] = useState(false);
    const cursorRef = useRef(null);

    useEffect(() => {
        const updatePosition = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
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
                setHoverText(text);
                setIsHovering(true);
            } else {
                setHoverText('');
                setIsHovering(false);
            }
        };

        document.addEventListener('mousemove', updatePosition);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mouseover', handleMouseOver);

        return () => {
            document.removeEventListener('mousemove', updatePosition);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseover', handleMouseOver);
        };
    }, [isVisible]);

    return (
        <div
            ref={cursorRef}
            //mix-blend-difference
            className="fixed top-0 left-0 w-fit z-[99999] pointer-events-none "
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
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
                        {/* Custom SVG Cursor */}
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.5728 0.586532C3.35945 0.708802 3.1869 0.891283 3.07676 1.11113C2.96661 1.33099 2.92375 1.57844 2.95355 1.82253L4.84255 22.0943C4.9633 23.0785 6.1273 23.5373 6.8868 22.8998L10.4405 19.9173L12.228 23.0135C13.256 24.7938 15.3205 24.981 17.1005 23.953C18.8813 22.925 19.7513 21.0438 18.7233 19.2635L16.942 16.1783L21.2331 14.617C22.1648 14.2778 22.3496 13.0408 21.5576 12.444L4.94605 0.672032C4.75061 0.525003 4.51634 0.438535 4.27225 0.423338C4.02815 0.40814 3.78496 0.464881 3.5728 0.586532Z" fill="white" />
                            <path d="M3.5728 0.586532C3.35945 0.708802 3.1869 0.891283 3.07676 1.11113C2.96661 1.33099 2.92375 1.57844 2.95355 1.82253L4.84255 22.0943C4.9633 23.0785 6.1273 23.5373 6.8868 22.8998L10.4405 19.9173L12.228 23.0135C13.256 24.7938 15.3206 24.981 17.1006 23.953C18.8813 22.925 19.7513 21.0438 18.7233 19.2635L16.942 16.1783L21.2331 14.617C22.1648 14.2778 22.3496 13.0408 21.5576 12.444L4.94605 0.672032C4.75061 0.525003 4.51634 0.438535 4.27225 0.423338C4.02815 0.40814 3.78496 0.464881 3.5728 0.586532ZM5.7923 4.43853L18.2135 13.0553L13.2853 14.8485L13.3083 14.8843L16.5583 20.5135C16.9153 21.1318 16.4693 21.431 15.8508 21.788C15.2323 22.145 14.7503 22.3818 14.3933 21.7635L11.1433 16.1343L11.1175 16.0848L7.04405 19.504L5.7923 4.43853Z" fill="#2D2D2D" />
                        </svg>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isVisible && isHovering && hoverText && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0, opacity: 0, y: 10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute -top-6 -left-1  bg-primary text-white px-3 py-1  rounded-2xl rounded-bl-none text-md font-bold whitespace-nowrap"
                        style={{
                            transform: 'translate(8px, 8px)', // Position to bottom-left of cursor
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                        }}
                    >
                        {hoverText}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Cursor;
