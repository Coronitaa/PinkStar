
import type { Prisma } from '@prisma/client';
import { PrismaClient, ItemTypeEnum, TagTypeEnum } from '@prisma/client';
import type { Game, Category, Resource, Author, Tag, ResourceFile, GetResourcesParams, PaginatedResourcesResponse, ResourceLinks, ChangelogEntry, WebItem, AppItem, ArtMusicItem, ItemStats, ItemType, ItemWithDetails, GenericListItem, TagType as AppTagType } from './types';
import { formatDistanceToNow } from 'date-fns';

const prisma = new PrismaClient();

console.warn("data.ts: Now using Prisma with SQLite for Games. Other item types and some complex queries still use MOCK DATA or are simplified.");

// --- Mock Data (to be gradually replaced by Prisma calls) ---
const commonTagsMock: Record<string, Tag> = {
  v1_19: { id: 'tag1', name: '1.19.X', type: 'version', color: 'bg-blue-500' },
  v1_20: { id: 'tag2', name: '1.20.X', type: 'version', color: 'bg-green-500' },
  v1_21: { id: 'tag10', name: '1.21.X', type: 'version', color: 'bg-purple-500' },
  fabric: { id: 'tag3', name: 'Fabric', type: 'loader', color: 'bg-indigo-500' },
  forge: { id: 'tag4', name: 'Forge', type: 'loader', color: 'bg-orange-500' },
  neoForge: { id: 'tag13', name: 'NeoForge', type: 'loader', color: 'bg-red-500' },
  v1_20_1: { id: 'tag14', name: '1.20.1', type: 'version', color: 'bg-green-600' },
  v1_20_4: { id: 'tag15', name: '1.20.4', type: 'version', color: 'bg-green-700' },
  datapack: { id: 'tag9', name: 'Datapack', type: 'genre' },
  library: { id: 'tag12', name: 'Library', type: 'misc' },
  utility: { id: 'tag5', name: 'Utility', type: 'genre' },
  map: { id: 'tag6', name: 'Map', type: 'genre' },
  texturePack: { id: 'tag7', name: 'Texture Pack', type: 'genre' },
  enhancement: { id: 'tag11', name: 'Enhancement', type: 'genre' },
  adventure: {id: 'tag-adventure', name: 'Adventure', type: 'genre'},
  strategy: {id: 'tag-strategy', name: 'Strategy', type: 'genre'},
  rpg: {id: 'tag-rpg', name: 'RPG', type: 'genre'},
  simulation: {id: 'tag-simulation', name: 'Simulation', type: 'genre'},
  sandbox: { id: 'tag-sandbox', name: 'Sandbox', type: 'genre' },
  space: { id: 'tag-space', name: 'Space Sim', type: 'genre' },
  rts: { id: 'tag-rts', name: 'RTS', type: 'genre' },
  openWorld: { id: 'tag-openworld', name: 'Open World', type: 'genre' },
  pc: { id: 'tag8', name: 'PC', type: 'platform' },
  multiplayer: {id: 'tag-multiplayer', name: 'Multiplayer', type: 'genre'},
  singleplayer: {id: 'tag-singleplayer', name: 'Singleplayer', type: 'genre'},
  channelRelease: { id: 'tag-ch-release', name: 'Release', type: 'channel', color: 'bg-green-500 border-green-500', textColor: 'text-green-50' },
  channelBeta: { id: 'tag-ch-beta', name: 'Beta', type: 'channel', color: 'bg-sky-500 border-sky-500', textColor: 'text-sky-50' },
  channelAlpha: { id: 'tag-ch-alpha', name: 'Alpha', type: 'channel', color: 'bg-orange-500 border-orange-500', textColor: 'text-orange-50' },
  react: { id: 'tag-react', name: 'React', type: 'framework' },
  nextjs: { id: 'tag-nextjs', name: 'Next.js', type: 'framework' },
  vue: { id: 'tag-vue', name: 'Vue.js', type: 'framework' },
  tailwind: { id: 'tag-tailwind', name: 'TailwindCSS', type: 'tooling' },
  typescript: { id: 'tag-ts', name: 'TypeScript', type: 'language' },
  javascript: { id: 'tag-js', name: 'JavaScript', type: 'language' },
  portfolio: { id: 'tag-portfolio', name: 'Portfolio', type: 'genre'},
  ecommerce: { id: 'tag-ecommerce', name: 'E-commerce', type: 'genre'},
  saas: { id: 'tag-saas', name: 'SaaS', type: 'genre'},
  ios: { id: 'tag-ios', name: 'iOS', type: 'platform' },
  android: { id: 'tag-android', name: 'Android', type: 'platform' },
  flutter: { id: 'tag-flutter', name: 'Flutter', type: 'framework' },
  swift: { id: 'tag-swift', name: 'Swift', type: 'language' },
  kotlin: { id: 'tag-kotlin', name: 'Kotlin', type: 'language' },
  productivity: {id: 'tag-productivity', name: 'Productivity', type: 'app-category'},
  social: {id: 'tag-social', name: 'Social', type: 'app-category'},
  digitalArt: { id: 'tag-digitalart', name: 'Digital Art', type: 'art-style' },
  traditionalArt: { id: 'tag-traditionalart', name: 'Traditional Art', type: 'art-style' },
  electronic: { id: 'tag-electronic', name: 'Electronic', type: 'music-genre' },
  ambient: { id: 'tag-ambient', name: 'Ambient', type: 'music-genre' },
  illustration: { id: 'tag-illustration', name: 'Illustration', type: 'art-style'},
  soundtrack: {id: 'tag-soundtrack', name: 'Soundtrack', type: 'music-genre'}
};

