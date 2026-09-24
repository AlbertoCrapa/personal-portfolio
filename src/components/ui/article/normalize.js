/**
 * Article content normalizer
 * ---------------------------------------------------------------------------
 * One authoring schema for both `projects.json` and `blog.json`.
 *
 * The old schema forced every idea into a `{ type: "section", title, text }`
 * pair, which is why every page read as heading / paragraph / heading /
 * paragraph. Here a heading is its own block, prose is the *default* block, and
 * everything that gives an article rhythm (lead, pull quote, callout, key
 * points, stats, aside, gallery, code, divider) is a first-class block too.
 *
 * Authoring shorthands — a content array may mix all of these:
 *
 *   "Just a paragraph."                  -> prose (full RichText markdown)
 *   "## Why the first version broke"     -> h2
 *   "### A smaller beat"                 -> h3
 *   "---"                                -> divider
 *   { "lead": "..." }                    -> oversized opening paragraph
 *   { "h2": "..." } / { "h3": "..." }    -> heading (h2 feeds the ToC)
 *   { "text": "..." }                    -> prose (explicit form)
 *   { "quote": "...", "cite": "..." }    -> pull quote
 *   { "callout": "...", "variant": "warning", "title": "..." }
 *   { "takeaways": ["..."], "title": "..." }
 *   { "stats": [{ "value": "9", "label": "tables" }] }
 *   { "aside": "..." }                   -> small margin note
 *   { "media": "/x.webp", "caption": "...", "size": "wide" }
 *   { "gallery": [{ "src": "...", "caption": "..." }] }
 *   { "model": "/m.glb", "poster": "...", "caption": "..." }
 *   { "compare": { "before": {...}, "after": {...} }, "caption": "..." }
 *   { "code": "...", "language": "cpp", "caption": "..." }
 *
 * Every legacy shape still normalizes to the exact same output, so old data
 * renders byte-for-byte as before:
 *
 *   { "type": "section", "title": "T", "text": "B" } -> [h2 "T", prose "B"]
 *   { "type": "media", "src", "description" }        -> media
 *   { "type": "model" | "beforeAfter", ... }         -> model | compare
 *   { "src", "description" }        (no type)        -> media
 *   { "title", "text" }             (no type)        -> [h2, prose]
 */

/** Block kinds the renderer knows about. */
export const KINDS = [
    'heading', 'lead', 'prose', 'quote', 'callout', 'keyPoints', 'stats',
    'aside', 'media', 'gallery', 'model', 'compare', 'code', 'divider',
];

/** Author-facing key (or `type` value) -> internal kind. */
const KEY_TO_KIND = {
    // structure
    h2: 'heading', h3: 'heading', h4: 'heading', heading: 'heading', title: 'heading',
    lead: 'lead', deck: 'lead', intro: 'lead',
    text: 'prose', prose: 'prose', paragraph: 'prose', p: 'prose', section: 'prose',
    divider: 'divider', hr: 'divider', rule: 'divider',
    // emphasis
    quote: 'quote', pullquote: 'quote', pullQuote: 'quote',
    callout: 'callout', note: 'callout', info: 'callout', warning: 'callout',
    takeaways: 'keyPoints', keyPoints: 'keyPoints', keypoints: 'keyPoints', checklist: 'keyPoints',
    stats: 'stats', numbers: 'stats', facts: 'stats',
    aside: 'aside', sidenote: 'aside',
    // media
    media: 'media', image: 'media', img: 'media', video: 'media', src: 'media',
    gallery: 'gallery', figures: 'gallery',
    model: 'model',
    compare: 'compare', beforeAfter: 'compare', comparison: 'compare',
    code: 'code', snippet: 'code',
};

/** Keys checked in order when an object has no explicit `type`. */
const INFERENCE_ORDER = [
    'lead', 'deck', 'intro',
    'h2', 'h3', 'h4', 'heading',
    'quote', 'pullquote', 'pullQuote',
    'callout', 'note',
    'takeaways', 'keyPoints', 'keypoints', 'checklist',
    'stats', 'numbers', 'facts',
    'aside', 'sidenote',
    'gallery', 'figures',
    'model',
    'compare', 'beforeAfter', 'comparison',
    'code', 'snippet',
    'media', 'image', 'img', 'video',
    'divider', 'hr', 'rule',
    'src',
    'text', 'prose', 'paragraph', 'p',
];

