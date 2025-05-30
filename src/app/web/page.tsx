import Link from 'next/link';
import { Code } from 'lucide-react';

export default function WebPage() {
  return (
    <div className="text-center py-20">
      <Code className="w-16 h-16 text-primary mx-auto mb-6" />
      <h1 className="text-4xl font-bold text-primary mb-4">Web Creations</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
        This section is under construction. Exciting web projects and tools will be featured here soon!
      </p>
      <Link href="/" className="text-accent hover:underline font-medium">
        Go back to Home
      </Link>
    </div>
  );
}
