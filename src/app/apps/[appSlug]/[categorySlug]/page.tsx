
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAppItemBySlug, getCategoryDetails, getResources, getAvailableFilterTags, getCategoriesForItemGeneric } from '@/lib/data';
import type { AppItem, Category, ItemType, DynamicAvailableFilterTags } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layers, PlusCircle, TabletSmartphone } from 'lucide-react';
import { CategoryPageContent } from '@/components/shared/CategoryPageContent';
import { cn } from '@/lib/utils';

const RESOURCES_PER_PAGE = 20;
const MAX_VISIBLE_CATEGORY_TABS = 5;

interface AppCategoryPageParams { appSlug: string; categorySlug: string };
interface AppCategoryPageSearchParams { [key: string]: string | string[] | undefined };

interface AppCategoryPageProps {
  params: Promise<AppCategoryPageParams>;
  searchParams: Promise<AppCategoryPageSearchParams>;
}

type SortByType = 'relevance' | 'updatedAt' | 'name';

export default async function AppCategoryPage({ params: paramsPromise, searchParams: searchParamsPromise }: AppCategoryPageProps) {
  const params = await paramsPromise;
  const searchParams = await searchParamsPromise;

  const appItem = await getAppItemBySlug(params.appSlug);
  if (!appItem) {
    notFound();
  }
  const itemType: ItemType = 'app';

  // ── Step 1: category + allCategories in parallel ───────────────────────────
  const [currentCategory, allItemCategories] = await Promise.all([
    getCategoryDetails(params.appSlug, itemType, params.categorySlug),
    getCategoriesForItemGeneric(appItem.id, itemType),
  ]);

  if (!currentCategory) {
    notFound();
  }

  const activeTagFilters: string[] = [];
  Object.keys(searchParams).forEach(key => {
    if (key !== 'q' && key !== 'sort' && searchParams[key]) {
      const value = searchParams[key];
      if (typeof value === 'string') {
        activeTagFilters.push(value);
      }
    }
  });

  const searchQuery = typeof searchParams.q === 'string' ? searchParams.q : undefined;
  const defaultSort = searchQuery ? 'relevance' : 'updatedAt';
  const sortBy = (typeof searchParams.sort === 'string' ? searchParams.sort : defaultSort) as SortByType;

  // ── Step 2: resources + filterTags in parallel ─────────────────────────────
  const [
    { resources: initialResources, total: initialTotal, hasMore: initialHasMore },
    dynamicAvailableFilterGroups,
  ] = await Promise.all([
    getResources({
      parentItemSlug: params.appSlug,
      parentItemType: itemType,
      categorySlug: params.categorySlug,
      selectedTagIds: activeTagFilters.length > 0 ? activeTagFilters : undefined,
      searchQuery,
      sortBy,
      page: 1,
      limit: RESOURCES_PER_PAGE,
    }),
    getAvailableFilterTags(params.appSlug, itemType, params.categorySlug),
  ]);

  const visibleCategories = allItemCategories.length > MAX_VISIBLE_CATEGORY_TABS
    ? allItemCategories.slice(0, MAX_VISIBLE_CATEGORY_TABS)
    : allItemCategories;
  const showMoreCategoriesButton = allItemCategories.length > MAX_VISIBLE_CATEGORY_TABS;

  return (
    <div className="space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="/apps">Apps</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href={`/apps/${appItem.slug}`}>{appItem.name}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{currentCategory.name}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <CategoryPageContent
        initialResources={initialResources}
        initialHasMore={initialHasMore}
        initialTotal={initialTotal}
        itemSlug={params.appSlug}
        itemType={itemType}
        categorySlug={params.categorySlug}
        dynamicAvailableFilterGroups={dynamicAvailableFilterGroups}
        itemName={appItem.name}
        categoryName={currentCategory.name}
        allItemCategories={allItemCategories}
        currentCategory={currentCategory}
        parentItemName={appItem.name}
        parentItemSlug={appItem.slug}
        maxVisibleCategoryTabs={MAX_VISIBLE_CATEGORY_TABS}
      />
    </div>
  );
}

export const revalidate = 3600;
