import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { HOVER_SCALE, SPRING_PRESS, useHoverCapable, useReducedMotion } from '../../utils/motion';

/**
 * Button
 * Multi-variant button for actions and navigation.
 *
 * The press is a spring, not a CSS transition: the button overshoots back to
 * rest, which is what makes a click feel answered rather than merely styled.
 * Hover lift only runs on devices that actually hover — a phone would
 * otherwise leave the button stuck in its hover state after a tap.
 *
 * @param {string} variant - 'primary' | 'secondary' | 'ghost' | 'quiet'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {string} href - External link (renders as <a>)
 * @param {string} to - Internal link (renders as <Link>)
 * @param {boolean} disabled - Disabled state
 * @param {boolean} fullWidth - Full width button
 * @param {string} className - Additional classes
 * @param {function} onClick - Click handler
 * @param {React.ReactNode} children - Button content
 */

// motion.create() — motion() as a factory is deprecated in framer-motion 11.
const MotionLink = motion.create(Link);

const VARIANTS = {
    primary: 'bg-accent-blue text-white hover:bg-accent-blue/90',
    secondary: 'bg-surface text-text-primary border border-border hover:border-border-strong hover:bg-surface-hover',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-surface/60',
    // Inverted — the highest-contrast call to action on a dark canvas.
    quiet: 'bg-text-primary text-bg hover:bg-text-primary/90',
};

const SIZES = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
};

const Button = ({
    variant = 'primary',
    size = 'md',
    href,
    to,
    disabled = false,
    fullWidth = false,
    className = '',
    onClick,
    children,
    ...props
}) => {
    const reduce = useReducedMotion();
    const canHover = useHoverCapable();

    const classes = [
        'inline-flex items-center justify-center font-semibold rounded-lg outline-offset-2 transition-colors duration-200',
        VARIANTS[variant] || VARIANTS.primary,
        SIZES[size] || SIZES.md,
        fullWidth ? 'w-full' : '',
        disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const motionProps = {
        className: classes,
        whileHover: reduce || !canHover || disabled ? undefined : { scale: HOVER_SCALE },
        whileTap: reduce || disabled ? undefined : { scale: 0.96 },
        transition: SPRING_PRESS,
    };

    if (href) {
        return (
            <motion.a href={href} target="_blank" rel="noopener noreferrer" {...motionProps} {...props}>
                {children}
            </motion.a>
        );
    }

    if (to) {
        return (
            <MotionLink to={to} {...motionProps} {...props}>
                {children}
            </MotionLink>
        );
    }

    return (
        <motion.button type="button" onClick={onClick} disabled={disabled} {...motionProps} {...props}>
            {children}
        </motion.button>
    );
};

export default Button;
