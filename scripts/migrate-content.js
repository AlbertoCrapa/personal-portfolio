#!/usr/bin/env node
/**
 * One-shot migration: legacy `content` blocks -> the authoring schema described
 * in CONTENT-GUIDE.md. Output is rendered identically by ArticleBody, so this
 * changes only how the JSON reads, never what the page looks like.
 *
 *   { type: "section", title, text }   ->  { "h2": title } + "text"
 *   { type: "media", src, description} ->  { "media": src, "caption": ... }
 *   { type: "model" | "beforeAfter" }  ->  { "model": ... } | { "compare": ... }
 *
 * Safe to re-run: already-migrated items pass through untouched.
 */
const fs = require('fs');
const path = require('path');

const drop = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null));

function migrateItem(item) {
  if (typeof item === 'string' || item === null || item === undefined) return [item];
  // already new-style
  if (item.h2 || item.h3 || item.lead || item.media || item.quote || item.callout
      || item.takeaways || item.stats || item.aside || item.gallery || item.compare
      || item.code || item.divider) {
    return [item];
  }

  const type = item.type || (item.src ? 'media' : 'section');

  if (type === 'section') {
    const out = [];
    if (item.title) out.push({ h2: item.title });
    if (item.text) out.push(item.text);
    return out;
  }

  if (type === 'media') {
    return [drop({
      media: item.src,
      poster: item.poster,
      alt: item.alt,
      caption: item.description || item.caption,
      size: item.size,
      fullscreen: (item.nonFullscreen === true || item.fullscreen === false) ? false : undefined,
    })];
  }

  if (type === 'model') {
    return [drop({
      model: item.src,
      poster: item.poster,
      alt: item.alt,
      caption: item.description || item.caption,
    })];
  }

  if (type === 'beforeAfter') {
    return [drop({
      compare: { before: item.before, after: item.after },
      startAt: item.startAt,
      caption: item.description || item.caption,
    })];
  }

  return [item];
}

const migrate = (content) => (Array.isArray(content) ? content.flatMap(migrateItem) : content);

const targets = [
  ['src/data/projects.json', (d) => Object.values(d.projects)],
  ['src/data/blog.json', (d) => d.blogs],
  ['src/data/playground.json', (d) => d.playground],
];

for (const [file, collect] of targets) {
  const abs = path.join(process.cwd(), file);
  const data = JSON.parse(fs.readFileSync(abs, 'utf8'));
  let count = 0;
  for (const item of collect(data)) {
    if (!Array.isArray(item.content)) continue;
    const before = item.content.length;
    item.content = migrate(item.content);
    count += 1;
    process.stdout.write(`  ${item.slug}: ${before} -> ${item.content.length} blocks\n`);
  }
  fs.writeFileSync(abs, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`${file}: migrated ${count} entries`);
}
