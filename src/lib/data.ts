
import type { Game, Category, Resource, Author, Tag, ResourceFile, GetResourcesParams, PaginatedResourcesResponse, ResourceLinks, ChangelogEntry } from './types';
import { formatDistanceToNow } from 'date-fns';

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
  enhancement: { id: 'tag11', name: 'Enhancement', type: 'genre' },
  library: { id: 'tag12', name: 'Library', type: 'misc' },
  neoForge: { id: 'tag13', name: 'NeoForge', type: 'loader', color: 'bg-red-500' },
  v1_20_1: { id: 'tag14', name: '1.20.1', type: 'version', color: 'bg-green-600' },
  v1_20_4: { id: 'tag15', name: '1.20.4', type: 'version', color: 'bg-green-700' },
  channelRelease: { id: 'tag-ch-release', name: 'Release', type: 'channel', color: 'bg-green-500 border-green-500', textColor: 'text-green-50' },
  channelBeta: { id: 'tag-ch-beta', name: 'Beta', type: 'channel', color: 'bg-sky-500 border-sky-500', textColor: 'text-sky-50' },
  channelAlpha: { id: 'tag-ch-alpha', name: 'Alpha', type: 'channel', color: 'bg-orange-500 border-orange-500', textColor: 'text-orange-50' },
  adventure: {id: 'tag-adventure', name: 'Adventure', type: 'genre'},
  strategy: {id: 'tag-strategy', name: 'Strategy', type: 'genre'},
  rpg: {id: 'tag-rpg', name: 'RPG', type: 'genre'},
  simulation: {id: 'tag-simulation', name: 'Simulation', type: 'genre'},
  multiplayer: {id: 'tag-multiplayer', name: 'Multiplayer', type: 'genre'},
  singleplayer: {id: 'tag-singleplayer', name: 'Singleplayer', type: 'genre'},
  sandbox: { id: 'tag-sandbox', name: 'Sandbox', type: 'genre' },
  space: { id: 'tag-space', name: 'Space Sim', type: 'genre' },
  rts: { id: 'tag-rts', name: 'RTS', type: 'genre' },
  openWorld: { id: 'tag-openworld', name: 'Open World', type: 'genre' },
};

const baseGames: Game[] = [
  {
    id: 'game1',
    name: 'PixelVerse Adventures',
    slug: 'pixelverse-adventures',
    description: 'An epic sandbox adventure in a blocky world.',
    longDescription: 'PixelVerse Adventures is a sprawling open-world sandbox game where creativity and exploration know no bounds. Build magnificent structures, embark on daring quests, discover hidden dungeons, and team up with friends in a vibrant, procedurally generated universe. With regular updates and a thriving community, there\'s always something new to discover in PixelVerse.',
    bannerUrl: 'https://placehold.co/800x450/D81B60/FFFFFF?text=PixelVerse+Banner',
    iconUrl: 'https://placehold.co/128x128/D81B60/FFFFFF?text=PV',
    tags: [commonTags.pc, commonTags.sandbox, commonTags.multiplayer, commonTags.adventure, commonTags.rpg],
    createdAt: new Date('2023-01-15T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-03-10T12:00:00Z').toISOString(),
  },
  {
    id: 'game2',
    name: 'Galaxy Explorers',
    slug: 'galaxy-explorers',
    description: 'Conquer the stars in this vast space simulation.',
    longDescription: 'Galaxy Explorers invites you to chart your own course across a procedurally generated galaxy of trillions of stars. Mine resources, trade commodities, engage in thrilling dogfights, build your own starbases, and unravel the mysteries of ancient alien civilizations. Whether you choose to be a peaceful trader, a notorious pirate, or a renowned explorer, your saga is written in the stars.',
    bannerUrl: 'https://placehold.co/800x450/AD1457/FFFFFF?text=Galaxy+Banner',
    iconUrl: 'https://placehold.co/128x128/AD1457/FFFFFF?text=GE',
    tags: [commonTags.pc, commonTags.space, commonTags.openWorld, commonTags.simulation, commonTags.singleplayer],
    createdAt: new Date('2022-11-20T14:30:00Z').toISOString(),
    updatedAt: new Date('2024-02-28T10:00:00Z').toISOString(),
  },
  {
    id: 'game3',
    name: 'Kingdoms Collide',
    slug: 'kingdoms-collide',
    description: 'Lead your armies to victory in this epic RTS.',
    longDescription: 'Kingdoms Collide is a real-time strategy game that blends classic RTS mechanics with deep tactical gameplay. Choose from unique factions, command vast armies, manage your economy, and outwit your opponents on diverse battlefields. Featuring a compelling single-player campaign and intense multiplayer matches, only the shrewdest commanders will prevail.',
    bannerUrl: 'https://placehold.co/800x450/F06292/FFFFFF?text=Kingdoms+Banner',
    iconUrl: 'https://placehold.co/128x128/F06292/FFFFFF?text=KC',
    tags: [commonTags.pc, commonTags.rts, commonTags.strategy, commonTags.multiplayer],
    createdAt: new Date('2023-05-01T09:00:00Z').toISOString(),
    updatedAt: new Date('2023-12-15T16:45:00Z').toISOString(),
  },
];

