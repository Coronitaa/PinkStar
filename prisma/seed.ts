
import { PrismaClient, ItemTypeEnum, TagTypeEnum } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // --- Create Users ---
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin', // Assign 'admin' role
    },
  });
  const regularUser = await prisma.user.create({
    data: {
      email: 'user@example.com',
      name: 'Regular User',
      role: 'user', // Default role is 'user'
    },
  });
  console.log('Created users.');

  // --- Create Authors (optionally linked to Users) ---
  const author1 = await prisma.author.create({
    data: {
      name: 'CreativeWorks',
      avatarUrl: 'https://placehold.co/40x40/D81B60/FFFFFF?text=CW',
      userId: regularUser.id, // Link to the regular user
    },
  });
  const author2 = await prisma.author.create({
    data: {
      name: 'ModMaster',
      avatarUrl: 'https://placehold.co/40x40/F48FB1/121212?text=MM',
      // This author is not linked to a User account for this example
    },
  });
  const authorAdmin = await prisma.author.create({
    data: {
      name: 'Admin Author',
      avatarUrl: 'https://placehold.co/40x40/880E4F/FFFFFF?text=AD',
      userId: adminUser.id, // Link to the admin user
    },
  });
  console.log(`Created authors.`);

  // --- Create Tags ---
  const tagsData = [
    // Game Specific
    { id: 'tag_v1_20', name: '1.20.X', type: TagTypeEnum.VERSION, color: 'bg-green-500' },
    { id: 'tag_fabric', name: 'Fabric', type: TagTypeEnum.LOADER, color: 'bg-indigo-500' },
    { id: 'tag_utility', name: 'Utility', type: TagTypeEnum.GENRE },
    { id: 'tag_enhancement', name: 'Enhancement', type: TagTypeEnum.GENRE },
    // Web Specific
    { id: 'tag_react', name: 'React', type: TagTypeEnum.FRAMEWORK },
    { id: 'tag_tailwind', name: 'TailwindCSS', type: TagTypeEnum.TOOLING },
    // App Specific
    { id: 'tag_ios', name: 'iOS', type: TagTypeEnum.PLATFORM },
    { id: 'tag_productivity', name: 'Productivity', type: TagTypeEnum.APP_CATEGORY },
    // Art/Music Specific
    { id: 'tag_digitalart', name: 'Digital Art', type: TagTypeEnum.ART_STYLE },
    { id: 'tag_electronic', name: 'Electronic', type: TagTypeEnum.MUSIC_GENRE },
    // General
    { id: 'tag_pc', name: 'PC', type: TagTypeEnum.PLATFORM },
    { id: 'tag_texture_pack', name: 'Texture Pack', type: TagTypeEnum.GENRE },
    { id: 'tag_channel_release', name: 'Release', type: TagTypeEnum.CHANNEL },
  ];

  for (const tag of tagsData) {
    await prisma.tag.upsert({
      where: { id: tag.id },
      update: {},
      create: tag,
    });
  }
  console.log(`Created tags.`);

  // --- Create Games ---
  const game1 = await prisma.game.create({
    data: {
      name: 'PixelVerse Adventures',
      slug: 'pixelverse-adventures',
      itemType: ItemTypeEnum.GAME,
      description: 'An epic sandbox adventure in a blocky world.',
      longDescription: 'PixelVerse Adventures is a sprawling open-world sandbox game where creativity and exploration know no bounds...',
      bannerUrl: 'https://placehold.co/1200x400/D81B60/FFFFFF?text=PixelVerse+Banner',
      iconUrl: 'https://placehold.co/128x128/D81B60/FFFFFF?text=PV',
      tags: { connect: [{ id: 'tag_pc' }, { id: 'tag_enhancement' }] },
    },
  });
  console.log(`Created games.`);

  // --- Create Web Items ---
  const webItem1 = await prisma.webItem.create({
    data: {
        name: "Profolio X",
        slug: "profolio-x",
        itemType: ItemTypeEnum.WEB,
        description: "A sleek and modern portfolio template for creatives.",
        longDescription: "Profolio X is a Next.js and Tailwind CSS powered portfolio template...",
        bannerUrl: "https://placehold.co/1200x400/1E88E5/FFFFFF?text=ProfolioX",
        iconUrl: "https://placehold.co/128x128/1E88E5/FFFFFF?text=PX",
        tags: { connect: [{ id: 'tag_react' }] },
        technologies: { connect: [{ id: 'tag_react'}, {id: 'tag_tailwind'}] }
    }
  });
  console.log(`Created web items.`);

  // --- Create App Items ---
   const appItem1 = await prisma.appItem.create({
    data: {
        name: "TaskMaster Pro",
        slug: "taskmaster-pro",
        itemType: ItemTypeEnum.APP,
        description: "Boost your productivity with this intuitive task manager.",
        longDescription: "TaskMaster Pro helps you organize your life and work with ease...",
        bannerUrl: "https://placehold.co/1200x400/FB8C00/FFFFFF?text=TaskMaster",
        iconUrl: "https://placehold.co/128x128/FB8C00/FFFFFF?text=TM",
        tags: { connect: [{ id: 'tag_productivity' }] },
        platforms: { connect: [{ id: 'tag_ios' }] }
    }
  });
  console.log(`Created app items.`);

  // --- Create Art/Music Items ---
  const artMusicItem1 = await prisma.artMusicItem.create({
    data: {
        name: "Cybernetic Dreams",
        slug: "cybernetic-dreams",
        itemType: ItemTypeEnum.ART_MUSIC,
        artistName: "Visionary Void",
        description: "A collection of futuristic digital paintings.",
        longDescription: "Dive into 'Cybernetic Dreams,' a series of digital artworks...",
        bannerUrl: "https://placehold.co/1200x400/6D4C41/FFFFFF?text=Cybernetic",
        iconUrl: "https://placehold.co/128x128/6D4C41/FFFFFF?text=CD",
        tags: { connect: [{ id: 'tag_digitalart' }] },
        medium: { connect: { id: 'tag_digitalart' } }
    }
  });
  console.log(`Created art/music items.`);

  // --- Create Categories ---
  const category1Game = await prisma.category.create({
    data: {
      name: 'Visual Enhancements',
      slug: 'visual-enhancements',
      parentItemType: ItemTypeEnum.GAME,
      game: { connect: { id: game1.id } },
      description: 'Mods that improve graphics, textures, and overall visual appeal.',
    },
  });
  console.log(`Created categories.`);

  // --- Create Resources ---
  const resource1 = await prisma.resource.create({
    data: {
      name: 'Ultra Graphics Mod',
      slug: 'ultra-graphics-mod',
      parentItemId: game1.id,
      parentItemType: ItemTypeEnum.GAME,
      categoryId: category1Game.id,
      authorId: author1.id,
      version: '2.1.0',
      description: 'Breathtaking visual overhaul for PixelVerse. Experience the world like never before.',
      detailedDescription: 'Ultra Graphics Mod transforms your PixelVerse experience with enhanced lighting, high-resolution textures, and stunning particle effects. Optimized for performance while delivering a visual feast.',
      imageUrl: 'https://placehold.co/600x400/D81B60/FFFFFF?text=UltraGFX',
      imageGallery: [ // Stored as Json
        'https://placehold.co/800x600/D81B60/FFFFFF?text=UltraGFX+Scene+1',
        'https://placehold.co/800x600/C2185B/FFFFFF?text=UltraGFX+Scene+2',
      ],
      requirements: 'Requires Fabric API. Minimum 8GB RAM recommended.',
      downloads: 15230,
      followers: 1250,
      rating: 4.8,
      reviewCount: 285,
      linksJson: { // Stored as Json
        discord: 'https://discord.gg/example',
        wiki: 'https://wiki.example.com/ultragfx',
      },
      tags: {
        connect: [{ id: 'tag_v1_20' }, { id: 'tag_fabric' }, { id: 'tag_texture_pack' }],
      },
      files: {
        create: [
          {
            name: 'ultra-graphics-v2.1.0-fabric-1.20.jar',
            url: '#download-link-1',
            size: '5.5 MB',
            channelId: 'tag_channel_release',
            supportedVersions: { connect: [{ id: 'tag_v1_20' }] },
            supportedLoaders: { connect: [{ id: 'tag_fabric' }] },
          },
        ],
      },
      changelogEntries: {
        create: [
          {
            versionName: 'v2.1.0',
            notes: 'Added support for PixelVerse v1.20.X.\nFixed water rendering artifacts.',
            gameVersionTagId: 'tag_v1_20',
            channelTagId: 'tag_channel_release',
          },
        ],
      },
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
