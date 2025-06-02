
'use server';

import { getResources, getBestMatchForCategoryAction as getBestMatchForCategoryFromLib } from '@/lib/data';
import type { GetResourcesParams, PaginatedResourcesResponse, Resource, ItemType } from '@/lib/types';

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
  parentItemSlug: string, // Renamed for clarity and consistency
  parentItemType: ItemType, // Added parentItemType
  categorySlug: string,
  searchQuery: string, 
  limit: number = 3
): Promise<Resource[]> {
  // Call the correctly imported and aliased function from lib/data
  return getBestMatchForCategoryFromLib(parentItemSlug, parentItemType, categorySlug, searchQuery, limit);
}

