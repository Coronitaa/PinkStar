import Link from 'next/link';
import Image from 'next/image';
import type { Game } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TagBadge } from '@/components/shared/TagBadge';

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden h-full shadow-lg hover:shadow-primary/30 transition-shadow duration-300">
      <CardHeader className="p-0">
        <Link href={`/games/${game.slug}`} className="block relative aspect-[16/9] overflow-hidden">
          <Image
            src={game.bannerUrl}
            alt={`${game.name} banner`}
            layout="fill"
            objectFit="cover"
            className="hover:scale-105 transition-transform duration-300"
            data-ai-hint="game art"
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex items-center mb-2">
          <Image 
            src={game.iconUrl} 
            alt={`${game.name} icon`} 
            width={40} 
            height={40} 
            className="rounded-md mr-3"
            data-ai-hint="game icon"
          />
          <CardTitle className="text-xl font-semibold hover:text-primary">
            <Link href={`/games/${game.slug}`}>
              {game.name}
            </Link>
          </CardTitle>
        </div>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{game.description}</p>
        {game.tags && game.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {game.tags.slice(0, 3).map(tag => (
              <TagBadge key={tag.id} tag={tag} />
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild variant="outline" className="w-full group">
          <Link href={`/games/${game.slug}`}>
            View Game
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
