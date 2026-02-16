'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import type { CodeHighlightTheme } from '@/lib/types';

interface CodeHighlightThemeContextType {
    theme: CodeHighlightTheme | null;
}

const CodeHighlightThemeContext = createContext<CodeHighlightThemeContextType>({ theme: null });

export const useCodeHighlightTheme = () => useContext(CodeHighlightThemeContext);

interface CodeHighlightThemeProviderProps {
    children: ReactNode;
    theme: CodeHighlightTheme | null;
}

export const CodeHighlightThemeProvider = ({ children, theme }: CodeHighlightThemeProviderProps) => {
    return (
        <CodeHighlightThemeContext.Provider value={{ theme }}>
            {children}
        </CodeHighlightThemeContext.Provider>
    );
};
