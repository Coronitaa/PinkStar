
import { getActiveCodeHighlightTheme } from '@/lib/data';
import type { HighlightTheme, HighlightStyle } from '@/lib/types';
import { unstable_noStore as noStore } from 'next/cache';

function generateHighlightCss(theme: HighlightTheme, selectorPrefix: string): string {
  const styles: { [key: string]: string } = {
    // Base styles
    [`${selectorPrefix}`]: `background-color: ${theme.background}; color: ${theme.text};`,
    // Specific token styles
    [`${selectorPrefix} .hljs-comment, ${selectorPrefix} .hljs-quote`]: `color: ${theme.comment}; font-style: italic;`,
    [`${selectorPrefix} .hljs-doctag, ${selectorPrefix} .hljs-keyword, ${selectorPrefix} .hljs-formula`]: `color: ${theme.keyword};`,
    [`${selectorPrefix} .hljs-section, ${selectorPrefix} .hljs-name, ${selectorPrefix} .hljs-selector-tag, ${selectorPrefix} .hljs-deletion, ${selectorPrefix} .hljs-subst`]: `color: ${theme.tag};`, // Using 'tag' for this group
    [`${selectorPrefix} .hljs-literal`]: `color: ${theme.number};`, // Using 'number' for literals
    [`${selectorPrefix} .hljs-string, ${selectorPrefix} .hljs-regexp, ${selectorPrefix} .hljs-addition, ${selectorPrefix} .hljs-attribute, ${selectorPrefix} .hljs-meta-string`]: `color: ${theme.string};`,
    [`${selectorPrefix} .hljs-built_in, ${selectorPrefix} .hljs-class .hljs-title`]: `color: ${theme.class};`,
    [`${selectorPrefix} .hljs-attr, ${selectorPrefix} .hljs-variable, ${selectorPrefix} .hljs-template-variable, ${selectorPrefix} .hljs-type, ${selectorPrefix} .hljs-selector-class, ${selectorPrefix} .hljs-selector-attr, ${selectorPrefix} .hljs-selector-pseudo, ${selectorPrefix} .hljs-number`]: `color: ${theme.attr};`, // Using 'attr' for this group
    [`${selectorPrefix} .hljs-symbol, ${selectorPrefix} .hljs-bullet, ${selectorPrefix} .hljs-link, ${selectorPrefix} .hljs-meta, ${selectorPrefix} .hljs-selector-id, ${selectorPrefix} .hljs-title`]: `color: ${theme.function};`, // Using 'function' for titles/links
    [`${selectorPrefix} .hljs-emphasis`]: `font-style: italic;`,
    [`${selectorPrefix} .hljs-strong`]: `font-weight: bold;`,
    [`${selectorPrefix} .hljs-punctuation`]: `color: ${theme.punctuation};`,
    [`${selectorPrefix} .hljs-operator`]: `color: ${theme.operator};`,
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
