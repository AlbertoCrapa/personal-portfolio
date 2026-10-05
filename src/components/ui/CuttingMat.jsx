import React from 'react';
import { useLocation } from 'react-router-dom';

/**
 * CuttingMat — the page backdrop, after the Cutting Mat wallpaper pack by
 * Robert McCombe and Radoslav Bali, drawn in the page's own colours.
 *
 * Read as a sheet of paper on a cutting mat: the mat shows in the margins,
 * strongest at the screen edge, and fades out under the content column, so text and cards sit on a clean
 * surface while the grid, its crosses and the 45° guide frame
 * them. In the column it drops to a trace (a fifth of its strength); on
 * phones, where the margins are a gutter wide, it is barely there at all.
 *
 * It also steps back on busy pages, slowly enough not to be noticed: each
 * route has a hand-set busyness (BUSYNESS), and on navigation the mat eases
 * its strength and the trace left under the content over ~3s. The playground
 * keeps the full mat; a long article or a wall of cards nearly loses it.
 *
 * Fitted to the site but offset: the cell divides the content width exactly
 * (close to 112px) and every line sits half a cell in from the content edges,
 * so no line ever traces the edge of a box or a column. Fixed, like a desk
 * mat under the paper, and redrawn on resize. Ink is `currentColor` (the
 * foreground), so it follows the theme.
 */

const TARGET_CELL = 112;
const TOP_BAR = 56;
const CROSS = 6;
const FADE = 120; // px inside the content edge where the fade reaches the trace
const TRACE = 0.2; // mat strength left under the content, on a quiet screen

// How busy each page is, 0 (quiet) to 1 (dense), set by hand from a one-off
// measure of visible text and media per screen. Chosen once per navigation:
// nothing is measured while scrolling.
const BUSYNESS = [
    [/^\/$/, 0.3], // sparse hero, then cards and writing
    [/^\/playground$/, 0.1],
    [/^\/playground\/[^/]+\/play$/, 0.2],
    [/^\/projects$/, 0.8],
    [/^\/privacy$/, 0.8],
    [/^\/blog$/, 0.9],
    [/^\/(blog|work|playground)\/[^/]+$/, 1], // articles
];
// A trailing slash ("/blog/") is the same page.
const busynessOf = (pathname) => {
    const path = pathname.replace(/(.)\/+$/, '$1');
    return BUSYNESS.find(([route]) => route.test(path))?.[1] ?? 0.5;
};

/** Sets the mat's strength for the current page as CSS variables straight on
 *  the element (no re-render); theme.css eases them over seconds. `ready`
 *  re-runs it once the svg exists, which is after the first measure. */
const useBusyness = (ref, ready) => {
    const { pathname } = useLocation();
    React.useEffect(() => {
        const busy = busynessOf(pathname);
        ref.current?.style.setProperty('--mat-level', String(1 - 0.6 * busy));
        ref.current?.style.setProperty('--mat-trace', String(TRACE - 0.13 * busy));
    }, [pathname, ref, ready]);
};

const measure = () => {
    const shell = document.querySelector('main .page-shell');
    if (!shell) return null;
    const rect = shell.getBoundingClientRect();
    const pad = parseFloat(getComputedStyle(shell).paddingLeft) || 0;
    const span = rect.width - pad * 2;
    const cell = span / Math.max(1, Math.round(span / TARGET_CELL));
    return { width: window.innerWidth, height: window.innerHeight, left: rect.left + pad, right: rect.left + pad + span, cell };
};

const CuttingMat = () => {
    const [mat, setMat] = React.useState(null);
    const ref = React.useRef(null);
    useBusyness(ref, mat !== null);

    React.useEffect(() => {
        let frame = 0;
        const update = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => setMat(measure()));
        };
        update();
        window.addEventListener('resize', update);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('resize', update);
        };
    }, []);

    if (!mat) return null;
    const { width, height, left, right, cell } = mat;
    // Half a cell in from the content edge and the top bar: the substep.
    const ox = left + cell / 2;
    const oy = TOP_BAR + cell / 2;
    const xs = [];
    for (let x = ox - Math.ceil(ox / cell) * cell; x <= width; x += cell) xs.push(x);
    const ys = [];
    for (let y = oy - Math.ceil(oy / cell) * cell; y <= height; y += cell) ys.push(y);

    // Full strength in the margins, a trace under the content.
    const trace = 'rgb(0 0 0 / var(--mat-trace))';
    // The fade runs the whole margin: full strength only at the screen edge.
    const mask = `linear-gradient(to right, #000 0px, ${trace} ${left + FADE}px, ${trace} ${right - FADE}px, #000 ${width}px)`;

    // The 45° guide from the mat's bottom-left corner, off screen.
    const gx = xs[0];
    const gy = ys[ys.length - 1] + cell;
    const reach = Math.max(width, height) * 2;

    return (
        <svg
            aria-hidden="true"
            focusable="false"
            width={width}
            height={height}
            ref={ref}
            className="cutting-mat"
            style={{ color: 'var(--foreground)', maskImage: mask, WebkitMaskImage: mask }}
        >
            <g stroke="currentColor" strokeWidth="1" fill="none" shapeRendering="crispEdges">
                <g strokeOpacity="0.05">
                    {xs.map((x) => <line key={`v${x}`} x1={x} y1={0} x2={x} y2={height} />)}
                    {ys.map((y) => <line key={`h${y}`} x1={0} y1={y} x2={width} y2={y} />)}
                </g>
                <g strokeOpacity="0.2">
                    {xs.flatMap((x) => ys.map((y) => (
                        <path key={`c${x}-${y}`} d={`M${x - CROSS} ${y}H${x + CROSS}M${x} ${y - CROSS}V${y + CROSS}`} />
                    )))}
                </g>
                <line x1={gx} y1={gy} x2={gx + reach} y2={gy - reach} strokeOpacity="0.07" shapeRendering="auto" />
            </g>
        </svg>
    );
};

export default CuttingMat;