const authorsMock: Author[] = [
  { id: 'author1', name: 'CreativeWorks', avatarUrl: 'https://placehold.co/40x40/D81B60/FFFFFF?text=CW' },
  { id: 'author2', name: 'ModMaster', avatarUrl: 'https://placehold.co/40x40/F48FB1/121212?text=MM' },
  { id: 'author3', name: 'PixelPerfect', avatarUrl: 'https://placehold.co/40x40/880E4F/FFFFFF?text=PP' },
];

const baseWebItemsMock: WebItem[] = [
  {
    id: 'web1', name: 'Profolio X', slug: 'profolio-x', itemType: 'web',
    description: 'A sleek and modern portfolio template for creatives.',
    longDescription: 'Profolio X is a Next.js and Tailwind CSS powered portfolio template...',
    bannerUrl: 'https://placehold.co/1200x400/1E88E5/FFFFFF?text=ProfolioX+Banner', iconUrl: 'https://placehold.co/128x128/1E88E5/FFFFFF?text=PX',
    tags: [commonTagsMock.portfolio, commonTagsMock.react, commonTagsMock.nextjs, commonTagsMock.tailwind],
    technologies: [commonTagsMock.nextjs, commonTagsMock.react, commonTagsMock.tailwind, commonTagsMock.typescript],
    createdAt: new Date('2023-08-10T10:00:00Z').toISOString(), updatedAt: new Date('2024-01-20T11:00:00Z').toISOString(),
    projectUrl: 'https://example.com/profolio-x-demo'
  },
];
const baseAppItemsMock: AppItem[] = [
   {
    id: 'app1', name: 'TaskMaster Pro', slug: 'taskmaster-pro', itemType: 'app',
    description: 'Boost your productivity with this intuitive task manager.',
    longDescription: 'TaskMaster Pro helps you organize your life and work with ease...',
    bannerUrl: 'https://placehold.co/1200x400/FB8C00/FFFFFF?text=TaskMaster+Banner', iconUrl: 'https://placehold.co/128x128/FB8C00/FFFFFF?text=TM',
    tags: [commonTagsMock.productivity, commonTagsMock.ios, commonTagsMock.android],
    platforms: [commonTagsMock.ios, commonTagsMock.android],
    // technologies: [commonTagsMock.flutter, {id: 'tag-dart', name: 'Dart', type: 'language'}], // Prisma needs Tag type for technologies
    createdAt: new Date('2023-03-20T09:00:00Z').toISOString(), updatedAt: new Date('2024-03-05T16:00:00Z').toISOString(),
    projectUrl: 'https://example.com/taskmaster-app'
  },
];
const baseArtMusicItemsMock: ArtMusicItem[] = [
  {
    id: 'art1', name: 'Cybernetic Dreams', slug: 'cybernetic-dreams', itemType: 'art-music',
    description: 'A collection of futuristic digital paintings.',
    artistName: 'Visionary Void',
    longDescription: 'Dive into "Cybernetic Dreams," a series of digital artworks...',
    bannerUrl: 'https://placehold.co/1200x400/6D4C41/FFFFFF?text=Cybernetic+Banner', iconUrl: 'https://placehold.co/128x128/6D4C41/FFFFFF?text=CD',
    tags: [commonTagsMock.digitalArt, commonTagsMock.illustration],
    medium: commonTagsMock.digitalArt,
    createdAt: new Date('2023-10-01T12:00:00Z').toISOString(), updatedAt: new Date('2023-11-15T10:00:00Z').toISOString(),
    projectUrl: 'https://example.com/cybernetic-dreams-gallery'
  },
];
const allCategoriesMock: Category[] = [
  { id: 'cat1', name: 'Visual Enhancements', slug: 'visual-enhancements', parentItemType: 'game', description: 'Mods that improve graphics, textures, and overall visual appeal.' },
  { id: 'cat2', name: 'Utilities', slug: 'utilities', parentItemType: 'game', description: 'Helpful tools and utilities to enhance gameplay convenience.' },
  { id: 'cat3', name: 'Maps & Worlds', slug: 'maps-and-worlds', parentItemType: 'game', description: 'Custom maps, adventure worlds, and new terrains to explore.' },
  { id: 'webcat1', name: 'UI Components', slug: 'ui-components', parentItemType: 'web', description: 'Reusable UI elements and libraries.' },
  { id: 'webcat2', name: 'Boilerplates', slug: 'boilerplates', parentItemType: 'web', description: 'Starter kits and templates for web projects.' },
  { id: 'appcat1', name: 'SDKs & Libraries', slug: 'sdks-libraries', parentItemType: 'app', description: 'Software Development Kits and libraries for app features.' },
  { id: 'artcat1', name: 'Brushes & Presets', slug: 'brushes-presets', parentItemType: 'art-music', description: 'Custom brushes for digital art software, audio presets.' },
];
const allResourcesMock: Resource[] = [
  {
    id: 'res1', name: 'Ultra Graphics Mod', slug: 'ultra-graphics-mod', parentItemName: 'PixelVerse Adventures', parentItemSlug: 'pixelverse-adventures', parentItemType: 'game', categoryName: 'Visual Enhancements', categorySlug: 'visual-enhancements', 
    imageUrl: 'https://placehold.co/600x400/D81B60/FFFFFF?text=UltraGFX+Main',
    imageGallery: [
        'https://placehold.co/800x600/D81B60/FFFFFF?text=UltraGFX+Scene+1',
        'https://placehold.co/800x600/C2185B/FFFFFF?text=UltraGFX+Scene+2',
        'https://placehold.co/800x600/AD1457/FFFFFF?text=UltraGFX+Character',
    ],
    author: authorsMock[0], tags: [commonTagsMock.v1_20, commonTagsMock.fabric, commonTagsMock.texturePack, commonTagsMock.pc, commonTagsMock.enhancement], downloads: 15000, createdAt: new Date('2023-05-10T10:00:00Z').toISOString(), updatedAt: new Date('2023-08-15T14:30:00Z').toISOString(), version: '2.1.0', description: 'Breathtaking visual overhaul for PixelVerse. Experience the world like never before.', detailedDescription: `Ultra Graphics Mod transforms your PixelVerse experience...`, 
    files: [
      { id: 'file1_1', name: 'ultra-graphics-v2.1.0-fabric-1.20.jar', url: '#', size: '5.5 MB', supportedVersions: [commonTagsMock.v1_20], supportedLoaders: [commonTagsMock.fabric], channel: commonTagsMock.channelRelease, date: '2023-08-15T14:30:00Z' },
      { id: 'file1_2', name: 'ultra-graphics-v2.0.0-fabric-1.19.jar', url: '#', size: '5.3 MB', supportedVersions: [commonTagsMock.v1_19], supportedLoaders: [commonTagsMock.fabric], channel: commonTagsMock.channelBeta, date: '2023-07-01T10:00:00Z' }
    ], 
    requirements: 'Requires Fabric API...', 
    changelogEntries: [
      { id: 'cl1-1', versionName: 'Ultra Graphics v2.1.0', date: '2023-08-15T14:30:00Z', notes: 'Added support for PixelVerse v1.20.X...', relatedFileId: 'file1_1' },
    ], rating: 4.8, reviewCount: 285, followers: 1250, links: { discord: 'https://discord.gg/example', wiki: 'https://wiki.example.com/ultragfx' }
  },
];
// --- End of Mock Data ---

