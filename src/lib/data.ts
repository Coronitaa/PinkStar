import type { Game, Category, Resource, Author, Tag, ResourceFile } from './types';

const authors: Author[] = [
  { id: 'author1', name: 'CreativeWorks', avatarUrl: 'https://placehold.co/40x40' },
  { id: 'author2', name: 'ModMaster', avatarUrl: 'https://placehold.co/40x40' },
  { id: 'author3', name: 'PixelPerfect', avatarUrl: 'https://placehold.co/40x40' },
];

const commonTags: Record<string, Tag> = {
  v1_19: { id: 'tag1', name: '1.19.X', type: 'version', color: 'bg-blue-500' },
  v1_20: { id: 'tag2', name: '1.20.X', type: 'version', color: 'bg-green-500' },
  fabric: { id: 'tag3', name: 'Fabric', type: 'loader', color: 'bg-indigo-500' },
  forge: { id: 'tag4', name: 'Forge', type: 'loader', color: 'bg-orange-500' },
  utility: { id: 'tag5', name: 'Utility', type: 'genre' },
  map: { id: 'tag6', name: 'Map', type: 'genre' },
  texturePack: { id: 'tag7', name: 'Texture Pack', type: 'genre' },
  pc: { id: 'tag8', name: 'PC', type: 'platform' },
};

const allResources: Resource[] = [
  {
    id: 'res1',
    name: 'Ultra Graphics Mod',
    slug: 'ultra-graphics-mod',
    gameName: 'PixelVerse Adventures',
    gameSlug: 'pixelverse-adventures',
    categoryName: 'Visual Enhancements',
    categorySlug: 'visual-enhancements',
    imageUrl: 'https://placehold.co/300x200',
    author: authors[0],
    tags: [commonTags.v1_20, commonTags.fabric, commonTags.texturePack, commonTags.pc],
    downloads: 15000,
    createdAt: new Date('2023-05-10T10:00:00Z').toISOString(),
    updatedAt: new Date('2023-08-15T14:30:00Z').toISOString(),
    version: '2.1.0',
    description: 'Breathtaking visual overhaul for PixelVerse. Experience the world like never before.',
    detailedDescription: `
### Transform Your Gameplay!
Ultra Graphics Mod completely revamps the visual experience of PixelVerse Adventures.
- High-resolution textures
- Dynamic lighting and shadows
- Improved particle effects
- Water reflections and caustics

**Compatibility:** Requires Fabric Mod Loader for version 1.20.X. Not compatible with OptiFine.
    `,
    files: [
      { id: 'file1_1', name: 'ultra-graphics-v2.1.0.jar', url: '#', size: '5.5 MB', version: '2.1.0' },
      { id: 'file1_2', name: 'ultra-graphics-v2.0.0.jar', url: '#', size: '5.2 MB', version: '2.0.0' },
    ],
  },
  {
    id: 'res2',
    name: 'Advanced Minimap',
    slug: 'advanced-minimap',
    gameName: 'PixelVerse Adventures',
    gameSlug: 'pixelverse-adventures',
    categoryName: 'Utilities',
    categorySlug: 'utilities',
    imageUrl: 'https://placehold.co/300x200',
    author: authors[1],
    tags: [commonTags.v1_19, commonTags.v1_20, commonTags.fabric, commonTags.forge, commonTags.utility],
    downloads: 250000,
    createdAt: new Date('2023-01-20T09:00:00Z').toISOString(),
    updatedAt: new Date('2023-09-01T11:00:00Z').toISOString(),
    version: '3.5.2',
    description: 'Highly customizable minimap with waypoints, entity radar, and biome information.',
    detailedDescription: `
The Advanced Minimap is an essential tool for any adventurer.
- Real-time map display
- Create and manage waypoints
- Customizable entity radar (players, mobs, items)
- Biome overlay
- Cave mode

Supports both Fabric and Forge.
    `,
    files: [
      { id: 'file2_1', name: 'advanced-minimap-v3.5.2-fabric.jar', url: '#', size: '1.2 MB', version: '3.5.2' },
      { id: 'file2_2', name: 'advanced-minimap-v3.5.2-forge.jar', url: '#', size: '1.3 MB', version: '3.5.2' },
    ],
  },
  {
    id: 'res3',
    name: 'Skyblock Odyssey Map',
    slug: 'skyblock-odyssey-map',
    gameName: 'PixelVerse Adventures',
    gameSlug: 'pixelverse-adventures',
    categoryName: 'Maps & Worlds',
    categorySlug: 'maps-and-worlds',
    imageUrl: 'https://placehold.co/300x200',
    author: authors[2],
    tags: [commonTags.v1_20, commonTags.map],
    downloads: 7500,
    createdAt: new Date('2023-07-01T12:00:00Z').toISOString(),
    updatedAt: new Date('2023-07-05T18:00:00Z').toISOString(),
    version: '1.0.0',
    description: 'A challenging and expansive Skyblock adventure with custom islands and quests.',
    detailedDescription: `
Embark on the Skyblock Odyssey!
- Dozens of unique islands to explore
- Custom quests and challenges
- Unique trading system
- Boss fights

Recommended for 1-4 players.
    `,
    files: [
      { id: 'file3_1', name: 'skyblock-odyssey-v1.0.zip', url: '#', size: '10.2 MB', version: '1.0.0' },
    ],
  },
   {
    id: 'res4',
    name: 'Cosmic Galaxy Pack',
    slug: 'cosmic-galaxy-pack',
    gameName: 'Galaxy Explorers',
    gameSlug: 'galaxy-explorers',
    categoryName: 'Ship Customization',
    categorySlug: 'ship-customization',
    imageUrl: 'https://placehold.co/300x200',
    author: authors[0],
    tags: [commonTags.utility, commonTags.pc],
    downloads: 9200,
    createdAt: new Date('2023-06-10T10:00:00Z').toISOString(),
    updatedAt: new Date('2023-08-25T14:30:00Z').toISOString(),
    version: '1.5.0',
    description: 'A stunning collection of ship skins and engine trails for Galaxy Explorers.',
    detailedDescription: `
### Deck out your starship!
The Cosmic Galaxy Pack offers:
- 20+ unique ship skins
- Animated engine trails
- Custom cockpit UIs

Easy to install and apply in-game.
    `,
    files: [
      { id: 'file4_1', name: 'cosmic-galaxy-pack-v1.5.0.pak', url: '#', size: '25.5 MB', version: '1.5.0' },
    ],
  },
];

