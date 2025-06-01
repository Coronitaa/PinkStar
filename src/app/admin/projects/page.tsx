
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2, Eye } from 'lucide-react';
import { getGamesWithDetails, getWebItemsWithDetails, getAppItemsWithDetails, getArtMusicItemsWithDetails } from '@/lib/data';
import type { ItemWithDetails, ItemType } from '@/lib/types';

async function getAllItems(): Promise<ItemWithDetails[]> {
  const games = await getGamesWithDetails();
  const web = await getWebItemsWithDetails();
  const apps = await getAppItemsWithDetails();
  const artMusic = await getArtMusicItemsWithDetails();
  return [...games, ...web, ...apps, ...artMusic].sort((a, b) => a.name.localeCompare(b.name));
}

function getItemTypeLabel(itemType: ItemType): string {
  switch (itemType) {
    case 'game': return 'Game';
    case 'web': return 'Web Project';
    case 'app': return 'Application';
    case 'art-music': return 'Art/Music';
    default: return 'Item';
  }
}

export default async function AdminProjectsPage() {
  const allItems = await getAllItems();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Projects</h1>
          <p className="text-muted-foreground">Add, edit, or remove projects from the site.</p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Project
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
          <CardDescription>
            Currently displaying {allItems.length} projects from mock data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No projects found.
                  </TableCell>
                </TableRow>
              )}
              {allItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant={
                      item.itemType === 'game' ? 'default' :
                      item.itemType === 'web' ? 'secondary' :
                      item.itemType === 'app' ? 'outline' : // You might want specific colors
                      'destructive' // For art-music, or adjust
                    }>
                      {getItemTypeLabel(item.itemType)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground truncate max-w-xs">{item.description}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="icon" asChild title="View Project">
                        <Link href={`/${item.itemType === 'art-music' ? 'art-music' : item.itemType + 's'}/${item.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                       <Button variant="ghost" size="icon" asChild title="Edit Project">
                        <Link href={`/admin/projects/edit/${item.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive-foreground hover:bg-destructive" title="Delete Project (UI Only)">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
       <p className="text-sm text-muted-foreground text-center">
        Note: Edit and Delete actions are UI only and do not persist changes without database integration.
      </p>
    </div>
  );
}
