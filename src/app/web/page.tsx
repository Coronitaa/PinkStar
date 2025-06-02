
import { getWebItemsWithDetails } from '@/lib/data';
import type { ItemWithDetails } from '@/lib/types';
import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

const WebItemsPageContent = dynamic(
  () => import('./WebItemsPageContent').then(mod => mod.WebItemsPageContent),
  { 
    ssr: false,
    loading: () => <LoadingSpinner text="Loading web projects..." />
  }
);

export default async function WebPage() {
  const webItemsWithDetails: ItemWithDetails[] = await getWebItemsWithDetails();
  return (
    <WebItemsPageContent initialItems={webItemsWithDetails} />
  );
}

export const revalidate = 3600;
