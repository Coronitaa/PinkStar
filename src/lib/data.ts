
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
    id: 'res1', name: 'Ultra Graphics Mod', slug: 'ultra-graphics-mod', gameName: 'PixelVerse Adventures', gameSlug: 'pixelverse-adventures', categoryName: 'Visual Enhancements', categorySlug: 'visual-enhancements', imageUrl: 'https://placehold.co/300x200/E91E63/FFFFFF?text=UltraGFX', author: authors[0], tags: [commonTags.v1_20, commonTags.fabric, commonTags.texturePack, commonTags.pc], downloads: 15000, createdAt: new Date('2023-05-10T10:00:00Z').toISOString(), updatedAt: new Date('2023-08-15T14:30:00Z').toISOString(), version: '2.1.0', description: 'Breathtaking visual overhaul for PixelVerse. Experience the world like never before.', detailedDescription: `Ultra Graphics Mod transforms your PixelVerse experience with stunning high-resolution textures, advanced lighting effects, and realistic weather systems. Explore familiar landscapes with a newfound sense of awe and immersion. This mod is optimized for performance while delivering top-tier visuals.\n\nFeatures:\n- 4K Texture Support\n- Dynamic Global Illumination\n- Volumetric Clouds & Fog\n- Enhanced Water Shaders\n- Particle Effect Overhaul`, files: [{ id: 'file1_1', name: 'ultra-graphics-v2.1.0.jar', url: '#', size: '5.5 MB', version: '2.1.0' }], requirements: 'Requires Fabric API and a compatible graphics card (GTX 1060 or equivalent recommended). Ensure you have at least 8GB of RAM allocated to the game.', changelog: `v2.1.0: Added support for PixelVerse v1.20.X, fixed water rendering artifacts.\nv2.0.0: Major visual overhaul, new lighting engine.\nv1.5.2: Performance improvements.`,
  },
  {
    id: 'res2', name: 'Advanced Minimap', slug: 'advanced-minimap', gameName: 'PixelVerse Adventures', gameSlug: 'pixelverse-adventures', categoryName: 'Utilities', categorySlug: 'utilities', imageUrl: 'https://placehold.co/300x200/4CAF50/FFFFFF?text=Minimap', author: authors[1], tags: [commonTags.v1_19, commonTags.v1_20, commonTags.fabric, commonTags.forge, commonTags.utility], downloads: 250000, createdAt: new Date('2023-01-20T09:00:00Z').toISOString(), updatedAt: new Date('2023-09-01T11:00:00Z').toISOString(), version: '3.5.2', description: 'Highly customizable minimap with waypoints, entity radar, and biome information.', detailedDescription: `The Advanced Minimap is an essential tool for any PixelVerse adventurer. It offers a highly configurable on-screen map that displays terrain, entities, and waypoints. \n\nKey Features:\n- Customizable zoom levels and display modes.\n- Unlimited waypoints with color coding and teleportation (if server allows).\n- Entity radar for players, mobs, and items.\n- Biome overlay and chunk grid.\n- Cave mode for underground exploration.`, files: [{ id: 'file2_1', name: 'advanced-minimap-v3.5.2-fabric.jar', url: '#', size: '1.2 MB', version: '3.5.2' }, { id: 'file2_2', name: 'advanced-minimap-v3.5.2-forge.jar', url: '#', size: '1.3 MB', version: '3.5.2' }], requirements: 'Compatible with Fabric or Forge mod loaders. No other dependencies.', changelog: `v3.5.2: Fixed compatibility with latest Forge for 1.20.X.\nv3.5.0: Added cave mode and biome overlay.\nv3.4.0: Improved performance and UI updates.`,
  },
  {
    id: 'res3', name: 'Skyblock Odyssey Map', slug: 'skyblock-odyssey-map', gameName: 'PixelVerse Adventures', gameSlug: 'pixelverse-adventures', categoryName: 'Maps & Worlds', categorySlug: 'maps-and-worlds', imageUrl: 'https://placehold.co/300x200/2196F3/FFFFFF?text=SkyblockMap', author: authors[2], tags: [commonTags.v1_20, commonTags.map], downloads: 7500, createdAt: new Date('2023-07-01T12:00:00Z').toISOString(), updatedAt: new Date('2023-07-05T18:00:00Z').toISOString(), version: '1.0.0', description: 'A challenging Skyblock adventure.', detailedDescription: `Embark on Skyblock Odyssey, a meticulously crafted map that tests your survival skills and creativity. Start on a tiny island with limited resources and expand your world, complete challenges, and discover hidden secrets across multiple floating islands. \n\nIncludes:\n- Custom island designs and progression.\n- Unique challenges and quests.\n- Villager trading system.`, files: [{ id: 'file3_1', name: 'skyblock-odyssey-v1.0.zip', url: '#', size: '10.2 MB', version: '1.0.0' }], requirements: 'PixelVerse Adventures v1.20 or higher. No mods required.', changelog: 'v1.0.0: Initial release.',
  },
  {
    id: 'res4', name: 'Cosmic Galaxy Pack', slug: 'cosmic-galaxy-pack', gameName: 'Galaxy Explorers', gameSlug: 'galaxy-explorers', categoryName: 'Ship Customization', categorySlug: 'ship-customization', imageUrl: 'https://placehold.co/300x200/9C27B0/FFFFFF?text=CosmicPack', author: authors[0], tags: [commonTags.utility, commonTags.pc], downloads: 9200, createdAt: new Date('2023-06-10T10:00:00Z').toISOString(), updatedAt: new Date('2023-08-25T14:30:00Z').toISOString(), version: '1.5.0', description: 'Stunning ship skins and engine trails.', detailedDescription: `Take your starship to the next level with the Cosmic Galaxy Pack! This pack includes a variety of breathtaking ship skins inspired by nebulas, supernovas, and distant galaxies. Also features custom engine trail effects and cockpit decals. \n\nContents:\n- 10 unique ship skins.\n- 5 animated engine trail effects.\n- 3 cockpit decal sets.`, files: [{ id: 'file4_1', name: 'cosmic-galaxy-pack-v1.5.0.pak', url: '#', size: '25.5 MB', version: '1.5.0' }], requirements: 'Galaxy Explorers v2.3 or newer.', changelog: 'v1.5.0: Added 2 new skins and optimized existing textures.\nv1.0.0: Initial release.',
  },
  {
    id: 'res5', name: 'Inventory Sorter', slug: 'inventory-sorter', gameName: 'PixelVerse Adventures', gameSlug: 'pixelverse-adventures', categoryName: 'Utilities', categorySlug: 'utilities', imageUrl: 'https://placehold.co/300x200/795548/FFFFFF?text=InvSort', author: authors[1], tags: [commonTags.v1_20, commonTags.v1_21, commonTags.fabric, commonTags.utility], downloads: 120000, createdAt: new Date('2023-03-15T00:00:00Z').toISOString(), updatedAt: new Date('2023-09-10T00:00:00Z').toISOString(), version: '1.8.0', description: 'Automatically sorts inventory and chests.', detailedDescription: `Tired of messy inventories? The Inventory Sorter mod is here to help! With a single click or configurable hotkey, sort your player inventory or any chest according to predefined rules or custom configurations. Supports item categories, names, and mod-specific sorting. \n\nFeatures:\n- One-click sorting for player inventory and chests.\n- Customizable sorting rules.\n- Hotkey support.\n- Integration with other inventory mods.`, files: [{ id: 'file5_1', name: 'inventory-sorter-v1.8.0.jar', url: '#', size: '0.5 MB', version: '1.8.0' }], requirements: 'Fabric API.', changelog: 'v1.8.0: Added support for PixelVerse 1.21.X. Improved sorting algorithm.\nv1.7.5: Fixed minor bugs with modded items.',
  },
  {
    id: 'res6', name: 'Realistic Textures HD', slug: 'realistic-textures-hd', gameName: 'PixelVerse Adventures', gameSlug: 'pixelverse-adventures', categoryName: 'Visual Enhancements', categorySlug: 'visual-enhancements', imageUrl: 'https://placehold.co/300x200/FF9800/FFFFFF?text=HDTextures', author: authors[2], tags: [commonTags.v1_20, commonTags.v1_21, commonTags.texturePack], downloads: 50000, createdAt: new Date('2023-02-01T00:00:00Z').toISOString(), updatedAt: new Date('2023-07-20T00:00:00Z').toISOString(), version: '4.2.0', description: 'Complete HD texture overhaul.', detailedDescription: `Experience PixelVerse Adventures in stunning high definition with the Realistic Textures HD pack. This pack replaces all default textures with high-resolution, detailed alternatives, bringing a new level of realism to your world. From individual blocks to expansive landscapes, every detail is enhanced. \n\nIncludes:\n- 256x, 128x, and 64x resolution options.\n- Normal and specular maps for PBR effects (with compatible shaders).\n- Connected textures support.`, files: [{ id: 'file6_1', name: 'realistic-textures-hd-v4.2.0_256x.zip', url: '#', size: '150 MB', version: '4.2.0' }, { id: 'file6_2', name: 'realistic-textures-hd-v4.2.0_128x.zip', url: '#', size: '80 MB', version: '4.2.0' }], requirements: 'OptiFine or a similar performance mod recommended for higher resolutions. Compatible with PixelVerse 1.20 and 1.21.', changelog: 'v4.2.0: Updated for 1.21, added new block textures.\nv4.1.0: Improved performance for 256x pack.\nv4.0.0: Initial release for PixelVerse 1.20.',
  },
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
    detailedDescription: `This is Utility Mod ${i + 1}. It helps with various things like item management, information display, or minor gameplay tweaks. It is designed to be lightweight and compatible with most other mods.`,
    files: [{ id: `file-pv-util-${i+7}`, name: `utility-mod-${i+1}.jar`, url: '#', size: '0.2MB', version: `1.${i % 5}.0` }],
    requirements: (i % 2 === 0 ? 'Fabric API' : 'Forge Mod Loader'),
    changelog: `v1.${i % 5}.0: Initial release or minor update.`,
  })),
  {
    id: 'res-pv-map-extra', name: 'PixelVerse Grand Plaza', slug: 'pv-grand-plaza', gameName: 'PixelVerse Adventures', gameSlug: 'pixelverse-adventures', categoryName: 'Maps & Worlds', categorySlug: 'maps-and-worlds', imageUrl: 'https://placehold.co/300x200/2196F3/FFFFFF?text=PVPlaza', author: authors[0], tags: [commonTags.v1_21, commonTags.map], downloads: 1200, createdAt: new Date('2023-10-01T12:00:00Z').toISOString(), updatedAt: new Date('2023-10-05T18:00:00Z').toISOString(), version: '1.0.0', description: 'A large central hub map for servers or exploration.', detailedDescription: `The PixelVerse Grand Plaza is a sprawling map featuring a magnificent central plaza, market stalls, park areas, and connecting pathways. Ideal as a server spawn, a roleplaying hub, or simply a beautiful world to explore. It includes hidden areas and details for dedicated explorers.`, files: [{ id: 'file-pv-map-extra', name: 'pv-grand-plaza.zip', url: '#', size: '15.2 MB', version: '1.0.0' }],
    requirements: 'PixelVerse Adventures v1.21 or higher.',
    changelog: 'v1.0.0: Initial release of the Grand Plaza map.',
  },
   {
    id: 'res-ge-nav', name: 'Advanced Navigation System', slug: 'ge-advanced-navigation', gameName: 'Galaxy Explorers', gameSlug: 'galaxy-explorers', categoryName: 'Gameplay Mechanics', categorySlug: 'gameplay-mechanics', imageUrl: 'https://placehold.co/300x200/FFC107/000000?text=AdvNav', author: authors[1], tags: [commonTags.pc, commonTags.utility], downloads: 18000, createdAt: new Date('2023-04-10T10:00:00Z').toISOString(), updatedAt: new Date('2023-09-05T14:30:00Z').toISOString(), version: '2.2.0', description: 'Overhauls in-ship navigation and targeting.', detailedDescription: 'The Advanced Navigation System (ANS) provides a comprehensive suite of tools for pilots in Galaxy Explorers. Features improved HUD elements, long-range scanners, jump point calculations, and customizable targeting reticles. Makes space travel more intuitive and combat more precise.', files: [{ id: 'file-ge-nav-1', name: 'ge-ans-v2.2.0.pak', url: '#', size: '8.1 MB', version: '2.2.0' }], requirements: 'Galaxy Explorers v2.5+.', changelog: 'v2.2.0: Added new scanner modes. v2.1.0: UI improvements.'
  },
  {
    id: 'res-kc-ai', name: 'Enhanced Tactical AI', slug: 'kc-tactical-ai', gameName: 'Kingdoms Collide', gameSlug: 'kingdoms-collide', categoryName: 'AI & NPCs', categorySlug: 'ai-and-npcs', imageUrl: 'https://placehold.co/300x200/8BC34A/FFFFFF?text=TacticalAI', author: authors[2], tags: [commonTags.pc, commonTags.utility], downloads: 5500, createdAt: new Date('2023-05-20T00:00:00Z').toISOString(), updatedAt: new Date('2023-08-10T00:00:00Z').toISOString(), version: '1.3.0', description: 'Makes enemy and allied AI smarter and more challenging.', detailedDescription: 'Experience more dynamic battles in Kingdoms Collide with the Enhanced Tactical AI mod. Enemy commanders will use more complex strategies, respond better to player actions, and manage their economies more efficiently. Allied AI will also show improved coordination and unit control.', files: [{ id: 'file-kc-ai-1', name: 'kc-eta-v1.3.0.mod', url: '#', size: '3.5 MB', version: '1.3.0' }], requirements: 'Kingdoms Collide v1.8 or newer.', changelog: 'v1.3.0: AI now utilizes flanking maneuvers. v1.2.0: Improved resource management for AI.'
  },
];

