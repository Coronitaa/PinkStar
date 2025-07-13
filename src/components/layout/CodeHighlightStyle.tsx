

import type { HighlightTheme } from '@/lib/types';
import { getActiveCodeHighlightTheme } from '@/lib/data';
import { unstable_noStore as noStore } from 'next/cache';

function generateHighlightCss(themeStyles: HighlightTheme, selectorPrefix: string): string {
    if (!themeStyles) return '';
    const styles: { [key: string]: string } = {
        [`${selectorPrefix}`]: `background-color: ${themeStyles.background || 'transparent'}; color: ${themeStyles.text};`,
        [`${selectorPrefix} .hljs-comment, ${selectorPrefix} .hljs-quote`]: `color: ${themeStyles.comment}; font-style: italic;`,
        [`${selectorPrefix} .hljs-keyword, ${selectorPrefix} .hljs-selector-tag, ${selectorPrefix} .hljs-doctag`]: `color: ${themeStyles.keyword};`,
        [`${selectorPrefix} .hljs-string, ${selectorPrefix} .hljs-regexp`]: `color: ${themeStyles.string};`,
        [`${selectorPrefix} .hljs-number, ${selectorPrefix} .hljs-literal, ${selectorPrefix} .hljs-bullet, ${selectorPrefix} .hljs-link`]: `color: ${themeStyles.number};`,
        [`${selectorPrefix} .hljs-function .hljs-title, ${selectorPrefix} .hljs-title.function_, ${selectorPrefix} .hljs-title.function_.invoke__`]: `color: ${themeStyles.function};`,
        [`${selectorPrefix} .hljs-class .hljs-title, ${selectorPrefix} .hljs-type`]: `color: ${themeStyles.class};`,
        [`${selectorPrefix} .hljs-tag, ${selectorPrefix} .hljs-name, ${selectorPrefix} .hljs-section`]: `color: ${themeStyles.tag};`,
        [`${selectorPrefix} .hljs-attr, ${selectorPrefix} .hljs-attribute`]: `color: ${themeStyles.attr};`,
        [`${selectorPrefix} .hljs-variable, ${selectorPrefix} .hljs-template-variable, ${selectorPrefix} .hljs-params`]: `color: ${themeStyles.variable};`,
        [`${selectorPrefix} .hljs-operator, ${selectorPrefix} .hljs-punctuation, ${selectorPrefix} .hljs-meta`]: `color: ${themeStyles.punctuation};`,
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
