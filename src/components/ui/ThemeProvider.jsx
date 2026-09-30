import React from 'react';

/**
 * ThemeProvider
 *
 * Owns the `data-theme` attribute on <html>. The *first* value is decided by
 * the inline bootstrap in public/index.html (before paint, so there is no
 * flash); this provider adopts whatever that script wrote and takes over from
 * there.
 *
 * Only two resolved values exist — "dark" and "light" — because every token in
 * theme.css is defined for exactly those two. "system" is a stored preference,
 * not a resolved theme: it tracks the OS and resolves to one of the two.
 */

const STORAGE_KEY = 'albyeah-theme';
const ThemeContext = React.createContext(null);

const readStoredPreference = () => {
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
    } catch {
        // Private mode / storage disabled — fall through to the default.
    }
    return 'dark';
};

const systemTheme = () =>
    typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark';

const resolve = (preference) => (preference === 'system' ? systemTheme() : preference);

export const ThemeProvider = ({ children }) => {
    const [preference, setPreference] = React.useState(() =>
        typeof window === 'undefined' ? 'dark' : readStoredPreference(),
    );
    const [theme, setTheme] = React.useState(() =>
        typeof window === 'undefined' ? 'dark' : resolve(readStoredPreference()),
    );

    // Follow the OS only while the stored preference is "system".
    React.useEffect(() => {
        setTheme(resolve(preference));
        if (preference !== 'system' || !window.matchMedia) return undefined;
        const query = window.matchMedia('(prefers-color-scheme: light)');
        const onChange = () => setTheme(query.matches ? 'light' : 'dark');
        query.addEventListener('change', onChange);
        return () => query.removeEventListener('change', onChange);
    }, [preference]);

    React.useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        // Keep the browser chrome (mobile address bar) on the same canvas.
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', theme === 'light' ? '#fcfcfc' : '#111111');
    }, [theme]);

    /**
     * Commit a new preference, wiping the new palette in from `origin`.
     *
     * The View Transition API paints the outgoing page underneath and reveals
     * the incoming one through a clip-path — the "rectangle" variant. Browsers
     * without it (Firefox, today) just get the instant swap, which is fine:
     * nothing depends on the animation.
     */
    const apply = React.useCallback((next, origin = 'bottom') => {
        const commit = () => setPreference(next);

        try {
            window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
            // Not being able to remember the choice shouldn't block making it.
        }

        const reduce =
            window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reduce || !document.startViewTransition) {
            commit();
            return;
        }

        // Wipe in from the edge the control sits closest to, so the change
        // visually originates at the thing that was clicked.
        const from = {
            top: 'inset(0 0 100% 0)',
            bottom: 'inset(100% 0 0 0)',
            left: 'inset(0 100% 0 0)',
            right: 'inset(0 0 0 100%)',
        }[origin] || 'inset(100% 0 0 0)';

        document.documentElement.style.setProperty('--theme-wipe-from', from);
        document.startViewTransition(() => {
            // Synchronous DOM write inside the callback: the attribute change
            // in the effect above is what the transition captures.
            const resolved = resolve(next);
            document.documentElement.setAttribute('data-theme', resolved);
            commit();
        });
    }, []);

    const value = React.useMemo(
        () => ({ theme, preference, setPreference: apply, isDark: theme === 'dark' }),
        [theme, preference, apply],
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
    const ctx = React.useContext(ThemeContext);
    if (!ctx) {
        // Components can render outside the provider in tests; a dark default
        // keeps them from crashing.
        return { theme: 'dark', preference: 'dark', setPreference: () => { }, isDark: true };
    }
    return ctx;
};

export default ThemeProvider;