// Helper to convert Prisma Tag to AppTagType
function mapPrismaTagToAppTag(prismaTag: Prisma.TagGetPayload<{}>): Tag {
  return {
    id: prismaTag.id,
    name: prismaTag.name,
    type: prismaTag.type.toLowerCase().replace(/_/g, '-') as AppTagType, // Convert enum to string literal type
    color: prismaTag.color ?? undefined,
    textColor: prismaTag.textColor ?? undefined,
  };
}

// Helper to convert Prisma Category to App CategoryType
function mapPrismaCategoryToAppCategory(
  prismaCategory: Prisma.CategoryGetPayload<{}>,
  parentSlug?: string // Needed if not directly on prismaCategory
): Category {
  return {
    id: prismaCategory.id,
    name: prismaCategory.name,
    slug: prismaCategory.slug,
    description: prismaCategory.description ?? undefined,
    parentItemSlug: parentSlug, // This will need to be determined based on which relation was used to fetch it
    parentItemType: prismaCategory.parentItemType.toLowerCase().replace(/_/g, '-') as ItemType,
  };
}

// Helper to convert Prisma Game to App Game type
function mapPrismaGameToAppGame(
  prismaGame: Prisma.GameGetPayload<{ include: { tags: true; categories: true } }>
): Game {
  return {
    id: prismaGame.id,
    name: prismaGame.name,
    slug: prismaGame.slug,
    description: prismaGame.description,
    longDescription: prismaGame.longDescription ?? undefined,
    bannerUrl: prismaGame.bannerUrl,
    iconUrl: prismaGame.iconUrl,
    createdAt: prismaGame.createdAt.toISOString(),
    updatedAt: prismaGame.updatedAt.toISOString(),
    itemType: 'game',
    tags: prismaGame.tags.map(mapPrismaTagToAppTag),
    // categories: prismaGame.categories.map(cat => mapPrismaCategoryToAppCategory(cat, prismaGame.slug)),
  };
}


