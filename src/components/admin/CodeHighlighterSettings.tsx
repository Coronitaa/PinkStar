
"use client";

import React, { useState, useMemo, useTransition, useEffect } from 'react';
import type { CodeHighlightTheme, CodeHighlightThemeFormData, HighlightTheme, HighlightStyle } from '@/lib/types';
import { HIGHLIGHT_STYLE_KEYS, HIGHLIGHT_STYLE_NAMES } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Trash2, PlusCircle, Palette } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';


const codeSnippets: Record<string, string> = {
  javascript: `function greet(name) {\n  // A simple greeting function\n  const message = \`Hello, \${name}!\`;\n  console.log(message);\n  return 42;\n}`,
  python: `class Greeter:\n    # A simple greeter class\n    def __init__(self, name):\n        self.name = name\n\n    def greet(self):\n        print(f"Hello, {self.name}!")\n        return True`,
  html: `<div class="container">\n  <h1>Welcome!</h1>\n  <p>This is a sample.</p>\n</div>`,
  css: `body {\n  background-color: #f0f0f0;\n  font-family: Arial, sans-serif;\n  line-height: 1.6;\n}`,
  json: `{\n  "name": "PinkStar",\n  "version": "1.0.0",\n  "active": true,\n  "features": ["themes", "previews"]\n}`,
  bash: `#!/bin/bash\n# A simple script to greet\nNAME="World"\necho "Hello, $NAME!"\n`,
  java: `public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!"); \n    }\n}`,
  cpp: `#include <iostream>\n\nint main() {\n    std::cout << "Hello World!";\n    return 0;\n}`,
};

