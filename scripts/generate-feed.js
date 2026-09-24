#!/usr/bin/env node

/**
 * JSON Feed Generator Script
 * Generates a valid JSON Feed (https://jsonfeed.org/) from blog.json
 * Run with: node scripts/generate-feed.js
 */

const fs = require("fs");
const path = require("path");

// Paths
const blogDataPath = path.join(__dirname, "../src/data/blog.json");
const feedOutputPath = path.join(__dirname, "../public/feed.json");

// Site configuration
const SITE_URL = "https://albyeah.com";
const SITE_TITLE = "Alberto Crapanzano Blog";
const SITE_DESCRIPTION =
  "Game developer blog - Unreal Engine, C++, game design, and development insights";
const AUTHOR_NAME = "Alberto Crapanzano";

/**
 * Generate JSON Feed from blog data
 */
function generateFeed() {
  console.log("📰 Generating JSON Feed...");

  // Read blog data
  let blogData;
  try {
    const rawData = fs.readFileSync(blogDataPath, "utf8");
    blogData = JSON.parse(rawData);
  } catch (error) {
    console.error("❌ Error reading blog.json:", error.message);
    process.exit(1);
  }

  const blogs = blogData.blogs || [];

  // Sort by date (newest first)
  const sortedBlogs = [...blogs].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  // Build JSON Feed structure (v1.1)
  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: SITE_TITLE,
    home_page_url: SITE_URL,
    feed_url: `${SITE_URL}/feed.json`,
    description: SITE_DESCRIPTION,
    icon: `${SITE_URL}/img/icons/icon-512.png`,
    favicon: `${SITE_URL}/favicon.ico`,
    authors: [
      {
        name: AUTHOR_NAME,
        url: SITE_URL,
      },
    ],
    language: "en-US",
    items: sortedBlogs.map((blog) => {
      const contentItems = Array.isArray(blog.content) ? blog.content : [];

      // Get first paragraph as summary
      const firstText = contentItems
        .map(readText)
        .find((text) => typeof text === "string" && text.trim());
      const summary = blog.excerpt || stripMarkdown(firstText).substring(0, 280) || "";

      // Combine content items into HTML
      const contentHtml = contentItems.map(itemToHtml).join("\n") || "";

      // Get cover image
      const coverSrc =
        blog.cover ||
        contentItems.map(readMediaSrc).find(Boolean) ||
        blog.media?.[0]?.src;

      const coverImage = coverSrc ? `${SITE_URL}${coverSrc}` : null;

      return {
        id: `${SITE_URL}/blog/${blog.slug}`,
        url: `${SITE_URL}/blog/${blog.slug}`,
        title: blog.title,
        summary: summary.replace(/\n/g, " ").substring(0, 280),
        content_html: contentHtml,
        image: coverImage,
        date_published: new Date(blog.date).toISOString(),
        date_modified: new Date(blog.date).toISOString(),
        authors: [
          {
            name: blog.author || AUTHOR_NAME,
          },
        ],
        tags: blog.tags || [],
      };
    }),
  };

  // Write feed to public folder
  try {
    fs.writeFileSync(feedOutputPath, JSON.stringify(feed, null, 2), "utf8");
    console.log(`✅ Generated feed.json with ${feed.items.length} items`);
    console.log(`   Output: ${feedOutputPath}`);
  } catch (error) {
    console.error("❌ Error writing feed.json:", error.message);
    process.exit(1);
  }
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Convert basic markdown to HTML
 */
function convertMarkdownToHtml(text) {
  if (!text) return "";

  return (
    text
      // Escape HTML first
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      // Bold
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // Underline
      .replace(/__(.*?)__/g, "<u>$1</u>")
      // Italic (after bold, so "**x**" is never read as "*<em>x</em>*")
      .replace(/\*([^*\n]+)\*/g, "<em>$1</em>")
      // Highlight / strikethrough
      .replace(/==(.+?)==/g, "<mark>$1</mark>")
      .replace(/~~(.+?)~~/g, "<s>$1</s>")
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      // Line breaks
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br>")
  );
}

