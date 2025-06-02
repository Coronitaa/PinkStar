
'use client';

import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import type { ItemWithDetails } from '@/lib/types';

const AppItemsPageContent = dynamic(
  () => import('./AppItemsPageContent').then(mod => mod.AppItemsPageContent),
  { 
    ssr: false,
    loading: () => <LoadingSpinner text="Loading apps..." />
  }
);

interface AppsPageClientLoaderProps {
  initialItems: ItemWithDetails[];
}

export function AppsPageClientLoader({ initialItems }: AppsPageClientLoaderProps) {
  return <AppItemsPageContent initialItems={initialItems} />;
}
