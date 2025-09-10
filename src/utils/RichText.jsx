import React from "react";


// Supports **bold**, __underline__, bullet/numbered lists, and line breaks
export default function RichText({ text }) {
  if (!text) return null;

  // Split into paragraphs by double newlines
  const paragraphs = text.split(/\n{2,}/);
  return (
    <>
      {paragraphs.map((para, idx) => {
        // Bullet list
        if (para.split('\n').every(line => /^[-*]\s/.test(line.trim()))) {
          return (
            <ul key={idx} style={{ paddingLeft: 24, marginBottom: 12, listStyle: 'disc' }} className="richtext-ul">
              {para.split('\n').map((line, i) => (
                <li key={i} className="richtext-li">{parseInline(line.replace(/^[-*]\s/, ''))}</li>
              ))}
            </ul>
          );
        }
        // Numbered list
        if (para.split('\n').every(line => /^\d+\.\s/.test(line.trim()))) {
          return (
            <ol key={idx} style={{ paddingLeft: 24, marginBottom: 12, listStyle: 'decimal' }} className="richtext-ol">
              {para.split('\n').map((line, i) => (
                <li key={i} className="richtext-li">{parseInline(line.replace(/^\d+\.\s/, ''))}</li>
              ))}
            </ol>
          );
        }
        // Blockquote
        if (para.trim().startsWith('>')) {
          return <blockquote key={idx} className="richtext-blockquote" style={{ borderLeft: '3px solid #bbb', margin: '8px 0', paddingLeft: 12, color: '#666', fontStyle: 'italic' }}>{parseInline(para.replace(/^>\s?/, ''))}</blockquote>;
        }
        // Horizontal rule
        if (/^---+$/.test(para.trim())) {
          return <hr key={idx} className="richtext-hr" style={{ margin: '18px 0', border: 0, borderTop: '1.5px solid #ddd' }} />;
        }
        // Normal paragraph, support single line breaks
        return <p key={idx} className="richtext-p">{parseInlineWithBreaks(para)}</p>;
      })}
    </>
  );
}


function parseInline(str) {
  let result = [];
  let remaining = str;
  
  // Process all patterns in a single pass
  while (remaining.length > 0) {
    // Look for the earliest match among all patterns
    const patterns = [
      { regex: /\[([^\]]+)\]\(([^\)]+)\)\{([^\}]+)\}/, type: 'linkWithHover' },
      { regex: /\[([^\]]+)\]\{([^\}]+)\}/, type: 'hoverOnly' },
      { regex: /\[([^\]]+)\]\(([^\)]+)\)/, type: 'linkOnly' }
    ];
    
    let earliestMatch = null;
    let earliestIndex = remaining.length;
    
    for (const pattern of patterns) {
      const match = pattern.regex.exec(remaining);
      if (match && match.index < earliestIndex) {
        earliestMatch = { ...pattern, match };
        earliestIndex = match.index;
      }
    }
    
    if (!earliestMatch) {
      // No more matches, add remaining text
      result.push(parseInlineSimple(remaining));
      break;
    }
    
    // Add text before the match
    if (earliestMatch.match.index > 0) {
      result.push(parseInlineSimple(remaining.slice(0, earliestMatch.match.index)));
    }
    
    // Add the matched element
    const match = earliestMatch.match;
    const key = result.length;
    
    if (earliestMatch.type === 'linkWithHover') {
      result.push(
        <a
          key={key}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-text={match[3]}
          style={{ textDecoration: 'underline', color: '#4d7de5ff', cursor: 'pointer' }}
          className="richtext-link script"
        >
          {match[1]}
        </a>
      );
    } else if (earliestMatch.type === 'hoverOnly') {
      result.push(
        <span
          key={key}
          data-cursor-text={match[2]}
          style={{ cursor: 'pointer', color: '#2563eb' }}
          className="richtext-hover-text script"
        >
          {match[1]}
        </span>
      );
    } else if (earliestMatch.type === 'linkOnly') {
      result.push(
        <a
          key={key}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-text="Visit Link"
          style={{ textDecoration: 'underline', color: '#2563eb', cursor: 'pointer' }}
          className="richtext-link script"
        >
          {match[1]}
        </a>
      );
    }
    
    // Continue with remaining string
    remaining = remaining.slice(earliestMatch.match.index + earliestMatch.match[0].length);
  }
  
  return result.flat();
}

// Only parse bold and underline (used inside parseInline for non-link text)
function parseInlineSimple(str) {
  const boldRegex = /\*\*(.*?)\*\*/g;
  const underlineRegex = /__(.*?)__/g;
  let result = [];
  let lastIndex = 0;
  let match;
  // Bold
  while ((match = boldRegex.exec(str))) {
    if (match.index > lastIndex) {
      result.push(str.slice(lastIndex, match.index));
    }
    result.push(<strong  className="strongText" key={match.index}>{match[1]}</strong>);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < str.length) {
    str = str.slice(lastIndex);
  } else {
    str = '';
  }
  // Underline
  let underlineParts = [];
  lastIndex = 0;
  while ((match = underlineRegex.exec(str))) {
    if (match.index > lastIndex) {
      underlineParts.push(str.slice(lastIndex, match.index));
    }
    underlineParts.push(<u key={match.index}>{match[1]}</u>);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < str.length) {
    underlineParts.push(str.slice(lastIndex));
  }
  return [...result, ...underlineParts];
}

function parseInlineWithBreaks(str) {
  // Split by single newlines for <br/>
  const lines = str.split('\n');
  return lines.map((line, i) => [parseInline(line), i < lines.length - 1 ? <br key={i} /> : null]);
}
