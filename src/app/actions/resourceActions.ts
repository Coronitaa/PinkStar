
'use server';

import { getResources, getBestMatchResourcesData } from '@/lib/data';
import type { GetResourcesParams, PaginatedResourcesResponse, Resource } from '@/lib/types';

export async function fetchPaginatedResourcesAction(
  params: GetResourcesParams
): Promise<PaginatedResourcesResponse> {
  // Ensure page and limit are numbers and have defaults
  const page = typeof params.page === 'number' ? params.page : 1;
  const limit = typeof params.limit === 'number' ? params.limit : 20; // Default limit to 20
  
  // The searchQuery from params should not be trimmed here, respect client's input
  const result = await getResources({ ...params, page, limit });
  return result;
}

export async function fetchBestMatchForCategoryAction(
  gameSlug: string,
  categorySlug: string,
  searchQuery: string, // Expect raw search query
  limit: number = 3
): Promise<Resource[]> {
  // Do not trim searchQuery here. If it's empty or just spaces, getBestMatchResourcesData handles it.
  // The previous check `if (!searchQuery.trim())` is removed to allow searches with spaces
  // if the underlying data function `getBestMatchResourcesData` is designed to handle them.
  // `getBestMatchResourcesData` now also checks `!searchQuery || searchQuery.length === 0`.
  return getBestMatchResourcesData(gameSlug, categorySlug, searchQuery, limit);
}
