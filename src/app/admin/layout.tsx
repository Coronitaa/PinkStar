
'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, LayoutDashboard, Package, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/Logo';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    // router.replace is better here as it doesn't add to history stack
    // but useEffect is needed for router to be available on initial render
    if (typeof window !== 'undefined') {
        router.replace('/');
    }
    return (
         <div className="flex items-center justify-center min-h-screen">
            <p>Redirecting...</p>
            <Loader2 className="ml-2 h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="sticky top-0 h-screen w-64 bg-background border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <Logo />
          <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          <AdminSidebarLink href="/admin" icon={LayoutDashboard}>Dashboard</AdminSidebarLink>
          <AdminSidebarLink href="/admin/projects" icon={Package}>Projects</AdminSidebarLink>
          {/* Add more admin links here */}
        </nav>
        <div className="p-4 border-t border-border">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href="/"> <Settings className="mr-2 h-4 w-4" />Back to Site</Link>
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}

interface AdminSidebarLinkProps {
  href: string;
  icon: React.ElementType;
  children: ReactNode;
}

function AdminSidebarLink({ href, icon: Icon, children }: AdminSidebarLinkProps) {
  // const pathname = usePathname(); // For active state, if needed
  // const isActive = pathname === href;
  return (
    <Button
      variant="ghost"
      // variant={isActive ? 'secondary' : 'ghost'}
      className="w-full justify-start"
      asChild
    >
      <Link href={href}>
        <Icon className="mr-2 h-4 w-4" />
        {children}
      </Link>
    </Button>
  );
}