/**
 * The feed has its own, deliberately crude renderer: an aggregator only gets
 * headings, paragraphs, lists, quotes, code and figures. Everything richer
 * (galleries, 3D models, before/after sliders) degrades to its plainest
 * useful form. Understands both the block schema in CONTENT-GUIDE.md and the
 * legacy `{ type: "section", title, text }` shape.
 */
function readText(item) {
  if (typeof item === "string") return /^(#{2,4}\s|-{3,}$)/.test(item.trim()) ? "" : item;
  if (!item || typeof item !== "object") return "";
  return item.lead || item.text || item.prose || "";
}

function readMediaSrc(item) {
  if (!item || typeof item !== "object") return null;
  if (item.type && item.type !== "media") return null;
  return item.media || item.image || item.video || item.src || null;
}

function listToHtml(items) {
  return `<ul>${items.map((i) => `<li>${convertMarkdownToHtml(String(i))}</li>`).join("")}</ul>`;
}

function figureToHtml(src, caption, fallbackAlt) {
  let html = `<figure><img src="${escapeHtml(src)}" alt="${escapeHtml(caption || fallbackAlt)}" />`;
  if (caption) html += `<figcaption>${escapeHtml(caption)}</figcaption>`;
  return `${html}</figure>`;
}

function itemToHtml(item) {
  if (typeof item === "string") {
    const trimmed = item.trim();
    if (/^-{3,}$/.test(trimmed)) return "<hr />";
    const heading = trimmed.match(/^(#{2,4})\s+(.+)$/);
    if (heading) return `<h${heading[1].length}>${escapeHtml(heading[2])}</h${heading[1].length}>`;
    return `<p>${convertMarkdownToHtml(item)}</p>`;
  }
  if (!item || typeof item !== "object") return "";

  if (item.h2) return `<h2>${escapeHtml(item.h2)}</h2>`;
  if (item.h3) return `<h3>${escapeHtml(item.h3)}</h3>`;
  if (item.h4) return `<h4>${escapeHtml(item.h4)}</h4>`;
  if (item.lead) return `<p>${convertMarkdownToHtml(item.lead)}</p>`;
  if (item.quote) {
    const cite = item.cite ? `<footer>${escapeHtml(item.cite)}</footer>` : "";
    return `<blockquote><p>${convertMarkdownToHtml(item.quote)}</p>${cite}</blockquote>`;
  }
  if (item.callout || item.note) return `<p><em>${convertMarkdownToHtml(item.callout || item.note)}</em></p>`;
  if (item.aside) return `<p><small>${convertMarkdownToHtml(item.aside)}</small></p>`;
  if (item.takeaways || item.keyPoints) return listToHtml(item.takeaways || item.keyPoints);
  if (Array.isArray(item.stats)) {
    return listToHtml(item.stats.map((s) => (typeof s === "string" ? s : `${s.value} — ${s.label || ""}`.trim())));
  }
  if (item.code) return `<pre><code>${escapeHtml(item.code)}</code></pre>`;
  if (Array.isArray(item.gallery)) {
    return item.gallery
      .map((f) => figureToHtml(typeof f === "string" ? f : f.src, typeof f === "string" ? "" : f.caption, ""))
      .join("");
  }
  if (item.divider || item.hr) return "<hr />";

  const mediaSrc = readMediaSrc(item);
  if (mediaSrc) return figureToHtml(mediaSrc, item.caption || item.description, "");

  // Legacy `{ type: "section", title, text }`
  let html = "";
  if (item.title) html += `<h2>${escapeHtml(item.title)}</h2>`;
  const text = readText(item);
  if (text) html += `<p>${convertMarkdownToHtml(text)}</p>`;
  return html;
}

/** Plain text for the feed summary — markdown marks would leak into readers. */
function stripMarkdown(text) {
  if (!text) return "";
  return String(text)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)(\{[^}]*\})?/g, "$1")
    .replace(/[*_`>#~=]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Run the generator
generateFeed();
