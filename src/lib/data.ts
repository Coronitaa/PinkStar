
import type { Game, Category, Resource, Author, Tag, ResourceFile, GetResourcesParams, PaginatedResourcesResponse, ResourceLinks, ChangelogEntry, WebItem, AppItem, ArtMusicItem, ItemStats, ItemType, ItemWithDetails, GenericListItem, TagType } from './types';
import { formatDistanceToNow } from 'date-fns';

const commonTags: Record<string, Tag> = {
  // Game Specific
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
  
  // General Genres/Types
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

  // Platforms / Participation
  pc: { id: 'tag8', name: 'PC', type: 'platform' },
  multiplayer: {id: 'tag-multiplayer', name: 'Multiplayer', type: 'genre'},
  singleplayer: {id: 'tag-singleplayer', name: 'Singleplayer', type: 'genre'},

  // Release Channels
  channelRelease: { id: 'tag-ch-release', name: 'Release', type: 'channel', color: 'bg-green-500 border-green-500', textColor: 'text-green-50' },
  channelBeta: { id: 'tag-ch-beta', name: 'Beta', type: 'channel', color: 'bg-sky-500 border-sky-500', textColor: 'text-sky-50' },
  channelAlpha: { id: 'tag-ch-alpha', name: 'Alpha', type: 'channel', color: 'bg-orange-500 border-orange-500', textColor: 'text-orange-50' },
  
  // Web Specific
  react: { id: 'tag-react', name: 'React', type: 'framework' },
  nextjs: { id: 'tag-nextjs', name: 'Next.js', type: 'framework' },
  vue: { id: 'tag-vue', name: 'Vue.js', type: 'framework' },
  tailwind: { id: 'tag-tailwind', name: 'TailwindCSS', type: 'tooling' },
  typescript: { id: 'tag-ts', name: 'TypeScript', type: 'language' },
  javascript: { id: 'tag-js', name: 'JavaScript', type: 'language' },
  portfolio: { id: 'tag-portfolio', name: 'Portfolio', type: 'genre'},
  ecommerce: { id: 'tag-ecommerce', name: 'E-commerce', type: 'genre'},
  saas: { id: 'tag-saas', name: 'SaaS', type: 'genre'},

  // App Specific
  ios: { id: 'tag-ios', name: 'iOS', type: 'platform' },
  android: { id: 'tag-android', name: 'Android', type: 'platform' },
  flutter: { id: 'tag-flutter', name: 'Flutter', type: 'framework' },
  swift: { id: 'tag-swift', name: 'Swift', type: 'language' },
  kotlin: { id: 'tag-kotlin', name: 'Kotlin', type: 'language' },
  productivity: {id: 'tag-productivity', name: 'Productivity', type: 'app-category'},
  social: {id: 'tag-social', name: 'Social', type: 'app-category'},

  // Art & Music Specific
  digitalArt: { id: 'tag-digitalart', name: 'Digital Art', type: 'art-style' },
  traditionalArt: { id: 'tag-traditionalart', name: 'Traditional Art', type: 'art-style' },
  electronic: { id: 'tag-electronic', name: 'Electronic', type: 'music-genre' },
  ambient: { id: 'tag-ambient', name: 'Ambient', type: 'music-genre' },
  illustration: { id: 'tag-illustration', name: 'Illustration', type: 'art-style'},
  soundtrack: {id: 'tag-soundtrack', name: 'Soundtrack', type: 'music-genre'}
};

const authors: Author[] = [
  { id: 'author1', name: 'CreativeWorks', avatarUrl: 'https://placehold.co/40x40/D81B60/FFFFFF?text=CW' },
  { id: 'author2', name: 'ModMaster', avatarUrl: 'https://placehold.co/40x40/F48FB1/121212?text=MM' },
  { id: 'author3', name: 'PixelPerfect', avatarUrl: 'https://placehold.co/40x40/880E4F/FFFFFF?text=PP' },
  { id: 'author4', name: 'WebWeaver', avatarUrl: 'https://placehold.co/40x40/1976D2/FFFFFF?text=WW' },
  { id: 'author5', name: 'AppArchitect', avatarUrl: 'https://placehold.co/40x40/388E3C/FFFFFF?text=AA' },
  { id: 'author6', name: 'ArtisticSoul', avatarUrl: 'https://placehold.co/40x40/FBC02D/121212?text=AS' },
];

