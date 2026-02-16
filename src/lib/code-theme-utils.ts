import type { HighlightTheme } from '@/lib/types';

export function generateHighlightCss(themeStyles: HighlightTheme, selectorPrefix: string): string {
    if (!themeStyles) return '';

    // We use a more specific selector strategy to ensure we override global styles.
    // The prefix should ideally be a class on the wrapper container.
    const p = selectorPrefix;

    const styles: { [key: string]: string } = {
        // Base - Resetting background and color to strict theme values
        // forcing inheritance to be broken for these properties
        [`${p}`]: `
            background-color: ${themeStyles.background || 'transparent'};
            color: ${themeStyles.text};
            font-family: inherit; 
            padding: 1rem; /* Consistent padding */
            border-radius: 0.375rem; /* rounded-md */
            line-height: 1.5;
        `,
        [`${p} code`]: `
            background-color: transparent !important;
            color: inherit !important;
            padding: 0 !important;
            font-family: 'Geist Mono', monospace, ui-monospace, SFMono-Regular;
        `,

        // Context specific resets to avoid global prose pollution
        [`${p} pre`]: `
            background-color: transparent !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow-x: auto;
        `,

        // Token Styles
        [`${p} .hljs-comment, ${p} .hljs-quote`]: `color: ${themeStyles.comment}; font-style: italic;`,

        [`${p} .hljs-keyword, ${p} .hljs-selector-tag, ${p} .hljs-doctag, ${p} .hljs-meta-keyword, ${p} .hljs-subst, ${p} .hljs-section, ${p} .hljs-built_in[class*="self"], ${p} .hljs-keyword[class*="self"], ${p} .hljs-name, ${p} .hljs-strong`]: `color: ${themeStyles.keyword};`,

        [`${p} .hljs-string, ${p} .hljs-regexp, ${p} .hljs-meta-string, ${p} .hljs-selector-attr, ${p} .hljs-template-variable, ${p} .hljs-addition`]: `color: ${themeStyles.string};`,

        [`${p} .hljs-number, ${p} .hljs-literal`]: `color: ${themeStyles.number};`,

        [`${p} .hljs-title.function_, ${p} .hljs-title.function_.invoke__, ${p} .hljs-title[class*="function"]`]: `color: ${themeStyles.function};`,

        [`${p} .hljs-params`]: `color: ${themeStyles.variable}; font-style: normal;`,

        [`${p} .hljs-title.class_, ${p} .hljs-type, ${p} .hljs-built_in, ${p} .hljs-class .hljs-title`]: `color: ${themeStyles.class};`,

        [`${p} .hljs-meta, ${p} .hljs-meta .hljs-keyword`]: `color: ${themeStyles.tag};`,

        [`${p} .hljs-tag, ${p} .hljs-selector-id, .hljs-selector-class`]: `color: ${themeStyles.tag};`,

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