const SimpleSyntaxHighlight = ({ code, theme }: { code: string; theme: Partial<HighlightTheme> }) => {
  const highlightStyle = (tokenType: keyof HighlightTheme) => {
    return { color: theme[tokenType] || theme.text };
  };

  const tokens = useMemo(() => {
    // This is a very simplified tokenizer for preview purposes only
    return code.split(/(\s+|\b)/).map((token, i) => {
      if (token.startsWith('//') || token.startsWith('#')) return <span key={i} style={highlightStyle('comment')}>{token}</span>;
      if (['function', 'class', 'const', 'def', 'div', 'h1', 'p', 'public', 'static', 'void', 'int', 'include'].includes(token)) return <span key={i} style={highlightStyle('keyword')}>{token}</span>;
      if (token.match(/^[`"']/)) return <span key={i} style={highlightStyle('string')}>{token}</span>;
      if (!isNaN(parseFloat(token))) return <span key={i} style={highlightStyle('number')}>{token}</span>;
      if (token.match(/<[a-z/]+(>)?/)) return <span key={i} style={highlightStyle('tag')}>{token}</span>;
      return <span key={i} style={{ color: theme.text }}>{token}</span>;
    });
  }, [code, theme]);

  return (
    <pre style={{ color: theme.text }} className="p-3 rounded-b-md text-xs overflow-x-auto bg-card">
      <code>{tokens}</code>
    </pre>
  );
};


interface CodeHighlighterSettingsProps {
    initialThemes: CodeHighlightTheme[];
    initialActiveThemeId: string;
}

export function CodeHighlighterSettings({ initialThemes, initialActiveThemeId }: CodeHighlighterSettingsProps) {
    const [themes, setThemes] = useState(initialThemes);
    const [activeThemeId, setActiveThemeId] = useState(initialActiveThemeId);
    const [selectedThemeForEdit, setSelectedThemeForEdit] = useState<CodeHighlightTheme | null>(null);
    const [isSaving, startSavingTransition] = useTransition();
    const router = useRouter();
    const { toast } = useToast();

    const [previewLanguage, setPreviewLanguage] = useState<string>('javascript');

    const selectedThemeData = useMemo(() => {
        return themes.find(t => t.id === activeThemeId) || themes.find(t => t.id === initialActiveThemeId) || null;
    }, [activeThemeId, themes, initialActiveThemeId]);

    const handleActivateTheme = async (themeId: string) => {
        console.log(`Activating theme: ${themeId}`);
        setActiveThemeId(themeId);
        toast({ title: 'Previewing Theme', description: 'The site style will update upon saving or activation in a real implementation.' });
    };

    const handleEditTheme = (themeId: string) => {
        const themeToEdit = themes.find(t => t.id === themeId);
        setSelectedThemeForEdit(themeToEdit || null);
    };

    const handleSaveTheme = async (formData: CodeHighlightThemeFormData) => {
        console.log("Saving theme", formData);
        startSavingTransition(async () => {
            const isNew = !themes.some(t => t.id === formData.id);
            let updatedThemes;
            if (isNew) {
                const newTheme: CodeHighlightTheme = {
                    ...formData,
                    styles: {
                        background: 'transparent', // Ensure background is not set
                        ...formData.styles
                    },
                    isActive: false,
                    isReadonly: false,
                    createdAt: new Date().toISOString()
                };
                updatedThemes = [...themes, newTheme];
            } else {
                updatedThemes = themes.map(t => t.id === formData.id ? { ...t, ...formData, styles: { ...t.styles, ...formData.styles, background: 'transparent' } } : t);
            }
            setThemes(updatedThemes);
            setSelectedThemeForEdit(null);
            toast({ title: isNew ? 'Theme Created' : 'Theme Updated' });
        });
    };
    
    const handleAddNewTheme = () => {
        const newTheme: CodeHighlightTheme = {
            id: `theme_${Date.now()}`,
            name: 'New Custom Theme',
            isActive: false,
            isReadonly: false,
            styles: {
                background: 'transparent', text: '#abb2bf', comment: '#5c6370', keyword: '#c678dd',
                string: '#98c379', number: '#d19a66', 'function': '#61afef', 'class': '#e6c07b',
                tag: '#e06c75', attr: '#d19a66', variable: '#e06c75', punctuation: '#abb2bf',
                operator: '#56b6c2'
            },
        };
        setSelectedThemeForEdit(newTheme);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
                <Card className="bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Theme Preview</CardTitle>
                                <CardDescription>
                                    See how the selected theme looks with different languages.
                                </CardDescription>
                            </div>
                            <Select value={previewLanguage} onValueChange={setPreviewLanguage}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select language..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(codeSnippets).map(lang => (
                                        <SelectItem key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {selectedThemeData ? (
                             <div className="border rounded-lg bg-card overflow-hidden">
                                <div className="px-3 py-1.5 bg-card-foreground/5 text-xs text-muted-foreground border-b">
                                    {previewLanguage}
                                </div>
                                <SimpleSyntaxHighlight code={codeSnippets[previewLanguage]} theme={selectedThemeData.styles} />
                             </div>
                        ) : (
                            <p className="text-muted-foreground text-center py-8">No theme selected for preview.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-4 space-y-6">
                <Card className="bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Active Theme</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Select value={activeThemeId} onValueChange={handleActivateTheme}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a theme..." />
                            </SelectTrigger>
                            <SelectContent>
                                {themes.map(theme => (
                                    <SelectItem key={theme.id} value={theme.id}>{theme.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                         <Button className="w-full" disabled>
                            <Save className="w-4 h-4 mr-2" /> Set as Active Theme
                            <span className="text-xs ml-2 opacity-70">(Not Implemented)</span>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Manage Themes</CardTitle>
                        <CardDescription>Edit existing themes or create new ones.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {themes.map(theme => (
                            <div key={theme.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                                <span className="text-sm">{theme.name}</span>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditTheme(theme.id)} disabled={theme.isReadonly}>
                                        <Palette className="w-4 h-4 text-blue-500"/>
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7" disabled={theme.isReadonly}>
                                        <Trash2 className="w-4 h-4 text-destructive/70"/>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full" onClick={handleAddNewTheme}>
                            <PlusCircle className="w-4 h-4 mr-2" /> Create New Theme
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            {selectedThemeForEdit && (
                <ThemeEditorDialog
                    theme={selectedThemeForEdit}
                    isOpen={!!selectedThemeForEdit}
                    onOpenChange={(open) => !open && setSelectedThemeForEdit(null)}
                    onSave={handleSaveTheme}
                    isSaving={isSaving}
                />
            )}
        </div>
    );
}


interface ThemeEditorDialogProps {
    theme: CodeHighlightTheme;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (formData: CodeHighlightThemeFormData) => void;
    isSaving: boolean;
}

function ThemeEditorDialog({ theme, isOpen, onOpenChange, onSave, isSaving }: ThemeEditorDialogProps) {
    const [formData, setFormData] = useState<CodeHighlightThemeFormData>({
        id: theme.id,
        name: theme.name,
        styles: { ...theme.styles },
    });
    const [previewLanguage, setPreviewLanguage] = useState<string>('javascript');


    useEffect(() => {
        setFormData({
            id: theme.id,
            name: theme.name,
            styles: { ...theme.styles },
        });
    }, [theme]);
    
    const handleStyleChange = (key: HighlightStyle, value: string) => {
        if (key === 'background') return; // Do not allow background color editing
        setFormData(prev => ({ ...prev, styles: { ...prev.styles, [key]: value } }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-2 border-b">
                    <DialogTitle>{theme.isReadonly ? `Viewing Theme: ${formData.name}` : `Editing Theme: ${formData.name}`}</DialogTitle>
                    <DialogDescription>
                        {theme.isReadonly ? 'This is a default theme and cannot be modified.' : 'Customize the colors for your code blocks.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex-grow contents">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 p-6 overflow-y-auto">
                        <div className="space-y-4">
                             <div>
                                <Label htmlFor="themeName">Theme Name</Label>
                                <Input id="themeName" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} disabled={theme.isReadonly} />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                {HIGHLIGHT_STYLE_KEYS.filter(key => key !== 'background').map(styleKey => (
                                    <div key={styleKey}>
                                        <Label htmlFor={`style-${styleKey}`}>{HIGHLIGHT_STYLE_NAMES[styleKey]}</Label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Input 
                                                type="color" 
                                                id={`style-color-${styleKey}`}
                                                value={formData.styles[styleKey] || '#000000'}
                                                onChange={(e) => handleStyleChange(styleKey, e.target.value)}
                                                className="w-10 h-10 p-1"
                                                disabled={theme.isReadonly}
                                            />
                                            <Input
                                                id={`style-${styleKey}`}
                                                value={formData.styles[styleKey] || ''}
                                                onChange={(e) => handleStyleChange(styleKey, e.target.value)}
                                                placeholder="#RRGGBB"
                                                className="h-10"
                                                disabled={theme.isReadonly}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 sticky top-0">
                             <div className="flex items-center justify-between">
                                <Label>Live Preview</Label>
                                 <Select value={previewLanguage} onValueChange={setPreviewLanguage}>
                                    <SelectTrigger className="w-[150px] h-8 text-xs">
                                        <SelectValue placeholder="Language..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(codeSnippets).map(lang => (
                                            <SelectItem key={lang} value={lang} className="text-xs">{lang.charAt(0).toUpperCase() + lang.slice(1)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="border rounded-lg bg-card overflow-hidden">
                                <div className="px-3 py-1.5 bg-card-foreground/5 text-xs text-muted-foreground border-b">
                                    {previewLanguage}
                                </div>
                                <SimpleSyntaxHighlight code={codeSnippets[previewLanguage]} theme={formData.styles} />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="p-6 pt-4 border-t">
                        <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                        {!theme.isReadonly && (
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4"/>}
                                Save Theme
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

    