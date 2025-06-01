
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
  tags?: Tag[]; // For project-level tags
  createdAt?: string;
  updatedAt?: string;
  itemType: ItemType;
  projectUrl?: string; // For WebItem, AppItem, ArtMusicItem to link externally if needed from ItemCard
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
  technologies?: Tag[];
}

export interface ArtMusicItem extends BaseItem {
  itemType: 'art-music';
  artistName?: string;
  medium?: Tag; // e.g., Digital Painting, Sculpture, Electronic Music
  technologies?: Tag[];
}

// GenericListItem can be any of the specific item types
export type GenericListItem = Game | WebItem | AppItem | ArtMusicItem;

export interface ItemStats {
  totalResources: number;
  totalDownloads: number; 
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
  order?: number; // For admin panel ordering
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
  tags: Tag[]; // For resource-level tags
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

// For AuthForm
export interface AuthFormSignUpData {
  email: string;
  username: string;
  phoneNumber: string;
  passwordBody: string; // Renamed from password to avoid conflict with AuthFormSignInData if merged
}

export interface AuthFormSignInData {
  identifier: string; // Can be email, username, or phone
  passwordBody: string; // Renamed from password
}

// Merged type for react-hook-form if using one form component with conditional fields
export interface AuthFormData extends Partial<AuthFormSignUpData>, Partial<AuthFormSignInData> {
  // Common fields or make all optional and validate based on mode
  email?: string;
  username?: string;
  phoneNumber?: string;
  identifier?: string;
  passwordBody: string;
}

// For Admin Project Form
export interface ProjectCategoryFormData {
  id: string; // Can be a temp ID for new categories
  name: string;
  slug: string;
  description?: string;
  order: number;
}

export interface ProjectFormData {
  id?: string; // Present if editing
  itemType: ItemType;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  bannerUrl: string;
  iconUrl: string;
  projectUrl?: string;
  tagsString?: string; // Comma-separated tags
  
  // Game specific (already in BaseItem if needed, or add here if distinct for form)
  
  // Web specific
  technologiesString?: string; // Comma-separated

  // App specific
  platformsString?: string; // Comma-separated
  appTechnologiesString?: string; // Comma-separated, to avoid conflict with web technologies

  // Art/Music specific
  artistName?: string;
  mediumId?: string; // ID of the selected medium tag
  artMusicTechnologiesString?: string; // Comma-separated

  authorId?: string; // ID of existing author, or empty for new author
  newAuthorName?: string; // If adding a new author

  categories: ProjectCategoryFormData[];
}