const baseGames: Game[] = [
  {
    id: 'game1', name: 'PixelVerse Adventures', slug: 'pixelverse-adventures', itemType: 'game',
    description: 'An epic sandbox adventure in a blocky world.',
    longDescription: 'PixelVerse Adventures is a sprawling open-world sandbox game where creativity and exploration know no bounds. Build magnificent structures, embark on daring quests, discover hidden dungeons, and team up with friends in a vibrant, procedurally generated universe. With regular updates and a thriving community, there\'s always something new to discover in PixelVerse.',
    bannerUrl: 'https://placehold.co/1200x400/D81B60/FFFFFF?text=PixelVerse+Banner', iconUrl: 'https://placehold.co/128x128/D81B60/FFFFFF?text=PV',
    tags: [commonTags.pc, commonTags.sandbox, commonTags.multiplayer, commonTags.adventure, commonTags.rpg],
    createdAt: new Date('2023-01-15T10:00:00Z').toISOString(), updatedAt: new Date('2024-03-10T12:00:00Z').toISOString(),
  },
  {
    id: 'game2', name: 'Galaxy Explorers', slug: 'galaxy-explorers', itemType: 'game',
    description: 'Conquer the stars in this vast space simulation.',
    longDescription: 'Galaxy Explorers invites you to chart your own course across a procedurally generated galaxy of trillions of stars. Mine resources, trade commodities, engage in thrilling dogfights, build your own starbases, and unravel the mysteries of ancient alien civilizations. Whether you choose to be a peaceful trader, a notorious pirate, or a renowned explorer, your saga is written in the stars.',
    bannerUrl: 'https://placehold.co/1200x400/AD1457/FFFFFF?text=Galaxy+Banner', iconUrl: 'https://placehold.co/128x128/AD1457/FFFFFF?text=GE',
    tags: [commonTags.pc, commonTags.space, commonTags.openWorld, commonTags.simulation, commonTags.singleplayer],
    createdAt: new Date('2022-11-20T14:30:00Z').toISOString(), updatedAt: new Date('2024-02-28T10:00:00Z').toISOString(),
  },
  {
    id: 'game3', name: 'Kingdoms Collide', slug: 'kingdoms-collide', itemType: 'game',
    description: 'Lead your armies to victory in this epic RTS.',
    longDescription: 'Kingdoms Collide is a real-time strategy game that blends classic RTS mechanics with deep tactical gameplay. Choose from unique factions, command vast armies, manage your economy, and outwit your opponents on diverse battlefields. Featuring a compelling single-player campaign and intense multiplayer matches, only the shrewdest commanders will prevail.',
    bannerUrl: 'https://placehold.co/1200x400/F06292/FFFFFF?text=Kingdoms+Banner', iconUrl: 'https://placehold.co/128x128/F06292/FFFFFF?text=KC',
    tags: [commonTags.pc, commonTags.rts, commonTags.strategy, commonTags.multiplayer],
    createdAt: new Date('2023-05-01T09:00:00Z').toISOString(), updatedAt: new Date('2023-12-15T16:45:00Z').toISOString(),
  },
];

const baseWebItems: WebItem[] = [
  {
    id: 'web1', name: 'Profolio X', slug: 'profolio-x', itemType: 'web',
    description: 'A sleek and modern portfolio template for creatives.',
    longDescription: 'Profolio X is a Next.js and Tailwind CSS powered portfolio template designed for developers, designers, and artists to showcase their work beautifully. It features a clean design, smooth animations, and an easy-to-customize structure. Comes with a built-in blog and project pages.',
    bannerUrl: 'https://placehold.co/1200x400/1E88E5/FFFFFF?text=ProfolioX+Banner', iconUrl: 'https://placehold.co/128x128/1E88E5/FFFFFF?text=PX',
    tags: [commonTags.portfolio, commonTags.react, commonTags.nextjs, commonTags.tailwind],
    technologies: [commonTags.nextjs, commonTags.react, commonTags.tailwind, commonTags.typescript],
    createdAt: new Date('2023-08-10T10:00:00Z').toISOString(), updatedAt: new Date('2024-01-20T11:00:00Z').toISOString(),
    projectUrl: 'https://example.com/profolio-x-demo'
  },
  {
    id: 'web2', name: 'E-Shop Starter', slug: 'e-shop-starter', itemType: 'web',
    description: 'A feature-rich e-commerce starter kit with modern tech.',
    longDescription: 'Kickstart your online store with E-Shop Starter. Built with Vue.js, Nuxt, and integrated with Stripe for payments. Includes product listings, cart functionality, user accounts, and an admin dashboard. Fully responsive and SEO-friendly.',
    bannerUrl: 'https://placehold.co/1200x400/43A047/FFFFFF?text=EShop+Banner', iconUrl: 'https://placehold.co/128x128/43A047/FFFFFF?text=ES',
    tags: [commonTags.ecommerce, commonTags.vue, commonTags.saas],
    technologies: [commonTags.vue, commonTags.typescript, {id: 'tag-nuxt', name: 'Nuxt.js', type: 'framework'}],
    createdAt: new Date('2023-06-15T14:00:00Z').toISOString(), updatedAt: new Date('2024-02-25T10:00:00Z').toISOString(),
    projectUrl: 'https://example.com/eshop-demo'
  },
];

