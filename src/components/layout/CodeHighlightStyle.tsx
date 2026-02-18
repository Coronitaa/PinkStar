import type { HighlightTheme } from '@/lib/types';
import { getActiveCodeHighlightTheme } from '@/lib/data';
import { unstable_noStore as noStore } from 'next/cache';

function generateHighlightCss(themeStyles: HighlightTheme, selectorPrefix: string): string {
    if (!themeStyles) return '';

    // Increased specificity using html.dark body to override any prose defaults
    const p = `html.dark body ${selectorPrefix}`;

    const styles: { [key: string]: string } = {
        // Base - Force reset background and padding to avoid inconsistencies
        [`${p}`]: `background-color: ${themeStyles.background || '#1e1e1e'} !important; color: ${themeStyles.text} !important; padding: 1rem !important; margin: 0 !important; border-radius: 0 0 0.5rem 0.5rem;`,
        
        // Ensure the code tag inside doesn't have its own background or extra padding
        [`${p} code`]: `background-color: transparent !important; padding: 0 !important; color: inherit !important; font-family: var(--font-geist-mono), monospace !important;`,

        // Token Styles
        [`${p} .hljs-comment, ${p} .hljs-quote`]: `color: ${themeStyles.comment}; font-style: italic;`,
        
        [`${p} .hljs-keyword, ${p} .hljs-selector-tag, ${p} .hljs-doctag, ${p} .hljs-meta-keyword, ${p} .hljs-subst, ${p} .hljs-section, ${p} .hljs-built_in[class*="self"], ${p} .hljs-keyword[class*="self"], ${p} .hljs-name, ${p} .hljs-strong`]: `color: ${themeStyles.keyword};`,

        [`${p} .hljs-string, ${p} .hljs-regexp, ${p} .hljs-meta-string, ${p} .hljs-selector-attr, ${p} .hljs-template-variable, ${p} .hljs-addition`]: `color: ${themeStyles.string};`,
        
        [`${p} .hljs-number, ${p} .hljs-literal`]: `color: ${themeStyles.number};`,
        
        [`${p} .hljs-title.function_, ${p} .hljs-title.function_.invoke__, ${p} .hljs-title[class*="function"]`]: `color: ${themeStyles.function};`,
        
        [`${p} .hljs-params`]: `color: ${themeStyles.variable}; font-style: normal;`,

        [`${p} .hljs-title.class_, ${p} .hljs-type, ${p} .hljs-built_in, ${p} .hljs-class .hljs-title`]: `color: ${themeStyles.class};`,
        
        [`${p} .hljs-meta, ${p} .hljs-meta .hljs-keyword`]: `color: ${themeStyles.tag};`,

        [`${p} .hljs-tag, ${p} .hljs-selector-id, ${p} .hljs-selector-class`]: `color: ${themeStyles.tag};`,
        
        [`${p} .hljs-attribute, ${p} .hljs-attr`]: `color: ${themeStyles.attr};`,
        
        [`${p} .hljs-variable, ${p} .hljs-property`]: `color: ${themeStyles.variable};`,
        
        [`${p} .hljs-operator, ${p} .hljs-punctuation`]: `color: ${themeStyles.punctuation};`,

        [`${p} .hljs-symbol, ${p} .hljs-bullet, ${p} .hljs-link`]: `color: ${themeStyles.operator};`,

        [`${p} .hljs-emphasis`]: `font-style: italic;`,
    };

    return Object.entries(styles)
      .map(([selector, rule]) => `${selector} { ${rule} }`)
      .join('\n');
}

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