const isFilledString = (v) => typeof v === 'string' && v.trim().length > 0;

/** `nonFullscreen: true` / `fullscreen: false` both opt a figure out. */
const allowsFullscreen = (item) =>
    !(item.nonFullscreen === true || item.fullscreen === false);

/** Accepts "/a.png" or { src, alt, caption } and returns the object form. */
const toFigure = (value, fallback = {}) => {
    if (isFilledString(value)) return { src: value, ...fallback };
    if (value && typeof value === 'object') {
        return {
            src: value.src,
            alt: value.alt,
            caption: value.caption || value.description,
            ...fallback,
        };
    }
    return null;
};

const headingLevel = (item, key) => {
    if (Number.isFinite(item.level)) return Math.min(4, Math.max(2, item.level));
    if (key === 'h3') return 3;
    if (key === 'h4') return 4;
    return 2;
};

/**
 * Turn one authored item into zero or more normalized blocks.
 * Legacy `{ title, text }` is the only 1 -> 2 expansion.
 */
function normalizeItem(item) {
    if (item === null || item === undefined) return [];

    // --- bare strings -------------------------------------------------------
    if (typeof item === 'string') {
        const trimmed = item.trim();
        if (!trimmed) return [];
        if (/^-{3,}$/.test(trimmed)) return [{ kind: 'divider' }];
        const h = trimmed.match(/^(#{2,4})\s+(.+)$/);
        if (h) return [{ kind: 'heading', level: h[1].length, text: h[2].trim() }];
        return [{ kind: 'prose', text: item }];
    }

    if (Array.isArray(item)) return item.flatMap(normalizeItem);
    if (typeof item !== 'object') return [];

    // --- pick the block kind ------------------------------------------------
    let key = null;
    if (isFilledString(item.type)) {
        key = item.type;
    } else {
        key = INFERENCE_ORDER.find((k) => item[k] !== undefined && item[k] !== null) || null;
    }
    const kind = KEY_TO_KIND[key] || (item.src ? 'media' : 'prose');

    // A legacy titled section is a heading *and* a body, not one welded block.
    const legacyTitled =
        kind === 'prose' && isFilledString(item.title) && key !== 'heading' && key !== 'title';
    if (legacyTitled) {
        const out = [{ kind: 'heading', level: 2, text: item.title.trim() }];
        const body = item.text ?? item.prose ?? item.paragraph;
        if (body) out.push({ kind: 'prose', text: body });
        return out;
    }

    switch (kind) {
        case 'heading': {
            const text = item.h2 ?? item.h3 ?? item.h4 ?? item.heading ?? item.title;
            if (!isFilledString(text)) return [];
            return [{
                kind: 'heading',
                level: headingLevel(item, key),
                text: text.trim(),
                // `toc: false` keeps a heading out of the sidebar.
                toc: item.toc !== false,
            }];
        }

        case 'lead': {
            const text = item.lead ?? item.deck ?? item.intro ?? item.text;
            return isFilledString(text) || Array.isArray(text) ? [{ kind: 'lead', text }] : [];
        }

        case 'prose': {
            const text = item.text ?? item.prose ?? item.paragraph ?? item.p;
            return text ? [{ kind: 'prose', text }] : [];
        }

        case 'divider':
            return [{ kind: 'divider' }];

        case 'quote': {
            const text = item.quote ?? item.pullquote ?? item.pullQuote ?? item.text;
            if (!isFilledString(text)) return [];
            return [{ kind: 'quote', text, cite: item.cite || item.author || item.source }];
        }

        case 'callout': {
            const text = item.callout ?? item.note ?? item.info ?? item.warning ?? item.text;
            if (!text) return [];
            const variant = item.variant || item.tone
                || (key === 'warning' ? 'warning' : 'info');
            return [{ kind: 'callout', text, variant, title: item.title }];
        }

        case 'keyPoints': {
            const items = item.takeaways ?? item.keyPoints ?? item.keypoints ?? item.checklist;
            const list = (Array.isArray(items) ? items : [items]).filter(isFilledString);
            if (!list.length) return [];
            return [{ kind: 'keyPoints', title: item.title, items: list, variant: item.variant }];
        }

        case 'stats': {
            const raw = item.stats ?? item.numbers ?? item.facts;
            const list = (Array.isArray(raw) ? raw : []).filter(Boolean).map((s) =>
                typeof s === 'string'
                    ? { value: s.split('—')[0]?.trim(), label: s.split('—')[1]?.trim() }
                    : { value: s.value, label: s.label, hint: s.hint }
            ).filter((s) => isFilledString(s.value));
            if (!list.length) return [];
            return [{ kind: 'stats', items: list }];
        }

        case 'aside': {
            const text = item.aside ?? item.sidenote ?? item.text;
            if (!text) return [];
            return [{ kind: 'aside', text, title: item.title }];
        }

        case 'media': {
            const src = item.media ?? item.image ?? item.img ?? item.video ?? item.src;
            if (!isFilledString(src)) return [];
            return [{
                kind: 'media',
                src,
                poster: item.poster,
                alt: item.alt,
                caption: item.caption ?? item.description,
                size: item.size || 'full',
                allowFullscreen: allowsFullscreen(item),
            }];
        }

        case 'gallery': {
            const raw = item.gallery ?? item.figures;
            const figures = (Array.isArray(raw) ? raw : []).map((f) => toFigure(f)).filter((f) => f?.src);
            if (!figures.length) return [];
            return [{
                kind: 'gallery',
                items: figures,
                caption: item.caption ?? item.description,
                columns: item.columns || Math.min(figures.length, 3),
                allowFullscreen: allowsFullscreen(item),
            }];
        }

        case 'model': {
            const src = isFilledString(item.model) ? item.model : item.src;
            if (!isFilledString(src)) return [];
            return [{
                kind: 'model',
                src,
                poster: item.poster,
                alt: item.alt,
                caption: item.caption ?? item.description,
                size: item.size || 'full',
            }];
        }

        case 'compare': {
            const pair = item.compare ?? item.comparison ?? item;
            const before = toFigure(pair.before);
            const after = toFigure(pair.after);
            if (!before?.src || !after?.src) return [];
            return [{
                kind: 'compare',
                before,
                after,
                caption: item.caption ?? item.description ?? pair.description,
                startAt: item.startAt ?? pair.startAt,
                size: item.size || 'full',
            }];
        }

        case 'code': {
            const code = item.code ?? item.snippet;
            if (!isFilledString(code)) return [];
            return [{
                kind: 'code',
                code,
                language: item.language || item.lang || 'text',
                caption: item.caption ?? item.description,
                filename: item.filename || item.file,
            }];
        }

        default:
            return [];
    }
}

/** Normalize a whole `content` array. */
export function normalizeContent(content) {
    if (!Array.isArray(content)) return [];
    return content.flatMap(normalizeItem);
}

/** ToC entries — h2 headings only, so the sidebar stays a map and not an index. */
export function getTocSections(blocks, toId) {
    return blocks
        .filter((b) => b.kind === 'heading' && b.level === 2 && b.toc !== false)
        .map((b) => ({ id: toId(b.text), title: b.text }));
}

const MARKDOWN_NOISE = [
    [/```[\s\S]*?```/g, ' '],
    [/!\[[^\]]*\]\([^)]*\)/g, ' '],
    [/\[([^\]]+)\]\([^)]*\)(\{[^}]*\})?/g, '$1'],
    [/[*_`>#~=]/g, ''],
    [/\s+/g, ' '],
];

/** Plain-text opening of an article, for meta descriptions and JSON-LD. */
export function getArticleSummary(blocks, length = 160) {
    const first = blocks.find((b) => (b.kind === 'lead' || b.kind === 'prose') && b.text);
    if (!first) return '';
    const raw = Array.isArray(first.text) ? first.text.join(' ') : String(first.text);
    const clean = MARKDOWN_NOISE.reduce((acc, [re, to]) => acc.replace(re, to), raw).trim();
    return clean.length > length ? `${clean.slice(0, length).trimEnd()}…` : clean;
}

/** First image/video in the body — used as a cover fallback. */
export function getFirstMediaSrc(blocks) {
    return blocks.find((b) => b.kind === 'media' && b.src)?.src || null;
}
