
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getResourceBySlug, getResources } from '@/lib/data';
import type { Resource } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResourceInfoSidebar } from '@/components/resource/ResourceInfoSidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, BookOpen, ListChecks, MessageCircle, Eye, Heart, AlertTriangle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Carousel, CarouselItem } from '@/components/shared/Carousel'; // For related resources
import { ResourceCard } from '@/components/resource/ResourceCard'; // For related resources
import { cn } from '@/lib/utils';

interface ResourcePageProps {
  params: { resourceSlug: string };
  searchParams?: { tab?: string };
}

export default async function ResourcePage({ params, searchParams }: ResourcePageProps) {
  const resource = await getResourceBySlug(params.resourceSlug);
  if (!resource) {
    notFound();
  }

  const { resources: allResourcesInCategory } = await getResources({ 
    gameSlug: resource.gameSlug, 
    categorySlug: resource.categorySlug,
    limit: 6 // Fetch a bit more to ensure we have enough for "related" after filtering current
  });

  const relatedResources = allResourcesInCategory
    .filter(r => r.id !== resource.id)
    .slice(0, 5);

  const defaultTab = searchParams?.tab || "overview";

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

      <div className="lg:grid lg:grid-cols-12 lg:gap-12"> {/* Increased gap */}
        <main className="lg:col-span-8 space-y-6">
          <Card className="overflow-hidden shadow-xl bg-card/70 backdrop-blur-sm border-border/30">
            <CardHeader className="p-0 relative aspect-[16/9] group">
              <Image
                src={resource.imageUrl}
                alt={`${resource.name} primary image`}
                fill
                style={{objectFit:"cover"}}
                priority
                className="transition-transform duration-500 group-hover:scale-105"
                data-ai-hint="gameplay screenshot"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent opacity-75 group-hover:opacity-50 transition-opacity duration-300" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                <div>
                  <CardTitle className="text-3xl md:text-4xl font-bold mb-1 text-primary drop-shadow-md">{resource.name}</CardTitle>
                  <CardDescription className="text-base text-muted-foreground">{resource.description}</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="mt-3 sm:mt-0 button-outline-glow button-follow-sheen shrink-0">
                  <Heart className="w-4 h-4 mr-2 text-accent" /> Follow
                </Button>
              </div>
              
              <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-4 bg-card-foreground/5 rounded-md">
                  <TabsTrigger value="overview" id="overview-tab"><Eye className="w-4 h-4 mr-1 sm:mr-2" />Overview</TabsTrigger>
                  <TabsTrigger value="files" id="files-tab"><FileText className="w-4 h-4 mr-1 sm:mr-2" />Files</TabsTrigger>
                  <TabsTrigger value="requirements" id="requirements-tab"><ListChecks className="w-4 h-4 mr-1 sm:mr-2" />Requirements</TabsTrigger>
                  <TabsTrigger value="changelog" id="changelog-tab"><BookOpen className="w-4 h-4 mr-1 sm:mr-2" />Changelog</TabsTrigger>
                  <TabsTrigger value="comments" id="comments-tab"><MessageCircle className="w-4 h-4 mr-1 sm:mr-2" />Comments</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <div 
                    className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none prose-headings:text-primary prose-a:text-accent hover:prose-a:text-accent/80 whitespace-pre-line leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: resource.detailedDescription.replace(/\n/g, '<br />') }}
                  />
                </TabsContent>
                <TabsContent value="files">
                   <ul className="space-y-4">
                    {resource.files.map(file => (
                      <li key={file.id} className="p-4 border rounded-md bg-card-foreground/10 hover:bg-card-foreground/15 transition-colors shadow-sm">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                          <div className="flex-grow">
                            <p className="font-medium text-foreground">{file.name}</p>
                            <p className="text-xs text-muted-foreground mb-1">Size: {file.size}</p>
                          </div>
                          <Link href={file.url} download className="shrink-0 self-start sm:self-center">
                            <Button variant="outline" size="sm" className="button-outline-glow w-full sm:w-auto">Download</Button>
                          </Link>
                        </div>
                        {(file.supportedVersions.length > 0 || file.supportedLoaders.length > 0) && (
                          <div className="mt-3 pt-3 border-t border-border/20 flex flex-col sm:flex-row gap-3 items-start">
                            {file.supportedVersions.length > 0 && (
                              <div className="flex-1 min-w-0">
                                <label className="text-xs text-muted-foreground block mb-1">Compatible Versions:</label>
                                <Select defaultValue={file.supportedVersions[0]?.id}>
                                  <SelectTrigger className="w-full sm:w-auto h-8 text-xs rounded-md">
                                    <SelectValue placeholder="Select version" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {file.supportedVersions.map(vTag => (
                                      <SelectItem key={vTag.id} value={vTag.id} className="text-xs">{vTag.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                            {file.supportedLoaders.length > 0 && (
                              <div className="flex-1 min-w-0">
                                 <label className="text-xs text-muted-foreground block mb-1">Compatible Loaders:</label>
                                <Select defaultValue={file.supportedLoaders[0]?.id}>
                                  <SelectTrigger className="w-full sm:w-auto h-8 text-xs rounded-md">
                                    <SelectValue placeholder="Select loader" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {file.supportedLoaders.map(lTag => (
                                      <SelectItem key={lTag.id} value={lTag.id} className="text-xs">{lTag.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                  {resource.files.length === 0 && <p className="text-muted-foreground p-4 text-center">No files available for this resource.</p>}
                </TabsContent>
                <TabsContent value="requirements">
                  {resource.requirements ? (
                     <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-line leading-relaxed" dangerouslySetInnerHTML={{ __html: resource.requirements.replace(/\n/g, '<br />') }}/>
                  ) : (
                    <p className="text-muted-foreground p-4 text-center">No specific requirements listed for this resource.</p>
                  )}
                </TabsContent>
                <TabsContent value="changelog">
                  {resource.changelog ? (
                     <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-line leading-relaxed" dangerouslySetInnerHTML={{ __html: resource.changelog.replace(/\n/g, '<br />') }} />
                  ) : (
                    <p className="text-muted-foreground p-4 text-center">No changelog available for this resource.</p>
                  )}
                </TabsContent>
                <TabsContent value="comments">
                  <p className="text-muted-foreground p-4 text-center">Comments are coming soon! Share your thoughts and feedback in the future.</p>
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
        <section className="pt-8 mt-8 border-t border-border/30">
          <h2 className="text-2xl font-semibold mb-6 text-center text-primary">Related Resources</h2>
           <Carousel 
            itemsToShow={3} 
            showArrows={relatedResources.length > 3}
            autoplay={true}
            autoplayInterval={6000}
            className="px-2"
          >
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

export const revalidate = 3600;
