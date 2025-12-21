import React from 'react';

/**
 * Callout Component
 * Info/Warning boxes for blog and project content
 * Matches the reference design with colored left border and emoji indicator
 * 
 * @param {string} type - 'info' | 'warning'
 * @param {React.ReactNode} children - Callout content
 */
const Callout = ({ type = 'info', children }) => {
    const styles = {
        info: {
            bg: 'bg-info-bg',
            border: 'border-l-info-border',
            icon: 'ℹ️',
        },
        warning: {
            bg: 'bg-warning-bg',
            border: 'border-l-warning-border',
            icon: '⚠️',
        },
    };

    const style = styles[type] || styles.info;

    return (
        <div className={`${style.bg} ${style.border} border-l-4 rounded-r-lg p-4 my-6`}>
            <div className="flex gap-3">
                <span className="text-lg flex-shrink-0" role="img" aria-label={type}>
                    {style.icon}
                </span>
                <div className="text-text-primary text-sm leading-relaxed">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Callout;
