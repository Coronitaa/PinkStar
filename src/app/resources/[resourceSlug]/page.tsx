
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getResourceBySlug, getResources } from '@/lib/data';
import type { Resource, ItemType } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResourceInfoSidebar } from '@/components/resource/ResourceInfoSidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResourceFilesTabContent } from '@/components/resource/ResourceFilesTabContent';
import { FileText, BookOpen, ListChecks, MessageCircle, Eye, Star } from 'lucide-react'; // Changed Heart to Star
import { Carousel, CarouselItem } from '@/components/shared/Carousel';
import { ResourceCard } from '@/components/resource/ResourceCard';

interface ResourcePageProps {
  params: { resourceSlug: string };
  searchParams?: { tab?: string };
}

const getItemTypeSectionPathAndName = (itemType: ItemType): { path: string; name: string } => {
  switch (itemType) {
    case 'game': return { path: '/games', name: 'Games' };
    case 'web': return { path: '/web', name: 'Web Projects' };
    case 'app': return { path: '/apps', name: 'Apps' };
    case 'art-music': return { path: '/art-music', name: 'Art & Music' };
    default: return { path: '/', name: 'Projects' }; 
  }
};


export default async function ResourcePage({ params, searchParams }: ResourcePageProps) {
  const resource = await getResourceBySlug(params.resourceSlug);
  if (!resource) {
    notFound();
  }

  const { resources: allResourcesInParentCategory } = await getResources({
    parentItemSlug: resource.parentItemSlug,
    parentItemType: resource.parentItemType,
    categorySlug: resource.categorySlug,
    limit: 6 
  });

  const relatedResources = allResourcesInParentCategory
    .filter(r => r.id !== resource.id)
    .slice(0, 5);

  const defaultTab = searchParams?.tab || "overview";

  const parentItemSection = getItemTypeSectionPathAndName(resource.parentItemType);
  const parentItemPath = `${parentItemSection.path}/${resource.parentItemSlug}`;
  const parentCategoryPath = `${parentItemPath}/${resource.categorySlug}`;


  return (
    <div className="space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href={parentItemSection.path}>{parentItemSection.name}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href={parentItemPath}>{resource.parentItemName}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href={parentCategoryPath}>{resource.categoryName}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{resource.name}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="lg:grid lg:grid-cols-12 lg:gap-12">
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
                  <Star className="w-4 h-4 mr-2 text-accent" /> Follow {/* Changed Heart to Star */}
                </Button>
              </div>

              <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4 bg-card-foreground/5 rounded-md">
                  <TabsTrigger value="overview" id="overview-tab"><Eye className="w-4 h-4 mr-1 sm:mr-2" />Overview</TabsTrigger>
                  <TabsTrigger value="files" id="files-tab"><FileText className="w-4 h-4 mr-1 sm:mr-2" />Files</TabsTrigger>
                  <TabsTrigger value="requirements" id="requirements-tab"><ListChecks className="w-4 h-4 mr-1 sm:mr-2" />Requirements</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <div
                    className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none prose-headings:text-primary prose-a:text-accent hover:prose-a:text-accent/80 whitespace-pre-line leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: resource.detailedDescription.replace(/\n/g, '<br />') }}
                  />
                </TabsContent>
                <TabsContent value="files">
                  {resource.files && resource.files.length > 0 ? (
                    <ResourceFilesTabContent
                        files={resource.files}
                        allChangelogEntries={resource.changelogEntries || []}
                        resourceSlug={resource.slug}
                    />
                  ) : (
                    <p className="text-muted-foreground p-4 text-center">No files available for this resource.</p>
                  )}
                </TabsContent>
                <TabsContent value="requirements">
                  {resource.requirements ? (
                     <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-line leading-relaxed" dangerouslySetInnerHTML={{ __html: resource.requirements.replace(/\n/g, '<br />') }}/>
                  ) : (
                    <p className="text-muted-foreground p-4 text-center">No specific requirements listed for this resource.</p>
                  )}
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
