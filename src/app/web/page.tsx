
import { getWebItemsWithDetails } from '@/lib/data';
import type { ItemWithDetails } from '@/lib/types';
import { WebPageClientLoader } from './WebPageClientLoader';

export default async function WebPage() {
  const webItemsWithDetails: ItemWithDetails[] = await getWebItemsWithDetails();
  return (
    <WebPageClientLoader initialItems={webItemsWithDetails} />
  );
}

export const revalidate = 3600;
