
'use client';

import React, { useMemo } from 'react';
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
import type { CodeHighlightTheme } from '@/lib/types';

const lowlight = createLowlight({ javascript, typescript, css, xml, json, bash, java: javaLang, cpp, plaintext });

// Función para generar CSS a partir del objeto del tema
function generateHighlightCss(themeStyles: CodeHighlightTheme['styles'], selectorPrefix: string): string {
    if (!themeStyles) return '';
    const styles: { [key: string]: string } = {
        [`${selectorPrefix}`]: `background-color: ${themeStyles.background || 'transparent'}; color: ${themeStyles.text};`,
        [`${selectorPrefix} .hljs-comment, ${selectorPrefix} .hljs-quote`]: `color: ${themeStyles.comment}; font-style: italic;`,
        [`${selectorPrefix} .hljs-keyword, ${selectorPrefix} .hljs-selector-tag, ${selectorPrefix} .hljs-doctag, ${selectorPrefix} .hljs-meta-keyword, ${selectorPrefix} .hljs-subst, ${selectorPrefix} .hljs-section, ${selectorPrefix} .hljs-built_in[class*="self"], ${selectorPrefix} .hljs-keyword[class*="self"], ${selectorPrefix} .hljs-name, ${selectorPrefix} .hljs-strong`]: `color: ${themeStyles.keyword};`,
        [`${selectorPrefix} .hljs-string, ${selectorPrefix} .hljs-regexp, ${selectorPrefix} .hljs-meta-string, ${selectorPrefix} .hljs-selector-attr, ${selectorPrefix} .hljs-template-variable, ${selectorPrefix} .hljs-addition`]: `color: ${themeStyles.string};`,
        [`${selectorPrefix} .hljs-number, ${selectorPrefix} .hljs-literal`]: `color: ${themeStyles.number};`,
        [`${selectorPrefix} .hljs-title.function_, ${selectorPrefix} .hljs-title.function_.invoke__, ${selectorPrefix} .hljs-title[class*="function"]`]: `color: ${themeStyles.function};`,
        [`${selectorPrefix} .hljs-params`]: `color: ${themeStyles.variable}; font-style: normal;`,
        [`${selectorPrefix} .hljs-title.class_, ${selectorPrefix} .hljs-type, ${selectorPrefix} .hljs-built_in, ${selectorPrefix} .hljs-class .hljs-title`]: `color: ${themeStyles.class};`,
        [`${selectorPrefix} .hljs-meta, ${selectorPrefix} .hljs-meta .hljs-keyword`]: `color: ${themeStyles.tag};`,
        [`${selectorPrefix} .hljs-tag, ${selectorPrefix} .hljs-selector-id, ${selectorPrefix} .hljs-selector-class`]: `color: ${themeStyles.tag};`,
        [`${selectorPrefix} .hljs-attribute, ${selectorPrefix} .hljs-attr`]: `color: ${themeStyles.attr};`,
        [`${selectorPrefix} .hljs-variable, ${selectorPrefix} .hljs-property`]: `color: ${themeStyles.variable};`,
        [`${selectorPrefix} .hljs-operator, ${selectorPrefix} .hljs-punctuation`]: `color: ${themeStyles.punctuation};`,
        [`${selectorPrefix} .hljs-symbol, ${selectorPrefix} .hljs-bullet, ${selectorPrefix} .hljs-link`]: `color: ${themeStyles.operator};`,
        [`${selectorPrefix} .hljs-emphasis`]: `font-style: italic;`,
    };

    return Object.entries(styles)
      .map(([selector, rule]) => `${selector} { ${rule} }`)
      .join('\n');
}


interface RenderedCodeBlockProps {
  rawCodeContent: string;
  language: string;
  theme?: CodeHighlightTheme['styles'] | null; // Tema ahora opcional y puede ser nulo
  title?: string;
  maxHeight?: string;
  isCollapsible?: boolean;
  isCollapsed?: boolean;
}

export const RenderedCodeBlock: React.FC<RenderedCodeBlockProps> = ({
  rawCodeContent,
  language,
  theme, // Se recibe el tema como prop
  title,
  maxHeight = '400px',
  isCollapsible = false,
  isCollapsed = false,
}) => {
  const [isCopied, setIsCopied] = React.useState(false);
  const [collapsedState, setCollapsedState] = React.useState(isCollapsed);

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

  const themeStyles = useMemo(() => {
    if (!theme) return '';
    return generateHighlightCss(theme, '.rendered-code-block-wrapper .rendered-code-block');
  }, [theme]);


  const displayLanguage = title || language || 'code';

  return (
    <div className="not-prose my-4 relative group/code-block rendered-code-block-wrapper">
      {themeStyles && <style>{themeStyles}</style>}
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
            <code className={`language-${language}`}>
              {parse(highlightedHtml)}
            </code>
          </pre>
        )}
      </div>
    </div>
  );
};
