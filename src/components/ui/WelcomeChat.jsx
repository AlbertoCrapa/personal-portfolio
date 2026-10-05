import React from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';

import { ChatThread } from '../arc/chat-thread/chat-thread';
import { motionTokens } from '../arc/lib/motion-tokens';
import { useNotification } from './NotificationProvider';
import data from '../../data/data.json';
import styles from './WelcomeChat.module.css';

/**
 * WelcomeChat — a first-person hello in the bottom-right corner, written as a
 * chat: a typing indicator, then each message lands like one sent by me.
 *
 * Same rules as the old welcome toast: once per browser session, after a
 * delay, gone on its own after `durationMs` (paused while the pointer or focus
 * is on it), and dismissible. Copy and timing live in data.json.
 */

const SESSION_KEY = 'albyeah-session-welcome-shown';
const TYPING_MS = 1100;
const PARTICIPANTS = [
    { id: 'alberto', name: 'Alberto' },
    { id: 'visitor', name: 'You' },
];

const seen = () => {
    try { return window.sessionStorage.getItem(SESSION_KEY) === '1'; } catch { return false; }
};
const markSeen = () => {
    try { window.sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* private mode: show again next time */ }
};

const WelcomeChat = () => {
    const config = data?.homepage?.notifications?.sessionWelcome || {};
    const lines = config.messages || [];
    const reduce = useReducedMotion();
    const { host } = useNotification();
    const [open, setOpen] = React.useState(false);
    const [messages, setMessages] = React.useState([]);
    const [typing, setTyping] = React.useState(false);
    const [held, setHeld] = React.useState(false);

    // Open after the delay, then type each line in turn.
    React.useEffect(() => {
        if (config.enabled === false || !lines.length || seen()) return undefined;
        const timers = [];
        const at = (ms, fn) => timers.push(window.setTimeout(fn, ms));
        let t = Math.max(800, Number.isFinite(config.delayMs) ? config.delayMs : 7000);
        at(t, () => { setOpen(true); markSeen(); });
        lines.forEach((text, i) => {
            at(t, () => setTyping(true));
            t += TYPING_MS;
            at(t, () => {
                setTyping(false);
                setMessages((prev) => [...prev, { id: `m${i}`, authorId: 'alberto', text, createdAt: new Date() }]);
            });
            t += 350;
        });
        return () => timers.forEach(window.clearTimeout);
        // Runs once per mount; the config is static JSON.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Auto-dismiss once everything is said, unless someone is reading it.
    const done = messages.length === lines.length;
    React.useEffect(() => {
        if (!open || !done || held) return undefined;
        const id = window.setTimeout(() => setOpen(false), Number.isFinite(config.durationMs) ? config.durationMs : 16500);
        return () => window.clearTimeout(id);
    }, [open, done, held, config.durationMs]);

    // Rendered into the notification stack so the corner never holds two overlapping surfaces.
    if (!host) return null;
    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.aside
                    className={styles.panel}
                    aria-label="Message from Alberto"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98, filter: `blur(${motionTokens.blur.subtle}px)` }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98, transition: { duration: motionTokens.duration.exit, ease: [...motionTokens.ease.exit] } }}
                    transition={reduce ? { duration: motionTokens.duration.fast } : motionTokens.spring.smooth}
                    onMouseEnter={() => setHeld(true)}
                    onMouseLeave={() => setHeld(false)}
                    onFocus={() => setHeld(true)}
                    onBlur={() => setHeld(false)}
                >
                    <header className={styles.header}>
                        <p className={styles.name}>Alberto</p>
                        <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label="Dismiss message">
                            <X size={16} strokeWidth={1.75} aria-hidden="true" />
                        </button>
                    </header>
                    <ChatThread
                        className={styles.thread}
                        participants={PARTICIPANTS}
                        currentUserId="visitor"
                        messages={messages}
                        typing={typing ? ['alberto'] : []}
                        composer={false}
                        label="Message from Alberto"
                    />
                </motion.aside>
            )}
        </AnimatePresence>,
        host
    );
};

export default WelcomeChat;
