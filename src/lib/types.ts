

export interface Author {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Tag {
  id: string;
  name: string;
  type: 'version' | 'loader' | 'genre' | 'platform' | 'misc' | 'channel';
  color?: string; // Hex color or Tailwind class for badge background
  textColor?: string; // Optional: Tailwind class for text color if contrast is needed
}

export interface ResourceFile {
  id:string;
  name: string;
  url: string;
  size: string; // e.g., "1.2 MB"
  supportedVersions: Tag[];
  supportedLoaders: Tag[];
  channel?: Tag; // Release, Beta, Alpha etc.
}

export interface ResourceLinks {
  discord?: string;
  wiki?: string;
  issues?: string;
  source?: string; // Example: GitHub, GitLab
}

export interface ChangelogEntry {
  id: string;
  versionName: string; // e.g., "Sodium 0.6.13 for NeoForge 1.21.5"
  date: string; // ISO date string
  notes: string; // Markdown content for the entry
  relatedFileId?: string; // ID of the ResourceFile this changelog entry refers to for download
  gameVersionTag?: Tag; // Specific game version for this entry (e.g., 1.21.5)
  channelTag?: Tag; // e.g., Release, Beta, Alpha
  loaderTags?: Tag[]; // e.g., Fabric, Forge
}

export interface Resource {
  id: string;
  name: string;
  slug: string;
  gameName: string; // To show on resource card if game context is not obvious
  gameSlug: string;
  categoryName: string; // To show on resource card
  categorySlug: string;
  imageUrl: string;
  author: Author;
  tags: Tag[];
  downloads: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  version: string; // Main version of this resource metadata (e.g. of the resource itself, not specific file)
  description: string; // Short summary
  detailedDescription: string; // Markdown or rich text
  files: ResourceFile[];
  requirements?: string; // For the new "Requirements" tab
  changelogEntries?: ChangelogEntry[];
  searchScore?: number; // Optional score for search relevance
  rating?: number; // Optional: 0-5 stars
  followers?: number; // Optional: count of followers
  links?: ResourceLinks; // Optional: links provided by author
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  gameSlug?: string; // To associate category with a game if needed for specific fetches
}

export interface Game {
  id: string;
  name: string;
  slug: string;
  description: string; // Short description for game card
  longDescription?: string; // Longer description for game page
  bannerUrl: string;
  iconUrl: string;
  tags?: Tag[]; // General tags for the game, e.g., "RPG", "Multiplayer"
}

export interface GetResourcesParams {
  gameSlug?: string;
  categorySlug?: string;
  tags?: string[];
  searchQuery?: string;
  sortBy?: 'relevance' | 'downloads' | 'updatedAt' | 'name'; // 'relevance' will now use scoring
  page?: number;
  limit?: number;
  minScore?: number; // Minimum search score to be included
}

export interface PaginatedResourcesResponse {
  resources: Resource[];
  total: number; // Total number of resources matching filters (before pagination)
  hasMore: boolean; // Indicates if there are more resources to load
}
