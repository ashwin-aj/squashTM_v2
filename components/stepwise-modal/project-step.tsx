'use client';

import { Project } from '@/types/squash-tm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoadingSkeleton } from './loading-skeleton';
import { ErrorState } from './error-state';
import { EmptyState } from './empty-state';
import { Check } from 'lucide-react';

interface ProjectStepProps {
  projects: Project[];
  selectedProject: Project | null;
  loading: boolean;
  error: string | null;
  onSelectProject: (project: Project) => void;
  onRetry: () => void;
}

export function ProjectStep({
  projects,
  selectedProject,
  loading,
  error,
  onSelectProject,
  onRetry,
}: ProjectStepProps) {
  if (loading) {
    return <LoadingSkeleton type="projects" />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  if (projects.length === 0) {
    return <EmptyState type="projects" />;
  }

  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <Card
          key={project.id}
          className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedProject?.id === project.id
              ? 'ring-2 ring-red-500 bg-red-50 dark:bg-red-950'
              : 'hover:bg-accent'
          }`}
          onClick={() => onSelectProject(project)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">
                {project.name}
              </h3>
              {project.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {project.description}
                </p>
              )}
            </div>
            {selectedProject?.id === project.id && (
              <Check className="w-5 h-5 text-red-600 ml-3 flex-shrink-0" />
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}