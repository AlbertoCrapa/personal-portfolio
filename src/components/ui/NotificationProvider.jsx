import React from 'react';

const NotificationContext = React.createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = React.useState([]);
    const timersRef = React.useRef(new Map());

    const removeNotification = React.useCallback((id) => {
        const exitDuration = 220;

        setNotifications((prev) =>
            prev.map((item) => (item.id === id ? { ...item, exiting: true } : item))
        );

        const existingTimer = timersRef.current.get(id);
        if (existingTimer) {
            window.clearTimeout(existingTimer);
        }

        const timerId = window.setTimeout(() => {
            setNotifications((prev) => prev.filter((item) => item.id !== id));
            timersRef.current.delete(id);
        }, exitDuration);

        timersRef.current.set(id, timerId);
    }, []);

    const notify = React.useCallback((payload) => {
        const config = typeof payload === 'string' ? { title: payload } : (payload || {});
        const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        const duration = Number.isFinite(config.duration) ? config.duration : 2600;

        setNotifications((prev) => [
            ...prev,
            {
                id,
                type: config.type || 'info',
                title: config.title || 'Done',
                message: config.message || '',
                exiting: false,
            },
        ]);

        const timerId = window.setTimeout(() => {
            removeNotification(id);
        }, Math.max(1200, duration));

        timersRef.current.set(id, timerId);
    }, [removeNotification]);

    React.useEffect(() => () => {
        timersRef.current.forEach((timerId) => window.clearTimeout(timerId));
        timersRef.current.clear();
    }, []);

    const value = React.useMemo(() => ({ notify }), [notify]);

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <div className="notification-stack" aria-live="polite" aria-atomic="false">
                {notifications.map((item) => (
                    <div
                        key={item.id}
                        className={`notification-toast notification-toast--${item.type} ${item.exiting ? 'is-exiting' : ''}`}
                        role="status"
                    >
                        <div className="notification-toast__icon" aria-hidden="true">
                            {item.type === 'success' ? '✓' : item.type === 'error' ? '!' : item.type === 'message' ? '@' : 'i'}
                        </div>
                        <div className="notification-toast__content">
                            {item.type === 'message' ? (
                                <>
                                    <div className="notification-toast__meta">
                                        <span className="notification-toast__meta-label">Message</span>
                                        <span className="notification-toast__meta-dot" aria-hidden="true" />
                                        <span className="notification-toast__meta-time">just now</span>
                                    </div>
                                    <p className="notification-toast__title">{item.title}</p>
                                    {item.message ? (
                                        <p className="notification-toast__message">
                                            {item.message}
                                        </p>
                                    ) : null}
                                </>
                            ) : (
                                <>
                                    <p className="notification-toast__title">{item.title}</p>
                                    {item.message ? <p className="notification-toast__message">{item.message}</p> : null}
                                </>
                            )}
                        </div>
                        <button
                            type="button"
                            className="notification-toast__close"
                            onClick={() => removeNotification(item.id)}
                            aria-label="Dismiss notification"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = React.useContext(NotificationContext);
    if (!context) {
        return {
            notify: () => { },
        };
    }
    return context;
};
