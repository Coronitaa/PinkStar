
'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { ProjectFormData, ItemType, ProjectCategoryFormData, Author, Tag } from '@/lib/types';
import { commonTags as predefinedTags, authors as predefinedAuthors } from '@/lib/data'; // Assuming authors are exported from data.ts

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, PlusCircle, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import slugify from 'slugify';
import { useState } from 'react';

const projectFormSchema = z.object({
  id: z.string().optional(),
  itemType: z.enum(['game', 'web', 'app', 'art-music'], { required_error: "Item type is required." }),
  name: z.string().min(3, "Name must be at least 3 characters."),
  slug: z.string().min(3, "Slug must be at least 3 characters.").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens."),
  description: z.string().min(10, "Short description must be at least 10 characters."),
  longDescription: z.string().optional(),
  bannerUrl: z.string().url("Must be a valid URL.").min(1, "Banner URL is required."),
  iconUrl: z.string().url("Must be a valid URL.").min(1, "Icon URL is required."),
  projectUrl: z.string().url("Must be a valid URL.").optional().or(z.literal('')),
  
  tagsString: z.string().optional(), // Will be parsed into Tag[]

  technologiesString: z.string().optional(), // For Web
  platformsString: z.string().optional(), // For App
  appTechnologiesString: z.string().optional(), // For App
  
  artistName: z.string().optional(), // For Art/Music
  mediumId: z.string().optional(), // For Art/Music
  artMusicTechnologiesString: z.string().optional(), // For Art/Music

  authorId: z.string().optional(),
  newAuthorName: z.string().optional(),

  categories: z.array(z.object({
    id: z.string(), // temp id for new, real id for existing
    name: z.string().min(1, "Category name is required."),
    slug: z.string().min(1, "Category slug is required.").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens."),
    description: z.string().optional(),
    order: z.number().min(0, "Order must be a positive number."),
  })).min(0),
}).refine(data => {
  if (data.authorId && data.newAuthorName) {
    return false; // Cannot select existing and add new author
  }
  return true;
}, {
  message: "Choose an existing author or enter a new one, not both.",
  path: ["authorId"], // Or path: ["newAuthorName"]
});


interface ProjectFormProps {
  initialData?: Partial<ProjectFormData>;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  isEditing?: boolean;
}