const allCategories: Category[] = [
  { id: 'cat1', name: 'Visual Enhancements', slug: 'visual-enhancements', description: 'Mods that improve graphics, textures, and overall visual appeal.' },
  { id: 'cat2', name: 'Utilities', slug: 'utilities', description: 'Helpful tools and utilities to enhance gameplay convenience.' },
  { id: 'cat3', name: 'Maps & Worlds', slug: 'maps-and-worlds', description: 'Custom maps, adventure worlds, and new terrains to explore.' },
  { id: 'cat4', name: 'Ship Customization', slug: 'ship-customization', description: 'Skins, parts, and modifications for your starships.' },
  { id: 'cat5', name: 'Gameplay Mechanics', slug: 'gameplay-mechanics', description: 'Mods that alter or add new gameplay features and systems.' },
  { id: 'cat6', name: 'AI & NPCs', slug: 'ai-and-npcs', description: 'Improvements and changes to artificial intelligence and non-player characters.' },
];


const authors: Author[] = [
  { id: 'author1', name: 'CreativeWorks', avatarUrl: 'https://placehold.co/40x40/D81B60/FFFFFF?text=CW' },
  { id: 'author2', name: 'ModMaster', avatarUrl: 'https://placehold.co/40x40/F48FB1/121212?text=MM' },
  { id: 'author3', name: 'PixelPerfect', avatarUrl: 'https://placehold.co/40x40/880E4F/FFFFFF?text=PP' },
];

