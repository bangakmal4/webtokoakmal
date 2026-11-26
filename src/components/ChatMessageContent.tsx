import React from 'react';

interface ChatMessageContentProps {
  text: string;
}

function renderInlineFormatting(line: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Matches **bold**, `code`, or *italic*
  const tokenRegex = /(\*\*[^*\n]+?\*\*|`[^`\n]+?`|\*[^*\n]+?\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let idx = 0;

  while ((match = tokenRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(line.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
      nodes.push(
        <strong key={`${keyPrefix}-b-${idx}`} className="font-semibold text-inkCharcoal">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`') && token.length > 2) {
      nodes.push(
        <code
          key={`${keyPrefix}-c-${idx}`}
          className="px-1 py-0.5 rounded bg-stoneSurface border border-borderSubtle text-[11px] font-mono text-emeraldDeep"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('*') && token.endsWith('*') && token.length > 2) {
      nodes.push(
        <em key={`${keyPrefix}-i-${idx}`} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    } else {
      nodes.push(token);
    }

    lastIndex = tokenRegex.lastIndex;
    idx += 1;
  }

  if (lastIndex < line.length) {
    nodes.push(line.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [line];
}

export const ChatMessageContent: React.FC<ChatMessageContentProps> = ({ text }) => {
  const normalized = text.replace(/\r\n/g, '\n').trim();
  const lines = normalized.split('\n');

  const blocks: React.ReactNode[] = [];
  let i = 0;
  let blockKey = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    // Markdown heading (e.g. ### Rekomendasi)
    const headingMatch = /^#{1,4}\s+(.+)$/.exec(trimmed);
    if (headingMatch) {
      blocks.push(
        <p
          key={`blk-${blockKey++}`}
          className="font-heading font-bold text-inkCharcoal text-xs sm:text-[13px] pt-1"
        >
          {renderInlineFormatting(headingMatch[1], `h-${blockKey}`)}
        </p>
      );
      i += 1;
      continue;
    }

    // Unordered bullet list (- item, * item, • item)
    if (/^[-*•]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*•]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*•]\s+/, ''));
        i += 1;
      }
      blocks.push(
        <ul key={`blk-${blockKey++}`} className="list-disc pl-4 space-y-1">
          {items.map((item, itemIdx) => (
            <li key={`ul-${blockKey}-${itemIdx}`} className="leading-relaxed">
              {renderInlineFormatting(item, `ul-${blockKey}-${itemIdx}`)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list (1. item, 2) item)
    if (/^\d+[.)]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+[.)]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+[.)]\s+/, ''));
        i += 1;
      }
      blocks.push(
        <ol key={`blk-${blockKey++}`} className="list-decimal pl-4 space-y-1">
          {items.map((item, itemIdx) => (
            <li key={`ol-${blockKey}-${itemIdx}`} className="leading-relaxed">
              {renderInlineFormatting(item, `ol-${blockKey}-${itemIdx}`)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Regular paragraph lines grouped until blank line or structural marker
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^#{1,4}\s+/.test(lines[i].trim()) &&
      !/^[-*•]\s+/.test(lines[i].trim()) &&
      !/^\d+[.)]\s+/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i += 1;
    }

    blocks.push(
      <p key={`blk-${blockKey++}`} className="leading-relaxed">
        {paraLines.map((line, lineIdx) => (
          <React.Fragment key={`p-${blockKey}-${lineIdx}`}>
            {lineIdx > 0 && <br />}
            {renderInlineFormatting(line, `p-${blockKey}-${lineIdx}`)}
          </React.Fragment>
        ))}
      </p>
    );
  }

  return <div className="space-y-2 break-words">{blocks}</div>;
};
