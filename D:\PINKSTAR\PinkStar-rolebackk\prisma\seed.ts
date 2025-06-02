
import { PrismaClient, ItemTypeEnum, TagTypeEnum } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // --- Create Authors ---
  const author1 = await prisma.author.create({
    data: {
      name: 'CreativeWorks',
      avatarUrl: 'https://placehold.co/40x40/D81B60/FFFFFF?text=CW',
    },
  });
  const author2 = await prisma.author.create({
    data: {
      name: 'ModMaster',
      avatarUrl: 'https://placehold.co/40x40/F48FB1/121212?text=MM',
    },
  });
   const author3 = await prisma.author.create({
    data: {
      name: 'PixelPerfect',
      avatarUrl: 'https://placehold.co/40x40/880E4F/FFFFFF?text=PP',
    },
  });
  console.log(`Created authors.`);

  // --- Create Tags ---
  // Game related
  const tag_v1_20 = await prisma.tag.create({ data: { name: '1.20.X', type: TagTypeEnum.VERSION, color: 'bg-green-500' } });
  const tag_v1_21 = await prisma.tag.create({ data: { name: '1.21.X', type: TagTypeEnum.VERSION, color: 'bg-purple-500' } });
  const tag_fabric = await prisma.tag.create({ data: { name: 'Fabric', type: TagTypeEnum.LOADER, color: 'bg-indigo-500' } });
  const tag_forge = await prisma.tag.create({ data: { name: 'Forge', type: TagTypeEnum.LOADER, color: 'bg-orange-500' } });
  const tag_utility = await prisma.tag.create({ data: { name: 'Utility', type: TagTypeEnum.GENRE } });
  const tag_enhancement = await prisma.tag.create({ data: { name: 'Enhancement', type: TagTypeEnum.GENRE } });
  const tag_adventure = await prisma.tag.create({ data: { name: 'Adventure', type: TagTypeEnum.GENRE } });
  const tag_pc = await prisma.tag.create({ data: { name: 'PC', type: TagTypeEnum.PLATFORM } });
  const tag_channel_release = await prisma.tag.create({ data: { name: 'Release', type: TagTypeEnum.CHANNEL, color: 'bg-green-500', textColor: 'text-green-50' } });
  const tag_channel_beta = await prisma.tag.create({ data: { name: 'Beta', type: TagTypeEnum.CHANNEL, color: 'bg-sky-500', textColor: 'text-sky-50' } });

  // Web related
  const tag_react = await prisma.tag.create({ data: { name: 'React', type: TagTypeEnum.FRAMEWORK } });
  const tag_nextjs = await prisma.tag.create({ data: { name: 'Next.js', type: TagTypeEnum.FRAMEWORK } });
  const tag_tailwind = await prisma.tag.create({ data: { name: 'TailwindCSS', type: TagTypeEnum.TOOLING } });
  const tag_portfolio = await prisma.tag.create({ data: { name: 'Portfolio', type: TagTypeEnum.GENRE }}); // Using GENRE for web project type

  // App related
  const tag_ios = await prisma.tag.create({ data: { name: 'iOS', type: TagTypeEnum.PLATFORM } });
  const tag_android = await prisma.tag.create({ data: { name: 'Android', type: TagTypeEnum.PLATFORM } });
  const tag_productivity = await prisma.tag.create({data: { name: 'Productivity', type: TagTypeEnum.APP_CATEGORY }});

  // Art/Music related
  const tag_digital_art = await prisma.tag.create({ data: { name: 'Digital Art', type: TagTypeEnum.ART_STYLE } });
  const tag_electronic = await prisma.tag.create({ data: { name: 'Electronic', type: TagTypeEnum.MUSIC_GENRE } });
  console.log(`Created tags.`);

  // --- Create Games ---
  const game1 = await prisma.game.create({
    data: {
      name: 'PixelVerse Adventures',
      slug: 'pixelverse-adventures',
      description: 'An epic sandbox adventure in a vibrant pixel world.',
      longDescription: 'PixelVerse Adventures offers endless possibilities. Explore vast landscapes, build magnificent structures, and battle fierce monsters. Your imagination is the only limit in this procedurally generated universe. Gather resources, craft tools, and team up with friends in multiplayer mode or brave the world solo.',
      bannerUrl: 'https://placehold.co/1200x400/D81B60/FFFFFF?text=PixelVerse+Banner',
      iconUrl: 'https://placehold.co/128x128/D81B60/FFFFFF?text=PV',
      tags: { connect: [{ id: tag_pc.id }, {id: tag_adventure.id}] },
    },
  });

  const game2 = await prisma.game.create({
    data: {
      name: 'Cosmic Frontiers',
      slug: 'cosmic-frontiers',
      description: 'Explore the galaxy, build an empire, and conquer the stars.',
      longDescription: 'Embark on a grand strategy journey across the stars in Cosmic Frontiers. Manage resources, research advanced technologies, design starships, and engage in tactical combat. Forge alliances or dominate your rivals in this immersive space 4X game. Features a dynamic galaxy and multiple alien civilizations.',
      bannerUrl: 'https://placehold.co/1200x400/F48FB1/121212?text=Cosmic+Banner',
      iconUrl: 'https://placehold.co/128x128/F48FB1/121212?text=CF',
      tags: { connect: [{ id: tag_pc.id }] },
    },
  });
  console.log(`Created games.`);

  // --- Create Web Items ---
  const webItem1 = await prisma.webItem.create({
    data: {
        name: 'Profolio X',
        slug: 'profolio-x',
        description: 'A sleek and modern portfolio template for creatives.',
        longDescription: 'Profolio X is a Next.js and Tailwind CSS powered portfolio template designed to showcase your work beautifully. It features a clean design, smooth animations, and easy customization. Perfect for developers, designers, and artists.',
        bannerUrl: 'https://placehold.co/1200x400/1E88E5/FFFFFF?text=ProfolioX+Banner',
        iconUrl: 'https://placehold.co/128x128/1E88E5/FFFFFF?text=PX',
        projectUrl: 'https://example.com/profolio-x-demo',
        tags: { connect: [{ id: tag_portfolio.id }] },
        technologies: { connect: [{ id: tag_react.id }, { id: tag_nextjs.id }, { id: tag_tailwind.id }] },
    }
  });
  console.log(`Created web items.`);

  // --- Create App Items ---
  const appItem1 = await prisma.appItem.create({
    data: {
        name: 'TaskMaster Pro',
        slug: 'taskmaster-pro',
        description: 'Boost your productivity with this intuitive task manager.',
        longDescription: 'TaskMaster Pro helps you organize your life and work with ease. Create projects, set deadlines, track progress, and collaborate with your team. Features a clean interface, offline access, and cloud sync.',
        bannerUrl: 'https://placehold.co/1200x400/FB8C00/FFFFFF?text=TaskMaster+Banner',
        iconUrl: 'https://placehold.co/128x128/FB8C00/FFFFFF?text=TM',
        projectUrl: 'https://example.com/taskmaster-app',
        tags: { connect: [{ id: tag_productivity.id }] },
        platforms: { connect: [{id: tag_ios.id}, {id: tag_android.id}]}
    }
  });
  console.log(`Created app items.`);

  // --- Create Art/Music Items ---
  const artMusicItem1 = await prisma.artMusicItem.create({
    data: {
        name: 'Cybernetic Dreams',
        slug: 'cybernetic-dreams',
        description: 'A collection of futuristic digital paintings.',
        artistName: 'Visionary Void',
        longDescription: 'Dive into "Cybernetic Dreams," a series of digital artworks exploring the intersection of humanity and technology. Each piece offers a glimpse into a possible future, filled with neon lights, advanced machinery, and thought-provoking concepts.',
        bannerUrl: 'https://placehold.co/1200x400/6D4C41/FFFFFF?text=Cybernetic+Banner',
        iconUrl: 'https://placehold.co/128x128/6D4C41/FFFFFF?text=CD',
        projectUrl: 'https://example.com/cybernetic-dreams-gallery',
        tags: { connect: [{ id: tag_digital_art.id }] },
        mediumId: tag_digital_art.id,
    }
  });
  console.log(`Created art/music items.`);

  // --- Create Categories ---
  // Categories for PixelVerse Adventures
  const categoryVisualsPV = await prisma.category.create({
    data: {
      name: 'Visual Enhancements',
      slug: 'visual-enhancements-pv',
      description: 'Mods that improve graphics, textures, and overall visual appeal for PixelVerse.',
      parentItemType: ItemTypeEnum.GAME,
      gameId: game1.id,
    },
  });
  const categoryUtilitiesPV = await prisma.category.create({
    data: {
      name: 'Utilities',
      slug: 'utilities-pv',
      description: 'Helpful tools and utilities to enhance gameplay convenience in PixelVerse.',
      parentItemType: ItemTypeEnum.GAME,
      gameId: game1.id,
    },
  });

  // Categories for Profolio X (WebItem)
  const categoryUIComponentsWeb = await prisma.category.create({
    data: {
        name: 'UI Kits',
        slug: 'ui-kits-profolio',
        description: 'Collections of UI components for Profolio X.',
        parentItemType: ItemTypeEnum.WEB,
        webItemId: webItem1.id,
    }
  });
  console.log(`Created categories.`);

  // --- Create Resources ---
  const resource1 = await prisma.resource.create({
    data: {
      name: 'Ultra Graphics Mod',
      slug: 'ultra-graphics-mod',
      parentItemId: game1.id,
      parentItemType: ItemTypeEnum.GAME,
      categoryId: categoryVisualsPV.id,
      authorId: author1.id,
      version: '2.1.0',
      description: 'Breathtaking visual overhaul for PixelVerse. Experience the world like never before.',
      detailedDescription: 'Ultra Graphics Mod transforms your PixelVerse experience with enhanced lighting, high-resolution textures, and stunning particle effects. Optimized for performance while delivering a visual feast.',
      imageUrl: 'https://placehold.co/600x400/D81B60/FFFFFF?text=UltraGFX',
      imageGallery: [
        'https://placehold.co/800x600/D81B60/FFFFFF?text=UltraGFX+Scene+1',
        'https://placehold.co/800x600/C2185B/FFFFFF?text=UltraGFX+Scene+2',
      ],
      requirements: 'Requires Fabric API. Minimum 8GB RAM recommended.',
      downloads: 15230,
      followers: 1250,
      rating: 4.8,
      reviewCount: 285,
      linksJson: { // Prisma expects a JSON object for Json fields // Changed from 'links' to 'linksJson'
        discord: 'https://discord.gg/example',
        wiki: 'https://wiki.example.com/ultragfx',
      },
      tags: { connect: [{ id: tag_v1_21.id }, { id: tag_fabric.id }, { id: tag_enhancement.id }] },
    },
  });

  const resourceFile1_1 = await prisma.resourceFile.create({
    data: {
      name: 'ultra-graphics-v2.1.0-fabric-1.21.jar',
      url: '#download-link-placeholder-1',
      size: '5.5 MB',
      resourceId: resource1.id,
      channelId: tag_channel_release.id,
      supportedVersions: { connect: [{ id: tag_v1_21.id }] },
      supportedLoaders: { connect: [{ id: tag_fabric.id }] },
      date: new Date('2023-08-15T14:30:00Z'),
    },
  });
   await prisma.changelogEntry.create({
    data: {
        resourceId: resource1.id,
        relatedFileId: resourceFile1_1.id,
        versionName: 'v2.1.0',
        notes: '- Added support for PixelVerse 1.21.X\n- Improved shader performance\n- Fixed skybox rendering bug',
        date: new Date('2023-08-15T14:30:00Z')
    }
  });


  const resource2 = await prisma.resource.create({
    data: {
      name: 'Inventory Sorter',
      slug: 'inventory-sorter-pv',
      parentItemId: game1.id,
      parentItemType: ItemTypeEnum.GAME,
      categoryId: categoryUtilitiesPV.id,
      authorId: author2.id,
      version: '1.3.2',
      description: 'Automatically sort your inventory with a single click!',
      detailedDescription: 'Tired of messy inventories? Inventory Sorter adds a smart button to sort all your items by category and name. Highly configurable.',
      imageUrl: 'https://placehold.co/600x400/F48FB1/121212?text=InvSort',
      downloads: 25800,
      followers: 890,
      rating: 4.5,
      reviewCount: 150,
      tags: { connect: [{ id: tag_v1_20.id }, { id: tag_v1_21.id }, { id: tag_fabric.id }, { id: tag_forge.id }, {id: tag_utility.id}] },
      // No linksJson for this resource in the original seed, so it will be null/undefined in the DB
    },
  });
   const resourceFile2_1 = await prisma.resourceFile.create({
    data: {
      name: 'inventory-sorter-v1.3.2-fabric-1.21.jar',
      url: '#download-link-placeholder-2',
      size: '250 KB',
      resourceId: resource2.id,
      channelId: tag_channel_release.id,
      supportedVersions: { connect: [{ id: tag_v1_21.id }] },
      supportedLoaders: { connect: [{ id: tag_fabric.id }] },
      date: new Date('2023-09-01T10:00:00Z'),
    },
  });
   await prisma.changelogEntry.create({
    data: {
        resourceId: resource2.id,
        relatedFileId: resourceFile2_1.id,
        versionName: 'v1.3.2',
        notes: '- Compatibility with 1.21\n- Minor bug fixes',
        date: new Date('2023-09-01T10:00:00Z')
    }
  });


  const resourceWeb1 = await prisma.resource.create({
    data: {
      name: 'Profolio X - Base Components',
      slug: 'profolio-x-base-components',
      parentItemId: webItem1.id,
      parentItemType: ItemTypeEnum.WEB,
      categoryId: categoryUIComponentsWeb.id,
      authorId: author1.id,
      version: '1.0.0',
      description: 'Core UI components for the Profolio X template.',
      detailedDescription: 'Get the essential React components used in Profolio X, including buttons, cards, and navigation elements. Styled with Tailwind CSS.',
      imageUrl: 'https://placehold.co/600x400/1E88E5/FFFFFF?text=PX+Components',
      downloads: 500,
      followers: 50,
      rating: 4.9,
      reviewCount: 12,
      tags: { connect: [{ id: tag_react.id }, {id: tag_tailwind.id}] },
      linksJson: { // Added example links for web resource
        projectUrl: 'https://example.com/profolio-x-components-demo',
        source: 'https://github.com/example/profolio-x-components'
      }
    },
  });
  console.log(`Created resources.`);

  console.log(`Seeding finished.`);
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
