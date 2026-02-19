import { useState } from 'react';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface YouTubeLiteEmbedProps {
    videoId: string;
    title?: string;
    className?: string;
    style?: React.CSSProperties;
}

export function YouTubeLiteEmbed({ videoId, title = 'Play Video', className, style }: YouTubeLiteEmbedProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    if (isLoaded) {
        return (
            <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={cn("w-full h-full", className)}
                style={style}
            />
        );
    }

    return (
        <div
            className={cn("relative w-full h-full cursor-pointer group bg-black overflow-hidden", className)}
            style={style}
            onClick={() => setIsLoaded(true)}
            role="button"
            aria-label={`Play video: ${title}`}
        >
            {/* Thumbnail */}
            <img
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                alt={title}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                loading="lazy"
            />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <Play className="w-8 h-8 text-white fill-current ml-1" />
                </div>
            </div>
        </div>
    );
}