export const formatNumberWithSuffix = (num: number | undefined | null): string => {
  if (num === undefined || num === null) return '0';
  if (num < 1000) return num.toString();
  const suffixes = ["", "k", "M", "B", "T"];
  const i = Math.floor(Math.log10(Math.abs(num)) / 3);
  if (i >= suffixes.length) return num.toExponential(1);
  const scaledNum = num / Math.pow(1000, i);
  const formattedNum = scaledNum.toFixed(1);
  return formattedNum.endsWith('.0') ? Math.floor(scaledNum) + suffixes[i] : formattedNum + suffixes[i];
};

export const calculateGenericItemSearchScore = (item: GenericListItem, query: string): number => {
  if (!query) return 0;
  const lowerQuery = query.toLowerCase();
  let score = 0;
  if (item.name.toLowerCase().includes(lowerQuery)) score += 10;
  if (item.description.toLowerCase().includes(lowerQuery)) score += 3;
  if (item.tags) item.tags.forEach(tag => { if (tag.name.toLowerCase().includes(lowerQuery)) score += 1; });
  return score;
};

// --- Game Data Functions (using Prisma) ---
export const getGameBySlug = async (slug: string): Promise<Game | undefined> => {
  const game = await prisma.game.findUnique({
    where: { slug },
    include: {
      tags: true,
      // categories: true, // This needs careful handling based on schema
    },
  });
  // return game ? mapPrismaGameToAppGame(game) : undefined;
  if (!game) return undefined;
  // Temp simplified mapping until Category relation is fully fleshed out in Prisma calls
  return {
    id: game.id,
    name: game.name,
    slug: game.slug,
    description: game.description,
    longDescription: game.longDescription ?? undefined,
    bannerUrl: game.bannerUrl,
    iconUrl: game.iconUrl,
    createdAt: game.createdAt.toISOString(),
    updatedAt: game.updatedAt.toISOString(),
    itemType: 'game',
    tags: game.tags.map(mapPrismaTagToAppTag),
  };
};

