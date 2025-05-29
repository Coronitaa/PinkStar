import type { Tag } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TagBadgeProps {
  tag: Tag;
  className?: string;
}

export function TagBadge({ tag, className }: TagBadgeProps) {
  // Determine badge variant or custom style based on tag type or color
  let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
  if (tag.type === 'version') variant = 'default';
  if (tag.type === 'loader') variant = 'outline';
  
  return (
    <Badge variant={variant} className={cn('text-xs', tag.color, className)}>
      {tag.name}
    </Badge>
  );
}
