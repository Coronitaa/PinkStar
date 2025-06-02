
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { PlusCircle, Search, Filter, Edit, Trash2, Eye, ChevronDown, ChevronUp, MoreHorizontal, Package, Code, TabletSmartphone, Music, Gamepad2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { GenericListItem, ItemType, Tag } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { formatTimeAgo, formatNumberWithSuffix } from '@/lib/data'; // Assuming formatTimeAgo is available and works client-side
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


interface AdminProjectsTableProps {
  initialItems: GenericListItem[];
}

type SortableColumn = 'name' | 'itemType' | 'createdAt' | 'updatedAt' | 'id';
type SortDirection = 'asc' | 'desc';

const ItemTypeIcon: React.FC<{ type: ItemType }> = ({ type }) => {
  switch (type) {
    case 'game': return <Gamepad2 className="w-4 h-4 text-purple-400" />;
    case 'web': return <Code className="w-4 h-4 text-sky-400" />;
    case 'app': return <TabletSmartphone className="w-4 h-4 text-emerald-400" />;
    case 'art-music': return <Music className="w-4 h-4 text-amber-400" />;
    default: return <Package className="w-4 h-4 text-muted-foreground" />;
  }
};

const ITEMS_PER_PAGE = 10;

export function AdminProjectsTable({ initialItems }: AdminProjectsTableProps) {
  const [items, setItems] = useState<GenericListItem[]>(initialItems);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterItemType, setFilterItemType] = useState<ItemType | 'all'>('all');
  
  const [sortBy, setSortBy] = useState<SortableColumn>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const [currentPage, setCurrentPage] = useState(1);

  const [lastUpdatedAtTimes, setLastUpdatedAtTimes] = useState<Record<string, string>>({});

  useEffect(() => {
    const newTimes: Record<string, string> = {};
    initialItems.forEach(item => {
      if (item.updatedAt) {
        newTimes[item.id] = formatTimeAgo(item.updatedAt);
      }
    });
    setLastUpdatedAtTimes(newTimes);
  }, [initialItems]);


  const filteredAndSortedItems = useMemo(() => {
    let processedItems = items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterItemType === 'all' || item.itemType === filterItemType;
      return matchesSearch && matchesType;
    });

    processedItems.sort((a, b) => {
      let valA, valB;
      switch (sortBy) {
        case 'name':
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
          break;
        case 'itemType':
          valA = a.itemType.toLowerCase();
          valB = b.itemType.toLowerCase();
          break;
        case 'createdAt':
          valA = new Date(a.createdAt || 0).getTime();
          valB = new Date(b.createdAt || 0).getTime();
          break;
        case 'updatedAt':
          valA = new Date(a.updatedAt || 0).getTime();
          valB = new Date(b.updatedAt || 0).getTime();
          break;
        default: // id
          valA = a.id.toLowerCase();
          valB = b.id.toLowerCase();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return processedItems;
  }, [items, searchTerm, filterItemType, sortBy, sortDirection]);
  
  const totalPages = Math.ceil(filteredAndSortedItems.length / ITEMS_PER_PAGE);
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedItems, currentPage]);


  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItemIds(new Set(paginatedItems.map(item => item.id)));
    } else {
      setSelectedItemIds(new Set());
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    const newSet = new Set(selectedItemIds);
    if (checked) {
      newSet.add(itemId);
    } else {
      newSet.delete(itemId);
    }
    setSelectedItemIds(newSet);
  };
  
  const requestSort = (column: SortableColumn) => {
    if (sortBy === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const SortIndicator: React.FC<{ column: SortableColumn }> = ({ column }) => {
    if (sortBy !== column) return null;
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />;
  };

  const getBasePath = (itemType: ItemType): string => {
    switch (itemType) {
      case 'game': return '/games';
      case 'web': return '/web';
      case 'app': return '/apps';
      case 'art-music': return '/art-music';
      default: return '/';
    }
  };


  return (
    <div className="space-y-4">
       <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search items by name or ID..." 
                className="pl-9 text-sm" 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
             <Select value={filterItemType} onValueChange={(value) => {setFilterItemType(value as ItemType | 'all'); setCurrentPage(1);}}>
              <SelectTrigger className="w-full sm:w-auto text-sm min-w-[150px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="game">Game</SelectItem>
                <SelectItem value="web">Web Project</SelectItem>
                <SelectItem value="app">Application</SelectItem>
                <SelectItem value="art-music">Art/Music</SelectItem>
              </SelectContent>
            </Select>
        </div>
      
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedItemIds.size > 0 && selectedItemIds.size === paginatedItems.length}
                  onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                  aria-label="Select all items on this page"
                />
              </TableHead>
              <TableHead className="w-[80px]">Icon</TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => requestSort('name')}>
                <div className="flex items-center">Name <SortIndicator column="name" /></div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => requestSort('itemType')}>
                 <div className="flex items-center">Type <SortIndicator column="itemType" /></div>
              </TableHead>
              <TableHead className="hidden md:table-cell cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => requestSort('id')}>
                <div className="flex items-center">ID <SortIndicator column="id" /></div>
              </TableHead>
              <TableHead className="hidden lg:table-cell cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => requestSort('updatedAt')}>
                <div className="flex items-center">Last Updated <SortIndicator column="updatedAt" /></div>
              </TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.length > 0 ? paginatedItems.map((item) => (
              <TableRow key={item.id} data-state={selectedItemIds.has(item.id) ? "selected" : ""}>
                <TableCell>
                  <Checkbox
                    checked={selectedItemIds.has(item.id)}
                    onCheckedChange={(checked) => handleSelectItem(item.id, Boolean(checked))}
                    aria-label={`Select item ${item.name}`}
                  />
                </TableCell>
                <TableCell>
                  <Image src={item.iconUrl} alt={`${item.name} icon`} width={32} height={32} className="rounded-sm object-cover" data-ai-hint={`${item.itemType} icon logo`} />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <ItemTypeIcon type={item.itemType} />
                    <Link href={`${getBasePath(item.itemType)}/${item.slug}`} className="hover:text-primary transition-colors" target="_blank" title={`View ${item.name} on site`}>
                        {item.name}
                    </Link>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1 md:hidden">{item.id}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">{item.itemType.replace('-', ' & ')}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{item.id}</TableCell>
                <TableCell className="hidden lg:table-cell text-xs text-muted-foreground" suppressHydrationWarning>
                  {lastUpdatedAtTimes[item.id] || (item.updatedAt ? formatTimeAgo(item.updatedAt) : 'N/A')}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" /> Edit Item
                      </DropdownMenuItem>
                       <Link href={`${getBasePath(item.itemType)}/${item.slug}`} target="_blank" passHref>
                        <DropdownMenuItem>
                            <ExternalLink className="mr-2 h-4 w-4" /> View on Site
                        </DropdownMenuItem>
                       </Link>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Item
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
                 <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No items match your current filters.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-muted-foreground">
                {selectedItemIds.size} of {filteredAndSortedItems.length} item(s) selected.
                Page {currentPage} of {totalPages}.
            </div>
            <div className="space-x-2">
                <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                >
                Previous
                </Button>
                <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                >
                Next
                </Button>
            </div>
        </div>
      )}
    </div>
  );
}

