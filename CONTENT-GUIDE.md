# Content Guide — projects & blog

One schema, one renderer, one set of rules for `src/data/projects.json`,
`src/data/blog.json` and `src/data/playground.json`.

Part 1 is **how to write** so a page reads like something a person shaped.
Part 2 is **what you can write** — the block reference.
Part 3 is the checklist to run before publishing.

---

## Part 1 — Making a page read naturally

### The problem this replaced

Every page used to be a list of `{ title, text }` pairs, so every page came out
the same shape:

```
Heading
Paragraph of ~90 words
Heading
Paragraph of ~90 words
Heading
Paragraph of ~90 words
```

Nothing there is badly written. It still reads as generated, because **the page
has exactly one texture**. Every element is the same size, sits the same
distance from its neighbours, and asks for the same amount of attention. A
reader's eye has nothing to skip and nowhere to rest, so it stops reading and
starts scanning — and scanning finds nothing, because nothing is shaped
differently from anything else.

Uniform paragraph length is the single loudest "this was generated" signal, and
it survives excellent sentences. Fixing it is a layout job, not a writing job.

### What the articles people actually finish do

Patterns that show up in nearly every long technical piece that gets read to the
end — postmortems, engine deep-dives, the long Medium posts people forward:

1. **They open with a lead, not a heading.** One oversized paragraph that says
   what the thing is and why it was hard. The first heading arrives two or three
   paragraphs in, once the reader is already inside the story.
2. **Paragraph length varies on purpose.** A five-line explanation, then a
   one-line verdict. Unevenness *is* what "natural" means here.
3. **Headings make a claim.** "Why the first version broke" beats "Architecture".
   A heading that names a topic is a label; a heading that states something is a
   promise the next paragraph keeps.
4. **One sentence per section gets promoted** to a pull quote, and the rest of
   the section stays quiet. Two pull quotes in a section reads as shouting.
5. **Figures sit inside the argument**, immediately after the sentence they
   prove — never parked at the end of a section as decoration.
6. **Captions add information.** They are the second most-read text on a page
   after the title. A caption that repeats the alt text is wasted.
7. **Concrete numbers instead of adjectives.** "9 tables", "16 ms", "6 months".
   A `stats` row is cheaper credibility than a paragraph of claims.
8. **They show the failure before the fix.** The naive version, the bug, the
   before/after. A solution with no visible problem reads like a brochure.
9. **They end on what changed**, not on a summary of what was said.

### The rhythm rules

These are the ones worth being strict about:

- **Never more than three prose blocks in a row** without something that is not
  prose — a figure, a list, a quote, a callout, a stat row.
- **Never two headings in a row.** If a heading has no body, it is not a
  heading, it is a label for the block under it.
- **Delay the first heading.** Lead plus one or two paragraphs first.
- **Roughly 250 words between visual breaks.** Past that, readers start
  skimming for the next non-text element and skip the prose in between.
- **A section with no figure, no list and no quote is probably two sections** —
  or one section that has not decided what it is about.
- **Vary figure width.** Not everything deserves the full column. A portrait
  screenshot at full width just looks lost (`size: "inline"`), a node graph at
  column width buries the detail (`size: "wide"`).
- **At most two inline marks per paragraph.** Emphasis works by contrast: a
  paragraph where five phrases are bold has no emphasis, only texture.

### The scan test

Read only the **headings**, the **lead**, the **pull quotes** and the
**captions**. If that alone tells the story, the page works. If it reads as a
list of topics, the headings are labels and the captions are decoration.

### Spacing is not your job

`ArticleBody` decides the gap above every block from what came before it: a
paragraph hugs its heading, two paragraphs sit close, a new section gets air, a
divider gets a lot. Do not try to fake rhythm with empty strings or stray
dividers — write the blocks and let the renderer space them.

### The reading measure

The column is currently `max-w-3xl` (~95 characters per line). Typographers put
comfortable long-form reading at 65–75. It is deliberately left alone so that
existing pages did not shift, but it is one line if you ever want it:

```js
// src/components/ui/ArticleBody.jsx
const MEASURE = 'max-w-3xl';       // today  — ~95 characters
const MEASURE = 'max-w-[68ch]';    // narrower — ~68 characters
```

That single change affects every project and post at once, which is exactly why
it is a decision and not a per-article setting.

---

## Part 2 — The block reference

`content` is a flat array. **A bare string is a paragraph** — that is the
default, and an article made of nothing but strings is valid and perfectly
readable. Everything else is an object with one recognised key.

```json
"content": [
  { "lead": "The opening paragraph, one size up." },
  "A plain paragraph. Full markdown works here.",
  "## A heading — shorthand for { \"h2\": ... }",
  "Another paragraph, under that heading.",
  { "media": "/works/thing/shot.webp", "caption": "Says something the text doesn't." },
  { "quote": "The one sentence worth promoting." },
  "---",
  "## The next act"
]
```

### Structure

| Block | Written as | Notes |
| --- | --- | --- |
| Paragraph | `"text..."` or `{ "text": "..." }` | The default. Full markdown; `\n\n` separates paragraphs inside one block. |
| Lead | `{ "lead": "..." }` | Oversized opening paragraph. One per article, at the top. |
| Heading (h2) | `"## Title"` or `{ "h2": "Title" }` | Feeds the table of contents. Add `"toc": false` to keep one out. |
| Heading (h3) | `"### Title"` or `{ "h3": "Title" }` | A beat inside a section. Not in the ToC. |
| Divider | `"---"` or `{ "divider": true }` | A scene break between acts, not between sections. Use two or three per article at most. |