const baseAppItems: AppItem[] = [
  {
    id: 'app1', name: 'TaskMaster Pro', slug: 'taskmaster-pro', itemType: 'app',
    description: 'Boost your productivity with this intuitive task manager.',
    longDescription: 'TaskMaster Pro helps you organize your life and work with ease. Create projects, set deadlines, track progress, and collaborate with teams. Available on iOS and Android, with cloud sync. Features include subtasks, reminders, priority levels, and customizable views.',
    bannerUrl: 'https://placehold.co/1200x400/FB8C00/FFFFFF?text=TaskMaster+Banner', iconUrl: 'https://placehold.co/128x128/FB8C00/FFFFFF?text=TM',
    tags: [commonTags.productivity, commonTags.ios, commonTags.android],
    platforms: [commonTags.ios, commonTags.android],
    technologies: [commonTags.flutter, {id: 'tag-dart', name: 'Dart', type: 'language'}],
    createdAt: new Date('2023-03-20T09:00:00Z').toISOString(), updatedAt: new Date('2024-03-05T16:00:00Z').toISOString(),
    projectUrl: 'https://example.com/taskmaster-app'
  },
];

const baseArtMusicItems: ArtMusicItem[] = [
  {
    id: 'art1', name: 'Cybernetic Dreams', slug: 'cybernetic-dreams', itemType: 'art-music',
    description: 'A collection of futuristic digital paintings.',
    artistName: 'Visionary Void',
    longDescription: 'Dive into "Cybernetic Dreams," a series of digital artworks exploring themes of technology, consciousness, and the future of humanity. Each piece is meticulously crafted with vibrant colors and intricate details, inviting contemplation and wonder.',
    bannerUrl: 'https://placehold.co/1200x400/6D4C41/FFFFFF?text=Cybernetic+Banner', iconUrl: 'https://placehold.co/128x128/6D4C41/FFFFFF?text=CD',
    tags: [commonTags.digitalArt, commonTags.illustration],
    medium: commonTags.digitalArt,
    createdAt: new Date('2023-10-01T12:00:00Z').toISOString(), updatedAt: new Date('2023-11-15T10:00:00Z').toISOString(),
    projectUrl: 'https://example.com/cybernetic-dreams-gallery'
  },
];

const allGenericItems: GenericListItem[] = [...baseGames, ...baseWebItems, ...baseAppItems, ...baseArtMusicItems];

const allCategories: Category[] = [
  // Game Categories
  { id: 'cat1', name: 'Visual Enhancements', slug: 'visual-enhancements', parentItemType: 'game', description: 'Mods that improve graphics, textures, and overall visual appeal.' },
  { id: 'cat2', name: 'Utilities', slug: 'utilities', parentItemType: 'game', description: 'Helpful tools and utilities to enhance gameplay convenience.' },
  { id: 'cat3', name: 'Maps & Worlds', slug: 'maps-and-worlds', parentItemType: 'game', description: 'Custom maps, adventure worlds, and new terrains to explore.' },
  { id: 'cat4', name: 'Ship Customization', slug: 'ship-customization', parentItemType: 'game', description: 'Skins, parts, and modifications for your starships.' },
  { id: 'cat5', name: 'Gameplay Mechanics', slug: 'gameplay-mechanics', parentItemType: 'game', description: 'Mods that alter or add new gameplay features and systems.' },
  { id: 'cat6', name: 'AI & NPCs', slug: 'ai-and-npcs', parentItemType: 'game', description: 'Improvements and changes to artificial intelligence and non-player characters.' },
  // Web Categories
  { id: 'webcat1', name: 'UI Components', slug: 'ui-components', parentItemType: 'web', description: 'Reusable UI elements and libraries.' },
  { id: 'webcat2', name: 'Boilerplates', slug: 'boilerplates', parentItemType: 'web', description: 'Starter kits and templates for web projects.' },
  { id: 'webcat3', name: 'API Integrations', slug: 'api-integrations', parentItemType: 'web', description: 'Resources for connecting with third-party APIs.' },
  // App Categories
  { id: 'appcat1', name: 'SDKs & Libraries', slug: 'sdks-libraries', parentItemType: 'app', description: 'Software Development Kits and libraries for app features.' },
  { id: 'appcat2', name: 'Design Assets', slug: 'design-assets', parentItemType: 'app', description: 'Icons, UI kits, and other design resources.' },
  // Art & Music Categories
  { id: 'artcat1', name: 'Brushes & Presets', slug: 'brushes-presets', parentItemType: 'art-music', description: 'Custom brushes for digital art software, audio presets.' },
  { id: 'artcat2', name: 'Stock Assets', slug: 'stock-assets', parentItemType: 'art-music', description: 'Royalty-free images, audio loops, and video clips.' },
];


