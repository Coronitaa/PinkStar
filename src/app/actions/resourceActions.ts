
'use server';

import { getResources, getBestMatchResourcesForCategory as getBestMatchResourcesData } from '@/lib/data';
import type { GetResourcesParams, PaginatedResourcesResponse, Resource } from '@/lib/types';

export async function fetchPaginatedResourcesAction(
  params: GetResourcesParams
): Promise<PaginatedResourcesResponse> {
  // Ensure page and limit are numbers and have defaults
  const page = typeof params.page === 'number' ? params.page : 1;
  const limit = typeof params.limit === 'number' ? params.limit : 20; // Default limit to 20
  
  const result = await getResources({ ...params, page, limit });
  return result;
}

export async function fetchBestMatchForCategoryAction(
  gameSlug: string,
  categorySlug: string,
  searchQuery: string,
  limit: number = 3
): Promise<Resource[]> {
  if (!searchQuery.trim()) {
    // Return highlighted if search is empty, or an empty array.
    // For this action, specifically for search, return empty.
    // The client component will handle falling back to highlighted.
    return [];
  }
  return getBestMatchResourcesData(gameSlug, categorySlug, searchQuery, limit);
}