export function ProjectForm({ initialData, onSubmit, isEditing = false }: ProjectFormProps) {
  const { toast } = useToast();
  const [itemType, setItemType] = useState<ItemType | undefined>(initialData?.itemType);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      itemType: 'game', // Default type
      categories: [],
      ...initialData,
      tagsString: initialData?.tagsString || (initialData as any)?.tags?.map((t: Tag) => t.name).join(', ') || '',
      technologiesString: initialData?.technologiesString || (initialData as any)?.technologies?.map((t: Tag) => t.name).join(', ') || '',
      platformsString: initialData?.platformsString || (initialData as any)?.platforms?.map((t: Tag) => t.name).join(', ') || '',
      appTechnologiesString: initialData?.appTechnologiesString || (initialData as any)?.technologies?.map((t: Tag) => t.name).join(', ') || '', // For apps
      artMusicTechnologiesString: initialData?.artMusicTechnologiesString || (initialData as any)?.technologies?.map((t: Tag) => t.name).join(', ') || '', // For art/music
    },
  });

  const { fields: categoryFields, append: appendCategory, remove: removeCategory, move: moveCategory } = useFieldArray({
    control: form.control,
    name: "categories",
  });

  const handleFormSubmit = async (data: ProjectFormData) => {
    // Here you would normally send data to your backend/Firestore
    // For now, we just call the onSubmit prop (which will likely console.log it)
    toast({ title: isEditing ? "Project Update Submitted" : "Project Creation Submitted", description: "Data (mock submission): " + JSON.stringify(data, null, 2) });
    await onSubmit(data);
    // form.reset(); // Optionally reset form after submission
  };

  const watchName = form.watch("name");
  const watchCategoryName = (index: number) => form.watch(`categories.${index}.name`);

  const handleGenerateSlug = (value: string, fieldName: "slug" | `categories.${number}.slug`) => {
    if (value) {
      form.setValue(fieldName, slugify(value, { lower: true, strict: true }), { shouldValidate: true });
    }
  };

  const handleItemTypeChange = (value: string) => {
    const newItemType = value as ItemType;
    form.setValue("itemType", newItemType);
    setItemType(newItemType);
    // Reset type-specific fields if needed, or handle in schema/validation
    // For example:
    if (newItemType !== 'web') form.setValue('technologiesString', '');
    if (newItemType !== 'app') {
      form.setValue('platformsString', '');
      form.setValue('appTechnologiesString', '');
    }
    if (newItemType !== 'art-music') {
        form.setValue('artistName', '');
        form.setValue('mediumId', '');
        form.setValue('artMusicTechnologiesString', '');
    }
    if (newItemType !== 'web' && newItemType !== 'app' && newItemType !== 'art-music') {
        form.setValue('projectUrl', '');
    }

  };
  
  // Predefined media for Art/Music (example)
  const artMusicMediaTags: Tag[] = predefinedTags ? Object.values(predefinedTags).filter(tag => tag.type === 'art-style' || tag.type === 'music-genre') : [];


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="itemType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Type *</FormLabel>
                  <Select onValueChange={(value) => handleItemTypeChange(value)} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select project type" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="game">Game</SelectItem>
                      <SelectItem value="web">Web Project</SelectItem>
                      <SelectItem value="app">Application</SelectItem>
                      <SelectItem value="art-music">Art/Music</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name *</FormLabel>
                  <FormControl><Input placeholder="My Awesome Project" {...field} /></FormControl>
                  <FormDescription>The main display name of the project.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="button" variant="outline" size="sm" onClick={() => handleGenerateSlug(watchName, "slug")} disabled={!watchName}>Generate Slug from Name</Button>
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug *</FormLabel>
                  <FormControl><Input placeholder="my-awesome-project" {...field} /></FormControl>
                  <FormDescription>URL-friendly identifier (e.g., my-awesome-project). Must be unique.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description *</FormLabel>
                  <FormControl><Textarea placeholder="A brief summary of the project..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="longDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Description</FormLabel>
                  <FormControl><Textarea placeholder="Provide more details about the project..." {...field} rows={6} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="iconUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon URL *</FormLabel>
                  <FormControl><Input placeholder="https://placehold.co/128x128.png" {...field} /></FormControl>
                  <FormDescription>Direct URL to the project's icon (e.g., 128x128px).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bannerUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner URL *</FormLabel>
                  <FormControl><Input placeholder="https://placehold.co/1200x400.png" {...field} /></FormControl>
                  <FormDescription>Direct URL to the project's banner image (e.g., 1200x400px).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             {(itemType === 'web' || itemType === 'app' || itemType === 'art-music') && (
                <FormField
                control={form.control}
                name="projectUrl"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Project URL (Homepage/Store)</FormLabel>
                    <FormControl><Input placeholder="https://example.com/my-project" {...field} /></FormControl>
                    <FormDescription>Link to the project's live site, app store page, or main gallery.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Metadata & Tags</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="tagsString"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Tags</FormLabel>
                  <FormControl><Input placeholder="tag1, tag2, awesome-tag" {...field} /></FormControl>
                  <FormDescription>Comma-separated list of tags. These are general tags for the project itself.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {itemType === 'web' && (
              <FormField
                control={form.control}
                name="technologiesString"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Web Technologies</FormLabel>
                    <FormControl><Input placeholder="React, Next.js, TailwindCSS" {...field} /></FormControl>
                    <FormDescription>Comma-separated list of technologies used (e.g., React, Vue, Node.js).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {itemType === 'app' && (
              <>
                <FormField
                  control={form.control}
                  name="platformsString"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>App Platforms</FormLabel>
                      <FormControl><Input placeholder="iOS, Android, Web" {...field} /></FormControl>
                      <FormDescription>Comma-separated list of target platforms (e.g., iOS, Android, Windows).</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="appTechnologiesString" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>App Technologies</FormLabel>
                      <FormControl><Input placeholder="Swift, Kotlin, Flutter" {...field} /></FormControl>
                      <FormDescription>Comma-separated list of technologies used (e.g., Swift, Kotlin, React Native).</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {itemType === 'art-music' && (
              <>
                <FormField
                  control={form.control}
                  name="artistName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Artist Name</FormLabel>
                      <FormControl><Input placeholder="The Visionary Artist" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mediumId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medium (Art Style/Music Genre)</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select medium..." /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {artMusicMediaTags.map(tag => <SelectItem key={tag.id} value={tag.id}>{tag.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="artMusicTechnologiesString" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Art/Music Tools/Software</FormLabel>
                      <FormControl><Input placeholder="Photoshop, Ableton Live, Blender" {...field} /></FormControl>
                      <FormDescription>Comma-separated list of tools or software used.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            <FormField
                control={form.control}
                name="authorId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Author (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select an existing author" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="">-- No Author / Or Add New --</SelectItem>
                        {predefinedAuthors.map((author: Author) => (
                            <SelectItem key={author.id} value={author.id}>{author.name}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormDescription>Select if the author already exists.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="newAuthorName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Or New Author Name</FormLabel>
                    <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                    <FormDescription>If the author is not in the list, enter their name here.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />

          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Project Categories</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendCategory({ id: `new-${Date.now()}`, name: '', slug: '', description: '', order: categoryFields.length + 1 })}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryFields.length === 0 && <p className="text-sm text-muted-foreground">No categories added yet.</p>}
            {categoryFields.map((field, index) => (
              <Card key={field.id} className="p-4 bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground flex items-center"><GripVertical className="mr-2 h-5 w-5 text-muted-foreground cursor-grab" /> Category {index + 1}</h4>
                  <div className="flex items-center gap-1">
                    <Button type="button" variant="ghost" size="icon" onClick={() => moveCategory(index, index - 1)} disabled={index === 0} title="Move Up">
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" onClick={() => moveCategory(index, index + 1)} disabled={index === categoryFields.length - 1} title="Move Down">
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => removeCategory(index)} title="Remove Category">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name={`categories.${index}.name`}
                    render={({ field: catField }) => (
                      <FormItem>
                        <FormLabel>Category Name *</FormLabel>
                        <FormControl><Input placeholder="General Resources" {...catField} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => handleGenerateSlug(watchCategoryName(index), `categories.${index}.slug`)} disabled={!watchCategoryName(index)}>Generate Slug</Button>
                  <FormField
                    control={form.control}
                    name={`categories.${index}.slug`}
                    render={({ field: catField }) => (
                      <FormItem>
                        <FormLabel>Category Slug *</FormLabel>
                        <FormControl><Input placeholder="general-resources" {...catField} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`categories.${index}.description`}
                    render={({ field: catField }) => (
                      <FormItem>
                        <FormLabel>Category Description</FormLabel>
                        <FormControl><Textarea placeholder="Briefly describe this category." {...catField} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name={`categories.${index}.order`}
                    render={({ field: catField }) => (
                      <FormItem>
                        <FormLabel>Display Order *</FormLabel>
                        <FormControl><Input type="number" placeholder="1" {...catField} onChange={e => catField.onChange(parseInt(e.target.value,10) || 0)} /></FormControl>
                         <FormDescription>Lower numbers appear first.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (isEditing ? "Saving Changes..." : "Creating Project...") : (isEditing ? "Save Changes" : "Create Project")}
        </Button>
      </form>
    </Form>
  );
}

