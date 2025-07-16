

import type { HighlightTheme } from '@/lib/types';
import { getActiveCodeHighlightTheme } from '@/lib/data';
import { unstable_noStore as noStore } from 'next/cache';

function generateHighlightCss(themeStyles: HighlightTheme, selectorPrefix: string): string {
    if (!themeStyles) return '';
    // Comprehensive mapping of highlight.js classes to theme properties
    const styles: { [key: string]: string } = {
        // Base
        [`${selectorPrefix}`]: `background-color: ${themeStyles.background || 'transparent'}; color: ${themeStyles.text};`,
        
        // Comments
        [`${selectorPrefix} .hljs-comment, ${selectorPrefix} .hljs-quote`]: `color: ${themeStyles.comment}; font-style: italic;`,
        
        // Keywords & Control Flow
        [`${selectorPrefix} .hljs-keyword, ${selectorPrefix} .hljs-selector-tag, ${selectorPrefix} .hljs-doctag, ${selectorPrefix} .hljs-meta-keyword, ${selectorPrefix} .hljs-subst, ${selectorPrefix} .hljs-section`]: `color: ${themeStyles.keyword};`,
        
        // Strings, Regex, etc.
        [`${selectorPrefix} .hljs-string, ${selectorPrefix} .hljs-regexp, ${selectorPrefix} .hljs-meta-string, ${selectorPrefix} .hljs-selector-attr, ${selectorPrefix} .hljs-template-variable, ${selectorPrefix} .hljs-addition`]: `color: ${themeStyles.string};`,
        
        // Numbers & Literals (booleans, null, etc.)
        [`${selectorPrefix} .hljs-number, ${selectorPrefix} .hljs-literal`]: `color: ${themeStyles.number};`,
        
        // Functions & Methods
        [`${selectorPrefix} .hljs-title.function_, ${selectorPrefix} .hljs-title.function_.invoke__`]: `color: ${themeStyles.function};`,
        
        // Parameters of functions
        [`${selectorPrefix} .hljs-params`]: `color: ${themeStyles.variable};`,

        // Classes, Types, & Built-ins
        [`${selectorPrefix} .hljs-title.class_, ${selectorPrefix} .hljs-type, ${selectorPrefix} .hljs-built_in, ${selectorPrefix} .hljs-name`]: `color: ${themeStyles.class};`,
        
        // Decorators (e.g., @decorator in Python/JS)
        [`${selectorPrefix} .hljs-meta`]: `color: ${themeStyles.tag};`,

        // HTML/XML Tags and Component names
        [`${selectorPrefix} .hljs-tag, ${selectorPrefix} .hljs-selector-id, ${selectorPrefix} .hljs-selector-class`]: `color: ${themeStyles.tag};`,
        
        // Attributes
        [`${selectorPrefix} .hljs-attribute, ${selectorPrefix} .hljs-attr`]: `color: ${themeStyles.attr};`,
        
        // Variables & Properties
        [`${selectorPrefix} .hljs-variable, ${selectorPrefix} .hljs-property`]: `color: ${themeStyles.variable};`,
        
        // Punctuation & Operators
        [`${selectorPrefix} .hljs-operator, ${selectorPrefix} .hljs-punctuation`]: `color: ${themeStyles.punctuation};`,

        // Symbols and bullets
        [`${selectorPrefix} .hljs-symbol, ${selectorPrefix} .hljs-bullet, ${selectorPrefix} .hljs-link`]: `color: ${themeStyles.operator};`,

        // Style
        [`${selectorPrefix} .hljs-emphasis`]: `font-style: italic;`,
        [`${selectorPrefix} .hljs-strong`]: `font-weight: bold;`,
    };

    return Object.entries(styles)
      .map(([selector, rule]) => `${selector} { ${rule} }`)
      .join('\n');
}

// This is now a pure Server Component.
// It fetches data and renders the <style> tag on the server.
export async function CodeHighlightStyle() {
  noStore();
  const activeTheme = await getActiveCodeHighlightTheme();

  if (!activeTheme) return null;
  
  const theme = activeTheme.styles;

  const tiptapCss = generateHighlightCss(theme, '.tiptap-code-block');
  const renderedCss = generateHighlightCss(theme, '.rendered-code-block');
  
  return (
    <style dangerouslySetInnerHTML={{ __html: `${tiptapCss}\n${renderedCss}` }} />
  );
}
