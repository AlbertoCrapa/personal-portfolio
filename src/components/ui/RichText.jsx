import React, { useEffect, useState } from 'react';
import Callout from './Callout';

/**
 * RichText Component
 * Enhanced markdown-like parser for content
 * 
 * Supports:
 * - **bold** and __underline__
 * - [link](url) and [link](url){hover text}
 * - > blockquotes
 * - --- horizontal rules
 * - - bullet lists and 1. numbered lists
 * - :::info and :::warning callout blocks
 * - `inline code` and ```code blocks```
 * - # headings (h1-h6)
 * - Line breaks with double newlines
 */
const RichText = ({ text, className = '' }) => {
  const normalizedText = normalizeTextInput(text);
  if (!normalizedText) return null;

  // Split into blocks (double newlines or special block markers)
  const blocks = parseBlocks(normalizedText);

  return (
    <div className={`rich-text space-y-4 ${className}`}>
      {blocks.map((block, idx) => renderBlock(block, idx))}
    </div>
  );
};

/**
 * Accepts string or array of strings for easier authoring in JSON data files.
 */
function normalizeTextInput(input) {
  if (!input) return '';
  if (Array.isArray(input)) {
    return input
      .filter((item) => typeof item === 'string' && item.trim())
      .join('\n\n');
  }
  if (typeof input === 'string') {
    return input;
  }
  return '';
}

/**
 * Parse text into blocks
 */
function parseBlocks(text) {
  const blocks = [];
  const lines = text.split('\n');
  let currentBlock = [];
  let inCodeBlock = false;
  let inCallout = null;
  let calloutContent = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block toggle
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        blocks.push({ type: 'code', content: currentBlock.join('\n'), language: currentBlock.language });
        currentBlock = [];
        inCodeBlock = false;
      } else {
        if (currentBlock.length > 0) {
          blocks.push({ type: 'paragraph', content: currentBlock.join('\n') });
          currentBlock = [];
        }
        currentBlock.language = line.trim().slice(3) || 'text';
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      currentBlock.push(line);
      continue;
    }

    // Callout start (:::info or :::warning)
    if (line.trim().startsWith(':::info')) {
      if (currentBlock.length > 0) {
        blocks.push({ type: 'paragraph', content: currentBlock.join('\n') });
        currentBlock = [];
      }
      inCallout = 'info';
      continue;
    }

    if (line.trim().startsWith(':::warning')) {
      if (currentBlock.length > 0) {
        blocks.push({ type: 'paragraph', content: currentBlock.join('\n') });
        currentBlock = [];
      }
      inCallout = 'warning';
      continue;
    }

    // Callout end
    if (line.trim() === ':::' && inCallout) {
      blocks.push({ type: 'callout', variant: inCallout, content: calloutContent.join('\n') });
      calloutContent = [];
      inCallout = null;
      continue;
    }

    if (inCallout) {
      calloutContent.push(line);
      continue;
    }

    // Horizontal rule
    if (/^-{3,}$/.test(line.trim())) {
      if (currentBlock.length > 0) {
        blocks.push({ type: 'paragraph', content: currentBlock.join('\n') });
        currentBlock = [];
      }
      blocks.push({ type: 'hr' });
      continue;
    }

    // Heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      if (currentBlock.length > 0) {
        blocks.push({ type: 'paragraph', content: currentBlock.join('\n') });
        currentBlock = [];
      }
      blocks.push({ type: 'heading', level: headingMatch[1].length, content: headingMatch[2] });
      continue;
    }

    // Blockquote
    if (line.trim().startsWith('>')) {
      if (currentBlock.length > 0 && currentBlock[0]?.startsWith('>') === false) {
        blocks.push({ type: 'paragraph', content: currentBlock.join('\n') });
        currentBlock = [];
      }
      currentBlock.push(line.replace(/^>\s?/, ''));
      if (!lines[i + 1]?.trim().startsWith('>')) {
        blocks.push({ type: 'blockquote', content: currentBlock.join('\n') });
        currentBlock = [];
      }
      continue;
    }

    // List item (bullet)
    if (/^[-*]\s/.test(line.trim())) {
      if (currentBlock.length > 0 && !/^[-*]\s/.test(currentBlock[0]?.trim())) {
        blocks.push({ type: 'paragraph', content: currentBlock.join('\n') });
        currentBlock = [];
      }
      currentBlock.push(line.replace(/^[-*]\s/, '').trim());
      if (i === lines.length - 1 || !/^[-*]\s/.test(lines[i + 1]?.trim())) {
        blocks.push({ type: 'ul', items: currentBlock });
        currentBlock = [];
      }
      continue;
    }

    // List item (numbered)
    if (/^\d+\.\s/.test(line.trim())) {
      if (currentBlock.length > 0 && !/^\d+\.\s/.test(currentBlock[0]?.trim())) {
        blocks.push({ type: 'paragraph', content: currentBlock.join('\n') });
        currentBlock = [];
      }
      currentBlock.push(line.replace(/^\d+\.\s/, '').trim());
      if (i === lines.length - 1 || !/^\d+\.\s/.test(lines[i + 1]?.trim())) {
        blocks.push({ type: 'ol', items: currentBlock });
        currentBlock = [];
      }
      continue;
    }

    // Empty line = new paragraph
    if (line.trim() === '') {
      if (currentBlock.length > 0) {
        blocks.push({ type: 'paragraph', content: currentBlock.join('\n') });
        currentBlock = [];
      }
      continue;
    }

    // Regular text
    currentBlock.push(line);
  }

  // Remaining content
  if (currentBlock.length > 0) {
    blocks.push({ type: 'paragraph', content: currentBlock.join('\n') });
  }

  if (calloutContent.length > 0 && inCallout) {
    blocks.push({ type: 'callout', variant: inCallout, content: calloutContent.join('\n') });
  }

  return blocks;
}

