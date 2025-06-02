
import { getGamesWithDetails } from '@/lib/data';
import type { ItemWithDetails } from '@/lib/types';
import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

const GamesPageContent = dynamic(
  () => import('./GamesPageContent').then(mod => mod.GamesPageContent),
  { 
    ssr: false, // Consider if SSR is beneficial or if client-side rendering is fine
    loading: () => <LoadingSpinner text="Loading games..." /> 
  }
);

export default async function GamesPage() {
  const gamesWithDetails: ItemWithDetails[] = await getGamesWithDetails();
  return (
    <GamesPageContent initialItems={gamesWithDetails} />
  );
}

export const revalidate = 3600;
