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
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  // For simplicity, we'll query resources by categoryId instead of listing IDs here
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
  // Categories will be fetched or filtered for a game
}
