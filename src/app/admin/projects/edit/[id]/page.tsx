
import { getItemBySlugGeneric, getCategoriesForItemGeneric, getGamesWithDetails, getWebItemsWithDetails, getAppItemsWithDetails, getArtMusicItemsWithDetails } from '@/lib/data';
import type { ProjectFormData, ItemWithDetails, Category as ItemCategory, Tag } from '@/lib/types';
import { ProjectFormClientPage } from '../../ProjectFormClientPage';
import { notFound } from 'next/navigation';

async function getItemById(id: string): Promise<ItemWithDetails | undefined> {
  const games = await getGamesWithDetails();
  const web = await getWebItemsWithDetails();
  const apps = await getAppItemsWithDetails();
  const artMusic = await getArtMusicItemsWithDetails();
  const allItems = [...games, ...web, ...apps, ...artMusic];
  return allItems.find(item => item.id === id);
}

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const item = await getItemById(params.id);

  if (!item) {
    notFound();
  }
  
  const initialCategories = await getCategoriesForItemGeneric(item.slug, item.itemType);

  // Transform item data to ProjectFormData
  const initialData: Partial<ProjectFormData> = {
    id: item.id,
    itemType: item.itemType,
    name: item.name,
    slug: item.slug,
    description: item.description,
    longDescription: item.longDescription || '',
    bannerUrl: item.bannerUrl,
    iconUrl: item.iconUrl,
    projectUrl: item.projectUrl || '',
    tagsString: item.tags?.map(t => t.name).join(', ') || '',
    // authorId: TODO: Need to map author from item to an ID if available or handle this
    categories: initialCategories.map((cat, index) => ({
      id: cat.id, // Assuming category has an ID
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      order: cat.order ?? index + 1, // Use existing order or assign one
    })).sort((a,b) => a.order - b.order),
  };

  // Add type-specific fields
    if (item.itemType === 'web' && (item as any).technologies) {
        initialData.technologiesString = ((item as any).technologies as Tag[])?.map(t => t.name).join(', ') || '';
    }
    if (item.itemType === 'app') {
        if ((item as any).platforms) {
            initialData.platformsString = ((item as any).platforms as Tag[])?.map(t => t.name).join(', ') || '';
        }
        if ((item as any).technologies) { // Assuming apps can also have a 'technologies' field
             initialData.appTechnologiesString = ((item as any).technologies as Tag[])?.map(t => t.name).join(', ') || '';
        }
    }
    if (item.itemType === 'art-music') {
        if ((item as any).artistName) {
            initialData.artistName = (item as any).artistName;
        }
        if ((item as any).medium) {
            initialData.mediumId = ((item as any).medium as Tag).id;
        }
         if ((item as any).technologies) { // Assuming art/music can also have a 'technologies' field
             initialData.artMusicTechnologiesString = ((item as any).technologies as Tag[])?.map(t => t.name).join(', ') || '';
        }
    }


  const handleSubmit = async (data: ProjectFormData) => {
    'use server';
    console.log(`Edited project data for ID ${params.id} (mock):`, data);
    // In a real app, you'd update this in Firestore here
    // For example: await db.collection('projects').doc(params.id).update(processedData);
    // Then potentially revalidatePath or redirect
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Edit Project: {item.name}</h1>
      <ProjectFormClientPage initialData={initialData} onSubmit={handleSubmit} isEditing />
    </div>
  );
}

