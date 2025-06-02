
import { auth } from '@/lib/firebase/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Sidebar, SidebarProvider, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarTrigger, SidebarContent, SidebarInset, SidebarFooter } from '@/components/ui/sidebar';
import { Home, Package, Users, Settings, BarChart3, LogOut, ShieldAlert } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { SignOutButton } from './auth/SignOutButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth(); // Get the session
  // Updated admin check to use role
  if (!session?.user || session.user.role !== 'admin') {
    redirect('/api/auth/signin?callbackUrl=/admin'); // Redirect to sign-in if not admin
  }

  const userInitial = session.user.name?.charAt(0).toUpperCase() || 'A';

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r border-sidebar-border text-sidebar-foreground bg-sidebar">
        <SidebarHeader className="p-4">
          <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
            <Logo />
            <SidebarTrigger className="md:hidden" />
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2 flex-1">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin" tooltip="Dashboard">
                <Home />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin/projects" tooltip="Projects">
                <Package />
                <span>Projects</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin/users" tooltip="Users">
                <Users />
                <span>Users</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin/analytics" tooltip="Analytics">
                <BarChart3 />
                <span>Analytics</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="/admin/moderation" tooltip="Moderation">
                <ShieldAlert />
                <span>Moderation</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin/settings" tooltip="Settings">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-sidebar-border">
           <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
             <Avatar className="h-9 w-9">
                <AvatarImage src={session.user.image ?? undefined} alt={session.user.name ?? "User"} />
                <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
            <div className="flex-1 group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{session.user.name}</p>
                <p className="text-xs text-sidebar-foreground/70 truncate">{session.user.email}</p>
            </div>
          </div>
          <SignOutButton className="w-full mt-3 justify-start group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-2">
            <LogOut />
            <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
          </SignOutButton>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="p-4 border-b flex items-center gap-2 md:hidden sticky top-0 bg-background z-10">
            <SidebarTrigger/>
            <Logo />
        </header>
        <div className="flex-1 p-6 overflow-y-auto">
         {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
