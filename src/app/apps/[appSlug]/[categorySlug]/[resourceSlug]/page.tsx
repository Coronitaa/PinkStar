
import { notFound } from 'next/navigation';
import { getResourceBySlug, getResources, getAvailableFilterTags, getActiveCodeHighlightTheme } from '@/lib/data';
import { ResourcePageContent } from '@/components/resource/ResourcePageContent';

interface AppResourcePageProps {
  params: Promise<{
    appSlug: string;
    categorySlug: string;
    resourceSlug: string;
  }>;
}

export default async function AppResourcePage({ params: paramsPromise }: AppResourcePageProps) {
  const params = await paramsPromise;
  const resource = await getResourceBySlug(params.resourceSlug);

  if (!resource || resource.parentItemType !== 'app' || resource.parentItemSlug !== params.appSlug || resource.categorySlug !== params.categorySlug) {
    notFound();
  }

  const [
    { resources: relatedResources },
    filterTagGroups,
    activeTheme,
  ] = await Promise.all([
    getResources({
      parentItemSlug: resource.parentItemSlug,
      parentItemType: resource.parentItemType,
      categorySlug: resource.categorySlug,
      limit: 6,
    }),
    getAvailableFilterTags(resource.parentItemSlug, resource.parentItemType, resource.categorySlug),
    getActiveCodeHighlightTheme(),
  ]);
  const filteredRelated = relatedResources.filter(r => r.id !== resource.id).slice(0, 5);

  return (
    <ResourcePageContent
      resource={resource}
      relatedResources={filteredRelated}
      initialFilterTagGroups={filterTagGroups}
      initialActiveTheme={activeTheme}
    />
  );
}
