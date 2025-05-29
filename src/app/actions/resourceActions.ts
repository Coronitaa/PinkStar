
'use server';

import { getResources } from '@/lib/data';
import type { GetResourcesParams, PaginatedResourcesResponse } from '@/lib/types';

export async function fetchPaginatedResourcesAction(
  params: GetResourcesParams
): Promise<PaginatedResourcesResponse> {
  // Ensure page and limit are numbers and have defaults
  const page = typeof params.page === 'number' ? params.page : 1;
  const limit = typeof params.limit === 'number' ? params.limit : 20; // Default limit to 20
  
  const result = await getResources({ ...params, page, limit });
  return result;
}
