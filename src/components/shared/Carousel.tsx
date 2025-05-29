
"use client";
import type React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
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
    if (autoplay && numItems > 1) {
      resetTimeout();
      timeoutRef.current = setTimeout(
        () => setCurrentIndex((prevIndex) => (prevIndex + 1) % numItems),
        autoplayInterval
      );
      return () => resetTimeout();
    }
  }, [currentIndex, autoplay, autoplayInterval, numItems, resetTimeout]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + numItems) % numItems);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % numItems);
  };
  
  // If there are no items, or fewer than itemsToShow, don't render arrows or complex logic
  if (numItems === 0) {
    return <div className={cn("text-muted-foreground text-center py-4", className)}>No items to display.</div>;
  }

  // Calculate how many actual "pages" or "slides" we have
  const numPages = Math.ceil(numItems / itemsToShow);
  const currentEffectiveIndex = Math.floor(currentIndex / itemsToShow);


  const handleEffectiveNext = () => {
    setCurrentIndex(prev => Math.min((currentEffectiveIndex + 1) * itemsToShow, numItems - itemsToShow));
  };

  const handleEffectivePrevious = () => {
    setCurrentIndex(prev => Math.max((currentEffectiveIndex - 1) * itemsToShow, 0));
  };


  // Adjust visible items logic for actual sliding effect per item
  // The transform will shift the whole track.
  // The width of the track is numItems * (100 / itemsToShow)%
  // The translation is currentIndex * (100 / itemsToShow)%

  if (numItems <= itemsToShow ) { // If not enough items to scroll, or to fill the view, disable arrows and autoplay effectively
     showArrows = false;
     autoplay = false;
  }


  return (
    <div className={cn("relative overflow-hidden group", className)}>
      <div 
        className="flex transition-transform duration-700 ease-in-out"
        style={{ 
            width: `${(numItems / itemsToShow) * 100}%`, // Track width
            transform: `translateX(-${(currentIndex / numItems) * 100}%)` // Slide percentage
        }}
      >
        {items.map((item, index) => (
           <div key={index} className="flex-shrink-0" style={{ width: `${100 / numItems}%`}}> {/* Each item takes its share of the track */}
             {item}
           </div>
        ))}
      </div>
      {showArrows && numItems > itemsToShow && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/70 hover:bg-background/90"
            onClick={goToPrevious}
            disabled={currentIndex === 0 && !autoplay} // Disable if at start and not autoplaying (autoplay handles looping)
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/70 hover:bg-background/90"
            onClick={goToNext}
            disabled={currentIndex >= numItems - itemsToShow && !autoplay} // Disable if at end and not autoplaying
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
  // The width is now controlled by the parent Carousel based on itemsToShow
  return (
    <div className={cn("p-1 h-full", className)}> 
      {children}
    </div>
  );
}
