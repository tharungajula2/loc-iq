"use client";

import React from "react";

interface MarkdownTextProps {
  text: string;
  className?: string;
}

export const MarkdownText: React.FC<MarkdownTextProps> = ({ text, className = "" }) => {
  if (!text) return null;

  const lines = text.split("\n");

  const renderInline = (content: string) => {
    // Parse links [text](url), inline code `code`, bold **text**, and italic *text*
    const tokens: React.ReactNode[] = [];
    let keyIdx = 0;

    // Pattern matches: [text](url), `code`, **bold**, *italic*
    const regex = /(\[.*?\]\(https?:\/\/.*?\)|`.*?`|\*\*.*?\*\*|\*.*?\*)/g;
    const parts = content.split(regex);

    parts.forEach((part) => {
      if (!part) return;

      if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
        const linkMatch = part.match(/^\[(.*?)\]\((https?:\/\/.*?)\)$/);
        if (linkMatch) {
          tokens.push(
            <a
              key={keyIdx++}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:underline inline-flex items-center gap-0.5"
            >
              {linkMatch[1]}
            </a>
          );
          return;
        }
      }

      if (part.startsWith('`') && part.endsWith('`')) {
        tokens.push(
          <code key={keyIdx++} className="bg-muted/80 px-1.5 py-0.5 rounded text-[11px] font-mono text-primary border border-border/40">
            {part.slice(1, -1)}
          </code>
        );
        return;
      }

      if (part.startsWith('**') && part.endsWith('**')) {
        tokens.push(
          <strong key={keyIdx++} className="font-bold text-foreground font-sans">
            {part.slice(2, -2)}
          </strong>
        );
        return;
      }

      if (part.startsWith('*') && part.endsWith('*')) {
        tokens.push(
          <em key={keyIdx++} className="italic text-foreground/90">
            {part.slice(1, -1)}
          </em>
        );
        return;
      }

      tokens.push(<span key={keyIdx++}>{part}</span>);
    });

    return tokens;
  };

  return (
    <div className={`space-y-2 text-xs leading-relaxed text-muted-foreground ${className}`}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Heading 3 (###)
        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={idx} className="text-sm font-bold font-mono text-primary pt-2 pb-1 border-b border-border/40">
              {renderInline(trimmed.replace(/^###\s+/, ""))}
            </h3>
          );
        }

        // Heading 2 (##)
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={idx} className="text-base font-bold font-mono text-amber-400 pt-3 pb-1 border-b border-border/60">
              {renderInline(trimmed.replace(/^##\s+/, ""))}
            </h2>
          );
        }

        // Heading 1 (#)
        if (trimmed.startsWith("# ")) {
          return (
            <h1 key={idx} className="text-lg font-extrabold font-mono text-foreground pt-3 pb-1">
              {renderInline(trimmed.replace(/^#\s+/, ""))}
            </h1>
          );
        }

        // Unordered Bullet List Item (- or *)
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const listContent = trimmed.replace(/^[-*]\s+/, "");
          return (
            <div key={idx} className="flex items-start gap-2 pl-3 py-0.5">
              <span className="text-primary font-bold shrink-0 mt-0.5">•</span>
              <div className="flex-1">{renderInline(listContent)}</div>
            </div>
          );
        }

        // Numbered List Item (1., 2., etc)
        if (/^\d+\.\s+/.test(trimmed)) {
          const numMatch = trimmed.match(/^(\d+\.)\s+(.*)$/);
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-3 py-0.5">
                <span className="font-mono text-primary font-semibold text-[11px] shrink-0">{numMatch[1]}</span>
                <div className="flex-1">{renderInline(numMatch[2])}</div>
              </div>
            );
          }
        }

        // Regular Paragraph
        return (
          <p key={idx} className="text-xs text-muted-foreground/90 leading-normal">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
};
