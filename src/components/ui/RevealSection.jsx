import { useInView } from 'react-intersection-observer';

/**
 * RevealSection — scroll-triggered fade+slide-up entrance animation.
 * Uses the same `.homepage-reveal` / `.is-visible` CSS classes as the homepage.
 */
const RevealSection = ({ children, className = '', delay = 0 }) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.06 });

    return (
        <div
            ref={ref}
            className={`homepage-reveal ${inView ? 'is-visible' : ''} ${className}`}
            style={delay ? { transitionDelay: `${delay}ms` } : undefined}
        >
            {children}
        </div>
    );
};

export default RevealSection;
