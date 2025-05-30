import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { Gamepad2, Code, TabletSmartphone, Music, Settings, User } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Logo />
        <nav className="ml-6 flex items-center space-x-3 lg:space-x-4">
          <Link href="/games" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors flex items-center">
            <Gamepad2 className="h-4 w-4 mr-1.5" /> Games
          </Link>
          <Link href="/web" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors flex items-center">
            <Code className="h-4 w-4 mr-1.5" /> Web
          </Link>
          <Link href="/apps" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors flex items-center">
            <TabletSmartphone className="h-4 w-4 mr-1.5" /> Apps
          </Link>
          <Link href="/art-music" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors flex items-center">
            <Music className="h-4 w-4 mr-1.5" /> Art & Music
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {/* Example: User/Settings buttons */}
          {/* <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button> */}
        </div>
      </div>
    </header>
  );
}
