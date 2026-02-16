

'use client';

import React, { useState, useMemo, useId } from 'react';
import parse from 'html-react-parser';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Check, ClipboardCopy, ChevronUp, ChevronDown } from 'lucide-react';
import { toHtml } from 'hast-util-to-html';
import { lowlight } from '@/lib/lowlight';
import { generateHighlightCss } from '@/lib/code-theme-utils';
import type { HighlightTheme } from '@/lib/types';
import { useCodeHighlightTheme } from '@/components/providers/CodeHighlightThemeProvider';

interface RenderedCodeBlockProps {
  rawCodeContent: string;
  language: string;
  theme?: HighlightTheme | null;
  title?: string;
  maxHeight?: string;
  isCollapsible?: boolean;
  isCollapsed?: boolean;
}

export const RenderedCodeBlock: React.FC<RenderedCodeBlockProps> = ({
  rawCodeContent,
  language,
  theme: propTheme,
  title,
  maxHeight = '800px',
  isCollapsible = false,
  isCollapsed = false,
}) => {
  const [isCopied, setIsCopied] = React.useState(false);
  const [collapsedState, setCollapsedState] = React.useState(isCollapsed);
  const { theme: contextTheme } = useCodeHighlightTheme();

  // Use prop theme if available, otherwise fall back to context theme
  const activeTheme = propTheme || contextTheme?.styles;
  const uniqueId = useId().replace(/:/g, '');
  const wrapperClass = `rendered-code-${uniqueId}`;

  const highlightedHtml = useMemo(() => {
    try {
      const registeredLanguages = lowlight.listLanguages();
      if (language && registeredLanguages.includes(language)) {
        const tree = lowlight.highlight(language, rawCodeContent);
        return toHtml(tree);
      }
      const tree = lowlight.highlightAuto(rawCodeContent);
      return toHtml(tree);
    } catch (error) {
      console.error("Syntax highlighting failed:", error);
      return rawCodeContent;
    }
  }, [rawCodeContent, language]);

  const styles = useMemo(() => {
    return activeTheme ? generateHighlightCss(activeTheme, `.${wrapperClass} .rendered-code-block`) : '';
  }, [activeTheme, wrapperClass]);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawCodeContent).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };



  const displayLanguage = title || language || 'code';

  return (
    <div className={cn("not-prose my-4 relative group/code-block rendered-code-block-wrapper", wrapperClass)}>
      {styles && <style dangerouslySetInnerHTML={{ __html: styles }} />}
      <div className="relative border border-border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between bg-card-foreground/5 px-2 py-1.5 border-b border-border text-xs">
          <span className="text-muted-foreground text-xs w-full mr-2 truncate">
            {displayLanguage}
          </span>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy}>
              {isCopied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <ClipboardCopy className="w-3.5 h-3.5" />}
            </Button>
            {isCollapsible && (
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setCollapsedState(prev => !prev)}>
                {collapsedState ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
        {!collapsedState && (
          <pre
            className="rendered-code-block m-0"
            style={{ maxHeight: maxHeight, overflowY: 'auto' }}
          >
            <code className={`hljs language-${language}`}>
              {parse(highlightedHtml)}
            </code>
          </pre>
        )}
      </div>
    </div>
  );
};
