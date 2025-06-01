
'use client';

import type { ProjectFormData } from '@/lib/types';
import { ProjectForm } from './ProjectForm';

interface ProjectFormClientPageProps {
  initialData?: Partial<ProjectFormData>;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  isEditing?: boolean;
}

// This client component wrapper is necessary because ProjectForm uses hooks like useForm
// and the page itself (NewProjectPage, EditProjectPage) might be a Server Component
// if it needs to perform async operations like fetching initial data.
export function ProjectFormClientPage({ initialData, onSubmit, isEditing }: ProjectFormClientPageProps) {
  return (
    <ProjectForm
      initialData={initialData}
      onSubmit={onSubmit}
      isEditing={isEditing}
    />
  );
}
