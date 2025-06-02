
import { getAppItemsWithDetails } from '@/lib/data';
import type { ItemWithDetails } from '@/lib/types';
import { AppsPageClientLoader } from './AppsPageClientLoader';

export default async function AppsPage() {
  const appItemsWithDetails: ItemWithDetails[] = await getAppItemsWithDetails();
  return (
    <AppsPageClientLoader initialItems={appItemsWithDetails} />
  );
}

export const revalidate = 3600;
