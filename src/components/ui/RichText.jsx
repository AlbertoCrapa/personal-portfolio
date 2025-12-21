import React from 'react';
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
  if (!text) return null;

  // Split into blocks (double newlines or special block markers)
  const blocks = parseBlocks(text);

  return (
    <div className={`rich-text space-y-4 ${className}`}>
      {blocks.map((block, idx) => renderBlock(block, idx))}
    </div>
  );
};

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
      return (
        <pre key={key} className="bg-surface rounded-lg p-4 overflow-x-auto my-4">
          <code className="text-sm text-text-primary font-mono">{block.content}</code>
        </pre>
      );

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