const allResources: Resource[] = [
  {
    id: 'res1', name: 'Ultra Graphics Mod', slug: 'ultra-graphics-mod', parentItemName: 'PixelVerse Adventures', parentItemSlug: 'pixelverse-adventures', parentItemType: 'game', categoryName: 'Visual Enhancements', categorySlug: 'visual-enhancements', 
    imageUrl: 'https://placehold.co/600x400/D81B60/FFFFFF?text=UltraGFX+Main',
    imageGallery: [
        'https://placehold.co/800x600/D81B60/FFFFFF?text=UltraGFX+Scene+1',
        'https://placehold.co/800x600/C2185B/FFFFFF?text=UltraGFX+Scene+2',
        'https://placehold.co/800x600/AD1457/FFFFFF?text=UltraGFX+Character',
    ],
    author: authors[0], tags: [commonTags.v1_20, commonTags.fabric, commonTags.texturePack, commonTags.pc, commonTags.enhancement], downloads: 15000, createdAt: new Date('2023-05-10T10:00:00Z').toISOString(), updatedAt: new Date('2023-08-15T14:30:00Z').toISOString(), version: '2.1.0', description: 'Breathtaking visual overhaul for PixelVerse. Experience the world like never before.', detailedDescription: `Ultra Graphics Mod transforms your PixelVerse experience with stunning high-resolution textures, advanced lighting effects, and realistic weather systems. Explore familiar landscapes with a newfound sense of awe and immersion. This mod is optimized for performance while delivering top-tier visuals.\n\nFeatures:\n- 4K Texture Support\n- Dynamic Global Illumination\n- Volumetric Clouds & Fog\n- Enhanced Water Shaders\n- Particle Effect Overhaul\n\nThis is a must have graphics mod for any PixelVerse player seeking ultimate immersion. Our team spent months crafting these visuals.`, 
    files: [
      { id: 'file1_1', name: 'ultra-graphics-v2.1.0-fabric-1.20.jar', url: '#', size: '5.5 MB', supportedVersions: [commonTags.v1_20], supportedLoaders: [commonTags.fabric], channel: commonTags.channelRelease, date: '2023-08-15T14:30:00Z' },
      { id: 'file1_2', name: 'ultra-graphics-v2.0.0-fabric-1.19.jar', url: '#', size: '5.3 MB', supportedVersions: [commonTags.v1_19], supportedLoaders: [commonTags.fabric], channel: commonTags.channelBeta, date: '2023-07-01T10:00:00Z' }
    ], 
    requirements: 'Requires Fabric API and a compatible graphics card (GTX 1060 or equivalent recommended). Ensure you have at least 8GB of RAM allocated to the game.', 
    changelogEntries: [
      { id: 'cl1-1', versionName: 'Ultra Graphics v2.1.0', date: '2023-08-15T14:30:00Z', notes: 'Added support for PixelVerse v1.20.X.\nFixed water rendering artifacts.\nImproved shadow quality on distant objects.', relatedFileId: 'file1_1', gameVersionTag: commonTags.v1_20, channelTag: commonTags.channelRelease, loaderTags: [commonTags.fabric] },
      { id: 'cl1-2', versionName: 'Ultra Graphics v2.0.0', date: '2023-07-01T10:00:00Z', notes: 'Major visual overhaul, new lighting engine implemented.\nPerformance optimizations for mid-range GPUs.\nAdded experimental volumetric fog (can be toggled in settings).', relatedFileId: 'file1_2', gameVersionTag: commonTags.v1_19, channelTag: commonTags.channelBeta, loaderTags: [commonTags.fabric] },
      { id: 'cl1-3', versionName: 'Ultra Graphics v2.0.0 Alpha 1', date: '2023-06-15T10:00:00Z', notes: 'Alpha release of v2.0.0. Includes new lighting engine.\nPlease report any bugs found.', gameVersionTag: commonTags.v1_19, channelTag: commonTags.channelAlpha, loaderTags: [commonTags.fabric] }
    ], rating: 4.8, reviewCount: 285, followers: 1250, links: { discord: 'https://discord.gg/example', wiki: 'https://wiki.example.com/ultragfx', issues: 'https://github.com/example/ultragfx', source: 'https://github.com/example/ultragfx' }
  },
  {
    id: 'res-web-ui-kit', name: 'Aurora UI Kit', slug: 'aurora-ui-kit', parentItemName: 'Profolio X', parentItemSlug: 'profolio-x', parentItemType: 'web', categoryName: 'UI Components', categorySlug: 'ui-components',
    imageUrl: 'https://placehold.co/600x400/0288D1/FFFFFF?text=AuroraUI',
    author: authors[3], tags: [commonTags.react, commonTags.tailwind, commonTags.typescript], downloads: 500, createdAt: new Date('2023-09-01T10:00:00Z').toISOString(), updatedAt: new Date('2024-01-15T11:00:00Z').toISOString(), version: '1.2.0',
    description: 'A comprehensive React component library for Profolio X.',
    detailedDescription: 'Aurora UI Kit provides a set of beautifully designed and accessible React components, perfectly styled for Profolio X using Tailwind CSS. Includes buttons, forms, modals, navigation, and more. Accelerate your Profolio X customization.',
    files: [{ id: 'file-web-uikit', name: 'aurora-ui-kit-v1.2.0.zip', url: '#', size: '1.2 MB', supportedVersions: [], supportedLoaders: [], channel: commonTags.channelRelease, date: '2024-01-15T11:00:00Z' }],
    requirements: 'React 18+, Tailwind CSS 3+', rating: 4.9, reviewCount: 75, followers: 150,
    links: { source: 'https://github.com/webweaver/aurora-ui', projectUrl: 'https://example.com/profolio-x-demo/aurora-ui'}
  },
  {
    id: 'res-app-auth', name: 'Firebase Auth Starter', slug: 'firebase-auth-starter', parentItemName: 'TaskMaster Pro', parentItemSlug: 'taskmaster-pro', parentItemType: 'app', categoryName: 'SDKs & Libraries', categorySlug: 'sdks-libraries',
    imageUrl: 'https://placehold.co/600x400/FFA000/FFFFFF?text=FirebaseAuth',
    author: authors[4], tags: [commonTags.flutter, {id: 'tag-firebase', name: 'Firebase', type: 'tooling'}], downloads: 800, createdAt: new Date('2023-07-10T14:00:00Z').toISOString(), updatedAt: new Date('2023-12-01T09:00:00Z').toISOString(), version: '1.0.0',
    description: 'Quickly integrate Firebase Authentication into your Flutter app.',
    detailedDescription: 'This starter package provides all necessary boilerplate code to integrate Firebase Authentication (Email/Password, Google Sign-In) into a Flutter application like TaskMaster Pro. Includes UI screens for login, registration, and password reset.',
    files: [{ id: 'file-app-auth', name: 'firebase-auth-starter-flutter.zip', url: '#', size: '800 KB', supportedVersions: [], supportedLoaders: [], channel: commonTags.channelRelease, date: '2023-12-01T09:00:00Z' }],
    requirements: 'Flutter 3+, Firebase project configured.', rating: 4.7, reviewCount: 120, followers: 200,
    links: { source: 'https://github.com/apparchitect/firebase-auth-starter', projectUrl: 'https://example.com/taskmaster-app/auth-starter'}
  },
  {
    id: 'res-art-nebula', name: 'Nebula Brush Pack', slug: 'nebula-brush-pack', parentItemName: 'Cybernetic Dreams', parentItemSlug: 'cybernetic-dreams', parentItemType: 'art-music', categoryName: 'Brushes & Presets', categorySlug: 'brushes-presets',
    imageUrl: 'https://placehold.co/600x400/795548/FFFFFF?text=NebulaBrushes',
    author: authors[5], tags: [commonTags.digitalArt, {id: 'tag-photoshop', name: 'Photoshop', type: 'tooling'}], downloads: 1200, createdAt: new Date('2023-11-01T15:00:00Z').toISOString(), updatedAt: new Date('2023-11-20T13:00:00Z').toISOString(), version: '1.0',
    description: 'A set of high-resolution brushes for creating stunning space nebulae.',
    detailedDescription: 'Create breathtaking space scenes with the Nebula Brush Pack for Photoshop (and compatible software). Includes over 50 high-resolution brushes for stars, gas clouds, and cosmic dust, perfect for digital artists working on projects like Cybernetic Dreams.',
    files: [{ id: 'file-art-brushes', name: 'nebula-brush-pack.abr', url: '#', size: '15 MB', supportedVersions: [], supportedLoaders: [], channel: commonTags.channelRelease, date: '2023-11-20T13:00:00Z' }],
    requirements: 'Adobe Photoshop CC or compatible graphics software.', rating: 4.9, reviewCount: 95, followers: 350,
    links: { projectUrl: 'https://example.com/cybernetic-dreams-gallery/brushes'}
  },
  {
    id: 'res2', name: 'Inventory Sorter', slug: 'inventory-sorter', parentItemName: 'PixelVerse Adventures', parentItemSlug: 'pixelverse-adventures', parentItemType: 'game', categoryName: 'Utilities', categorySlug: 'utilities',
    imageUrl: 'https://placehold.co/600x400/F48FB1/121212?text=InvSort',
    author: authors[1], tags: [commonTags.v1_19, commonTags.fabric, commonTags.utility, commonTags.pc], downloads: 7500, createdAt: new Date('2023-02-20T11:00:00Z').toISOString(), updatedAt: new Date('2023-06-01T16:00:00Z').toISOString(), version: '1.2.3', description: 'Automatically sorts your inventory with a single click.', detailedDescription: 'Tired of messy inventories? Inventory Sorter adds a smart button to your inventory screen that intelligently organizes all your items by category and name. Customizable sorting profiles coming soon!', 
    files: [
      { id: 'file2_1', name: 'inventory-sorter-v1.2.3-fabric-1.19.jar', url: '#', size: '250 KB', supportedVersions: [commonTags.v1_19], supportedLoaders: [commonTags.fabric], channel: commonTags.channelRelease, date: '2023-06-01T16:00:00Z' }
    ], 
    requirements: 'Fabric API.', rating: 4.5, reviewCount: 150, followers: 500, links: { source: 'https://github.com/example/invsort' }
  },
  {
    id: 'res3', name: 'The Lost Mines Adventure Map', slug: 'lost-mines-map', parentItemName: 'PixelVerse Adventures', parentItemSlug: 'pixelverse-adventures', parentItemType: 'game', categoryName: 'Maps & Worlds', categorySlug: 'maps-and-worlds',
    imageUrl: 'https://placehold.co/600x400/880E4F/FFFFFF?text=LostMines',
    author: authors[2], tags: [commonTags.map, commonTags.adventure, commonTags.pc], downloads: 3200, createdAt: new Date('2023-09-05T09:00:00Z').toISOString(), updatedAt: new Date('2023-10-10T12:30:00Z').toISOString(), version: '1.0.0', description: 'A challenging adventure map with puzzles and boss fights.', detailedDescription: 'Embark on a perilous journey through The Lost Mines! This custom adventure map features intricate puzzles, challenging parkour sections, unique boss encounters, and a captivating story. Can you uncover the secrets hidden deep within?', 
    files: [
      { id: 'file3_1', name: 'lost-mines-adventure-map-v1.0.zip', url: '#', size: '12.1 MB', supportedVersions: [commonTags.v1_20], supportedLoaders: [], channel: commonTags.channelRelease, date: '2023-10-10T12:30:00Z' }
    ], 
    rating: 4.2, reviewCount: 88, followers: 300, links: { discord: 'https://discord.gg/pixelperfectmaps' }
  },
];


