import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getResourceBySlug, getResources } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResourceInfoSidebar } from '@/components/resource/ResourceInfoSidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"; // Assuming this exists or will be created
import Link from 'next/link';
import { TagBadge } from '@/components/shared/TagBadge';
import { Carousel, CarouselItem } from '@/components/shared/Carousel';
import { ResourceCard } from '@/components/resource/ResourceCard';
import { Separator } from '@/components/ui/separator';

// Basic Breadcrumb components (can be moved to ui/breadcrumb.tsx if needed)
const UIBreadcrumb = ({ children }: { children: React.ReactNode }) => <nav aria-label="breadcrumb"><ol className="flex items-center space-x-1.5 text-sm text-muted-foreground">{children}</ol></nav>;
const UIBreadcrumbList = ({ children }: { children: React.ReactNode }) => <>{children}</>; // ol is already in UIBreadcrumb
const UIBreadcrumbItem = ({ children }: { children: React.ReactNode }) => <li className="flex items-center">{children}</li>;
const UIBreadcrumbLink = ({ href, children }: { href: string, children: React.ReactNode }) => <Link href={href} className="hover:text-primary transition-colors">{children}</Link>;
const UIBreadcrumbPage = ({ children }: { children: React.ReactNode }) => <span className="font-medium text-foreground">{children}</span>;
const UIBreadcrumbSeparator = () => <li role="presentation" aria-hidden="true" className="px-1">/</li>;


interface ResourcePageProps {
  params: { resourceSlug: string };
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const resource = await getResourceBySlug(params.resourceSlug);
  if (!resource) {
    notFound();
  }

  // Fetch related resources (e.g., by same author or in same category)
  const relatedResources = (await getResources({ gameSlug: resource.gameSlug, categorySlug: resource.categorySlug }))
    .filter(r => r.id !== resource.id)
    .slice(0, 5);


  return (
    <div className="space-y-8">
      <UIBreadcrumb>
        <UIBreadcrumbList>
          <UIBreadcrumbItem><UIBreadcrumbLink href="/">Home</UIBreadcrumbLink></UIBreadcrumbItem>
          <UIBreadcrumbSeparator />
          <UIBreadcrumbItem><UIBreadcrumbLink href={`/games/${resource.gameSlug}`}>{resource.gameName}</UIBreadcrumbLink></UIBreadcrumbItem>
          <UIBreadcrumbSeparator />
          {/* Link to category listing page could be: /games/${resource.gameSlug}#category-${resource.categorySlug} or a dedicated category page */}
          <UIBreadcrumbItem><UIBreadcrumbLink href={`/games/${resource.gameSlug}`}>{resource.categoryName}</UIBreadcrumbLink></UIBreadcrumbItem>
          <UIBreadcrumbSeparator />
          <UIBreadcrumbItem><UIBreadcrumbPage>{resource.name}</UIBreadcrumbPage></UIBreadcrumbItem>
        </UIBreadcrumbList>
      </UIBreadcrumb>

      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <main className="lg:col-span-8 space-y-6">
          <Card className="overflow-hidden shadow-xl">
            <CardHeader className="p-0 relative aspect-video">
              <Image
                src={resource.imageUrl}
                alt={`${resource.name} primary image`}
                layout="fill"
                objectFit="cover"
                priority
                data-ai-hint="gameplay screenshot"
              />
            </CardHeader>
            <CardContent className="p-6">
              <CardTitle className="text-3xl md:text-4xl font-bold mb-2">{resource.name}</CardTitle>
              <CardDescription className="text-base text-muted-foreground mb-4">{resource.description}</CardDescription>
              
              <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert max-w-none prose-headings:text-primary prose-a:text-accent hover:prose-a:text-accent/80"
                dangerouslySetInnerHTML={{ __html: resource.detailedDescription.replace(/\n/g, '<br />') }} // Basic markdown-like rendering
              />
            </CardContent>
          </Card>

          {/* Could add sections for changelog, comments, etc. here */}
           <Card>
            <CardHeader>
              <CardTitle>Files</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {resource.files.map(file => (
                  <li key={file.id} className="flex justify-between items-center p-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">Version: {file.version} | Size: {file.size}</p>
                    </div>
                    <Link href={file.url} download>
                      <Button variant="outline" size="sm">Download</Button>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>


        </main>

        <aside className="lg:col-span-4 mt-8 lg:mt-0">
          <ResourceInfoSidebar resource={resource} />
        </aside>
      </div>

      {relatedResources.length > 0 && (
        <section className="pt-8 mt-8 border-t">
          <h2 className="text-2xl font-semibold mb-4">Related Resources</h2>
          <Carousel>
            {relatedResources.map(related => (
              <CarouselItem key={related.id}>
                <ResourceCard resource={related} compact />
              </CarouselItem>
            ))}
          </Carousel>
        </section>
      )}

    </div>
  );
}

export const revalidate = 3600; // Revalidate data every hour