export const getGamesWithDetails = async (): Promise<ItemWithDetails[]> => {
  const games = await prisma.game.findMany({
    include: {
      tags: true,
      // categories: true, // Placeholder until category fetching per game is defined
      // _count: { select: { resources: true } } // For totalResources
    },
  });

  return Promise.all(games.map(async (game) => {
    // const categories = game.categories.map(cat => mapPrismaCategoryToAppCategory(cat, game.slug));
    const categories = await getCategoriesForItemGeneric(game.slug, 'game'); // Uses MOCK for now
    const stats = await getItemStatsGeneric(game.slug, 'game'); // Uses MOCK for now

    return {
      id: game.id,
      name: game.name,
      slug: game.slug,
      description: game.description,
      longDescription: game.longDescription ?? undefined,
      bannerUrl: game.bannerUrl,
      iconUrl: game.iconUrl,
      createdAt: game.createdAt.toISOString(),
      updatedAt: game.updatedAt.toISOString(),
      itemType: 'game' as ItemType,
      tags: game.tags.map(mapPrismaTagToAppTag),
      categories,
      stats,
    };
  }));
};


// --- Other Item Type Data Functions (still using MOCK DATA) ---
export const getWebItemsWithDetails = async (): Promise<ItemWithDetails[]> => {
  console.warn("getWebItemsWithDetails: Using MOCK DATA.");
  return Promise.all(baseWebItemsMock.map(async (item) => ({
    ...item,
    categories: await getCategoriesForItemGeneric(item.slug, 'web'),
    stats: await getItemStatsGeneric(item.slug, 'web'),
  })));
};
export const getAppItemsWithDetails = async (): Promise<ItemWithDetails[]> => {
  console.warn("getAppItemsWithDetails: Using MOCK DATA.");
   return Promise.all(baseAppItemsMock.map(async (item) => ({
    ...item,
    categories: await getCategoriesForItemGeneric(item.slug, 'app'),
    stats: await getItemStatsGeneric(item.slug, 'app'),
  })));
};
export const getArtMusicItemsWithDetails = async (): Promise<ItemWithDetails[]> => {
  console.warn("getArtMusicItemsWithDetails: Using MOCK DATA.");
  return Promise.all(baseArtMusicItemsMock.map(async (item) => ({
    ...item,
    categories: await getCategoriesForItemGeneric(item.slug, 'art-music'),
    stats: await getItemStatsGeneric(item.slug, 'art-music'),
  })));
};

export const getItemBySlugGeneric = async (slug: string, itemType: ItemType): Promise<GenericListItem | undefined> => {
  console.warn(`getItemBySlugGeneric for ${itemType}: Using MOCK DATA or simplified Prisma for Game.`);
  if (itemType === 'game') return getGameBySlug(slug);
  if (itemType === 'web') return baseWebItemsMock.find(i => i.slug === slug);
  if (itemType === 'app') return baseAppItemsMock.find(i => i.slug === slug);
  if (itemType === 'art-music') return baseArtMusicItemsMock.find(i => i.slug === slug);
  return undefined;
};

export const getWebItemBySlug = async (slug: string): Promise<WebItem | undefined> => getItemBySlugGeneric(slug, 'web') as Promise<WebItem | undefined>;
export const getAppItemBySlug = async (slug: string): Promise<AppItem | undefined> => getItemBySlugGeneric(slug, 'app') as Promise<AppItem | undefined>;
export const getArtMusicItemBySlug = async (slug: string): Promise<ArtMusicItem | undefined> => getItemBySlugGeneric(slug, 'art-music') as Promise<ArtMusicItem | undefined>;


