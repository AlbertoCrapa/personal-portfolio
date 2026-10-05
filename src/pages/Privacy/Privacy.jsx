import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import SEO from '../../components/SEO';
import Breadcrumb from '../../components/ui/Breadcrumb';
import styles from './Privacy.module.css';

/** Privacy — what the site collects (nothing) and what the contact form does. */
const Privacy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <SEO
                title="Privacy Policy - Alberto Crapanzano"
                description="Privacy policy for albyeah.com - Learn about how your data is handled on this website."
                url="/privacy"
                noindex
            />

            <article className={styles.page}>
                <Breadcrumb items={[{ label: 'home', path: '/' }, { label: 'privacy', path: '/privacy' }]} />

                <header className={styles.header}>
                    <h1 className={styles.title}>Privacy policy</h1>
                    <p className={styles.updated}>Last updated December 2024</p>
                </header>

                <section className={styles.section} aria-labelledby="privacy-tracking">
                    <h2 id="privacy-tracking" className={styles.heading}>No tracking</h2>
                    <p>
                        This website does not use cookies or collect any personal data during your visit.
                        There are no third-party analytics, tracking scripts, or advertising services
                        running on this site. Your browsing activity remains completely private.
                    </p>
                </section>

                <section className={styles.section} aria-labelledby="privacy-contact">
                    <h2 id="privacy-contact" className={styles.heading}>Contact form</h2>
                    <p>
                        If you choose to reach out through the contact form, the information you
                        provide (your email address, subject and message) is sent directly to me by
                        email. It is used only to reply to you.
                    </p>
                    <p>
                        By sending the form, you agree to share these details for the purpose of
                        communication. Your information will never be sold, shared with third parties,
                        or used for any other purpose.
                    </p>
                </section>

                <section className={styles.section} aria-labelledby="privacy-links">
                    <h2 id="privacy-links" className={styles.heading}>External links</h2>
                    <p>
                        This website may contain links to external platforms (such as GitHub, LinkedIn,
                        or Itch.io). These third-party sites have their own privacy policies, and I
                        have no control over their data collection practices.
                    </p>
                </section>

                <section className={styles.section} aria-labelledby="privacy-questions">
                    <h2 id="privacy-questions" className={styles.heading}>Questions</h2>
                    <p>
                        If you have any questions about this policy,{' '}
                        <Link to="/#contact" className={styles.link}>send me a message</Link>.
                    </p>
                </section>
            </article>
        </>
    );
};

export default Privacy;
