
import { PlusCircle, Search, Filter, Edit, Trash2, Eye, ChevronDown, ChevronUp, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getAllItemsForAdmin, formatTimeAgo } from '@/lib/data';
import type { GenericListItem, ItemType } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { AdminProjectsTable } from './AdminProjectsTable';

export const metadata = {
  title: 'Manage Projects - PinkStar Admin',
};

// This is a Server Component, data fetching happens here
export default async function AdminProjectsPage() {
  const allItems: GenericListItem[] = await getAllItemsForAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Projects</h1>
          <p className="text-muted-foreground">
            View, edit, and manage all items (games, web projects, apps, art/music).
          </p>
        </div>
        <Button className="button-primary-glow">
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Item
        </Button>
      </div>

      <Card className="shadow-lg border-border/40">
        <CardHeader className="pb-4">
          <CardTitle>All Items ({allItems.length})</CardTitle>
          <CardDescription>Browse and manage the entire catalog of items on PinkStar.</CardDescription>
          <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search items by name or ID..." className="pl-9 text-sm" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <AdminProjectsTable initialItems={allItems} />
        </CardContent>
      </Card>
    </div>
  );
}

// This will remain a Server Component, and AdminProjectsTable will be a Client Component.
