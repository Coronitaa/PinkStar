
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
  const styles: { [key: string]: string } = {
    '': `background-color: ${theme.background}; color: ${theme.text};`,
    '.hljs-comment, .hljs-quote': `color: ${theme.comment}; font-style: italic;`,
    '.hljs-doctag, .hljs-keyword, .hljs-formula': `color: ${theme.keyword};`,
    '.hljs-section, .hljs-name, .hljs-selector-tag, .hljs-deletion, .hljs-subst': `color: ${theme.tag};`,
    '.hljs-literal': `color: ${theme.number};`,
    '.hljs-string, .hljs-regexp, .hljs-addition, .hljs-attribute, .hljs-meta-string': `color: ${theme.string};`,
    '.hljs-built_in, .hljs-class .hljs-title': `color: ${theme.class};`,
    '.hljs-attr, .hljs-variable, .hljs-template-variable, .hljs-type, .hljs-selector-class, .hljs-selector-attr, .hljs-selector-pseudo, .hljs-number': `color: ${theme.attr};`,
    '.hljs-symbol, .hljs-bullet, .hljs-link, .hljs-meta, .hljs-selector-id, .hljs-title': `color: ${theme.function};`,
    '.hljs-emphasis': 'font-style: italic;',
    '.hljs-strong': 'font-weight: bold;',
    '.hljs-punctuation': `color: ${theme.punctuation};`,
    '.hljs-operator': `color: ${theme.operator};`,
  };

  return Object.entries(styles)
    .map(([selector, rule]) => `.code-preview-wrapper .hljs${selector} { ${rule} }`)
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