const baseGames: Game[] = [
  {
    id: 'game1', name: 'PixelVerse Adventures', slug: 'pixelverse-adventures', description: 'An epic block-building adventure where creativity knows no bounds.', longDescription: 'Dive into PixelVerse Adventures, a sprawling sandbox world where you can build, explore, and survive. Gather resources, craft tools, construct magnificent structures, and battle strange creatures. Whether you prefer peaceful farming or daring dungeon crawls, PixelVerse offers endless possibilities. Regular updates bring new biomes, blocks, and challenges to keep your adventures fresh and exciting.', bannerUrl: 'https://placehold.co/1200x400/D81B60/FFFFFF?text=PixelVerse', iconUrl: 'https://placehold.co/128x128/D81B60/FFFFFF?text=PV', tags: [{id: 'gtag1', name: 'Sandbox', type: 'genre'}, {id: 'gtag2', name: 'Survival', type: 'genre'}, {id: 'gtag3', name: 'Building', type: 'genre'}],
  },
  {
    id: 'game2', name: 'Galaxy Explorers', slug: 'galaxy-explorers', description: 'Command your starship and chart the vast unknown of space.', longDescription: 'Become a legendary captain in Galaxy Explorers! Customize your starship, recruit a loyal crew, and embark on missions across a procedurally generated universe. Engage in thrilling space combat, trade valuable goods, explore mysterious planets, and uncover ancient alien secrets. The galaxy is yours to discover, but beware of pirates and other dangers lurking in the void.', bannerUrl: 'https://placehold.co/1200x400/9C27B0/FFFFFF?text=Galaxy+Explorers', iconUrl: 'https://placehold.co/128x128/9C27B0/FFFFFF?text=GE', tags: [{id: 'gtag4', name: 'Space Sim', type: 'genre'}, {id: 'gtag5', name: 'Exploration', type: 'genre'}, {id: 'gtag6', name: 'Sci-Fi', type: 'genre'}],
  },
   {
    id: 'game3', name: 'Kingdoms Collide', slug: 'kingdoms-collide', description: 'Lead your faction to victory in this epic real-time strategy game.', longDescription: 'Kingdoms Collide is a fast-paced RTS where you command one of several unique factions, each with distinct units, abilities, and playstyles. Gather resources, build your base, amass a powerful army, and outmaneuver your opponents on diverse battlefields. Featuring a single-player campaign, skirmish modes, and competitive multiplayer, strategic depth and quick thinking are key to ruling the lands.', bannerUrl: 'https://placehold.co/1200x400/009688/FFFFFF?text=Kingdoms+Collide', iconUrl: 'https://placehold.co/128x128/009688/FFFFFF?text=KC', tags: [{id: 'gtag7', name: 'RTS', type: 'genre'}, {id: 'gtag8', name: 'Fantasy', type: 'genre'}, {id: 'gtag9', name: 'Multiplayer', type: 'genre'}],
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

// Simulating data fetching delays
const MOCK_DELAY = 50; // 50ms delay
const delayed = <T>(data: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(data), MOCK_DELAY));


export const getGamesBasic = async (): Promise<Game[]> => {
  return delayed(baseGames.map(g => ({...g}))); // Return copies
};

export const getGameBySlug = async (slug: string): Promise<Game | undefined> => {
  const game = baseGames.find(g => g.slug === slug);
  return delayed(game ? {...game} : undefined);
};

export const getGameStats = async (gameSlug: string): Promise<{ totalResources: number; totalDownloads: number }> => {
  const { resources } = await getResources({ gameSlug }); // No pagination for accurate full count
  const totalResources = resources.length;
  const totalDownloads = resources.reduce((sum, resource) => sum + resource.downloads, 0);
  return delayed({ totalResources, totalDownloads });
};

export const getGamesWithDetails = async (): Promise<(Game & { categories: Category[], stats: {totalResources: number, totalDownloads: number} })[]> => {
  const games = await getGamesBasic();
  const gamesWithDetails = await Promise.all(
    games.map(async (game) => {
      const categories = await getCategoriesForGame(game.slug);
      const stats = await getGameStats(game.slug);
      return { ...game, categories, stats };
    })
  );
  return delayed(gamesWithDetails);
};


export const getCategoriesForGame = async (gameSlug: string): Promise<Category[]> => {
  let gameCategoriesConfig: { [key: string]: string[] } = {
    'pixelverse-adventures': ['cat1', 'cat2', 'cat3', 'cat5'],
    'galaxy-explorers': ['cat4', 'cat5', 'cat6'],
    'kingdoms-collide': ['cat2', 'cat5', 'cat6'],
  };

  const categoryIds = gameCategoriesConfig[gameSlug] || [];
  const categories = allCategories
    .filter(cat => categoryIds.includes(cat.id))
    .map(c => ({ ...c, gameSlug })); // Return copies

  return delayed(categories.sort((a, b) => a.name.localeCompare(b.name)));
};

export const getCategoryDetails = async (gameSlug: string, categorySlug: string): Promise<Category | undefined> => {
  const gameCategories = await getCategoriesForGame(gameSlug);
  const category = gameCategories.find(c => c.slug === categorySlug);
  return delayed(category);
};


export const getResources = async (params: GetResourcesParams): Promise<PaginatedResourcesResponse> => {
  let filteredResources = [...allResources]; // Work with a copy

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

  // Default sort by relevance if no sort is specified or if it's 'relevance'
  const sortBy = params?.sortBy || 'relevance';

  switch (sortBy) {
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
      // Example relevance: combination of downloads and recency
      // Adjust weights as needed
      filteredResources.sort((a,b) => {
        const scoreA = (a.downloads / 1000) + (new Date(a.updatedAt).getTime() / (1000 * 60 * 60 * 24 * 30)); // Downloads scaled, recency scaled
        const scoreB = (b.downloads / 1000) + (new Date(b.updatedAt).getTime() / (1000 * 60 * 60 * 24 * 30));
        return scoreB - scoreA;
      });
      break;
  }
  
  const total = filteredResources.length;
  let paginatedResources = filteredResources;

  if (params?.page && params?.limit) {
    const start = (params.page - 1) * params.limit;
    const end = start + params.limit;
    paginatedResources = filteredResources.slice(start, end);
  }

  return delayed({
    resources: paginatedResources,
    total,
    hasMore: params?.page && params?.limit ? (params.page * params.limit) < total : false,
  });
};

export const getResourceBySlug = async (slug: string): Promise<Resource | undefined> => {
  const resource = allResources.find(r => r.slug === slug);
  return delayed(resource ? {...resource} : undefined);
};

export const getHighlightedResources = async (gameSlug: string, categorySlug: string, limit: number = 5): Promise<Resource[]> => {
  const { resources } = await getResources({ gameSlug, categorySlug, sortBy: 'downloads', page: 1, limit });
  return delayed(resources);
};

export const getAvailableFilterTags = async (gameSlug: string, categorySlug?: string): Promise<{ versions: Tag[], loaders: Tag[] }> => {
  // Fetch all resources for the given game/category to accurately determine available tags
  const { resources: allFilteredResources } = await getResources({ gameSlug, categorySlug, limit: 1000 }); // Large limit to get all relevant
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

  return delayed({
    versions: Array.from(versions.values()).sort((a,b) => a.name.localeCompare(b.name)),
    loaders: Array.from(loaders.values()).sort((a,b) => a.name.localeCompare(b.name)),
  });
};