const MOCK_DELAY = 0; 
const delayed = <T>(data: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(data), MOCK_DELAY));

// Function to format numbers with suffixes (K, M, B)
export function formatNumberWithSuffix(num: number | undefined | null): string {
  if (num === undefined || num === null) return '0';
  if (num < 1000) return num.toString();
  
  const suffixes = ["", "k", "M", "B", "T"];
  const i = Math.floor(Math.log10(Math.abs(num)) / 3);
  
  if (i >= suffixes.length) return num.toExponential(1);

  const scaledNum = num / Math.pow(1000, i);
  
  const formattedNum = scaledNum.toFixed(1);
  if (formattedNum.endsWith('.0')) {
    return Math.floor(scaledNum) + suffixes[i];
  }
  return formattedNum + suffixes[i];
}


// Generic function to calculate search score
export const calculateGenericItemSearchScore = (item: GenericListItem, query: string): number => {
  if (!query) return 0;
  const lowerQuery = query.toLowerCase();
  let score = 0;

  if (item.name.toLowerCase().includes(lowerQuery)) {
    score += 10;
    if (item.name.toLowerCase().startsWith(lowerQuery)) score += 5;
    if (item.name.toLowerCase() === lowerQuery) score += 10;
  }

  if (item.description.toLowerCase().includes(lowerQuery)) {
    score += 3;
  }

  if (item.tags) {
    item.tags.forEach(tag => {
      if (tag.name.toLowerCase().includes(lowerQuery)) {
        score += 1;
      }
    });
  }
  if (item.itemType === 'web' && (item as WebItem).technologies) {
    (item as WebItem).technologies?.forEach(tech => {
      if (tech.name.toLowerCase().includes(lowerQuery)) score +=1;
    });
  }
  if (item.itemType === 'app' && (item as AppItem).platforms) {
    (item as AppItem).platforms?.forEach(platform => {
      if (platform.name.toLowerCase().includes(lowerQuery)) score +=1;
    });
  }
   if (item.itemType === 'art-music' && (item as ArtMusicItem).artistName) {
    if ((item as ArtMusicItem).artistName?.toLowerCase().includes(lowerQuery)) score +=2;
  }

  return score;
};


