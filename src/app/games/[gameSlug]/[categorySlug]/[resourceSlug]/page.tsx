
import { notFound } from 'next/navigation';
import { getResourceBySlug, getResources, getAvailableFilterTags, getActiveCodeHighlightTheme } from '@/lib/data';
import { ResourcePageContent } from '@/components/resource/ResourcePageContent';

interface GameResourcePageProps {
  params: Promise<{
    gameSlug: string;
    categorySlug: string;
    resourceSlug: string;
  }>;
}

export default async function GameResourcePage({ params: paramsPromise }: GameResourcePageProps) {
  const params = await paramsPromise;
  const resource = await getResourceBySlug(params.resourceSlug);

  if (!resource || resource.parentItemType !== 'game' || resource.parentItemSlug !== params.gameSlug || resource.categorySlug !== params.categorySlug) {
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