/**
 * Render a single block
 */
function renderBlock(block, key) {
  switch (block.type) {
    case 'heading':
      const HeadingTag = `h${block.level}`;
      const headingSizes = {
        1: 'text-3xl md:text-4xl font-bold',
        2: 'text-2xl md:text-3xl font-bold',
        3: 'text-xl md:text-2xl font-semibold',
        4: 'text-lg md:text-xl font-semibold',
        5: 'text-base md:text-lg font-medium',
        6: 'text-sm md:text-base font-medium',
      };
      return (
        <HeadingTag key={key} className={`${headingSizes[block.level]} text-text-primary mt-6 mb-3`}>
          {parseInline(block.content)}
        </HeadingTag>
      );

    case 'paragraph':
      return (
        <p key={key} className="text-text-secondary leading-relaxed">
          {parseInline(block.content)}
        </p>
      );

    case 'blockquote':
      return (
        <blockquote key={key} className="border-l-4 border-border pl-4 py-2 my-4 text-text-muted italic">
          {parseInline(block.content)}
        </blockquote>
      );

    case 'ul':
      return (
        <ul key={key} className="list-disc list-inside space-y-1 text-text-secondary pl-2">
          {block.items.map((item, i) => (
            <li key={i}>{parseInline(item)}</li>
          ))}
        </ul>
      );

    case 'ol':
      return (
        <ol key={key} className="list-decimal list-inside space-y-1 text-text-secondary pl-2">
          {block.items.map((item, i) => (
            <li key={i}>{parseInline(item)}</li>
          ))}
        </ol>
      );

    case 'hr':
      return <hr key={key} className="border-t border-border my-8" />;

    case 'code':
      return <CodeBlock key={key} content={block.content} language={block.language} />;

    case 'callout':
      return (
        <Callout key={key} type={block.variant}>
          {parseInline(block.content)}
        </Callout>
      );

    default:
      return null;
  }
}

const HLJS_SCRIPT_ID = 'hljs-script';
const HLJS_STYLE_ID = 'hljs-style';
const HLJS_SCRIPT_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
const HLJS_STYLE_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css';

function normalizeLanguage(language) {
  if (!language) return 'plaintext';
  const normalized = language.toLowerCase().trim();
  const aliases = {
    'c++': 'cpp',
    js: 'javascript',
    ts: 'typescript',
    sh: 'bash',
    yml: 'yaml',
  };
  return aliases[normalized] || normalized;
}

function formatLanguageLabel(language) {
  const normalized = normalizeLanguage(language);
  const labels = {
    cpp: 'C++',
    csharp: 'C#',
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    plaintext: 'Text',
  };
  return labels[normalized] || normalized;
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function ensureHighlightAssets() {
  if (typeof document === 'undefined') return Promise.resolve(null);

  if (!document.getElementById(HLJS_STYLE_ID)) {
    const link = document.createElement('link');
    link.id = HLJS_STYLE_ID;
    link.rel = 'stylesheet';
    link.href = HLJS_STYLE_SRC;
    document.head.appendChild(link);
  }

  if (window.hljs) return Promise.resolve(window.hljs);

  const existingScript = document.getElementById(HLJS_SCRIPT_ID);
  if (existingScript) {
    return new Promise((resolve) => {
      existingScript.addEventListener('load', () => resolve(window.hljs || null), { once: true });
      existingScript.addEventListener('error', () => resolve(null), { once: true });
    });
  }

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.id = HLJS_SCRIPT_ID;
    script.src = HLJS_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve(window.hljs || null);
    script.onerror = () => resolve(null);
    document.body.appendChild(script);
  });
}

