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
      const firstTextItem = contentItems.find(
        (item) =>
          (item?.type === "section" || (!item?.type && item?.text)) &&
          typeof item?.text === "string" &&
          item.text.trim(),
      );

      // Get first content section text as summary
      const summary =
        blog.excerpt || firstTextItem?.text?.substring(0, 280) || "";

      // Combine content items into HTML
      const contentHtml =
        contentItems
          .map((item) => {
            const itemType = item?.type || (item?.src ? "media" : "section");
            let html = "";

            if (itemType === "media" && item?.src) {
              html += `<figure><img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.description || blog.title)}" />`;
              if (item.description) {
                html += `<figcaption>${escapeHtml(item.description)}</figcaption>`;
              }
              html += `</figure>`;
              return html;
            }

            if (item?.title) {
              html += `<h2>${escapeHtml(item.title)}</h2>`;
            }
            if (item?.text) {
              // Convert basic markdown to HTML
              html += `<p>${convertMarkdownToHtml(item.text)}</p>`;
            }
            return html;
          })
          .join("\n") || "";

      // Get cover image
      const coverSrc =
        blog.cover ||
        contentItems.find(
          (item) => (item?.type === "media" || item?.src) && item?.src,
        )?.src ||
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
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      // Line breaks
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br>")
  );
}

// Run the generator
generateFeed();
