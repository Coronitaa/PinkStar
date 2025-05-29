import type { Game, Category, Resource, Author, Tag, ResourceFile, GetResourcesParams, PaginatedResourcesResponse } from './types';

const authors: Author[] = [
  { id: 'author1', name: 'CreativeWorks', avatarUrl: 'https://placehold.co/40x40' },
  { id: 'author2', name: 'ModMaster', avatarUrl: 'https://placehold.co/40x40' },
  { id: 'author3', name: 'PixelPerfect', avatarUrl: 'https://placehold.co/40x40' },
];

const commonTags: Record<string, Tag> = {
  v1_19: { id: 'tag1', name: '1.19.X', type: 'version', color: 'bg-blue-500' },
  v1_20: { id: 'tag2', name: '1.20.X', type: 'version', color: 'bg-green-500' },
  v1_21: { id: 'tag10', name: '1.21.X', type: 'version', color: 'bg-purple-500' },
  fabric: { id: 'tag3', name: 'Fabric', type: 'loader', color: 'bg-indigo-500' },
  forge: { id: 'tag4', name: 'Forge', type: 'loader', color: 'bg-orange-500' },
  utility: { id: 'tag5', name: 'Utility', type: 'genre' },
  map: { id: 'tag6', name: 'Map', type: 'genre' },
  texturePack: { id: 'tag7', name: 'Texture Pack', type: 'genre' },
  pc: { id: 'tag8', name: 'PC', type: 'platform' },
  datapack: { id: 'tag9', name: 'Datapack', type: 'genre' },
};

