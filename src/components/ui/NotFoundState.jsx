import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { Button } from '../arc/button/button';
import LinkButton from './LinkButton';
import styles from './NotFoundState.module.css';

/**
 * NotFoundState — a missing page or record: what happened, then one way on
 * (plus a way back when there is history to go back to).
 */
const NotFoundState = ({ title, description, to, label }) => {
    const navigate = useNavigate();
    const canGoBack = typeof window !== 'undefined' && window.history.length > 1;

    return (
        <section className={styles.state}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.description}>{description}</p>
            <div className={styles.actions}>
                <LinkButton to={to} variant="primary">{label}</LinkButton>
                {canGoBack && (
                    <Button variant="ghost" onClick={() => navigate(-1)}>
                        <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />
                        Go back
                    </Button>
                )}
            </div>
        </section>
    );
};

export default NotFoundState;
