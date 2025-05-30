
"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CarouselProps {
  children: React.ReactNode; // Should be an array of CarouselItem
  className?: string;
  autoplay?: boolean;
  autoplayInterval?: number;
  showArrows?: boolean;
  itemsToShow?: number; // For responsiveness, e.g., how many items fit
}

export function Carousel({ 
  children, 
  className, 
  autoplay = false, 
  autoplayInterval = 5000,
  showArrows = true,
  itemsToShow = 3, // Default, can be adjusted via props
}: CarouselProps) {
  const items = React.Children.toArray(children);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const numItems = items.length;

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    if (autoplay && numItems > 1 && numItems > itemsToShow) { // Ensure autoplay only if enough items to scroll
      resetTimeout();
      timeoutRef.current = setTimeout(
        () => setCurrentIndex((prevIndex) => (prevIndex + 1) % (numItems - itemsToShow + 1)), // Adjust for itemsToShow logic
        autoplayInterval
      );
      return () => resetTimeout();
    }
  }, [currentIndex, autoplay, autoplayInterval, numItems, itemsToShow, resetTimeout]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + (numItems - itemsToShow + 1)) % (numItems - itemsToShow + 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % (numItems - itemsToShow + 1));
  };
  
  if (numItems === 0) {
    return <div className={cn("text-muted-foreground text-center py-4", className)}>No items to display.</div>;
  }

  const effectiveShowArrows = showArrows && numItems > itemsToShow;

  return (
    <div className={cn("relative group overflow-visible", className)}> {/* Changed overflow-hidden to overflow-visible */}
      <div 
        className="flex transition-transform duration-700 ease-in-out"
        style={{ 
            width: `${(numItems / itemsToShow) * 100}%`, 
            transform: `translateX(-${(currentIndex * (100 / numItems))}%)` 
        }}
      >
        {items.map((item, index) => (
           <div 
              key={index} 
              className="flex-shrink-0" 
              style={{ width: `${(100 / itemsToShow) / (numItems / itemsToShow)}%` }} 
            > 
             {item}
           </div>
        ))}
      </div>
      {effectiveShowArrows && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/70 hover:bg-background/90"
            onClick={goToPrevious}
            disabled={currentIndex === 0} 
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/70 hover:bg-background/90"
            onClick={goToNext}
            disabled={currentIndex >= numItems - itemsToShow} 
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Next</span>
          </Button>
        </>
      )}
    </div>
  );
}

interface CarouselItemProps {
  children: React.ReactNode;
  className?: string;
}

export function CarouselItem({ children, className }: CarouselItemProps) {
  return (
    <div className={cn("p-1 h-full", className)}> 
      {children}
    </div>
  );
}