// Generic function to get an item by slug and type
export const getItemBySlugGeneric = async (slug: string, itemType: ItemType): Promise<GenericListItem | undefined> => {
  const item = allGenericItems.find(g => g.slug === slug && g.itemType === itemType);
  return delayed(item ? {...item} : undefined);
};

// Generic function to get categories for a specific item type and slug
export const getCategoriesForItemGeneric = async (itemSlug: string, itemType: ItemType): Promise<Category[]> => {
  const itemCategories = allCategories
    .filter(cat => cat.parentItemType === itemType) 
    .map(c => ({ ...c, parentItemSlug: itemSlug, parentItemType: itemType })); 

  
  let specificItemCategories: Category[] = [];
  if (itemType === 'game') {
      if (itemSlug === 'pixelverse-adventures') specificItemCategories = itemCategories.filter(c => ['cat1', 'cat2', 'cat3'].includes(c.id));
      else if (itemSlug === 'galaxy-explorers') specificItemCategories = itemCategories.filter(c => ['cat4', 'cat5'].includes(c.id));
      else specificItemCategories = itemCategories.slice(0,2); 
  } else if (itemType === 'web') {
      if (itemSlug === 'profolio-x') specificItemCategories = itemCategories.filter(c => ['webcat1', 'webcat2'].includes(c.id));
      else if (itemSlug === 'e-shop-starter') specificItemCategories = itemCategories.filter(c => ['webcat1', 'webcat3'].includes(c.id));
      else specificItemCategories = itemCategories.slice(0,2);
  } else if (itemType === 'app') {
      if (itemSlug === 'taskmaster-pro') specificItemCategories = itemCategories.filter(c => ['appcat1', 'appcat2'].includes(c.id));
      else specificItemCategories = itemCategories.slice(0,2);
  } else if (itemType === 'art-music') {
       if (itemSlug === 'cybernetic-dreams') specificItemCategories = itemCategories.filter(c => ['artcat1'].includes(c.id));
       else specificItemCategories = itemCategories.slice(0,1);
  }
  
  return delayed(specificItemCategories.sort((a, b) => a.name.localeCompare(b.name)));
};

