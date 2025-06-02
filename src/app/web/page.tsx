
import { getWebItemsWithDetails } from '@/lib/data';
import type { ItemWithDetails } from '@/lib/types';
import { WebItemsPageContent } from './WebItemsPageContent';

export default async function WebPage() {
  const webItemsWithDetails: ItemWithDetails[] = await getWebItemsWithDetails();
  return (
    <WebItemsPageContent initialItems={webItemsWithDetails} />
  );
}

export const revalidate = 3600;
