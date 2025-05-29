import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getResourceBySlug, getResources } from '@/lib/data';
import type { Resource } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResourceInfoSidebar } from '@/components/resource/ResourceInfoSidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { TagBadge } from '@/components/shared/TagBadge';
import { Carousel, CarouselItem } from '@/components/shared/Carousel';
import { ResourceCard } from '@/components/resource/ResourceCard';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, BookOpen, ListChecks, MessageCircle, Eye } from 'lucide-react';


interface ResourcePageProps {
  params: { resourceSlug: string };
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const resource = await getResourceBySlug(params.resourceSlug);
  if (!resource) {
    notFound();
  }

  const relatedResources = (await getResources({ gameSlug: resource.gameSlug, categorySlug: resource.categorySlug }))
    .filter(r => r.id !== resource.id)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href={`/games/${resource.gameSlug}`}>{resource.gameName}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href={`/games/${resource.gameSlug}/${resource.categorySlug}`}>{resource.categoryName}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{resource.name}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
              
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 mb-4">
                  <TabsTrigger value="overview"><Eye className="w-4 h-4 mr-1 sm:mr-2" />Overview</TabsTrigger>
                  <TabsTrigger value="files"><FileText className="w-4 h-4 mr-1 sm:mr-2" />Files</TabsTrigger>
                  <TabsTrigger value="requirements"><ListChecks className="w-4 h-4 mr-1 sm:mr-2" />Requirements</TabsTrigger>
                  <TabsTrigger value="changelog"><BookOpen className="w-4 h-4 mr-1 sm:mr-2" />Changelog</TabsTrigger>
                  <TabsTrigger value="comments"><MessageCircle className="w-4 h-4 mr-1 sm:mr-2" />Comments</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <div 
                    className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert max-w-none prose-headings:text-primary prose-a:text-accent hover:prose-a:text-accent/80 whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: resource.detailedDescription.replace(/\n/g, '<br />') }}
                  />
                </TabsContent>
                <TabsContent value="files">
                   <ul className="space-y-2">
                    {resource.files.map(file => (
                      <li key={file.id} className="flex justify-between items-center p-3 border rounded-md bg-card-foreground/5">
                        <div>
                          <p className="font-medium text-card-foreground">{file.name}</p>
                          <p className="text-xs text-muted-foreground">Version: {file.version} | Size: {file.size}</p>
                        </div>
                        <Link href={file.url} download>
                          <Button variant="outline" size="sm">Download</Button>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {resource.files.length === 0 && <p className="text-muted-foreground">No files available for this resource.</p>}
                </TabsContent>
                <TabsContent value="requirements">
                  {resource.requirements ? (
                     <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-line" dangerouslySetInnerHTML={{ __html: resource.requirements.replace(/\n/g, '<br />') }}/>
                  ) : (
                    <p className="text-muted-foreground">No specific requirements listed for this resource.</p>
                  )}
                </TabsContent>
                <TabsContent value="changelog">
                  {resource.changelog ? (
                     <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-line" dangerouslySetInnerHTML={{ __html: resource.changelog.replace(/\n/g, '<br />') }} />
                  ) : (
                    <p className="text-muted-foreground">No changelog available for this resource.</p>
                  )}
                </TabsContent>
                <TabsContent value="comments">
                  <p className="text-muted-foreground">Comments are coming soon! Share your thoughts and feedback in the future.</p>
                  {/* Placeholder for comments section */}
                </TabsContent>
              </Tabs>
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
