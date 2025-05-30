import Link from 'next/link';
import { Music } from 'lucide-react';

export default function ArtMusicPage() {
  return (
    <div className="text-center py-20">
      <Music className="w-16 h-16 text-primary mx-auto mb-6" />
      <h1 className="text-4xl font-bold text-primary mb-4">Art & Music Showcase</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
        Immerse yourself in stunning visuals and captivating sounds. Coming soon!
      </p>
      <Link href="/" className="text-accent hover:underline font-medium">
        Go back to Home
      </Link>
    </div>
  );
}
