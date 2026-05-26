import React from 'react';

/**
 * PixelReveal
 *
 * Two modes controlled by props:
 *
 *  fullscreen={true} (default)  — position:fixed, window dimensions.
 *                                 Use in Layout for the site-wide background.
 *  fullscreen={false}           — position:absolute, parent dimensions.
 *                                 Use inside a hero/section container.
 *
 *  explode={true} (default)     — fires shockwave on mount, then ambient.
 *  explode={false}              — skips shockwave; ambient only from t=0.
 *
 * Props:
 *   explode      (bool)   default true
 *   fullscreen   (bool)   default true
 *   ambientPeak  (number) default 0.13  — max opacity in ambient phase
 */
const PixelReveal = ({ explode = true, fullscreen = true, ambientPeak = 0.09 }) => {
    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const W = fullscreen ? window.innerWidth : canvas.parentElement.offsetWidth;
        const H = fullscreen ? window.innerHeight : canvas.parentElement.offsetHeight;
        canvas.width = W;
        canvas.height = H;

        const ctx = canvas.getContext('2d');
        const cx = W / 2;
        const cy = H / 2;
        const maxDist = Math.sqrt(cx * cx + cy * cy);

        // Square with big rounded corners (≈37 % of size)
        const RS = 4;    // side length
        const RR = 1.5;  // corner radius
        const SPACING = 10;

        const EXPLOSION_OPACITIES = [0.2, 0.3, 0.45, 0.6, 0.75, 0.9, 1.0];
        const BLAST_RISE = 0.04;
        const BLAST_FADE = 0.38;
        const BLEND_START = explode ? 1.0 : 0;
        const BLEND_DUR = explode ? 0.4 : 0;

        const cols = Math.ceil(W / SPACING) + 2;
        const rows = Math.ceil(H / SPACING) + 2;
        const dots = [];

        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
                const x = c * SPACING;
                const y = r * SPACING;
                const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
                const edgeFactor = dist / maxDist; // 0 = center, 1 = corner
                dots.push({
                    x, y,
                    peakTime: edgeFactor * 0.52 + Math.random() * 0.10,
                    baseOpacity: EXPLOSION_OPACITIES[Math.floor(Math.random() * EXPLOSION_OPACITIES.length)],
                    period: 3.0 + Math.random() * 4.5,
                    phase: Math.random() * Math.PI * 2,
                    // center nearly invisible; edges carry almost all the texture
                    // pow(3) keeps the dark zone large — only brightens near screen corners
                    peak:   ambientPeak * (0.015 + Math.pow(edgeFactor, 3) * 0.985) * (0.3 + Math.random() * 0.7),
                });
            }
        }

        let startTime = null;
        let rafId = null;

        const drawSquare = (x, y) => {
            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(x - RS / 2, y - RS / 2, RS, RS, RR);
            } else {
                ctx.rect(x - RS / 2, y - RS / 2, RS, RS);
            }
            ctx.fill();
        };

        const draw = (ts) => {
            if (!startTime) startTime = ts;
            const t = (ts - startTime) / 1000;

            ctx.clearRect(0, 0, W, H);

            for (const dot of dots) {
                // ── explosion alpha ──
                let blastAlpha = 0;
                if (explode) {
                    const dt = t - dot.peakTime;
                    if (dt >= -BLAST_RISE && dt <= BLAST_FADE) {
                        blastAlpha = dt < 0
                            ? ((dt + BLAST_RISE) / BLAST_RISE) * dot.baseOpacity
                            : (1 - dt / BLAST_FADE) * dot.baseOpacity;
                        blastAlpha = Math.max(0, blastAlpha);
                    }
                }

                // ── ambient alpha ──
                const ambientAlpha =
                    (Math.sin((t / dot.period) * Math.PI * 2 + dot.phase) * 0.5 + 0.5) * dot.peak;

                // ── blend between phases ──
                let alpha;
                if (!explode) {
                    alpha = ambientAlpha;
                } else if (t < BLEND_START) {
                    alpha = blastAlpha;
                } else if (t < BLEND_START + BLEND_DUR) {
                    const mix = (t - BLEND_START) / BLEND_DUR;
                    alpha = blastAlpha * (1 - mix) + ambientAlpha * mix;
                } else {
                    alpha = ambientAlpha;
                }

                if (alpha < 0.009) continue;

                ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
                drawSquare(dot.x, dot.y);
            }

            rafId = requestAnimationFrame(draw);
        };

        rafId = requestAnimationFrame(draw);
        return () => { if (rafId) cancelAnimationFrame(rafId); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: fullscreen ? 'fixed' : 'absolute',
                inset: 0,
                width: fullscreen ? '100vw' : '100%',
                height: fullscreen ? '100vh' : '100%',
                pointerEvents: 'none',
                zIndex: 0,
            }}
        />
    );
};

export default PixelReveal;
