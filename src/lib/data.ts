import type { Game, Category, Resource, Author, Tag, ResourceFile, GetResourcesFilters } from './types';

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
    imageUrl: 'https://placehold.co/300x200/E91E63/FFFFFF?text=UltraGFX',
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
    requirements: 'Requires Fabric API. Recommended: 8GB RAM.',
    changelog: `
v2.1.0:
- Added support for new biome lighting.
- Fixed water transparency issues.
v2.0.0:
- Initial release for 1.20.X.
    `,
  },
  {
    id: 'res2',
    name: 'Advanced Minimap',
    slug: 'advanced-minimap',
    gameName: 'PixelVerse Adventures',
    gameSlug: 'pixelverse-adventures',
    categoryName: 'Utilities',
    categorySlug: 'utilities',
    imageUrl: 'https://placehold.co/300x200/4CAF50/FFFFFF?text=Minimap',
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
    requirements: 'None.',
    changelog: `
v3.5.2:
- Performance improvements for entity radar.
- Fixed waypoint sharing bug.
    `,
  },
  {
    id: 'res3',
    name: 'Skyblock Odyssey Map',
    slug: 'skyblock-odyssey-map',
    gameName: 'PixelVerse Adventures',
    gameSlug: 'pixelverse-adventures',
    categoryName: 'Maps & Worlds',
    categorySlug: 'maps-and-worlds',
    imageUrl: 'https://placehold.co/300x200/2196F3/FFFFFF?text=Skyblock',
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
    imageUrl: 'https://placehold.co/300x200/9C27B0/FFFFFF?text=CosmicPack',
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
    requirements: 'Base game Galaxy Explorers v1.2+.',
  },
  {
    id: 'res5',
    name: 'Inventory Sorter',
    slug: 'inventory-sorter',
    gameName: 'PixelVerse Adventures',
    gameSlug: 'pixelverse-adventures',
    categoryName: 'Utilities',
    categorySlug: 'utilities',
    imageUrl: 'https://placehold.co/300x200/795548/FFFFFF?text=InvSort',
    author: authors[1],
    tags: [commonTags.v1_20, commonTags.fabric, commonTags.utility],
    downloads: 120000,
    createdAt: new Date('2023-03-15T00:00:00Z').toISOString(),
    updatedAt: new Date('2023-09-10T00:00:00Z').toISOString(),
    version: '1.8.0',
    description: 'Automatically sorts your inventory and chests with a single click or keybind.',
    detailedDescription: 'Tired of messy inventories? This mod adds smart sorting to keep everything organized. Highly configurable.',
    files: [{ id: 'file5_1', name: 'inventory-sorter-v1.8.0.jar', url: '#', size: '0.5 MB', version: '1.8.0' }],
    requirements: 'Fabric API.',
    changelog: 'v1.8.0: Added compatibility with locked slots.\nv1.7.5: Improved sorting logic for tools.'
  },
  {
    id: 'res6',
    name: 'Realistic Textures HD',
    slug: 'realistic-textures-hd',
    gameName: 'PixelVerse Adventures',
    gameSlug: 'pixelverse-adventures',
    categoryName: 'Visual Enhancements',
    categorySlug: 'visual-enhancements',
    imageUrl: 'https://placehold.co/300x200/FF9800/FFFFFF?text=HDTextures',
    author: authors[2],
    tags: [commonTags.v1_20, commonTags.texturePack],
    downloads: 50000,
    createdAt: new Date('2023-02-01T00:00:00Z').toISOString(),
    updatedAt: new Date('2023-07-20T00:00:00Z').toISOString(),
    version: '4.2.0',
    description: 'A complete high-definition texture overhaul for PixelVerse. Supports PBR.',
    detailedDescription: 'Experience PixelVerse in stunning detail with these 128x resolution textures. Includes PBR maps for compatible shaders.',
    files: [{ id: 'file6_1', name: 'realistic-textures-hd-v4.2.0.zip', url: '#', size: '150 MB', version: '4.2.0' }],
  }
];

