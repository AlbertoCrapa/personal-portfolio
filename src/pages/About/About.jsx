import React, { useEffect } from 'react';
import Layout from '../../layouts/Layout';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import { useNotification } from '../../components/ui/NotificationProvider';
import data from '../../data/data.json';

/**
 * About & Contact Page
 * Personal introduction and contact form
 */
const About = () => {
    const { about, contact } = data;
    const { notify } = useNotification();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Layout>
            <SEO
                title="About & Contact - Alberto Crapanzano | Game Developer"
                description="Learn more about Alberto Crapanzano (Albyeah), a technical artist and creative developer specializing in playful digital experiences. Get in touch for collaborations."
                keywords="About, Contact, Alberto Crapanzano, Albyeah, Technical Artist, Game Developer, Freelance"
                url="/about"
            />

            <div className="space-y-8">
                {/* Breadcrumb */}
                <Breadcrumb
                    items={[
                        { label: 'home', path: '/' },
                        { label: 'about', path: '/about' },
                    ]}
                />

                {/* About Section */}
                <section className="space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold text-text-primary">Hi!</h1>

                    <div className="max-w-2xl space-y-4">
                        <p className="text-text-secondary leading-relaxed text-lg">
                            {about?.description2 || "If you are interested in working with me on a project, reach out!"}
                        </p>
                    </div>
                </section>

                {/* Contact Form Section */}
                <section className="bg-surface rounded-xl p-6 lg:p-8 max-w-xl">
                    <h2 className="text-2xl font-bold text-text-primary mb-6">Let's talk</h2>
                    <ContactForm email={contact?.email} />
                </section>

                {/* Quick Links */}
                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-text-primary">Quick Links</h2>
                    <div className="flex flex-wrap gap-3">
                        {contact?.cv && (
                            <Button
                                href={contact.cv}
                                download
                                variant="secondary"
                                size="md"
                                onClick={() => {
                                    notify({
                                        type: 'success',
                                        title: 'Download started',
                                        message: 'Your CV file is being downloaded.',
                                    });
                                }}
                            >
                                Download CV
                            </Button>
                        )}
                        {contact?.github && (
                            <Button href={contact.github} variant="secondary" size="md">
                                GitHub
                            </Button>
                        )}
                        {contact?.linkedin && (
                            <Button href={contact.linkedin} variant="secondary" size="md">
                                LinkedIn
                            </Button>
                        )}
                    </div>
                </section>

            </div>
        </Layout>
    );
};

/**
 * Contact Form Component
 */
const ContactForm = ({ email = 'hello@albyeah.com' }) => {
    const [formData, setFormData] = React.useState({
        email: '',
        subject: '',
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`From: ${formData.email}\n\n${formData.message}`)}`;
        window.location.href = mailtoLink;
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
            <div className="space-y-1.5">
                <label htmlFor="contact-email" className="text-sm font-medium text-text-secondary">Email</label>
                <input
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue transition-colors"
                />
            </div>
            <div className="space-y-1.5">
                <label htmlFor="contact-subject" className="text-sm font-medium text-text-secondary">Subject</label>
                <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    placeholder="Project collaboration"
                    autoComplete="off"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue transition-colors"
                />
            </div>
            <div className="space-y-1.5">
                <label htmlFor="contact-message" className="text-sm font-medium text-text-secondary">Message</label>
                <textarea
                    id="contact-message"
                    name="message"
                    placeholder="Tell me about your project, team, or role."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue transition-colors resize-none"
                />
            </div>
            <Button type="submit" variant="primary" size="md">
                Send Message
            </Button>
        </form>
    );
};

export default About;
