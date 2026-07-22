import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';

import SEO from '../../components/SEO';
import Breadcrumb from '../../components/ui/Breadcrumb';
import RevealSection from '../../components/ui/RevealSection';
import playgroundData from '../../data/playground.json';
import { getExperienceComponent } from '../../experiences';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const EXIT_MS = 320;

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

  const items = playgroundData.playground || [];
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
      <SEO title={`${project.title} — Playing | Alberto Crapanzano`} noindex />

      <RevealSection>
        <div className="space-y-4">
          <Breadcrumb
            items={[
              { label: 'home', path: '/' },
              { label: 'playground', path: '/playground' },
              { label: project.title, path: `/playground/${slug}` },
              { label: 'play', path: `/playground/${slug}/play` },
            ]}
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary">{project.title}</h1>
            <button
              type="button"
              onClick={goToDetails}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary bg-surface hover:bg-surface-hover border border-border rounded-full px-4 py-2 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to details
            </button>
          </div>

          {project.experience.instructions && (
            <p className="text-sm text-text-secondary max-w-2xl">{project.experience.instructions}</p>
          )}

          <div
            className="relative w-full h-[60vh] sm:h-[65vh] md:h-[70vh] max-h-[720px] rounded-xl border border-border bg-surface overflow-hidden flex items-center justify-center"
            style={{
              opacity: leaving ? 0 : 1,
              transform: leaving ? 'scale(0.98)' : 'scale(1)',
              transition: prefersReducedMotion() ? 'none' : `opacity ${EXIT_MS}ms ${EASE}, transform ${EXIT_MS}ms ${EASE}`,
            }}
          >
            {!ready && !loadError && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-surface">
                <div className="w-8 h-8 rounded-full border-2 border-border border-t-accent-blue animate-spin" />
                <p className="text-sm text-text-muted">Loading experience…</p>
              </div>
            )}

            {loadError && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 text-center px-6 bg-surface">
                <p className="text-text-primary font-semibold">Couldn't load this experience</p>
                <p className="text-sm text-text-secondary">Please refresh the page and try again.</p>
              </div>
            )}

            {ExperienceComponent ? (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  opacity: ready ? 1 : 0,
                  transition: prefersReducedMotion() ? 'none' : `opacity 400ms ${EASE}`,
                }}
              >
                <Suspense fallback={null}>
                  <ExperienceComponent onReady={() => setReady(true)} onError={(err) => setLoadError(err)} />
                </Suspense>
              </div>
            ) : (
              !loadError && (
                <p className="text-sm text-text-muted">This experience isn't available yet.</p>
              )
            )}
          </div>
        </div>
      </RevealSection>
    </>
  );
};

export default Experience;
