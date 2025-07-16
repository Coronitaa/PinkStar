

import type { HighlightTheme } from '@/lib/types';
import { getActiveCodeHighlightTheme } from '@/lib/data';
import { unstable_noStore as noStore } from 'next/cache';

function generateHighlightCss(themeStyles: HighlightTheme, selectorPrefix: string): string {
    if (!themeStyles) return '';
    const styles: { [key: string]: string } = {
        // Base
        [`${selectorPrefix}`]: `background-color: ${themeStyles.background || 'transparent'}; color: ${themeStyles.text};`,
        
        // Comments
        [`${selectorPrefix} .hljs-comment, ${selectorPrefix} .hljs-quote`]: `color: ${themeStyles.comment}; font-style: italic;`,
        
        // Keywords & Control Flow
        [`${selectorPrefix} .hljs-keyword, ${selectorPrefix} .hljs-selector-tag, ${selectorPrefix} .hljs-doctag, ${selectorPrefix} .hljs-meta-keyword, ${selectorPrefix} .hljs-subst`]: `color: ${themeStyles.keyword};`,
        
        // Strings & Regex
        [`${selectorPrefix} .hljs-string, ${selectorPrefix} .hljs-regexp, ${selectorPrefix} .hljs-meta-string, ${selectorPrefix} .hljs-selector-attr, ${selectorPrefix} .hljs-template-variable`]: `color: ${themeStyles.string};`,
        
        // Numbers & Literals
        [`${selectorPrefix} .hljs-number, ${selectorPrefix} .hljs-literal`]: `color: ${themeStyles.number};`,
        
        // Functions & Methods
        [`${selectorPrefix} .hljs-title.function_, ${selectorPrefix} .hljs-title.function_.invoke__`]: `color: ${themeStyles.function};`,
        
        // Classes, Types, & Built-ins
        [`${selectorPrefix} .hljs-title.class_, ${selectorPrefix} .hljs-type, ${selectorPrefix} .hljs-built_in`]: `color: ${themeStyles.class};`,
        
        // Tags & Sections
        [`${selectorPrefix} .hljs-tag, ${selectorPrefix} .hljs-name, ${selectorPrefix} .hljs-section, ${selectorPrefix} .hljs-selector-id, ${selectorPrefix} .hljs-selector-class`]: `color: ${themeStyles.tag};`,
        
        // Attributes
        [`${selectorPrefix} .hljs-attribute, ${selectorPrefix} .hljs-attr`]: `color: ${themeStyles.attr};`,
        
        // Variables & Parameters
        [`${selectorPrefix} .hljs-variable, ${selectorPrefix} .hljs-params, ${selectorPrefix} .hljs-property`]: `color: ${themeStyles.variable};`,
        
        // Punctuation & Operators
        [`${selectorPrefix} .hljs-operator, ${selectorPrefix} .hljs-punctuation`]: `color: ${themeStyles.punctuation};`,

        // Links & Symbols
        [`${selectorPrefix} .hljs-symbol, ${selectorPrefix} .hljs-bullet, ${selectorPrefix} .hljs-link`]: `color: ${themeStyles.operator};`, // Reusing operator color for symbols

        // Meta (preprocessor)
        [`${selectorPrefix} .hljs-meta`]: `color: ${themeStyles.comment};`, // Reusing comment color for meta

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
