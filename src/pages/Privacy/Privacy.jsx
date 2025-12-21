import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../layouts/Layout';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/ui/Breadcrumb';
import data from '../../data/data.json';


const Privacy = () => {
    const { fullname } = data;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Layout>
            <SEO
                title="Privacy Policy - Alberto Crapanzano"
                description="Privacy policy for albyeah.com - Learn about how your data is handled on this website."
                url="/privacy"
                noindex
            />

            <div className="space-y-8">
                {/* Breadcrumb */}
                <Breadcrumb
                    items={[
                        { label: 'home', path: '/' },
                        { label: 'privacy', path: '/privacy' },
                    ]}
                />

                {/* Content */}
                <article className="max-w-2xl space-y-8">
                    <header>
                        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                            Privacy Policy
                        </h1>
                        <p className="text-text-muted text-sm">
                            Last updated: December 2024
                        </p>
                    </header>

                    {/* No Tracking Section */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-text-primary">
                            Your Privacy Matters
                        </h2>
                        <p className="text-text-secondary leading-relaxed">
                            This website does not use cookies or collect any personal data during your visit.
                            There are no third-party analytics, tracking scripts, or advertising services
                            running on this site. Your browsing activity remains completely private.
                        </p>
                    </section>

                    {/* Contact Form Section */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-text-primary">
                            Contact Form
                        </h2>
                        <p className="text-text-secondary leading-relaxed">
                            If you choose to reach out through the contact form, the information you
                            provide—including your email address, subject, and message—will be sent
                            directly to me via email. This data is used solely to respond to your inquiry.
                        </p>
                        <p className="text-text-secondary leading-relaxed">
                            By submitting the contact form, you agree to share these details for the
                            purpose of communication. Your information will never be sold, shared with
                            third parties, or used for any other purposes.
                        </p>
                    </section>

                    {/* External Links Section */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-text-primary">
                            External Links
                        </h2>
                        <p className="text-text-secondary leading-relaxed">
                            This website may contain links to external platforms (such as GitHub, LinkedIn,
                            or Itch.io). These third-party sites have their own privacy policies, and I
                            have no control over their data collection practices.
                        </p>
                    </section>

                    {/* Questions Section */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-text-primary">
                            Questions?
                        </h2>
                        <p className="text-text-secondary leading-relaxed">
                            If you have any questions about this privacy policy, feel free to{' '}
                            <Link to="/about" className="text-accent-blue hover:underline">
                                get in touch
                            </Link>.
                        </p>
                    </section>
                </article>

                {/* Footer */}
                <footer className="pt-8 border-t border-border text-center space-y-3">
                    <p className="text-xs text-text-muted">
                        © {new Date().getFullYear()} {fullname}. All rights reserved.
                    </p>
                </footer>
            </div>
        </Layout>
    );
};

export default Privacy;
