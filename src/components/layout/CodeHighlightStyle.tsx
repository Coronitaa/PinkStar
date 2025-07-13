
'use client';

import { getActiveCodeHighlightTheme } from '@/lib/data';
import type { HighlightTheme } from '@/lib/types';
import { unstable_noStore as noStore } from 'next/cache';

function generateHighlightCss(theme: HighlightTheme, selectorPrefix: string): string {
  if (!theme) return '';
  const styles: { [key: string]: string } = {
    // Base styles
    [`${selectorPrefix}`]: `background-color: ${theme.background}; color: ${theme.text};`,
    // Specific token styles from highlight.js
    [`${selectorPrefix} .hljs-comment, ${selectorPrefix} .hljs-quote`]: `color: ${theme.comment}; font-style: italic;`,
    [`${selectorPrefix} .hljs-keyword, ${selectorPrefix} .hljs-selector-tag, ${selectorPrefix} .hljs-doctag`]: `color: ${theme.keyword};`,
    [`${selectorPrefix} .hljs-string, ${selectorPrefix} .hljs-regexp`]: `color: ${theme.string};`,
    [`${selectorPrefix} .hljs-number, ${selectorPrefix} .hljs-literal, ${selectorPrefix} .hljs-bullet, ${selectorPrefix} .hljs-link`]: `color: ${theme.number};`,
    [`${selectorPrefix} .hljs-function .hljs-title, ${selectorPrefix} .hljs-title.function_, ${selectorPrefix} .hljs-title.function_.invoke__`]: `color: ${theme.function};`,
    [`${selectorPrefix} .hljs-class .hljs-title, ${selectorPrefix} .hljs-type`]: `color: ${theme.class};`,
    [`${selectorPrefix} .hljs-tag, ${selectorPrefix} .hljs-name, ${selectorPrefix} .hljs-section`]: `color: ${theme.tag};`,
    [`${selectorPrefix} .hljs-attr, ${selectorPrefix} .hljs-attribute`]: `color: ${theme.attr};`,
    [`${selectorPrefix} .hljs-variable, ${selectorPrefix} .hljs-template-variable, ${selectorPrefix} .hljs-params`]: `color: ${theme.variable};`,
    [`${selectorPrefix} .hljs-operator, ${selectorPrefix} .hljs-punctuation, ${selectorPrefix} .hljs-meta`]: `color: ${theme.punctuation};`, // Grouping operator with punctuation
    [`${selectorPrefix} .hljs-emphasis`]: `font-style: italic;`,
    [`${selectorPrefix} .hljs-strong`]: `font-weight: bold;`,
  };

  return Object.entries(styles)
    .map(([selector, rule]) => `${selector} { ${rule} }`)
    .join('\n');
}

export async function CodeHighlightStyle() {
  noStore();
  const activeTheme = await getActiveCodeHighlightTheme();

  if (!activeTheme) {
    // Fallback to a default theme if none is active in the DB
    return null;
  }
  
  const tiptapCss = generateHighlightCss(activeTheme.styles, '.tiptap-code-block');
  const renderedCss = generateHighlightCss(activeTheme.styles, '.rendered-code-block');

  return (
    <style dangerouslySetInnerHTML={{ __html: `${tiptapCss}\n${renderedCss}` }} />
  );
}