### Emphasis

| Block | Written as | Use it for |
| --- | --- | --- |
| Pull quote | `{ "quote": "...", "cite": "optional" }` | The claim the reader should leave with. One per major section. |
| Callout | `{ "callout": "...", "variant": "info" \| "warning", "title": "..." }` | The aside you would otherwise bury in brackets. |
| Key points | `{ "takeaways": ["...", "..."], "title": "..." }` | "What this covers" near the top, "what I'd do differently" at the end. 3–5 items. |
| Stats | `{ "stats": [{ "value": "9", "label": "tables", "hint": "optional" }] }` | 2–4 concrete numbers. Breaks the text wall and is instantly scannable. |
| Aside | `{ "aside": "...", "title": "optional" }` | Smaller type, deliberately skippable. |

### Media

| Block | Written as |
| --- | --- |
| Image / video | `{ "media": "/path.webp", "caption": "...", "size": "full" \| "wide" \| "inline" \| "small", "alt": "...", "fullscreen": false }` |
| Gallery | `{ "gallery": [{ "src": "...", "caption": "..." }], "columns": 2, "caption": "..." }` |
| 3D model | `{ "model": "/model.glb", "poster": "/poster.webp", "caption": "..." }` |
| Before / after | `{ "compare": { "before": { "src": "..." }, "after": { "src": "..." } }, "startAt": 50, "caption": "..." }` |
| Code | `{ "code": "...", "language": "cpp", "filename": "src/Thing.cpp", "caption": "..." }` |

`.mp4`, `.webm` and `.mov` are detected automatically and rendered as video —
there is no separate video block. Video autoplays muted and pauses off-screen.

**Sizes.** `full` is the column width (default). `wide` breaks the column on
large screens without ever reaching the table of contents. `inline` and `small`
are for portrait shots and diagrams that look silly stretched.

**Captions are plain text.** Markdown is not parsed inside a caption — no
backticks, no asterisks.

### Inline markup (inside any prose block)

| Syntax | Result | Use it for |
| --- | --- | --- |
| `**bold**` | **bold** | The load-bearing phrase in a paragraph. |
| `*italic*` | *italic* | A title, a term, a light stress. |
| `__underline__` | underline | A term you are about to define. |
| `==highlight==` | highlight | The one clause a skimmer must not miss. |
| `~~strike~~` | ~~strike~~ | The idea you tried and abandoned. |
| `` `code` `` | `code` | Identifiers, file names, values. |
| `[text](url)` | link | Add `{hover text}` after it when the destination is not obvious. |
| `- item` | bullet list | Genuinely parallel items, 3–5 of them. |
| `1. item` | numbered list | Sequence, and only sequence. |
| `> quote` | soft quote | Quoting someone, including a past version of yourself. Quieter than a pull quote. |
| ` ```lang ` | code block | Same renderer as the `code` block, without the filename and caption. |
| `:::info` … `:::` | callout | Same component as the `callout` block. |
| `---` | rule | Prefer the `divider` block. |

### Legacy shape

`{ "type": "section", "title": "...", "text": "..." }` still works and still
renders identically — it normalises to a heading plus a paragraph. So do
`{ "type": "media" }`, `{ "type": "model" }` and `{ "type": "beforeAfter" }`.
Nothing has to be rewritten in a hurry, but new writing should use the short
form: the point of the refactor is that a paragraph no longer needs a heading in
order to exist.

`scripts/migrate-content.js` converts a legacy file in place, and is safe to
re-run.

---

## Part 3 — Before publishing

- [ ] The first heading is **not** the first block.
- [ ] No run of more than three prose blocks without something that is not prose.
- [ ] Paragraph lengths visibly vary — at least one one-liner, at least one long one.
- [ ] Every heading makes a claim, not a topic label.
- [ ] Every figure sits after the sentence it proves, not at the end of a section.
- [ ] Every caption says something the paragraph does not.
- [ ] At least one concrete number instead of an adjective.
- [ ] At most one pull quote per major section.
- [ ] No paragraph carries more than two inline marks.
- [ ] The scan test passes: headings + lead + quotes + captions tell the story.
- [ ] The last block is what changed, not a summary of what was said.

## Where this lives in the code

| File | Job |
| --- | --- |
| `src/components/ui/article/normalize.js` | Authoring shapes → normalized blocks. All back-compat lives here. |
| `src/components/ui/ArticleBody.jsx` | Renders blocks and owns the vertical rhythm. |
| `src/components/ui/article/blocks.jsx` | Lead, pull quote, key points, stats, aside, gallery, divider, code figure. |
| `src/components/ui/RichText.jsx` | Markdown inside a prose block. |
| `src/components/ui/MediaFrame.jsx` | Images and video, with the fullscreen morph. |
| `scripts/generate-feed.js` | A deliberately crude renderer of the same schema, for RSS. |

**A worked example lives at `/work/text-typo-example`** — every block type and
every inline mark, written as a real article rather than a component gallery.