const games: Game[] = [
  {
    id: 'game1',
    name: 'PixelVerse Adventures',
    slug: 'pixelverse-adventures',
    description: 'An epic block-building adventure in a vast, procedurally generated world.',
    longDescription: 'Dive into PixelVerse Adventures, where creativity meets exploration. Build magnificent structures, battle fierce monsters, and uncover ancient secrets in a world limited only by your imagination. Features extensive modding support.',
    bannerUrl: 'https://placehold.co/1200x400',
    iconUrl: 'https://placehold.co/100x100',
    tags: [{id: 'gtag1', name: 'Sandbox', type: 'genre'}, {id: 'gtag2', name: 'Survival', type: 'genre'}, {id: 'gtag3', name: 'Building', type: 'genre'}],
  },
  {
    id: 'game2',
    name: 'Galaxy Explorers',
    slug: 'galaxy-explorers',
    description: 'Command your starship and explore the vast unknown of space.',
    longDescription: 'Galaxy Explorers puts you in the captain\'s chair of an advanced starship. Chart unknown systems, trade with alien civilizations, engage in thrilling space combat, and customize your vessel to become a legend of the cosmos.',
    bannerUrl: 'https://placehold.co/1200x400',
    iconUrl: 'https://placehold.co/100x100',
    tags: [{id: 'gtag4', name: 'Space Sim', type: 'genre'}, {id: 'gtag5', name: 'Sci-Fi', type: 'genre'}, {id: 'gtag6', name: 'Exploration', type: 'genre'}],
  },
   {
    id: 'game3',
    name: 'Kingdoms Collide',
    slug: 'kingdoms-collide',
    description: 'A real-time strategy game of medieval warfare and diplomacy.',
    longDescription: 'Forge your empire in Kingdoms Collide. Raise mighty armies, construct impenetrable fortresses, and outmaneuver your rivals on the battlefield and in the courts. Will you rule through conquest or cunning alliances?',
    bannerUrl: 'https://placehold.co/1200x400',
    iconUrl: 'https://placehold.co/100x100',
    tags: [{id: 'gtag7', name: 'RTS', type: 'genre'}, {id: 'gtag8', name: 'Medieval', type: 'genre'}, {id: 'gtag9', name: 'Strategy', type: 'genre'}],
  },
];

