
'use client';

import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import type { ItemWithDetails } from '@/lib/types';

const GamesPageContent = dynamic(
  () => import('./GamesPageContent').then(mod => mod.GamesPageContent),
  { 
    ssr: false,
    loading: () => <LoadingSpinner text="Loading games..." /> 
  }
);

interface GamesPageClientLoaderProps {
  initialItems: ItemWithDetails[];
}

export function GamesPageClientLoader({ initialItems }: GamesPageClientLoaderProps) {
  return <GamesPageContent initialItems={initialItems} />;
}
