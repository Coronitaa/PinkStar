
// This file acts as a server component to wrap the client component
import type { ProjectFormData } from '@/lib/types';
import { ProjectFormClientPage } from '../ProjectFormClientPage';

export default function NewProjectPage() {
  const handleSubmit = async (data: ProjectFormData) => {
    'use server';
    console.log("New project data submitted (mock):", data);
    // In a real app, you'd save this to Firestore here
    // For example: await db.collection('projects').add(processedData);
    // Then potentially revalidatePath or redirect
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Add New Project</h1>
      <ProjectFormClientPage onSubmit={handleSubmit} />
    </div>
  );
}
