

'use client';

import React, { useState, useMemo, useId } from 'react';
import parse from 'html-react-parser';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Check, ClipboardCopy, ChevronUp, ChevronDown } from 'lucide-react';
import { createLowlight } from 'lowlight';
import { toHtml } from 'hast-util-to-html';

import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import javaLang from 'highlight.js/lib/languages/java';
import cpp from 'highlight.js/lib/languages/cpp';
import plaintext from 'highlight.js/lib/languages/plaintext';
import type { HighlightTheme } from '@/lib/types';

const lowlight = createLowlight({ javascript, typescript, python, css, xml, json, bash, java: javaLang, cpp, plaintext });

interface RenderedCodeBlockProps {
  rawCodeContent: string;
  language: string;
  theme?: HighlightTheme | null;
  title?: string;
  maxHeight?: string;
  isCollapsible?: boolean;
  isCollapsed?: boolean;
}

function generateCssFromTheme(theme: HighlightTheme, wrapperId: string): string {
    if (!theme) return '';
    // This consolidated mapping includes all selectors from SimpleSyntaxHighlight, CodeHighlightStyle, and RichTextEditor's implementation.
    const styles: { [key: string]: string } = {
        '': `background-color: ${theme.background || 'transparent'}; color: ${theme.text};`,
        '.hljs-comment, .hljs-quote': `color: ${theme.comment}; font-style: italic;`,
        '.hljs-keyword, .hljs-selector-tag, .hljs-doctag, .hljs-meta-keyword, .hljs-subst, .hljs-section, .hljs-built_in[class*="self"], .hljs-keyword[class*="self"], .hljs-name, .hljs-strong': `color: ${theme.keyword};`,
        '.hljs-string, .hljs-regexp, .hljs-addition, .hljs-attribute, .hljs-meta-string, .hljs-selector-attr, .hljs-template-variable': `color: ${theme.string};`,
        '.hljs-number, .hljs-literal': `color: ${theme.number};`,
        '.hljs-title.function_, .hljs-title.function_.invoke__, .hljs-title[class*="function"]': `color: ${theme.function};`,
        '.hljs-params': `color: ${theme.variable}; font-style: normal;`,
        '.hljs-title.class_, .hljs-type, .hljs-built_in, .hljs-class .hljs-title': `color: ${theme.class};`,
        '.hljs-meta, .hljs-meta .hljs-keyword': `color: ${theme.tag};`,
        '.hljs-tag, .hljs-selector-id, .hljs-selector-class': `color: ${theme.tag};`,
        '.hljs-attr': `color: ${theme.attr};`,
        '.hljs-variable, .hljs-property': `color: ${theme.variable};`,
        '.hljs-operator, .hljs-punctuation': `color: ${theme.punctuation};`,
        '.hljs-symbol, .hljs-bullet, .hljs-link': `color: ${theme.operator};`,
        '.hljs-emphasis': 'font-style: italic;',
    };

    return Object.entries(styles)
        .map(([selector, rule]) => `#${wrapperId} ${selector.startsWith('.') ? selector : `.hljs${selector}`} { ${rule} }`)
        .join('\n');
}


export const RenderedCodeBlock: React.FC<RenderedCodeBlockProps> = ({
  rawCodeContent,
  language,
  theme,
  title,
  maxHeight = '400px',
  isCollapsible = false,
  isCollapsed = false,
}) => {
  const [isCopied, setIsCopied] = React.useState(false);
  const [collapsedState, setCollapsedState] = React.useState(isCollapsed);
  const uniqueId = useId();

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

  const handleCopy = () => {
    navigator.clipboard.writeText(rawCodeContent).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const themeStyles = useMemo(() => theme ? generateCssFromTheme(theme, uniqueId) : '', [theme, uniqueId]);

  const displayLanguage = title || language || 'code';

  return (
    <>
      {themeStyles && <style>{themeStyles}</style>}
      <div id={uniqueId} className="not-prose my-4 relative group/code-block rendered-code-block-wrapper">
        <div className="relative bg-muted/30 border border-border rounded-lg overflow-hidden">
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
    </>
  );
};
