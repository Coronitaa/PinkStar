
export interface Author {
  id: string;
  name: string;
  avatarUrl?: string;
}

export type TagType = 'version' | 'loader' | 'genre' | 'platform' | 'misc' | 'channel' | 'framework' | 'language' | 'tooling' | 'app-category' | 'art-style' | 'music-genre';

export interface Tag {
  id: string;
  name: string;
  type: TagType;
  color?: string;
  textColor?: string;
}

export interface ResourceFile {
  id:string;
  name: string;
  url: string;
  size: string;
  supportedVersions: Tag[];
  supportedLoaders: Tag[];
  channel?: Tag;
  date?: string;
}

export interface ResourceLinks {
  discord?: string;
  wiki?: string;
  issues?: string;
  source?: string;
  projectUrl?: string; // For direct link to a web project, app store, etc.
}

export interface ChangelogEntry {
  id: string;
  versionName: string;
  date: string;
  notes: string;
  relatedFileId?: string;
  gameVersionTag?: Tag;
  channelTag?: Tag;
  loaderTags?: Tag[];
}

export type ItemType = 'game' | 'web' | 'app' | 'art-music';

export interface BaseItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  bannerUrl: string;
  iconUrl: string;
  tags?: Tag[];
  createdAt?: string;
  updatedAt?: string;
  itemType: ItemType;
  projectUrl?: string; // For Web, App, ArtMusic to link externally if needed from ItemCard
}

export interface Game extends BaseItem {
  itemType: 'game';
}

export interface WebItem extends BaseItem {
  itemType: 'web';
  technologies?: Tag[]; // e.g., React, Next.js, Firebase
}

export interface AppItem extends BaseItem {
  itemType: 'app';
  platforms?: Tag[]; // e.g., iOS, Android, Web
}

export interface ArtMusicItem extends BaseItem {
  itemType: 'art-music';
  artistName?: string;
  medium?: Tag; // e.g., Digital Painting, Sculpture, Electronic Music
}

// GenericListItem can be any of the specific item types
export type GenericListItem = Game | WebItem | AppItem | ArtMusicItem;

export interface ItemStats {
  totalResources: number;
  totalDownloads?: number; // Downloads might not apply to all types
  totalViews?: number;    // Views might be more generic
  totalFollowers: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentItemSlug?: string; // Slug of the game, web project, etc. this category belongs to
  parentItemType?: ItemType; // Type of the parent item
}

export interface Resource {
  id: string;
  name: string;
  slug: string;
  parentItemName: string;
  parentItemSlug: string;
  parentItemType: ItemType; // 'game', 'web', 'app', 'art-music'
  categoryName: string;
  categorySlug: string;
  imageUrl: string;
  imageGallery?: string[];
  author: Author;
  tags: Tag[];
  downloads: number; // Or perhaps 'interactions' if more generic
  createdAt: string;
  updatedAt: string;
  version: string;
  description: string;
  detailedDescription: string;
  files: ResourceFile[];
  requirements?: string;
  changelogEntries?: ChangelogEntry[];
  searchScore?: number;
  rating?: number;
  reviewCount?: number;
  followers?: number;
  links?: ResourceLinks;
}


export interface GetResourcesParams {
  parentItemSlug?: string;
  parentItemType?: ItemType;
  categorySlug?: string;
  tags?: string[];
  searchQuery?: string;
  sortBy?: 'relevance' | 'downloads' | 'updatedAt' | 'name';
  page?: number;
  limit?: number;
  minScore?: number;
}

export interface PaginatedResourcesResponse {
  resources: Resource[];
  total: number;
  hasMore: boolean;
}

// For the main listing pages (games, web, apps, art-music)
export interface ItemWithDetails extends GenericListItem {
  categories: Category[]; // Top categories to display on the item card
  stats: ItemStats;
}

