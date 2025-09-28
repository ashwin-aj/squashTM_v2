'use client';

import { Folder } from '@/types/squash-tm';
import { Card } from '@/components/ui/card';
import { LoadingSkeleton } from './loading-skeleton';
import { ErrorState } from './error-state';
import { EmptyState } from './empty-state';
import { Check, Folder as FolderIcon } from 'lucide-react';

interface FolderStepProps {
  folders: Folder[];
  selectedFolder: Folder | null;
  loading: boolean;
  error: string | null;
  onSelectFolder: (folder: Folder) => void;
  onRetry: () => void;
}

export function FolderStep({
  folders,
  selectedFolder,
  loading,
  error,
  onSelectFolder,
  onRetry,
}: FolderStepProps) {
  if (loading) {
    return <LoadingSkeleton type="folders" />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  if (folders.length === 0) {
    return <EmptyState type="folders" />;
  }

  return (
    <div className="space-y-3">
      {folders.map((folder) => (
        <Card
          key={folder.id}
          className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedFolder?.id === folder.id
              ? 'ring-2 ring-red-500 bg-red-50 dark:bg-red-950'
              : 'hover:bg-accent'
          }`}
          onClick={() => onSelectFolder(folder)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <FolderIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground">
                  {folder.name}
                </h3>
                {folder.parentId && (
                  <p className="text-sm text-muted-foreground">
                    Subfolder
                  </p>
                )}
              </div>
            </div>
            {selectedFolder?.id === folder.id && (
              <Check className="w-5 h-5 text-red-600 ml-3 flex-shrink-0" />
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}