const allResources: Resource[] = [
  {
    id: 'res1', name: 'Ultra Graphics Mod', slug: 'ultra-graphics-mod', gameName: 'PixelVerse Adventures', gameSlug: 'pixelverse-adventures', categoryName: 'Visual Enhancements', categorySlug: 'visual-enhancements', imageUrl: 'https://placehold.co/600x400/D81B60/FFFFFF?text=UltraGFX', author: authors[0], tags: [commonTags.v1_20, commonTags.fabric, commonTags.texturePack, commonTags.pc, commonTags.enhancement], downloads: 15000, createdAt: new Date('2023-05-10T10:00:00Z').toISOString(), updatedAt: new Date('2023-08-15T14:30:00Z').toISOString(), version: '2.1.0', description: 'Breathtaking visual overhaul for PixelVerse. Experience the world like never before with this amazing mod.', detailedDescription: `Ultra Graphics Mod transforms your PixelVerse experience with stunning high-resolution textures, advanced lighting effects, and realistic weather systems. Explore familiar landscapes with a newfound sense of awe and immersion. This mod is optimized for performance while delivering top-tier visuals.\n\nFeatures:\n- 4K Texture Support\n- Dynamic Global Illumination\n- Volumetric Clouds & Fog\n- Enhanced Water Shaders\n- Particle Effect Overhaul\n\nThis is a must have graphics mod for any PixelVerse player seeking ultimate immersion. Our team spent months crafting these visuals.`, 
    files: [
      { id: 'file1_1', name: 'ultra-graphics-v2.1.0-fabric-1.20.jar', url: '#', size: '5.5 MB', supportedVersions: [commonTags.v1_20], supportedLoaders: [commonTags.fabric], channel: commonTags.channelRelease },
      { id: 'file1_2', name: 'ultra-graphics-v2.0.0-fabric-1.19.jar', url: '#', size: '5.3 MB', supportedVersions: [commonTags.v1_19], supportedLoaders: [commonTags.fabric], channel: commonTags.channelBeta }
    ], 
    requirements: 'Requires Fabric API and a compatible graphics card (GTX 1060 or equivalent recommended). Ensure you have at least 8GB of RAM allocated to the game.', 
    changelogEntries: [
      { id: 'cl1-1', versionName: 'Ultra Graphics v2.1.0', date: '2023-08-15T14:30:00Z', notes: 'Added support for PixelVerse v1.20.X.\nFixed water rendering artifacts.\nImproved shadow quality on distant objects.', relatedFileId: 'file1_1', gameVersionTag: commonTags.v1_20, channelTag: commonTags.channelRelease, loaderTags: [commonTags.fabric] },
      { id: 'cl1-2', versionName: 'Ultra Graphics v2.0.0', date: '2023-07-01T10:00:00Z', notes: 'Major visual overhaul, new lighting engine implemented.\nPerformance optimizations for mid-range GPUs.\nAdded experimental volumetric fog (can be toggled in settings).', relatedFileId: 'file1_2', gameVersionTag: commonTags.v1_19, channelTag: commonTags.channelBeta, loaderTags: [commonTags.fabric] },
      { id: 'cl1-3', versionName: 'Ultra Graphics v2.0.0 Alpha 1', date: '2023-06-15T10:00:00Z', notes: 'Alpha release of v2.0.0. Includes new lighting engine.\nPlease report any bugs found.', gameVersionTag: commonTags.v1_19, channelTag: commonTags.channelAlpha, loaderTags: [commonTags.fabric] }
    ], rating: 4.8, followers: 1250, links: { discord: 'https://discord.gg/example', wiki: 'https://wiki.example.com/ultragfx', issues: 'https://github.com/example/ultragfx/issues', source: 'https://github.com/example/ultragfx' }
  },
  {
    id: 'res2', name: 'Advanced Minimap Utility', slug: 'advanced-minimap', gameName: 'PixelVerse Adventures', gameSlug: 'pixelverse-adventures', categoryName: 'Utilities', categorySlug: 'utilities', imageUrl: 'https://placehold.co/600x400/F48FB1/121212?text=Minimap', author: authors[1], tags: [commonTags.v1_19, commonTags.v1_20, commonTags.v1_20_1, commonTags.v1_20_4, commonTags.fabric, commonTags.forge, commonTags.utility, commonTags.library], downloads: 250000, createdAt: new Date('2023-01-20T09:00:00Z').toISOString(), updatedAt: new Date('2024-03-01T11:00:00Z').toISOString(), version: '3.5.2', description: 'Highly customizable minimap with waypoints, entity radar, and biome information. A must-have utility.', detailedDescription: `The Advanced Minimap is an essential tool for any PixelVerse adventurer. It offers a highly configurable on-screen map that displays terrain, entities, and waypoints. \n\nKey Features:\n- Customizable zoom levels and display modes.\n- Unlimited waypoints with color coding and teleportation (if server allows).\n- Entity radar for players, mobs, and items.\n- Biome overlay and chunk grid.\n- Cave mode for underground exploration. An excellent utility. This description provides overview details.`, 
    files: [
      { id: 'file2_1', name: 'advanced-minimap-v3.5.2-fabric.jar', url: '#', size: '1.2 MB', supportedVersions: [commonTags.v1_19, commonTags.v1_20, commonTags.v1_20_1, commonTags.v1_20_4], supportedLoaders: [commonTags.fabric], channel: commonTags.channelRelease }, 
      { id: 'file2_2', name: 'advanced-minimap-v3.5.2-forge.jar', url: '#', size: '1.3 MB', supportedVersions: [commonTags.v1_19, commonTags.v1_20, commonTags.v1_20_1, commonTags.v1_20_4], supportedLoaders: [commonTags.forge], channel: commonTags.channelRelease },
      { id: 'file2_3', name: 'advanced-minimap-v3.5.0-neoforge.jar', url: '#', size: '1.3 MB', supportedVersions: [commonTags.v1_20_1], supportedLoaders: [commonTags.neoForge], channel: commonTags.channelBeta }
    ], 
    requirements: 'Compatible with Fabric or Forge mod loaders. No other dependencies.', 
    changelogEntries: [
      { id: 'cl2-1', versionName: 'Advanced Minimap v3.5.2', date: '2024-03-01T11:00:00Z', notes: 'Fixed compatibility with latest Forge for 1.20.X.\nMinor UI tweaks for waypoint management.', relatedFileId: 'file2_2', gameVersionTag: commonTags.v1_20_4, channelTag: commonTags.channelRelease, loaderTags: [commonTags.forge]},
      { id: 'cl2-2', versionName: 'Advanced Minimap v3.5.0', date: '2024-01-15T10:00:00Z', notes: 'Added cave mode and biome overlay.\nImproved performance for entity tracking.\nAdded NeoForge support (Beta).', relatedFileId: 'file2_3', gameVersionTag: commonTags.v1_20_1, channelTag: commonTags.channelBeta, loaderTags: [commonTags.neoForge]}
    ], rating: 4.5, followers: 8700, links: { discord: 'https://discord.gg/modmaster', source: 'https://github.com/modmaster/minimap' }
  },
  {
    id: 'res3', name: 'Skyblock Odyssey Map', slug: 'skyblock-odyssey-map', gameName: 'PixelVerse Adventures', gameSlug: 'pixelverse-adventures', categoryName: 'Maps & Worlds', categorySlug: 'maps-and-worlds', imageUrl: 'https://placehold.co/600x400/880E4F/FFFFFF?text=SkyblockMap', author: authors[2], tags: [commonTags.v1_20, commonTags.map], downloads: 7500, createdAt: new Date('2023-07-01T12:00:00Z').toISOString(), updatedAt: new Date('2023-07-05T18:00:00Z').toISOString(), version: '1.0.0', description: 'A challenging Skyblock adventure map.', detailedDescription: `Embark on Skyblock Odyssey, a meticulously crafted map that tests your survival skills and creativity. Start on a tiny island with limited resources and expand your world, complete challenges, and discover hidden secrets across multiple floating islands. \n\nIncludes:\n- Custom island designs and progression.\n- Unique challenges and quests.\n- Villager trading system. This map offers a great overview of skyblock mechanics.`, 
    files: [{ id: 'file3_1', name: 'skyblock-odyssey-v1.0.zip', url: '#', size: '10.2 MB', supportedVersions: [commonTags.v1_20], supportedLoaders: [], channel: commonTags.channelRelease }], 
    requirements: 'PixelVerse Adventures v1.20 or higher. No mods required.', 
    changelogEntries: [{ id: 'cl3-1', versionName: 'Skyblock Odyssey v1.0.0', date: '2023-07-01T12:00:00Z', notes: 'Initial release of the Skyblock Odyssey map.', relatedFileId: 'file3_1', gameVersionTag: commonTags.v1_20, channelTag: commonTags.channelRelease }], rating: 4.2, followers: 300, links: { wiki: 'https://pixelperfect.com/skyblock/wiki' }
  },
  {
    id: 'res4', name: 'Cosmic Galaxy Ship Pack', slug: 'cosmic-galaxy-pack', gameName: 'Galaxy Explorers', gameSlug: 'galaxy-explorers', categoryName: 'Ship Customization', categorySlug: 'ship-customization', imageUrl: 'https://placehold.co/600x400/AD1457/FFFFFF?text=CosmicPack', author: authors[0], tags: [commonTags.utility, commonTags.pc], downloads: 9200, createdAt: new Date('2023-06-10T10:00:00Z').toISOString(), updatedAt: new Date('2023-08-25T14:30:00Z').toISOString(), version: '1.5.0', description: 'Stunning ship skins and engine trails for your starship.', detailedDescription: `Take your starship to the next level with the Cosmic Galaxy Pack! This pack includes a variety of breathtaking ship skins inspired by nebulas, supernovas, and distant galaxies. Also features custom engine trail effects and cockpit decals. \n\nContents:\n- 10 unique ship skins.\n- 5 animated engine trail effects.\n- 3 cockpit decal sets. Great overview of customization options.`, 
    files: [{ id: 'file4_1', name: 'cosmic-galaxy-pack-v1.5.0.pak', url: '#', size: '25.5 MB', supportedVersions: [], supportedLoaders: [], channel: commonTags.channelRelease }], 
    requirements: 'Galaxy Explorers v2.3 or newer.', 
    changelogEntries: [{ id: 'cl4-1', versionName: 'Cosmic Galaxy Pack v1.5.0', date: '2023-08-25T14:30:00Z', notes: 'Added 2 new skins and optimized existing textures.', relatedFileId: 'file4_1', channelTag: commonTags.channelRelease }], rating: 4.9, followers: 550, links: { issues: 'https://creative.works/cosmicpack/issues'}
  },
  {
    id: 'res5', name: 'Inventory Sorter Utility', slug: 'inventory-sorter', gameName: 'PixelVerse Adventures', gameSlug: 'pixelverse-adventures', categoryName: 'Utilities', categorySlug: 'utilities', imageUrl: 'https://placehold.co/600x400/EC407A/FFFFFF?text=InvSort', author: authors[1], tags: [commonTags.v1_20, commonTags.v1_21, commonTags.fabric, commonTags.utility], downloads: 120000, createdAt: new Date('2023-03-15T00:00:00Z').toISOString(), updatedAt: new Date('2023-09-10T00:00:00Z').toISOString(), version: '1.8.0', description: 'Automatically sorts inventory and chests. A very useful utility.', detailedDescription: `Tired of messy inventories? The Inventory Sorter mod is here to help! With a single click or configurable hotkey, sort your player inventory or any chest according to predefined rules or custom configurations. Supports item categories, names, and mod-specific sorting. \n\nFeatures:\n- One-click sorting for player inventory and chests.\n- Customizable sorting rules.\n- Hotkey support.\n- Integration with other inventory mods. This utility makes life easier. Provides a great overview of sorting.`, 
    files: [{ id: 'file5_1', name: 'inventory-sorter-v1.8.0.jar', url: '#', size: '0.5 MB', supportedVersions: [commonTags.v1_20, commonTags.v1_21], supportedLoaders: [commonTags.fabric], channel: commonTags.channelRelease }], 
    requirements: 'Fabric API.', 
    changelogEntries: [
      { id: 'cl5-1', versionName: 'Inventory Sorter v1.8.0', date: '2023-09-10T00:00:00Z', notes: 'Added support for PixelVerse 1.21.X. Improved sorting algorithm.', relatedFileId: 'file5_1', gameVersionTag: commonTags.v1_21, channelTag: commonTags.channelRelease, loaderTags: [commonTags.fabric]},
      { id: 'cl5-2', versionName: 'Inventory Sorter v1.7.5 Alpha', date: '2023-08-01T00:00:00Z', notes: 'Fixed minor bugs with modded items.', gameVersionTag: commonTags.v1_20, channelTag: commonTags.channelAlpha, loaderTags: [commonTags.fabric]}
    ], rating: 5.0, followers: 9800
  },
  {
    id: 'res6', name: 'Realistic Textures HD Pack', slug: 'realistic-textures-hd', gameName: 'PixelVerse Adventures', gameSlug: 'pixelverse-adventures', categoryName: 'Visual Enhancements', categorySlug: 'visual-enhancements', imageUrl: 'https://placehold.co/600x400/F06292/121212?text=HDTextures', author: authors[2], tags: [commonTags.v1_20, commonTags.v1_21, commonTags.texturePack], downloads: 50000, createdAt: new Date('2023-02-01T00:00:00Z').toISOString(), updatedAt: new Date('2023-07-20T00:00:00Z').toISOString(), version: '4.2.0', description: 'Complete HD texture overhaul for a realistic visual experience.', detailedDescription: `Experience PixelVerse Adventures in stunning high definition with the Realistic Textures HD pack. This pack replaces all default textures with high-resolution, detailed alternatives, bringing a new level of realism to your world. From individual blocks to expansive landscapes, every detail is enhanced. \n\nIncludes:\n- 256x, 128x, and 64x resolution options.\n- Normal and specular maps for PBR effects (with compatible shaders).\n- Connected textures support. Perfect for a visual graphics boost.`, 
    files: [
      { id: 'file6_1', name: 'realistic-textures-hd-v4.2.0_256x.zip', url: '#', size: '150 MB', supportedVersions: [commonTags.v1_20, commonTags.v1_21], supportedLoaders: [], channel: commonTags.channelAlpha }, 
      { id: 'file6_2', name: 'realistic-textures-hd-v4.2.0_128x.zip', url: '#', size: '80 MB', supportedVersions: [commonTags.v1_20, commonTags.v1_21], supportedLoaders: [], channel: commonTags.channelRelease }
    ], 
    requirements: 'OptiFine or a similar performance mod recommended for higher resolutions. Compatible with PixelVerse 1.20 and 1.21.', 
    changelogEntries: [
      { id: 'cl6-1', versionName: 'Realistic Textures HD v4.2.0', date: '2023-07-20T00:00:00Z', notes: 'Updated for 1.21, added new block textures.', relatedFileId: 'file6_1', gameVersionTag: commonTags.v1_21, channelTag: commonTags.channelAlpha},
      { id: 'cl6-2', versionName: 'Realistic Textures HD v4.1.0', date: '2023-06-10T00:00:00Z', notes: 'Improved performance for 256x pack.', gameVersionTag: commonTags.v1_20, channelTag: commonTags.channelRelease}
    ], rating: 4.6, followers: 2300
  },
  ...Array.from({ length: 25 }, (_, i) => ({
    id: `res-pv-util-${i + 7}`,
    name: `Utility Mod ${i + 1}`,
    slug: `utility-mod-${i + 1}`,
    gameName: 'PixelVerse Adventures',
    gameSlug: 'pixelverse-adventures',
    categoryName: 'Utilities',
    categorySlug: 'utilities',
    imageUrl: `https://placehold.co/600x400/7B1FA2/FFFFFF?text=Util-${i + 1}`,
    author: authors[i % 3],
    tags: [commonTags.v1_20, (i % 2 === 0 ? commonTags.fabric : commonTags.forge), commonTags.utility],
    downloads: Math.floor(Math.random() * 10000) + 500,
    createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30 * (i + 1)).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7 * (i + 1)).toISOString(),
    version: `1.${i % 5}.0`,
    description: `A handy utility mod number ${i + 1} for everyday tasks in PixelVerse. This item helps with various overview tasks.`,
    detailedDescription: `This is Utility Mod ${i + 1}. It helps with various things like item management, information display, or minor gameplay tweaks. It is designed to be lightweight and compatible with most other mods. Essential utility for players. This is part of the detailed overview.`,
    files: [{ id: `file-pv-util-${i+7}`, name: `utility-mod-${i+1}.jar`, url: '#', size: '0.2MB', supportedVersions: [commonTags.v1_20], supportedLoaders: [(i % 2 === 0 ? commonTags.fabric : commonTags.forge)], channel: i % 3 === 0 ? commonTags.channelRelease : (i % 3 === 1 ? commonTags.channelBeta : commonTags.channelAlpha) }],
    requirements: (i % 2 === 0 ? 'Fabric API' : 'Forge Mod Loader'),
    changelogEntries: [{id: `cl-pv-util-${i+7}`, versionName: `Utility Mod 1.${i%5}.0`, date: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7 * (i + 1)).toISOString(), notes: `Initial release or minor update for Utility Mod ${i+1}.`, relatedFileId: `file-pv-util-${i+7}`, gameVersionTag: commonTags.v1_20, channelTag: i % 3 === 0 ? commonTags.channelRelease : (i % 3 === 1 ? commonTags.channelBeta : commonTags.channelAlpha), loaderTags: [(i % 2 === 0 ? commonTags.fabric : commonTags.forge)]}],
    rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10, 
    followers: Math.floor(Math.random() * 500) + 10,
  })),
  {
    id: 'res-pv-map-extra', name: 'PixelVerse Grand Plaza Map', slug: 'pv-grand-plaza', gameName: 'PixelVerse Adventures', gameSlug: 'pixelverse-adventures', categoryName: 'Maps & Worlds', categorySlug: 'maps-and-worlds', imageUrl: 'https://placehold.co/600x400/880E4F/FFFFFF?text=PVPlaza', author: authors[0], tags: [commonTags.v1_21, commonTags.map], downloads: 1200, createdAt: new Date('2023-10-01T12:00:00Z').toISOString(), updatedAt: new Date('2023-10-05T18:00:00Z').toISOString(), version: '1.0.0', description: 'A large central hub map for servers or exploration. Beautiful map.', detailedDescription: `The PixelVerse Grand Plaza is a sprawling map featuring a magnificent central plaza, market stalls, park areas, and connecting pathways. Ideal as a server spawn, a roleplaying hub, or simply a beautiful world to explore. It includes hidden areas and details for dedicated explorers. This map is truly grand and offers a great overview for your city.`, 
    files: [{ id: 'file-pv-map-extra', name: 'pv-grand-plaza.zip', url: '#', size: '15.2 MB', supportedVersions: [commonTags.v1_21], supportedLoaders: [], channel: commonTags.channelRelease }],
    requirements: 'PixelVerse Adventures v1.21 or higher.',
    changelogEntries: [{ id: 'cl-pv-map', versionName: 'Grand Plaza v1.0.0', date: '2023-10-05T18:00:00Z', notes: 'Initial release of the Grand Plaza map.', relatedFileId: 'file-pv-map-extra', gameVersionTag: commonTags.v1_21, channelTag: commonTags.channelRelease }], rating: 4.0, followers: 150
  },
   {
    id: 'res-ge-nav', name: 'Advanced Navigation System', slug: 'ge-advanced-navigation', gameName: 'Galaxy Explorers', gameSlug: 'galaxy-explorers', categoryName: 'Gameplay Mechanics', categorySlug: 'gameplay-mechanics', imageUrl: 'https://placehold.co/600x400/C2185B/FFFFFF?text=AdvNav', author: authors[1], tags: [commonTags.pc, commonTags.utility, commonTags.enhancement], downloads: 18000, createdAt: new Date('2023-04-10T10:00:00Z').toISOString(), updatedAt: new Date('2023-09-05T14:30:00Z').toISOString(), version: '2.2.0', description: 'Overhauls in-ship navigation and targeting for Galaxy Explorers.', detailedDescription: 'The Advanced Navigation System (ANS) provides a comprehensive suite of tools for pilots in Galaxy Explorers. Features improved HUD elements, long-range scanners, jump point calculations, and customizable targeting reticles. Makes space travel more intuitive and combat more precise. A key system for exploration.', 
    files: [{ id: 'file-ge-nav-1', name: 'ge-ans-v2.2.0.pak', url: '#', size: '8.1 MB', supportedVersions: [], supportedLoaders: [], channel: commonTags.channelRelease }], 
    requirements: 'Galaxy Explorers v2.5+.', 
    changelogEntries: [{ id: 'cl-ge-nav', versionName: 'ANS v2.2.0', date: '2023-09-05T14:30:00Z', notes: 'Added new scanner modes.\nUI improvements.', relatedFileId: 'file-ge-nav-1', channelTag: commonTags.channelRelease }], rating: 4.7, followers: 900, links: { source: 'https://github.com/modmaster/ge-ans'}
  },
  {
    id: 'res-kc-ai', name: 'Enhanced Tactical AI Mod', slug: 'kc-tactical-ai', gameName: 'Kingdoms Collide', gameSlug: 'kingdoms-collide', categoryName: 'AI & NPCs', categorySlug: 'ai-and-npcs', imageUrl: 'https://placehold.co/600x400/E91E63/FFFFFF?text=TacticalAI', author: authors[2], tags: [commonTags.pc, commonTags.utility], downloads: 5500, createdAt: new Date('2023-05-20T00:00:00Z').toISOString(), updatedAt: new Date('2023-08-10T00:00:00Z').toISOString(), version: '1.3.0', description: 'Makes enemy and allied AI smarter and more challenging in Kingdoms Collide.', detailedDescription: 'Experience more dynamic battles in Kingdoms Collide with the Enhanced Tactical AI mod. Enemy commanders will use more complex strategies, respond better to player actions, and manage their economies more efficiently. Allied AI will also show improved coordination and unit control. This mod improves AI significantly.', 
    files: [{ id: 'file-kc-ai-1', name: 'kc-eta-v1.3.0.mod', url: '#', size: '3.5 MB', supportedVersions: [], supportedLoaders: [], channel: commonTags.channelAlpha }], 
    requirements: 'Kingdoms Collide v1.8 or newer.', 
    changelogEntries: [{ id: 'cl-kc-ai', versionName: 'ETA v1.3.0', date: '2023-08-10T00:00:00Z', notes: 'AI now utilizes flanking maneuvers more effectively.\nImproved resource management logic for AI opponents.', relatedFileId: 'file-kc-ai-1', channelTag: commonTags.channelAlpha }], rating: 4.3, followers: 280
  },
];

