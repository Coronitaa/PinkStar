'use server';

import { getActiveCodeHighlightTheme } from '@/lib/data';
import { CodeHighlightTheme } from '@/lib/types';

export async function getActiveCodeHighlightThemeAction(): Promise<CodeHighlightTheme | null> {
    return getActiveCodeHighlightTheme();
}
