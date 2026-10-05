import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';

import { ArrowLeft, RotateCw } from 'lucide-react';

import SEO from '../../components/SEO';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { Alert } from '../../components/arc/alert/alert';
import { Button } from '../../components/arc/button/button';
import playgroundData from '../../data/playground.json';
import { getExperienceComponent } from '../../experiences';
import styles from './Experience.module.css';

// Leaving fades the stage out on Arc's exit timing before the route changes.
const EXIT_MS = 180;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Experience Page — the dedicated, playable stage for a playground item.
 * Keeps the write-up on /playground/:slug and hosts the interactive build
 * here at /playground/:slug/play, so leaving the experience always lands
 * back on the description rather than a blank state.
 */
const Experience = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const items = (playgroundData.playground || []).filter((item) => !item.hidden);
  const project = items.find((p) => p.slug === slug);

  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  const goToDetails = useCallback(() => {
    const basePath = `/playground/${slug}`;
    if (leaving || prefersReducedMotion()) {
      navigate(basePath);
      return;
    }
    setLeaving(true);
    window.setTimeout(() => navigate(basePath), EXIT_MS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, navigate, leaving]);

  if (!project || !project.experience) {
    return <Navigate to={project ? `/playground/${slug}` : '/playground'} replace />;
  }

  const ExperienceComponent = getExperienceComponent(project.experience.kind);

  return (
    <>
      <SEO title={`${project.title} (playing) | Alberto Crapanzano`} noindex />

      <div className={styles.page}>
        <Breadcrumb
          items={[
            { label: 'home', path: '/' },
            { label: 'playground', path: '/playground' },
            { label: project.title, path: `/playground/${slug}` },
            { label: 'play', path: `/playground/${slug}/play` },
          ]}
        />

        <header className={styles.header}>
          <h1 className={styles.title}>{project.title}</h1>
          <Button variant="secondary" onClick={goToDetails}>
            <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />
            Back to details
          </Button>
        </header>

        {project.experience.instructions && (
          <p className={styles.instructions}>{project.experience.instructions}</p>
        )}

        <div
          className={styles.stage}
          data-leaving={leaving || undefined}
          aria-busy={!ready && !loadError ? 'true' : undefined}
        >
          {!ready && !loadError && (
            <div className={styles.loading} role="status">
              <span className={styles.pulse} aria-hidden="true" />
              Loading the experience
            </div>
          )}

          {loadError && (
            <div className={styles.error}>
              <Alert tone="danger" title="The experience didn't load">
                Your browser may have blocked it, or the download was interrupted.
              </Alert>
              <Button variant="secondary" onClick={() => window.location.reload()}>
                <RotateCw size={16} strokeWidth={1.75} aria-hidden="true" />
                Reload the experience
              </Button>
            </div>
          )}

          {ExperienceComponent ? (
            <div className={styles.canvas} data-ready={ready || undefined}>
              <Suspense fallback={null}>
                <ExperienceComponent onReady={() => setReady(true)} onError={(err) => setLoadError(err)} />
              </Suspense>
            </div>
          ) : (
            !loadError && <p className={styles.unavailable}>This experience isn't available yet.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Experience;