const MOCK_DELAY = 0; 
const delayed = <T>(data: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(data), MOCK_DELAY));

const calculateSearchScore = (resource: Resource, query: string): number => {
  let score = 0;
  const lowerQuery = query.toLowerCase(); 

  if (resource.name.toLowerCase().includes(lowerQuery)) {
    score += 10;
    if (resource.name.toLowerCase().startsWith(lowerQuery)) score += 5;
    if (resource.name.toLowerCase() === lowerQuery) score += 10;
  }
  if (resource.description.toLowerCase().includes(lowerQuery)) {
    score += 3;
  }
  if (resource.detailedDescription.toLowerCase().includes(lowerQuery)) {
    const overviewMentions = (resource.detailedDescription.toLowerCase().match(new RegExp(lowerQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    score += overviewMentions * 1; 
  }
  resource.author.name.toLowerCase().includes(lowerQuery) && (score += 2);
  resource.tags.forEach(tag => tag.name.toLowerCase().includes(lowerQuery) && (score += 1));
  
  return score;
};

export const getGamesBasic = async (): Promise<Game[]> => {
  return delayed(baseGames.map(g => ({...g})));
};

export const getGameBySlug = async (slug: string): Promise<Game | undefined> => {
  const game = baseGames.find(g => g.slug === slug);
  return delayed(game ? {...game} : undefined);
};

export const getGameStats = async (gameSlug: string): Promise<{ totalResources: number; totalDownloads: number }> => {
  const { resources } = await getResources({ gameSlug, limit: Infinity }); 
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
    .map(c => ({ ...c, gameSlug })); 

  return delayed(categories.sort((a, b) => a.name.localeCompare(b.name)));
};

export const getCategoryDetails = async (gameSlug: string, categorySlug: string): Promise<Category | undefined> => {
  const gameCategories = await getCategoriesForGame(gameSlug);
  const category = gameCategories.find(c => c.slug === categorySlug);
  return delayed(category);
};

export const getResources = async (params: GetResourcesParams): Promise<PaginatedResourcesResponse> => {
  let filteredResources = [...allResources].map(r => ({...r, searchScore: 0}));

  if (params?.gameSlug) {
    filteredResources = filteredResources.filter(r => r.gameSlug === params.gameSlug);
  }
  if (params?.categorySlug) {
    filteredResources = filteredResources.filter(r => r.categorySlug === params.categorySlug);
  }
  
  if (params?.searchQuery && params.searchQuery.length > 0) { 
    const query = params.searchQuery; 
    filteredResources = filteredResources.map(r => {
      r.searchScore = calculateSearchScore(r, query);
      return r;
    }).filter(r => r.searchScore! > (params.minScore || 0));
  }


  if (params?.tags && params.tags.length > 0) {
    filteredResources = filteredResources.filter(r =>
      params.tags!.every(tagId => r.tags.some(rt => rt.id === tagId))
    );
  }
  
  const sortBy = params?.sortBy || (params?.searchQuery && params.searchQuery.length > 0 ? 'relevance' : 'downloads');

  switch (sortBy) {
    case 'relevance':
      if (params?.searchQuery && params.searchQuery.length > 0) {
        filteredResources.sort((a, b) => (b.searchScore || 0) - (a.searchScore || 0));
      } else {
        // Default relevance: combination of downloads and recency
        filteredResources.sort((a, b) => {
          const scoreA = (a.downloads / 1000) + (new Date(a.updatedAt).getTime() / (1000 * 60 * 60 * 24 * 30));
          const scoreB = (b.downloads / 1000) + (new Date(b.updatedAt).getTime() / (1000 * 60 * 60 * 24 * 30));
          return scoreB - scoreA;
        });
      }
      break;
    case 'downloads':
      filteredResources.sort((a, b) => b.downloads - a.downloads);
      break;
    case 'updatedAt':
      filteredResources.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      break;
    case 'name':
      filteredResources.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }
  
  const total = filteredResources.length;
  let paginatedResources = filteredResources;

  const page = params?.page || 1;
  const limit = params?.limit;

  if (limit && limit !== Infinity) {
    const start = (page - 1) * limit;
    const end = start + limit;
    paginatedResources = filteredResources.slice(start, end);
  } else if (limit === Infinity) {
    paginatedResources = filteredResources; // No pagination, return all
  }

  // Ensure changelog entries are sorted by date descending if they exist for each resource
  paginatedResources.forEach(resource => {
    if (resource.changelogEntries) {
      resource.changelogEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  });


  return delayed({
    resources: paginatedResources,
    total,
    hasMore: (limit && limit !== Infinity) ? (page * limit) < total : false,
  });
};

export const getBestMatchResourcesData = async (gameSlug: string, categorySlug: string, searchQuery: string, limit: number = 3): Promise<Resource[]> => {
  if (!searchQuery || searchQuery.length === 0) return []; 
  
  const { resources } = await getResources({
    gameSlug,
    categorySlug,
    searchQuery, 
    sortBy: 'relevance',
    limit,
    minScore: 1, 
  });
  return delayed(resources);
};


export const getResourceBySlug = async (slug: string): Promise<Resource | undefined> => {
  const resource = allResources.find(r => r.slug === slug);
  if (resource) {
    // Ensure changelog entries are sorted by date descending if they exist
    const resourceCopy = { ...resource };
    if (resourceCopy.changelogEntries) {
      resourceCopy.changelogEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return delayed(resourceCopy);
  }
  return delayed(undefined);
};

export const getHighlightedResources = async (gameSlug: string, categorySlug: string, limit: number = 5): Promise<Resource[]> => {
  const { resources } = await getResources({ gameSlug, categorySlug, sortBy: 'downloads', page: 1, limit });
  return delayed(resources);
};

export const getAvailableFilterTags = async (gameSlug: string, categorySlug?: string): Promise<{ versions: Tag[], loaders: Tag[], genres: Tag[], misc: Tag[], channels: Tag[] }> => {
  const { resources: allFilteredResources } = await getResources({ gameSlug, categorySlug, limit: Infinity }); 
  
  const versions = new Map<string, Tag>();
  const loaders = new Map<string, Tag>();
  const genres = new Map<string, Tag>();
  const misc = new Map<string, Tag>();
  const channels = new Map<string, Tag>();


  allFilteredResources.forEach(resource => {
    resource.tags.forEach(tag => {
      if (tag.type === 'version' && !versions.has(tag.id)) versions.set(tag.id, tag);
      else if (tag.type === 'loader' && !loaders.has(tag.id)) loaders.set(tag.id, tag);
      else if (tag.type === 'genre' && !genres.has(tag.id)) genres.set(tag.id, tag);
      else if (tag.type === 'misc' && !misc.has(tag.id)) misc.set(tag.id, tag);
    });
    
    resource.files.forEach(file => {
      if (file.channel && !channels.has(file.channel.id)) {
        channels.set(file.channel.id, file.channel);
      }
    });
  });

  return delayed({
    versions: Array.from(versions.values()).sort((a,b) => b.name.localeCompare(a.name)), // Sort versions newest first by name (approx)
    loaders: Array.from(loaders.values()).sort((a,b) => a.name.localeCompare(b.name)),
    genres: Array.from(genres.values()).sort((a,b) => a.name.localeCompare(b.name)),
    misc: Array.from(misc.values()).sort((a,b) => a.name.localeCompare(b.name)),
    channels: Array.from(channels.values()).sort((a,b) => { // Custom sort for channels
        const order = ['Release', 'Beta', 'Alpha']; // Desired order
        return order.indexOf(a.name) - order.indexOf(b.name);
    }),
  });
};

export const formatTimeAgo = (dateString: string | undefined) => {
  if (!dateString) return 'N/A';
  if (typeof window === 'undefined') {
    // Consistent server-side rendering, e.g., simple date format
    // This helps prevent mismatches if the client renders "time ago" immediately
    return new Date(dateString).toLocaleDateString(); 
  }
  // Client-side will render "time ago"
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};