// Generic function to get stats for an item
export const getItemStatsGeneric = async (itemSlug: string, itemType: ItemType): Promise<ItemStats> => {
  const { resources } = await getResources({ parentItemSlug: itemSlug, parentItemType: itemType, limit: Infinity });
  const totalResources = resources.length;
  const totalDownloads = resources.reduce((sum, resource) => sum + (resource.downloads || 0), 0);
  const totalFollowers = Math.floor(Math.random() * 1200000) + 50000;
  const totalViews = itemType !== 'game' ? Math.floor(Math.random() * 50000000) + 1000000 : undefined; 
  return delayed({ totalResources, totalDownloads, totalFollowers, totalViews });
};

// Generic function to get items with their details
const getItemsWithDetailsGeneric = async (itemType: ItemType): Promise<ItemWithDetails[]> => {
  const baseItems = allGenericItems.filter(item => item.itemType === itemType);
  const itemsWithDetails = await Promise.all(
    baseItems.map(async (item) => {
      const categories = await getCategoriesForItemGeneric(item.slug, item.itemType);
      const stats = await getItemStatsGeneric(item.slug, item.itemType);
      return { ...item, categories, stats } as ItemWithDetails;
    })
  );
  return delayed(itemsWithDetails);
};

// Specific implementations for each item type
export const getGamesWithDetails = async (): Promise<ItemWithDetails[]> => getItemsWithDetailsGeneric('game');
export const getWebItemsWithDetails = async (): Promise<ItemWithDetails[]> => getItemsWithDetailsGeneric('web');
export const getAppItemsWithDetails = async (): Promise<ItemWithDetails[]> => getItemsWithDetailsGeneric('app');
export const getArtMusicItemsWithDetails = async (): Promise<ItemWithDetails[]> => getItemsWithDetailsGeneric('art-music');

// Specific getters for individual items
export const getGameBySlug = async (slug: string): Promise<Game | undefined> => getItemBySlugGeneric(slug, 'game') as Promise<Game | undefined>;
export const getWebItemBySlug = async (slug: string): Promise<WebItem | undefined> => getItemBySlugGeneric(slug, 'web') as Promise<WebItem | undefined>;
export const getAppItemBySlug = async (slug: string): Promise<AppItem | undefined> => getItemBySlugGeneric(slug, 'app') as Promise<AppItem | undefined>;
export const getArtMusicItemBySlug = async (slug: string): Promise<ArtMusicItem | undefined> => getItemBySlugGeneric(slug, 'art-music') as Promise<ArtMusicItem | undefined>;


export const getCategoryDetails = async (parentItemSlug: string, parentItemType: ItemType, categorySlug: string): Promise<Category | undefined> => {
  const itemCategories = await getCategoriesForItemGeneric(parentItemSlug, parentItemType);
  const category = itemCategories.find(c => c.slug === categorySlug);
  return delayed(category);
};

