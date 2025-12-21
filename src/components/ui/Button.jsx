import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Button Component
 * Multi-variant button for actions and navigation
 * 
 * @param {string} variant - 'primary' | 'secondary' | 'ghost'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {string} href - External link (renders as <a>)
 * @param {string} to - Internal link (renders as <Link>)
 * @param {boolean} disabled - Disabled state
 * @param {boolean} fullWidth - Full width button
 * @param {string} className - Additional classes
 * @param {function} onClick - Click handler
 * @param {React.ReactNode} children - Button content
 */
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
    const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-bg';

    const variants = {
        primary: 'bg-accent-blue text-white hover:bg-accent-blue/90 active:scale-98',
        secondary: 'bg-surface text-text-primary border border-border hover:bg-surface-hover active:scale-98',
        ghost: 'text-text-secondary hover:text-text-primary hover:bg-surface/50',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm gap-1.5',
        md: 'px-4 py-2 text-base gap-2',
        lg: 'px-6 py-3 text-lg gap-2.5',
    };

    const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
    ${className}
  `.trim();

    // External link
    if (href) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={classes}
                {...props}
            >
                {children}
            </a>
        );
    }

    // Internal link
    if (to) {
        return (
            <Link to={to} className={classes} {...props}>
                {children}
            </Link>
        );
    }

    // Button
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={classes}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
