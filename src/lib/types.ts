export interface Author {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Tag {
  id: string;
  name: string;
  type: 'version' | 'loader' | 'genre' | 'platform' | 'misc';
  color?: string; // Hex color for badge background, if needed
}

export interface ResourceFile {
  id: string;
  name: string;
  url: string;
  size: string; // e.g., "1.2 MB"
  version: string;
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
  version: string; // Main version of this resource metadata
  description: string; // Short summary
  detailedDescription: string; // Markdown or rich text
  files: ResourceFile[];
  requirements?: string; // For the new "Requirements" tab
  changelog?: string; // For the new "Changelog" tab
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

export interface GetResourcesFilters {
  gameSlug?: string;
  categorySlug?: string;
  tags?: string[];
  searchQuery?: string;
  sortBy?: 'relevance' | 'downloads' | 'updatedAt' | 'name';
  page?: number;
  limit?: number;
}
