import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, CircleAlert, Construction, Info, X } from 'lucide-react';

import { motionTokens } from '../arc/lib/motion-tokens';
import styles from './NotificationProvider.module.css';

/**
 * Notifications land in the bottom-right corner as chat bubbles: each new one
 * springs up from the corner and pushes the rest up, so a run of them reads
 * like a thread. `duration: Infinity` keeps a bubble until its X is pressed.
 * The stack also hosts other corner surfaces (WelcomeChat) via `host`, so
 * nothing overlaps.
 */

const NotificationContext = React.createContext(null);

const ICONS = { success: Check, error: CircleAlert, warning: Construction, info: Info, message: Info };

const DEV_NOTICE = {
    id: 'dev-notice',
    type: 'warning',
    title: 'Work in progress',
    message: 'This site is still under development, so some features and content may be incomplete or inaccurate.',
};

export const NotificationProvider = ({ children }) => {
    const reduce = useReducedMotion();
    const [notifications, setNotifications] = React.useState([DEV_NOTICE]);
    const [host, setHost] = React.useState(null);
    const timersRef = React.useRef(new Map());

    const removeNotification = React.useCallback((id) => {
        window.clearTimeout(timersRef.current.get(id));
        timersRef.current.delete(id);
        setNotifications((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const notify = React.useCallback((payload) => {
        const config = typeof payload === 'string' ? { title: payload } : (payload || {});
        const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        const duration = config.duration === Infinity || Number.isFinite(config.duration) ? config.duration : 2600;

        setNotifications((prev) => [
            ...prev,
            { id, type: config.type || 'info', title: config.title || 'Done', message: config.message || '' },
        ]);

        if (duration === Infinity) return;
        timersRef.current.set(id, window.setTimeout(() => removeNotification(id), Math.max(1200, duration)));
    }, [removeNotification]);

    React.useEffect(() => () => {
        timersRef.current.forEach((timerId) => window.clearTimeout(timerId));
        timersRef.current.clear();
    }, []);

    const value = React.useMemo(() => ({ notify, host }), [notify, host]);

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <div className={styles.stack}>
                <ol className={styles.list} aria-live="polite" aria-label="Notifications">
                    <AnimatePresence initial={false} mode="popLayout">
                        {notifications.map((item) => {
                            const Icon = ICONS[item.type] || Info;
                            return (
                                <motion.li
                                    key={item.id}
                                    layout={!reduce}
                                    className={styles.bubble}
                                    data-type={item.type}
                                    role="status"
                                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.94 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={reduce
                                        ? { opacity: 0 }
                                        : { opacity: 0, scale: 0.94, transition: { duration: motionTokens.duration.exit, ease: [...motionTokens.ease.exit] } }}
                                    transition={reduce ? { duration: motionTokens.duration.fast } : motionTokens.spring.smooth}
                                >
                                    <Icon className={styles.icon} size={16} strokeWidth={1.75} aria-hidden="true" />
                                    <div className={styles.body}>
                                        <p className={styles.title}>{item.title}</p>
                                        {item.message ? <p className={styles.message}>{item.message}</p> : null}
                                    </div>
                                    <button
                                        type="button"
                                        className={styles.close}
                                        onClick={() => removeNotification(item.id)}
                                        aria-label="Dismiss notification"
                                    >
                                        <X size={14} strokeWidth={1.75} aria-hidden="true" />
                                    </button>
                                </motion.li>
                            );
                        })}
                    </AnimatePresence>
                </ol>
                <div ref={setHost} className={styles.host} />
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = React.useContext(NotificationContext);
    if (!context) {
        return {
            notify: () => { },
            host: null,
        };
    }
    return context;
};