export const getAllItemsForAdmin = async (): Promise<GenericListItem[]> => {
  console.warn("getAllItemsForAdmin: Using MOCK DATA and simplified Prisma for Games.");
  const games = await prisma.game.findMany({ include: { tags: true } });
  const mappedGames = games.map(g => ({
    ...g,
    itemType: 'game' as ItemType,
    createdAt: g.createdAt.toISOString(),
    updatedAt: g.updatedAt.toISOString(),
    tags: g.tags.map(mapPrismaTagToAppTag),
  }));
  return [...mappedGames, ...baseWebItemsMock, ...baseAppItemsMock, ...baseArtMusicItemsMock];
};

export const getCategoriesForItemGeneric = async (itemSlug: string, itemType: ItemType): Promise<Category[]> => {
  console.warn(`getCategoriesForItemGeneric for ${itemType}: Using MOCK DATA. Prisma integration pending.`);
  // This needs to be implemented with Prisma, likely by querying Categories linked to the specific itemId.
  // For now, using mock data filtered by parentItemType.
  const itemCategories = allCategoriesMock
    .filter(cat => cat.parentItemType === itemType) 
    .map(c => ({ ...c, parentItemSlug: itemSlug }));
  
  let specificItemCategories: Category[] = [];
   if (itemType === 'game') {
      if (itemSlug === 'pixelverse-adventures' || itemSlug === 'cosmic-frontiers') specificItemCategories = itemCategories.filter(c => ['cat1', 'cat2', 'cat3'].includes(c.id));
      else specificItemCategories = itemCategories.slice(0,2); 
  } else if (itemType === 'web') {
      if (itemSlug === 'profolio-x') specificItemCategories = itemCategories.filter(c => ['webcat1', 'webcat2'].includes(c.id));
      else specificItemCategories = itemCategories.slice(0,2);
  } else if (itemType === 'app') {
      if (itemSlug === 'taskmaster-pro') specificItemCategories = itemCategories.filter(c => ['appcat1'].includes(c.id));
      else specificItemCategories = itemCategories.slice(0,1);
  } else if (itemType === 'art-music') {
       if (itemSlug === 'cybernetic-dreams') specificItemCategories = itemCategories.filter(c => ['artcat1'].includes(c.id));
       else specificItemCategories = itemCategories.slice(0,1);
  }
  return specificItemCategories.sort((a, b) => a.name.localeCompare(b.name));
};

export const getItemStatsGeneric = async (itemSlug: string, itemType: ItemType): Promise<ItemStats> => {
  console.warn(`getItemStatsGeneric for ${itemType}: Using MOCK DATA / simplified Prisma count for Games.`);
   let totalResources = 0;
  if (itemType === 'game') {
    totalResources = await prisma.resource.count({ where: { game: { slug: itemSlug } } });
  } else {
    // Mock for other types until Prisma models are complete
    totalResources = allResourcesMock.filter(r => r.parentItemSlug === itemSlug && r.parentItemType === itemType).length;
  }
  const totalDownloads = allResourcesMock
    .filter(r => r.parentItemSlug === itemSlug && r.parentItemType === itemType)
    .reduce((sum, resource) => sum + (resource.downloads || 0), 0);
  const totalFollowers = Math.floor(Math.random() * 1200) + 50; // Mocked
  const totalViews = itemType !== 'game' ? Math.floor(Math.random() * 5000) + 100 : undefined; // Mocked
  return { totalResources, totalDownloads, totalFollowers, totalViews };
};


export const getCategoryDetails = async (parentItemSlug: string, parentItemType: ItemType, categorySlug: string): Promise<Category | undefined> => {
  console.warn(`getCategoryDetails for ${parentItemType}: Using MOCK DATA. Prisma integration pending.`);
  const itemCategories = await getCategoriesForItemGeneric(parentItemSlug, parentItemType);
  return itemCategories.find(c => c.slug === categorySlug);
};