const allResources: Resource[] = [
  {
    id: 'res1', name: 'Ultra Graphics Mod', slug: 'ultra-graphics-mod', gameName: 'PixelVerse Adventures', gameSlug: 'pixelverse-adventures', categoryName: 'Visual Enhancements', categorySlug: 'visual-enhancements', imageUrl: 'https://placehold.co/300x200/E91E63/FFFFFF?text=UltraGFX', author: authors[0], tags: [commonTags.v1_20, commonTags.fabric, commonTags.texturePack, commonTags.pc], downloads: 15000, createdAt: new Date('2023-05-10T10:00:00Z').toISOString(), updatedAt: new Date('2023-08-15T14:30:00Z').toISOString(), version: '2.1.0', description: 'Breathtaking visual overhaul for PixelVerse. Experience the world like never before.', detailedDescription: `...`, files: [{ id: 'file1_1', name: 'ultra-graphics-v2.1.0.jar', url: '#', size: '5.5 MB', version: '2.1.0' }], requirements: 'Requires Fabric API.', changelog: `...`,
  },
  {
    id: 'res2', name: 'Advanced Minimap', slug: 'advanced-minimap', gameName: 'PixelVerse Adventures', gameSlug: 'pixelverse-adventures', categoryName: 'Utilities', categorySlug: 'utilities', imageUrl: 'https://placehold.co/300x200/4CAF50/FFFFFF?text=Minimap', author: authors[1], tags: [commonTags.v1_19, commonTags.v1_20, commonTags.fabric, commonTags.forge, commonTags.utility], downloads: 250000, createdAt: new Date('2023-01-20T09:00:00Z').toISOString(), updatedAt: new Date('2023-09-01T11:00:00Z').toISOString(), version: '3.5.2', description: 'Highly customizable minimap with waypoints, entity radar, and biome information.', detailedDescription: `...`, files: [{ id: 'file2_1', name: 'advanced-minimap-v3.5.2-fabric.jar', url: '#', size: '1.2 MB', version: '3.5.2' }],
  },
  {
    id: 'res3', name: 'Skyblock Odyssey Map', slug: 'skyblock-odyssey-map', gameName: 'PixelVerse Adventures', gameSlug: 'pixelverse-adventures', categoryName: 'Maps & Worlds', categorySlug: 'maps-and-worlds', imageUrl: 'https://placehold.co/300x200/2196F3/FFFFFF?text=SkyblockMap', author: authors[2], tags: [commonTags.v1_20, commonTags.map], downloads: 7500, createdAt: new Date('2023-07-01T12:00:00Z').toISOString(), updatedAt: new Date('2023-07-05T18:00:00Z').toISOString(), version: '1.0.0', description: 'A challenging Skyblock adventure.', detailedDescription: `...`, files: [{ id: 'file3_1', name: 'skyblock-odyssey-v1.0.zip', url: '#', size: '10.2 MB', version: '1.0.0' }],
  },
  {
    id: 'res4', name: 'Cosmic Galaxy Pack', slug: 'cosmic-galaxy-pack', gameName: 'Galaxy Explorers', gameSlug: 'galaxy-explorers', categoryName: 'Ship Customization', categorySlug: 'ship-customization', imageUrl: 'https://placehold.co/300x200/9C27B0/FFFFFF?text=CosmicPack', author: authors[0], tags: [commonTags.utility, commonTags.pc], downloads: 9200, createdAt: new Date('2023-06-10T10:00:00Z').toISOString(), updatedAt: new Date('2023-08-25T14:30:00Z').toISOString(), version: '1.5.0', description: 'Stunning ship skins and engine trails.', detailedDescription: `...`, files: [{ id: 'file4_1', name: 'cosmic-galaxy-pack-v1.5.0.pak', url: '#', size: '25.5 MB', version: '1.5.0' }],
  },
  {
    id: 'res5', name: 'Inventory Sorter', slug: 'inventory-sorter', gameName: 'PixelVerse Adventures', gameSlug: 'pixelverse-adventures', categoryName: 'Utilities', categorySlug: 'utilities', imageUrl: 'https://placehold.co/300x200/795548/FFFFFF?text=InvSort', author: authors[1], tags: [commonTags.v1_20, commonTags.v1_21, commonTags.fabric, commonTags.utility], downloads: 120000, createdAt: new Date('2023-03-15T00:00:00Z').toISOString(), updatedAt: new Date('2023-09-10T00:00:00Z').toISOString(), version: '1.8.0', description: 'Automatically sorts inventory and chests.', detailedDescription: `...`, files: [{ id: 'file5_1', name: 'inventory-sorter-v1.8.0.jar', url: '#', size: '0.5 MB', version: '1.8.0' }],
  },
  {
    id: 'res6', name: 'Realistic Textures HD', slug: 'realistic-textures-hd', gameName: 'PixelVerse Adventures', gameSlug: 'pixelverse-adventures', categoryName: 'Visual Enhancements', categorySlug: 'visual-enhancements', imageUrl: 'https://placehold.co/300x200/FF9800/FFFFFF?text=HDTextures', author: authors[2], tags: [commonTags.v1_20, commonTags.v1_21, commonTags.texturePack], downloads: 50000, createdAt: new Date('2023-02-01T00:00:00Z').toISOString(), updatedAt: new Date('2023-07-20T00:00:00Z').toISOString(), version: '4.2.0', description: 'Complete HD texture overhaul.', detailedDescription: `...`, files: [{ id: 'file6_1', name: 'realistic-textures-hd-v4.2.0.zip', url: '#', size: '150 MB', version: '4.2.0' }],
  },
  // Add 20 more dummy resources for PixelVerse Adventures, Utilities category to test pagination
  ...Array.from({ length: 25 }, (_, i) => ({
    id: `res-pv-util-${i + 7}`,
    name: `Utility Mod ${i + 1}`,
    slug: `utility-mod-${i + 1}`,
    gameName: 'PixelVerse Adventures',
    gameSlug: 'pixelverse-adventures',
    categoryName: 'Utilities',
    categorySlug: 'utilities',
    imageUrl: `https://placehold.co/300x200/607D8B/FFFFFF?text=Util-${i + 1}`,
    author: authors[i % 3],
    tags: [commonTags.v1_20, (i % 2 === 0 ? commonTags.fabric : commonTags.forge), commonTags.utility],
    downloads: Math.floor(Math.random() * 10000) + 500,
    createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7).toISOString(),
    version: `1.${i % 5}.0`,
    description: `A handy utility mod number ${i + 1} for everyday tasks.`,
    detailedDescription: `This is Utility Mod ${i + 1}. It helps with various things.`,
    files: [{ id: `file-pv-util-${i+7}`, name: `utility-mod-${i+1}.jar`, url: '#', size: '0.2MB', version: `1.${i % 5}.0` }],
  })),
  {
    id: 'res-pv-map-extra', name: 'PixelVerse Grand Plaza', slug: 'pv-grand-plaza', gameName: 'PixelVerse Adventures', gameSlug: 'pixelverse-adventures', categoryName: 'Maps & Worlds', categorySlug: 'maps-and-worlds', imageUrl: 'https://placehold.co/300x200/2196F3/FFFFFF?text=PVPlaza', author: authors[0], tags: [commonTags.v1_21, commonTags.map], downloads: 1200, createdAt: new Date('2023-10-01T12:00:00Z').toISOString(), updatedAt: new Date('2023-10-05T18:00:00Z').toISOString(), version: '1.0.0', description: 'A large central hub map.', detailedDescription: `...`, files: [{ id: 'file-pv-map-extra', name: 'pv-grand-plaza.zip', url: '#', size: '15.2 MB', version: '1.0.0' }],
  },
];