function CodeBlock({ content, language }) {
  const [highlightedHtml, setHighlightedHtml] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;

    const highlightCode = async () => {
      const raw = content || '';
      const safeFallback = escapeHtml(raw);

      const hljs = await ensureHighlightAssets();
      if (!active) return;

      if (!hljs) {
        setHighlightedHtml(safeFallback);
        return;
      }

      try {
        const normalizedLanguage = normalizeLanguage(language);
        const highlighted = hljs.getLanguage(normalizedLanguage)
          ? hljs.highlight(raw, { language: normalizedLanguage }).value
          : hljs.highlightAuto(raw).value;
        setHighlightedHtml(highlighted || safeFallback);
      } catch (error) {
        setHighlightedHtml(safeFallback);
      }
    };

    highlightCode();

    return () => {
      active = false;
    };
  }, [content, language]);

  const handleCopy = async () => {
    if (!content || !navigator?.clipboard) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      setCopied(false);
    }
  };

  return (
    <div className="my-4 w-full max-w-3xl rounded-2xl border border-border bg-bg/60 overflow-y-auto max-h-[34rem]">
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-2 border-b border-border bg-bg/90 backdrop-blur-sm">
        <span className="inline-flex items-center gap-2 text-text-primary text-xs font-semibold tracking-wide uppercase">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 md:w-5 md:h-5 text-text-primary">
            <path d="M8 8 4 12l4 4M16 8l4 4-4 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{formatLanguageLabel(language)}</span>
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-bg transition-colors"
          aria-label="Copy code"
          title={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? (
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <rect x="9" y="3" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="2" />
              <rect x="3" y="9" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="2" />
            </svg>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 md:p-5 text-sm leading-relaxed">
        <code
          className="hljs !bg-transparent font-mono"
          dangerouslySetInnerHTML={{ __html: highlightedHtml || escapeHtml(content || '') }}
        />
      </pre>
    </div>
  );
}

/**
 * Parse inline formatting (bold, underline, links, code)
 */
function parseInline(text) {
  if (!text) return null;

  const result = [];
  let remaining = text;
  let keyCounter = 0;

  while (remaining.length > 0) {
    // Find the earliest match
    const patterns = [
      { regex: /\*\*(.+?)\*\*/, type: 'bold' },
      { regex: /__(.+?)__/, type: 'underline' },
      { regex: /`([^`]+)`/, type: 'code' },
      { regex: /\[([^\]]+)\]\(([^)]+)\)(\{([^}]+)\})?/, type: 'link' },
    ];

    let earliest = null;
    let earliestIndex = remaining.length;

    for (const pattern of patterns) {
      const match = pattern.regex.exec(remaining);
      if (match && match.index < earliestIndex) {
        earliest = { pattern, match };
        earliestIndex = match.index;
      }
    }

    if (!earliest) {
      result.push(remaining);
      break;
    }

    // Add text before match
    if (earliest.match.index > 0) {
      result.push(remaining.slice(0, earliest.match.index));
    }

    // Add formatted element
    const { pattern, match } = earliest;
    const key = keyCounter++;

    switch (pattern.type) {
      case 'bold':
        result.push(<strong key={key} className="font-semibold text-text-primary">{match[1]}</strong>);
        break;
      case 'underline':
        result.push(<u key={key} className="underline">{match[1]}</u>);
        break;
      case 'code':
        result.push(
          <code key={key} className="bg-surface px-1.5 py-0.5 rounded text-sm font-mono text-accent-blue">
            {match[1]}
          </code>
        );
        break;
      case 'link':
        result.push(
          <a
            key={key}
            href={match[2]}
            target={match[2].startsWith('http') ? '_blank' : undefined}
            rel={match[2].startsWith('http') ? 'noopener noreferrer' : undefined}
            className="text-accent-blue hover:underline"
            title={match[4] || undefined}
          >
            {match[1]}
          </a>
        );
        break;
      default:
        break;
    }

    remaining = remaining.slice(earliest.match.index + earliest.match[0].length);
  }

  return result;
}

export default RichText;