export const getResources = async (params: GetResourcesParams): Promise<PaginatedResourcesResponse> => {
  let filteredResources = [...allResources].map(r => ({...r, searchScore: 0}));

  if (params?.parentItemSlug && params?.parentItemType) {
    filteredResources = filteredResources.filter(r => r.parentItemSlug === params.parentItemSlug && r.parentItemType === params.parentItemType);
  }
  if (params?.categorySlug) {
    filteredResources = filteredResources.filter(r => r.categorySlug === params.categorySlug);
  }
  
  if (params?.searchQuery && params.searchQuery.length > 0) {
    const query = params.searchQuery.toLowerCase();
    filteredResources = filteredResources.map(r => {
      let score = 0;
      const nameMatch = r.name.toLowerCase().includes(query);
      const descMatch = r.description.toLowerCase().includes(query);
      const tagMatch = r.tags.some(tag => tag.name.toLowerCase().includes(query));

      if (nameMatch && descMatch) {
        score = 50;
      } else if (nameMatch) {
        score = 40;
      } else if (descMatch && tagMatch) {
        score = 30;
      } else if (descMatch) {
        score = 20;
      } else if (tagMatch) {
        score = 10;
      }
      r.searchScore = score;
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
        filteredResources.sort((a, b) => {
          const scoreA = (a.downloads / 1000) + (new Date(a.updatedAt).getTime() / (1000 * 60 * 60 * 24 * 30)) + (a.rating || 0);
          const scoreB = (b.downloads / 1000) + (new Date(b.updatedAt).getTime() / (1000 * 60 * 60 * 24 * 30)) + (b.rating || 0);
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
    paginatedResources = filteredResources;
  }

  paginatedResources.forEach(resource => {
    if (resource.changelogEntries) {
      resource.changelogEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    if (resource.files) {
        resource.files.sort((a,b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
    }
  });


  return delayed({
    resources: paginatedResources,
    total,
    hasMore: (limit && limit !== Infinity) ? (page * limit) < total : false,
  });
};

export const getBestMatchForCategoryAction = async (parentItemSlug: string, parentItemType: ItemType, categorySlug: string, searchQuery: string, limit: number = 3): Promise<Resource[]> => {
  if (!searchQuery || searchQuery.length === 0) return [];
  
  const { resources } = await getResources({
    parentItemSlug,
    parentItemType,
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
    const resourceCopy = { ...resource };
    if (resourceCopy.changelogEntries) {
      resourceCopy.changelogEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    if (resourceCopy.files) {
        resourceCopy.files.sort((a,b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
    }
    return delayed(resourceCopy);
  }
  return delayed(undefined);
};

export const getHighlightedResources = async (parentItemSlug: string, parentItemType: ItemType, categorySlug: string, limit: number = 5): Promise<Resource[]> => {
  const { resources } = await getResources({ parentItemSlug, parentItemType, categorySlug, sortBy: 'downloads', page: 1, limit });
  return delayed(resources);
};

export const getAvailableFilterTags = async (parentItemSlug: string, parentItemType: ItemType, categorySlug?: string): Promise<Partial<AvailableTags>> => {
  const { resources: allFilteredResources } = await getResources({ parentItemSlug, parentItemType, categorySlug, limit: Infinity }); 
  
  const tagsMap: Record<TagType, Map<string, Tag>> = {
    'version': new Map(), 'loader': new Map(), 'genre': new Map(), 'platform': new Map(), 'misc': new Map(), 'channel': new Map(),
    'framework': new Map(), 'language': new Map(), 'tooling': new Map(),
    'app-category': new Map(),
    'art-style': new Map(), 'music-genre': new Map()
  };

  allFilteredResources.forEach(resource => {
    resource.tags.forEach(tag => {
      if (tagsMap[tag.type] && !tagsMap[tag.type].has(tag.id)) {
        tagsMap[tag.type].set(tag.id, tag);
      }
    });
    
    resource.files.forEach(file => {
      if (file.channel && tagsMap['channel'] && !tagsMap['channel'].has(file.channel.id)) {
        tagsMap['channel'].set(file.channel.id, file.channel);
      }
    });
  });

  const sortByName = (a: Tag, b: Tag) => a.name.localeCompare(b.name);
  const sortByVersion = (a: Tag, b: Tag) => b.name.localeCompare(a.name); 
  const sortChannels = (a: Tag, b: Tag) => {
    const order = ['Release', 'Beta', 'Alpha'];
    return order.indexOf(a.name) - order.indexOf(b.name);
  };

  const result: Partial<AvailableTags> = {};
  if (tagsMap['version'].size > 0) result.versions = Array.from(tagsMap['version'].values()).sort(sortByVersion);
  if (tagsMap['loader'].size > 0) result.loaders = Array.from(tagsMap['loader'].values()).sort(sortByName);
  if (tagsMap['genre'].size > 0) result.genres = Array.from(tagsMap['genre'].values()).sort(sortByName);
  if (tagsMap['misc'].size > 0) result.misc = Array.from(tagsMap['misc'].values()).sort(sortByName);
  if (tagsMap['channel'].size > 0) result.channels = Array.from(tagsMap['channel'].values()).sort(sortChannels);
  if (tagsMap['framework'].size > 0) result.frameworks = Array.from(tagsMap['framework'].values()).sort(sortByName);
  if (tagsMap['language'].size > 0) result.languages = Array.from(tagsMap['language'].values()).sort(sortByName);
  if (tagsMap['tooling'].size > 0) result.tooling = Array.from(tagsMap['tooling'].values()).sort(sortByName);
  if (tagsMap['platform'].size > 0) result.platforms = Array.from(tagsMap['platform'].values()).sort(sortByName); 
  if (tagsMap['app-category'].size > 0) result.appCategories = Array.from(tagsMap['app-category'].values()).sort(sortByName);
  if (tagsMap['art-style'].size > 0) result.artStyles = Array.from(tagsMap['art-style'].values()).sort(sortByName);
  if (tagsMap['music-genre'].size > 0) result.musicGenres = Array.from(tagsMap['music-genre'].values()).sort(sortByName);
  
  return delayed(result);
};


export const formatTimeAgo = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    // Check if running in a browser environment
    if (typeof window === 'undefined') {
      // Fallback for server-side rendering or environments without 'window'
      return new Date(dateString).toLocaleDateString(); 
    }
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    // Fallback for invalid date string or other errors during formatting
    try {
        // Attempt to format as a simple date string if fromDistanceToNow fails
        return new Date(dateString).toLocaleDateString();
    } catch (fallbackError) {
        // If all else fails, return a generic error message
        return 'Invalid Date';
    }
  }
};
    
    

