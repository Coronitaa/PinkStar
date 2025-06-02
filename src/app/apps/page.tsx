
import { getAppItemsWithDetails } from '@/lib/data';
import type { ItemWithDetails } from '@/lib/types';
import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

const AppItemsPageContent = dynamic(
  () => import('./AppItemsPageContent').then(mod => mod.AppItemsPageContent),
  { 
    ssr: false,
    loading: () => <LoadingSpinner text="Loading apps..." />
  }
);

export default async function AppsPage() {
  const appItemsWithDetails: ItemWithDetails[] = await getAppItemsWithDetails();
  return (
    <AppItemsPageContent initialItems={appItemsWithDetails} />
  );
}

export const revalidate = 3600;
