import Link from 'next/link';
import { TabletSmartphone } from 'lucide-react';

export default function AppsPage() {
  return (
    <div className="text-center py-20">
      <TabletSmartphone className="w-16 h-16 text-primary mx-auto mb-6" />
      <h1 className="text-4xl font-bold text-primary mb-4">Innovative Apps</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
        Discover a curated list of applications. This section is coming soon!
      </p>
      <Link href="/" className="text-accent hover:underline font-medium">
        Go back to Home
      </Link>
    </div>
  );
}
