"use client";

import React, { useState, useMemo, useTransition } from 'react';
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

// Dummy code snippets for preview
const codeSnippets = {
  javascript: `function greet(name) {\n  // A simple greeting function\n  const message = \`Hello, \${name}!\`;\n  console.log(message);\n  return 42;\n}`,
  python: `class Greeter:\n    # A simple greeter class\n    def __init__(self, name):\n        self.name = name\n\n    def greet(self):\n        print(f"Hello, {self.name}!")\n        return True`,
  html: `<div class="container">\n  <h1>Welcome!</h1>\n  <p>This is a sample.</p>\n</div>`,
};

// Mock highlighter for client-side preview. A full implementation would be heavier.
const SimpleSyntaxHighlight = ({ code, theme }: { code: string; theme: HighlightTheme }) => {
  const highlightStyle = (tokenType: string) => {
    switch (tokenType) {
      case 'comment': return { color: theme.comment };
      case 'keyword': return { color: theme.keyword };
      case 'string': return { color: theme.string };
      case 'number': return { color: theme.number };
      case 'function': return { color: theme.function };
      case 'class': return { color: theme.class };
      case 'tag': return { color: theme.tag };
      case 'attr': return { color: theme.attr };
      case 'punctuation': return { color: theme.punctuation };
      default: return { color: theme.text };
    }
  };
  
  // This is a very simplified tokenizer for preview purposes only
  const tokens = code.split(/(\s+|\b)/).map((token, i) => {
    if (token.startsWith('//') || token.startsWith('#')) return <span key={i} style={highlightStyle('comment')}>{token}</span>;
    if (['function', 'class', 'const', 'def'].includes(token)) return <span key={i} style={highlightStyle('keyword')}>{token}</span>;
    if (token.match(/^[`"']/)) return <span key={i} style={highlightStyle('string')}>{token}</span>;
    if (!isNaN(parseFloat(token))) return <span key={i} style={highlightStyle('number')}>{token}</span>;
    if (token.match(/<[a-z/]+(>)?/)) return <span key={i} style={highlightStyle('tag')}>{token}</span>
    return <span key={i}>{token}</span>;
  });

  return (
    <pre style={{ background: theme.background, color: theme.text }} className="p-3 rounded-b-md text-xs overflow-x-auto">
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

    const selectedThemeData = useMemo(() => {
        return themes.find(t => t.id === activeThemeId) || themes.find(t => t.id === initialActiveThemeId) || null;
    }, [activeThemeId, themes, initialActiveThemeId]);

    const handleActivateTheme = async (themeId: string) => {
        // This would call a server action
        console.log(`Activating theme: ${themeId}`);
        setActiveThemeId(themeId);
        // In a real app:
        // startSavingTransition(async () => {
        //   const result = await activateThemeAction(themeId);
        //   if (result.success) {
        //     toast({ title: 'Theme Activated!' });
        //     router.refresh();
        //   } else {
        //     toast({ title: 'Error', description: result.error, variant: 'destructive' });
        //     setActiveThemeId(initialActiveThemeId); // Revert on failure
        //   }
        // });
        toast({ title: 'Previewing Theme', description: 'The site style will update upon saving or activation in a real implementation.' });
    };

    const handleEditTheme = (themeId: string) => {
        const themeToEdit = themes.find(t => t.id === themeId);
        setSelectedThemeForEdit(themeToEdit || null);
    };

    const handleSaveTheme = async (formData: CodeHighlightThemeFormData) => {
        // This would call a server action
        console.log("Saving theme", formData);
        startSavingTransition(async () => {
            // const result = await saveThemeAction(formData);
            // MOCK SUCCESS
            const isNew = !themes.some(t => t.id === formData.id);
            let updatedThemes;
            if (isNew) {
                updatedThemes = [...themes, { ...formData, isActive: false, isReadonly: false, createdAt: new Date().toISOString() }];
            } else {
                updatedThemes = themes.map(t => t.id === formData.id ? { ...t, ...formData } : t);
            }
            setThemes(updatedThemes);
            setSelectedThemeForEdit(null);
            toast({ title: isNew ? 'Theme Created' : 'Theme Updated' });
            // router.refresh();
        });
    };
    
    const handleAddNewTheme = () => {
        const newTheme: CodeHighlightTheme = {
            id: `theme_${Date.now()}`,
            name: 'New Custom Theme',
            isActive: false,
            isReadonly: false,
            styles: { // Default to a light theme structure
                background: '#ffffff', text: '#333333', comment: '#999999', keyword: '#d73a49',
                string: '#032f62', number: '#005cc5', 'function': '#6f42c1', 'class': '#6f42c1',
                tag: '#22863a', attr: '#6f42c1', variable: '#e36209', punctuation: '#24292e',
                operator: '#d73a49'
            },
        };
        setSelectedThemeForEdit(newTheme);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
                <Card className="bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Theme Preview</CardTitle>
                        <CardDescription>
                            See how the selected theme looks with different languages. The active theme will be applied across the entire site.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {selectedThemeData ? (
                            Object.entries(codeSnippets).map(([lang, code]) => (
                                <div key={lang}>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1 px-1">{lang.charAt(0).toUpperCase() + lang.slice(1)}</h4>
                                    <SimpleSyntaxHighlight code={code} theme={selectedThemeData.styles} />
                                </div>
                            ))
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

    useEffect(() => {
        setFormData({
            id: theme.id,
            name: theme.name,
            styles: { ...theme.styles },
        });
    }, [theme]);
    
    const handleStyleChange = (key: HighlightStyle, value: string) => {
        setFormData(prev => ({ ...prev, styles: { ...prev.styles, [key]: value } }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Card className="lg:col-span-12 bg-card/80 backdrop-blur-sm p-6 shadow-lg">
             <form onSubmit={handleSubmit}>
                <div className="flex justify-between items-center mb-4">
                    <CardTitle>Edit Theme: {formData.name}</CardTitle>
                    <div className="flex gap-2">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4"/>}
                            Save Theme
                        </Button>
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="themeName">Theme Name</Label>
                        <Input id="themeName" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {HIGHLIGHT_STYLE_KEYS.map(styleKey => (
                            <div key={styleKey}>
                                <Label htmlFor={`style-${styleKey}`}>{HIGHLIGHT_STYLE_NAMES[styleKey]}</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Input 
                                        type="color" 
                                        id={`style-color-${styleKey}`}
                                        value={formData.styles[styleKey] || '#000000'}
                                        onChange={(e) => handleStyleChange(styleKey, e.target.value)}
                                        className="w-10 h-10 p-1"
                                    />
                                    <Input
                                        id={`style-${styleKey}`}
                                        value={formData.styles[styleKey] || ''}
                                        onChange={(e) => handleStyleChange(styleKey, e.target.value)}
                                        placeholder="#RRGGBB"
                                        className="h-10"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </form>
        </Card>
    );
}

