
'use client';

import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import type { ItemWithDetails } from '@/lib/types';

const WebItemsPageContent = dynamic(
  () => import('./WebItemsPageContent').then(mod => mod.WebItemsPageContent),
  { 
    ssr: false,
    loading: () => <LoadingSpinner text="Loading web projects..." />
  }
);

interface WebPageClientLoaderProps {
  initialItems: ItemWithDetails[];
}

export function WebPageClientLoader({ initialItems }: WebPageClientLoaderProps) {
  return <WebItemsPageContent initialItems={initialItems} />;
}
