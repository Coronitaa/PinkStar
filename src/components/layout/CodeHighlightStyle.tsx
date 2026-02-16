

import type { HighlightTheme } from '@/lib/types';
import { getActiveCodeHighlightTheme } from '@/lib/data';
import { unstable_noStore as noStore } from 'next/cache';

function generateHighlightCss(themeStyles: HighlightTheme, selectorPrefix: string): string {
    if (!themeStyles) return '';

    const prefixWithBody = `body ${selectorPrefix}`;

    const styles: { [key: string]: string } = {
        // Base
        [`${prefixWithBody}`]: `background-color: ${themeStyles.background || 'transparent'}; color: ${themeStyles.text};`,
        
        // Comments & Docstrings
        [`${prefixWithBody} .hljs-comment, ${prefixWithBody} .hljs-quote`]: `color: ${themeStyles.comment}; font-style: italic;`,
        
        // Keywords & Control Flow
        [`${prefixWithBody} .hljs-keyword, ${prefixWithBody} .hljs-selector-tag, ${prefixWithBody} .hljs-doctag, ${prefixWithBody} .hljs-meta-keyword, ${prefixWithBody} .hljs-subst, ${prefixWithBody} .hljs-section, ${prefixWithBody} .hljs-built_in[class*="self"], ${prefixWithBody} .hljs-keyword[class*="self"], ${prefixWithBody} .hljs-name, ${prefixWithBody} .hljs-strong`]: `color: ${themeStyles.keyword};`,

        // Strings, Regex, etc.
        [`${prefixWithBody} .hljs-string, ${prefixWithBody} .hljs-regexp, ${prefixWithBody} .hljs-meta-string, ${prefixWithBody} .hljs-selector-attr, ${prefixWithBody} .hljs-template-variable, ${prefixWithBody} .hljs-addition`]: `color: ${themeStyles.string};`,
        
        // Numbers & Literals (booleans, null, etc.)
        [`${prefixWithBody} .hljs-number, ${prefixWithBody} .hljs-literal`]: `color: ${themeStyles.number};`,
        
        // Functions & Methods
        [`${prefixWithBody} .hljs-title.function_, ${prefixWithBody} .hljs-title.function_.invoke__, ${prefixWithBody} .hljs-title[class*="function"]`]: `color: ${themeStyles.function};`,
        
        // Parameters of functions
        [`${prefixWithBody} .hljs-params`]: `color: ${themeStyles.variable}; font-style: normal;`,

        // Classes, Types, & Built-ins
        [`${prefixWithBody} .hljs-title.class_, ${prefixWithBody} .hljs-type, ${prefixWithBody} .hljs-built_in, ${prefixWithBody} .hljs-class .hljs-title`]: `color: ${themeStyles.class};`,
        
        // Decorators & Annotations (e.g., @decorator in Python/JS)
        [`${prefixWithBody} .hljs-meta, ${prefixWithBody} .hljs-meta .hljs-keyword`]: `color: ${themeStyles.tag};`,

        // HTML/XML Tags and Component names
        [`${prefixWithBody} .hljs-tag, ${prefixWithBody} .hljs-selector-id, ${prefixWithBody} .hljs-selector-class`]: `color: ${themeStyles.tag};`,
        
        // Attributes
        [`${prefixWithBody} .hljs-attribute, ${prefixWithBody} .hljs-attr`]: `color: ${themeStyles.attr};`,
        
        // Variables & Properties
        [`${prefixWithBody} .hljs-variable, ${prefixWithBody} .hljs-property`]: `color: ${themeStyles.variable};`,
        
        // Punctuation & Operators
        [`${prefixWithBody} .hljs-operator, ${prefixWithBody} .hljs-punctuation`]: `color: ${themeStyles.punctuation};`,

        // Symbols and bullets
        [`${prefixWithBody} .hljs-symbol, ${prefixWithBody} .hljs-bullet, ${prefixWithBody} .hljs-link`]: `color: ${themeStyles.operator};`,

        // Style
        [`${prefixWithBody} .hljs-emphasis`]: `font-style: italic;`,
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
