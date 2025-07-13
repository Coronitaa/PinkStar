
import { getAllCodeHighlightThemes, getActiveCodeHighlightTheme } from '@/lib/data';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { CodeHighlighterSettings } from '@/components/admin/CodeHighlighterSettings';

export const dynamic = 'force-dynamic';

export default async function AdminCodeHighlighterPage() {
    const allThemes = await getAllCodeHighlightThemes();
    const activeTheme = await getActiveCodeHighlightTheme(); // This might be null if none is active

    return (
        <div className="space-y-6">
            <Breadcrumb>
                <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="/admin">Admin</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink href="/admin/settings">Settings</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>Code Highlighter Theme</BreadcrumbPage></BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            
            <header>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Code Highlighter Theme</h1>
                <p className="text-muted-foreground">
                Customize the appearance of code blocks across the entire site.
                </p>
            </header>

            <CodeHighlighterSettings 
                initialThemes={allThemes}
                initialActiveThemeId={activeTheme?.id ?? ''}
            />
        </div>
    );
}

