
'use client';

import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { Gamepad2, Code, TabletSmartphone, Music, User, LogOut, ShieldCheck, Loader2, Settings } from 'lucide-react'; // Added Settings
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export function Header() {
  const { user, isAdmin, signOut, loading } = useAuth();

  const getInitials = (email: string | null | undefined, displayName?: string | null | undefined) => {
    if (displayName) return displayName.substring(0, 2).toUpperCase();
    if (email) return email.substring(0, 2).toUpperCase();
    return 'PS';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Logo />
        <nav className="ml-6 flex items-center space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-4">
          <Button variant="link" asChild className="text-xs sm:text-sm font-medium text-foreground/70 hover:text-foreground transition-colors px-1 sm:px-2">
            <Link href="/games"><Gamepad2 className="h-3.5 w-3.5 mr-1 sm:mr-1.5" /> Games</Link>
          </Button>
          <Button variant="link" asChild className="text-xs sm:text-sm font-medium text-foreground/70 hover:text-foreground transition-colors px-1 sm:px-2">
            <Link href="/web"><Code className="h-3.5 w-3.5 mr-1 sm:mr-1.5" /> Web</Link>
          </Button>
          <Button variant="link" asChild className="text-xs sm:text-sm font-medium text-foreground/70 hover:text-foreground transition-colors px-1 sm:px-2">
            <Link href="/apps"><TabletSmartphone className="h-3.5 w-3.5 mr-1 sm:mr-1.5" /> Apps</Link>
          </Button>
          <Button variant="link" asChild className="text-xs sm:text-sm font-medium text-foreground/70 hover:text-foreground transition-colors px-1 sm:px-2">
            <Link href="/art-music"><Music className="h-3.5 w-3.5 mr-1 sm:mr-1.5" /> Art & Music</Link>
          </Button>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {loading ? (
             <Loader2 className="h-6 w-6 animate-spin text-primary" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    {/* <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || "User"} /> */}
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user.email, user.displayName)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.displayName || user.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {isAdmin ? 'Administrator' : 'User'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" /> {/* Changed Icon */}
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center"> {/* Placeholder link */}
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="flex items-center cursor-pointer text-destructive hover:!text-destructive-foreground focus:!text-destructive-foreground hover:!bg-destructive focus:!bg-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button variant="default" size="sm" asChild className="button-primary-glow">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