const games: Game[] = [
  {
    id: 'game1',
    name: 'PixelVerse Adventures',
    slug: 'pixelverse-adventures',
    description: 'An epic block-building adventure in a vast, procedurally generated world.',
    longDescription: 'Dive into PixelVerse Adventures, where creativity meets exploration. Build magnificent structures, battle fierce monsters, and uncover ancient secrets in a world limited only by your imagination. Features extensive modding support.',
    bannerUrl: 'https://placehold.co/1200x400/E91E63/FFFFFF?text=PixelVerse',
    iconUrl: 'https://placehold.co/100x100/E91E63/FFFFFF?text=PV',
    tags: [{id: 'gtag1', name: 'Sandbox', type: 'genre'}, {id: 'gtag2', name: 'Survival', type: 'genre'}, {id: 'gtag3', name: 'Building', type: 'genre'}],
  },
  {
    id: 'game2',
    name: 'Galaxy Explorers',
    slug: 'galaxy-explorers',
    description: 'Command your starship and explore the vast unknown of space.',
    longDescription: 'Galaxy Explorers puts you in the captain\'s chair of an advanced starship. Chart unknown systems, trade with alien civilizations, engage in thrilling space combat, and customize your vessel to become a legend of the cosmos.',
    bannerUrl: 'https://placehold.co/1200x400/9C27B0/FFFFFF?text=Galaxy+Explorers',
    iconUrl: 'https://placehold.co/100x100/9C27B0/FFFFFF?text=GE',
    tags: [{id: 'gtag4', name: 'Space Sim', type: 'genre'}, {id: 'gtag5', name: 'Sci-Fi', type: 'genre'}, {id: 'gtag6', name: 'Exploration', type: 'genre'}],
  },
   {
    id: 'game3',
    name: 'Kingdoms Collide',
    slug: 'kingdoms-collide',
    description: 'A real-time strategy game of medieval warfare and diplomacy.',
    longDescription: 'Forge your empire in Kingdoms Collide. Raise mighty armies, construct impenetrable fortresses, and outmaneuver your rivals on the battlefield and in the courts. Will you rule through conquest or cunning alliances?',
    bannerUrl: 'https://placehold.co/1200x400/009688/FFFFFF?text=Kingdoms+Collide',
    iconUrl: 'https://placehold.co/100x100/009688/FFFFFF?text=KC',
    tags: [{id: 'gtag7', name: 'RTS', type: 'genre'}, {id: 'gtag8', name: 'Medieval', type: 'genre'}, {id: 'gtag9', name: 'Strategy', type: 'genre'}],
  },
];

const allCategories: Category[] = [
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
  const gameCategories: Category[] = [];
  if (gameSlug === 'pixelverse-adventures') {
    gameCategories.push(...[allCategories[0], allCategories[1], allCategories[2], allCategories[4]].map(c => ({...c, gameSlug})));
  }
  if (gameSlug === 'galaxy-explorers') {
    gameCategories.push(...[allCategories[3], allCategories[4], allCategories[5]].map(c => ({...c, gameSlug})));
  }
  if (gameSlug === 'kingdoms-collide') {
    gameCategories.push(...[allCategories[1], allCategories[4], allCategories[5]].map(c => ({...c, gameSlug})));
  }
  return gameCategories;
};

export const getCategoryDetails = async (gameSlug: string, categorySlug: string): Promise<Category | undefined> => {
  const gameCategories = await getCategoriesForGame(gameSlug);
  return gameCategories.find(c => c.slug === categorySlug);
};


export const getResources = async (filters?: GetResourcesFilters): Promise<Resource[]> => {
  let filteredResources = allResources;

  if (filters?.gameSlug) {
    filteredResources = filteredResources.filter(r => r.gameSlug === filters.gameSlug);
  }
  if (filters?.categorySlug) {
    filteredResources = filteredResources.filter(r => r.categorySlug === filters.categorySlug);
  }
  
  if (filters?.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filteredResources = filteredResources.filter(r => 
      r.name.toLowerCase().includes(query) || 
      r.description.toLowerCase().includes(query) ||
      r.author.name.toLowerCase().includes(query)
    );
  }

  if (filters?.tags && filters.tags.length > 0) {
    filteredResources = filteredResources.filter(r =>
      filters.tags!.every(tagId => r.tags.some(rt => rt.id === tagId))
    );
  }

  if (filters?.sortBy) {
    switch (filters.sortBy) {
      case 'downloads':
        filteredResources.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'updatedAt':
        filteredResources.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case 'name':
        filteredResources.sort((a, b) => a.name.localeCompare(b.name));
        break;
      // 'relevance' could be more complex, for now, it's the default order or could be download-based
      case 'relevance':
      default:
         // Example: weight downloads heavily, then update date
        filteredResources.sort((a,b) => (b.downloads / 1000) - (a.downloads / 1000) + (new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
        break;
    }
  }
  
  // Pagination (simple slice)
  // if (filters?.page && filters?.limit) {
  //   const start = (filters.page - 1) * filters.limit;
  //   const end = start + filters.limit;
  //   filteredResources = filteredResources.slice(start, end);
  // }


  return filteredResources;
};

export const getResourceBySlug = async (slug: string): Promise<Resource | undefined> => {
  return allResources.find(r => r.slug === slug);
};

export const getHighlightedResources = async (gameSlug: string, categorySlug: string, limit: number = 5): Promise<Resource[]> => {
  const categoryResources = allResources.filter(r => r.gameSlug === gameSlug && r.categorySlug === categorySlug);
  return categoryResources.sort((a, b) => b.downloads - a.downloads).slice(0, limit);
};

export const getAvailableFilterTags = async (gameSlug: string, categorySlug?: string): Promise<{ versions: Tag[], loaders: Tag[] }> => {
  // If categorySlug is provided, filter resources by that category first. Otherwise, use all resources for the game.
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
