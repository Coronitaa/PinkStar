
import Link from 'next/link';
import Image from 'next/image';
import type { Game, Category } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TagBadge } from '@/components/shared/TagBadge';
import { Package, Download, Palette, Layers } from 'lucide-react';

interface GameCardProps {
  game: Game;
  categories: Category[];
  stats: {
    totalResources: number;
    totalDownloads: number;
  };
}

const MAX_CATEGORIES_DISPLAY = 2;

export function GameCard({ game, categories, stats }: GameCardProps) {
  return (
    <Link href={`/games/${game.slug}`} className="block group">
      <Card className="flex flex-col overflow-hidden h-full bg-card/80 backdrop-blur-sm shadow-xl hover:shadow-primary/40 transition-all duration-300 ease-in-out border-border/30 hover:border-primary/50 transform hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="block relative aspect-[16/9] overflow-hidden">
            <Image
              src={game.bannerUrl}
              alt={`${game.name} banner`}
              layout="fill"
              objectFit="cover"
              className="group-hover:scale-105 transition-transform duration-300 ease-in-out"
              data-ai-hint="game art wallpaper"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/70 via-card/30 to-transparent group-hover:from-card/50 transition-all duration-300"></div>
          </div>
        </CardHeader>
        <CardContent className="p-5 flex-grow">
          <div className="flex items-center mb-3">
            <Image 
              src={game.iconUrl} 
              alt={`${game.name} icon`} 
              width={48} 
              height={48} 
              className="rounded-lg mr-4 border-2 border-primary/50 shadow-md"
              data-ai-hint="game icon logo"
            />
            <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                {game.name}
            </CardTitle>
          </div>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 h-10">{game.description}</p>
          
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-primary mb-1 flex items-center"><Layers className="w-3.5 h-3.5 mr-1.5" /> Categories</h4>
            {categories.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {categories.slice(0, MAX_CATEGORIES_DISPLAY).map(cat => (
                  <TagBadge 
                    key={cat.id} 
                    tag={{ name: cat.name, id: cat.id, type: 'misc' }} 
                    className="text-xs bg-secondary hover:bg-secondary/80"
                  />
                ))}
                {categories.length > MAX_CATEGORIES_DISPLAY && (
                  <Badge variant="outline" className="text-xs border-accent/50 text-accent">
                    +{categories.length - MAX_CATEGORIES_DISPLAY} more
                  </Badge>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No categories yet.</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-5 pt-0 border-t border-border/20">
          <div className="flex justify-between items-center w-full text-sm text-muted-foreground">
            <div className="flex items-center" title="Total Resources">
              <Package className="w-4 h-4 mr-1.5 text-accent" />
              <span>{stats.totalResources.toLocaleString()} Resources</span>
            </div>
            <div className="flex items-center" title="Total Downloads">
              <Download className="w-4 h-4 mr-1.5 text-accent" />
              <span>{stats.totalDownloads.toLocaleString()} Downloads</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