// In a real app, categories would be associated with games, perhaps through a join table or nested.
// For this mock, we'll define some global categories and then filter resources by gameId and categoryName/slug.
const categories: Category[] = [
    { id: 'cat1', name: 'Visual Enhancements', slug: 'visual-enhancements', description: 'Mods that improve graphics, textures, and overall visual fidelity.' },
    { id: 'cat2', name: 'Utilities', slug: 'utilities', description: 'Helpful tools, UI improvements, and quality-of-life mods.' },
    { id: 'cat3', name: 'Maps & Worlds', slug: 'maps-and-worlds', description: 'Custom maps, adventure worlds, and new terrains to explore.' },
    { id: 'cat4', name: 'Ship Customization', slug: 'ship-customization', description: 'Skins, parts, and visual upgrades for your starships.' },
    { id: 'cat5', name: 'Gameplay Mechanics', slug: 'gameplay-mechanics', description: 'Mods that alter or add new gameplay features, rules, or systems.' },
    { id: 'cat6', name: 'AI & NPCs', slug: 'ai-and-npcs', description: 'Improvements to enemy AI, new companions, or enhanced NPC interactions.' },
];


export const getGames = async (): Promise<Game[]> => {
  return games;
};

export const getGameBySlug = async (slug: string): Promise<Game | undefined> => {
  return games.find(g => g.slug === slug);
};

export const getCategoriesForGame = async (gameSlug: string): Promise<Category[]> => {
  // This is a simplified mock. In a real app, categories would be linked to games.
  // Here, we'll return a subset of global categories relevant to the game.
  if (gameSlug === 'pixelverse-adventures') {
    return [categories[0], categories[1], categories[2], categories[4]];
  }
  if (gameSlug === 'galaxy-explorers') {
    return [categories[3], categories[4], categories[5]];
  }
  if (gameSlug === 'kingdoms-collide') {
    return [categories[1], categories[4], categories[5]];
  }
  return [];
};

export const getResources = async (filters?: { gameSlug?: string; categorySlug?: string; tags?: string[] }): Promise<Resource[]> => {
  let filteredResources = allResources;
  if (filters?.gameSlug) {
    filteredResources = filteredResources.filter(r => r.gameSlug === filters.gameSlug);
  }
  if (filters?.categorySlug) {
    filteredResources = filteredResources.filter(r => r.categorySlug === filters.categorySlug);
  }
  if (filters?.tags && filters.tags.length > 0) {
    filteredResources = filteredResources.filter(r =>
      filters.tags!.every(tagId => r.tags.some(rt => rt.id === tagId))
    );
  }
  return filteredResources;
};

export const getResourceBySlug = async (slug: string): Promise<Resource | undefined> => {
  return allResources.find(r => r.slug === slug);
};

export const getHighlightedResources = async (gameSlug: string, categorySlug: string, limit: number = 3): Promise<Resource[]> => {
  const categoryResources = allResources.filter(r => r.gameSlug === gameSlug && r.categorySlug === categorySlug);
  // Simple highlight: sort by downloads and take top `limit`
  return categoryResources.sort((a, b) => b.downloads - a.downloads).slice(0, limit);
};

// Helper to get all unique tags for filtering options (e.g., versions, loaders)
export const getAvailableFilterTags = async (gameSlug: string, categorySlug: string): Promise<{ versions: Tag[], loaders: Tag[] }> => {
  const resources = await getResources({ gameSlug, categorySlug });
  const versions = new Map<string, Tag>();
  const loaders = new Map<string, Tag>();

  resources.forEach(resource => {
    resource.tags.forEach(tag => {
      if (tag.type === 'version' && !versions.has(tag.id)) {
        versions.set(tag.id, tag);
      } else if (tag.type === 'loader' && !loaders.has(tag.id)) {
        loaders.set(tag.id, tag);
      }
    });
  });

  return {
    versions: Array.from(versions.values()).sort((a,b) => a.name.localeCompare(b.name)),
    loaders: Array.from(loaders.values()).sort((a,b) => a.name.localeCompare(b.name)),
  };
};