const games: Game[] = [
  {
    id: 'game1', name: 'PixelVerse Adventures', slug: 'pixelverse-adventures', description: 'An epic block-building adventure.', longDescription: '...', bannerUrl: 'https://placehold.co/1200x400/E91E63/FFFFFF?text=PixelVerse', iconUrl: 'https://placehold.co/100x100/E91E63/FFFFFF?text=PV', tags: [{id: 'gtag1', name: 'Sandbox', type: 'genre'}],
  },
  {
    id: 'game2', name: 'Galaxy Explorers', slug: 'galaxy-explorers', description: 'Command your starship.', longDescription: '...', bannerUrl: 'https://placehold.co/1200x400/9C27B0/FFFFFF?text=Galaxy+Explorers', iconUrl: 'https://placehold.co/100x100/9C27B0/FFFFFF?text=GE', tags: [{id: 'gtag4', name: 'Space Sim', type: 'genre'}],
  },
   {
    id: 'game3', name: 'Kingdoms Collide', slug: 'kingdoms-collide', description: 'Real-time strategy game.', longDescription: '...', bannerUrl: 'https://placehold.co/1200x400/009688/FFFFFF?text=Kingdoms+Collide', iconUrl: 'https://placehold.co/100x100/009688/FFFFFF?text=KC', tags: [{id: 'gtag7', name: 'RTS', type: 'genre'}],
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
  return gameCategories.sort((a, b) => a.name.localeCompare(b.name));
};

export const getCategoryDetails = async (gameSlug: string, categorySlug: string): Promise<Category | undefined> => {
  const gameCategories = await getCategoriesForGame(gameSlug);
  return gameCategories.find(c => c.slug === categorySlug);
};


export const getResources = async (params: GetResourcesParams): Promise<PaginatedResourcesResponse> => {
  let filteredResources = allResources;

  if (params?.gameSlug) {
    filteredResources = filteredResources.filter(r => r.gameSlug === params.gameSlug);
  }
  if (params?.categorySlug) {
    filteredResources = filteredResources.filter(r => r.categorySlug === params.categorySlug);
  }
  
  if (params?.searchQuery) {
    const query = params.searchQuery.toLowerCase();
    filteredResources = filteredResources.filter(r => 
      r.name.toLowerCase().includes(query) || 
      r.description.toLowerCase().includes(query) ||
      r.author.name.toLowerCase().includes(query)
    );
  }

  if (params?.tags && params.tags.length > 0) {
    filteredResources = filteredResources.filter(r =>
      params.tags!.every(tagId => r.tags.some(rt => rt.id === tagId))
    );
  }

  if (params?.sortBy) {
    switch (params.sortBy) {
      case 'downloads':
        filteredResources.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'updatedAt':
        filteredResources.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case 'name':
        filteredResources.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'relevance':
      default:
        filteredResources.sort((a,b) => (b.downloads / 1000) - (a.downloads / 1000) + (new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
        break;
    }
  }
  
  const total = filteredResources.length;
  let paginatedResources = filteredResources;

  if (params?.page && params?.limit) {
    const start = (params.page - 1) * params.limit;
    const end = start + params.limit;
    paginatedResources = filteredResources.slice(start, end);
  }

  return {
    resources: paginatedResources,
    total,
    hasMore: params.page && params.limit ? (params.page * params.limit) < total : false,
  };
};

export const getResourceBySlug = async (slug: string): Promise<Resource | undefined> => {
  return allResources.find(r => r.slug === slug);
};

export const getHighlightedResources = async (gameSlug: string, categorySlug: string, limit: number = 5): Promise<Resource[]> => {
  const { resources } = await getResources({ gameSlug, categorySlug, sortBy: 'downloads', page: 1, limit });
  return resources;
};

export const getAvailableFilterTags = async (gameSlug: string, categorySlug?: string): Promise<{ versions: Tag[], loaders: Tag[] }> => {
  const { resources: allFilteredResources } = await getResources({ gameSlug, categorySlug }); // Fetch all, not paginated for tags
  const versions = new Map<string, Tag>();
  const loaders = new Map<string, Tag>();

  allFilteredResources.forEach(resource => {
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
