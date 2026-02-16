

'use client';

import React, { useMemo } from 'react';
import parse from 'html-react-parser';
import { toHtml } from 'hast-util-to-html';
import { lowlight } from '@/lib/lowlight';
import { generateHighlightCss } from '@/lib/code-theme-utils';
import type { CodeHighlightTheme } from '@/lib/types';



interface SimpleSyntaxHighlightProps {
  code: string;
  theme?: CodeHighlightTheme['styles'] | null;
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

  const themeStyles = useMemo(() => theme ? generateHighlightCss(theme, '.code-preview-wrapper') : '', [theme]);

  return (
    <>
      {themeStyles && <style>{themeStyles}</style>}
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
