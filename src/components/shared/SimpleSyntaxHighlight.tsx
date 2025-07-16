

'use client';

import React, { useMemo } from 'react';
import parse from 'html-react-parser';
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

const lowlight = createLowlight({ javascript, typescript, css, xml, json, bash, java: javaLang, cpp, plaintext });

interface SimpleSyntaxHighlightProps {
  code: string;
  theme: HighlightTheme;
}

function generateCssFromTheme(theme: HighlightTheme): string {
    if (!theme) return '';
    const styles: { [key: string]: string } = {
        '': `background-color: ${theme.background || 'transparent'}; color: ${theme.text};`,
        '.hljs-comment, .hljs-quote': `color: ${theme.comment}; font-style: italic;`,
        '.hljs-keyword, .hljs-selector-tag, .hljs-doctag, .hljs-meta-keyword, .hljs-subst, .hljs-section': `color: ${theme.keyword};`,
        '.hljs-string, .hljs-regexp, .hljs-addition, .hljs-attribute, .hljs-meta-string, .hljs-selector-attr, .hljs-template-variable': `color: ${theme.string};`,
        '.hljs-number, .hljs-literal': `color: ${theme.number};`,
        '.hljs-title.function_, .hljs-title.function_.invoke__': `color: ${theme.function};`,
        '.hljs-params': `color: ${theme.variable};`,
        '.hljs-title.class_, .hljs-type, .hljs-built_in, .hljs-name': `color: ${theme.class};`,
        '.hljs-meta': `color: ${theme.tag};`,
        '.hljs-tag, .hljs-selector-id, .hljs-selector-class': `color: ${theme.tag};`,
        '.hljs-attr': `color: ${theme.attr};`, // Kept for specificity if needed
        '.hljs-variable, .hljs-property': `color: ${theme.variable};`,
        '.hljs-operator, .hljs-punctuation': `color: ${theme.punctuation};`,
        '.hljs-symbol, .hljs-bullet, .hljs-link': `color: ${theme.operator};`,
        '.hljs-emphasis': 'font-style: italic;',
        '.hljs-strong': 'font-weight: bold;',
    };

    return Object.entries(styles)
        .map(([selector, rule]) => `.code-preview-wrapper ${selector.startsWith('.') ? selector : `.hljs${selector}`} { ${rule} }`)
        .join('\n');
}

export const SimpleSyntaxHighlight: React.FC<SimpleSyntaxHighlightProps> = ({ code, theme }) => {
  const highlightedHtml = useMemo(() => {
    try {
      const tree = lowlight.highlightAuto(code);
      return toHtml(tree);
    } catch (error) {
      console.error("Syntax highlighting failed:", error);
      return code; 
    }
  }, [code]);

  const themeStyles = useMemo(() => generateCssFromTheme(theme), [theme]);

  return (
    <>
      <style>{themeStyles}</style>
      <div className="code-preview-wrapper">
        <pre className="m-0 p-4 rounded-b-md" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <code>
            {parse(highlightedHtml)}
          </code>
        </pre>
      </div>
    </>
  );
};