// --- Resource Data Functions (still mostly MOCK DATA) ---
export const getResources = async (params: GetResourcesParams): Promise<PaginatedResourcesResponse> => {
  console.warn(`getResources: Using MOCK DATA. Prisma integration pending. Params: ${JSON.stringify(params)}`);
  let filteredResources = [...allResourcesMock].map(r => ({...r, searchScore: 0}));

  if (params?.parentItemSlug && params?.parentItemType) {
    filteredResources = filteredResources.filter(r => r.parentItemSlug === params.parentItemSlug && r.parentItemType === params.parentItemType);
  }
  if (params?.categorySlug) {
    filteredResources = filteredResources.filter(r => r.categorySlug === params.categorySlug);
  }
  
  if (params?.searchQuery && params.searchQuery.length > 0) {
    // Basic mock search logic
    const query = params.searchQuery.toLowerCase();
    filteredResources = filteredResources.filter(r => 
      r.name.toLowerCase().includes(query) || 
      r.description.toLowerCase().includes(query) ||
      r.tags.some(t => t.name.toLowerCase().includes(query))
    );
    // Mock relevance sort
    filteredResources.sort((a,b) => a.name.startsWith(query) ? -1 : 1);
  } else {
     // Mock default sort (e.g., downloads)
     filteredResources.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
  }
  
  const total = filteredResources.length;
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const paginatedResources = filteredResources.slice((page - 1) * limit, page * limit);

  return {
    resources: paginatedResources,
    total,
    hasMore: (page * limit) < total,
  };
};

export const getBestMatchForCategoryAction = async (parentItemSlug: string, parentItemType: ItemType, categorySlug: string, searchQuery: string, limit: number = 3): Promise<Resource[]> => {
  console.warn(`getBestMatchForCategoryAction: Using MOCK DATA. Query: ${searchQuery}`);
  if (!searchQuery || searchQuery.length === 0) return [];
  const { resources } = await getResources({ parentItemSlug, parentItemType, categorySlug, searchQuery, sortBy: 'relevance', limit });
  return resources;
};

export const getResourceBySlug = async (slug: string): Promise<Resource | undefined> => {
  console.warn(`getResourceBySlug: Using MOCK DATA. Slug: ${slug}`);
  const resource = allResourcesMock.find(r => r.slug === slug);
  if (resource) {
    const resourceCopy = { ...resource };
    if (resourceCopy.changelogEntries) resourceCopy.changelogEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (resourceCopy.files) resourceCopy.files.sort((a,b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
    return resourceCopy;
  }
  return undefined;
};

export const getHighlightedResources = async (parentItemSlug: string, parentItemType: ItemType, categorySlug: string, limit: number = 5): Promise<Resource[]> => {
  console.warn(`getHighlightedResources: Using MOCK DATA.`);
  const { resources } = await getResources({ parentItemSlug, parentItemType, categorySlug, sortBy: 'downloads', page: 1, limit });
  return resources;
};

export const getAvailableFilterTags = async (parentItemSlug: string, parentItemType: ItemType, categorySlug?: string): Promise<Partial<Record<AppTagType, Tag[]>>> => {
  console.warn(`getAvailableFilterTags: Using MOCK DATA.`);
  const { resources: allFilteredResources } = await getResources({ parentItemSlug, parentItemType, categorySlug, limit: Infinity }); 
  const available: Partial<Record<AppTagType, Tag[]>> = {};
  
  const tagStore: Record<AppTagType, Map<string, Tag>> = {
    'version': new Map(), 'loader': new Map(), 'genre': new Map(), 'platform': new Map(), 'misc': new Map(), 'channel': new Map(),
    'framework': new Map(), 'language': new Map(), 'tooling': new Map(),
    'app-category': new Map(),
    'art-style': new Map(), 'music-genre': new Map()
  };

  allFilteredResources.forEach(resource => {
    resource.tags.forEach(tag => {
      if (tagStore[tag.type] && !tagStore[tag.type].has(tag.id)) {
        tagStore[tag.type].set(tag.id, tag);
      }
    });
    resource.files.forEach(file => {
      if (file.channel && tagStore['channel'] && !tagStore['channel'].has(file.channel.id)) {
        tagStore['channel'].set(file.channel.id, file.channel);
      }
    });
  });

  for (const type in tagStore) {
    if (tagStore[type as AppTagType].size > 0) {
      available[type as AppTagType] = Array.from(tagStore[type as AppTagType].values()).sort((a,b) => a.name.localeCompare(b.name));
    }
  }
  return available;
};

export const formatTimeAgo = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    if (typeof window === 'undefined') return new Date(dateString).toLocaleDateString(); 
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch (error) {
    try { return new Date(dateString).toLocaleDateString(); } 
    catch (fallbackError) { return 'Invalid Date'; }
  }
};
