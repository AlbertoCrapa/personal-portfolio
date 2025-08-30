import React from "react";

// Supports **bold**, __underline__, and * bullet lists
export default function RichText({ text }) {
  if (!text) return null;

  // Bullet list: split by newlines, check if all lines start with '* '
  if (text.split('\n').every(line => line.trim().startsWith('* '))) {
    return (
      <ul style={{ paddingLeft: 20, listStyle: 'disc' }}>
        {text.split('\n').map((line, i) => (
          <li key={i}>{parseInline(line.replace(/^\*\s/, ''))}</li>
        ))}
      </ul>
    );
  }

  // Otherwise, treat as paragraph with inline formatting
  return <p>{parseInline(text)}</p>;
}

function parseInline(str) {
  // Replace **bold** and __underline__
  const boldRegex = /\*\*(.*?)\*\*/g;
  const underlineRegex = /__(.*?)__/g;

  // Split by bold first
  const parts = [];
  let lastIndex = 0;
  let match;
  while ((match = boldRegex.exec(str))) {
    if (match.index > lastIndex) {
      parts.push(str.slice(lastIndex, match.index));
    }
    parts.push(<strong key={match.index}>{match[1]}</strong>);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < str.length) {
    str = str.slice(lastIndex);
  } else {
    str = '';
  }

  // Now handle underline in the remaining string
  const underlineParts = [];
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

  return [...parts, ...underlineParts];
}
