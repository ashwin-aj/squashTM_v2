'use client';

import { FileX, FolderOpen, TestTube, ListChecks } from 'lucide-react';

interface EmptyStateProps {
  type: 'projects' | 'folders' | 'testCases' | 'testSteps';
  message?: string;
}

export function EmptyState({ type, message }: EmptyStateProps) {
  const getIcon = () => {
    switch (type) {
      case 'projects':
        return <FileX className="w-12 h-12 text-muted-foreground" />;
      case 'folders':
        return <FolderOpen className="w-12 h-12 text-muted-foreground" />;
      case 'testCases':
        return <TestTube className="w-12 h-12 text-muted-foreground" />;
      case 'testSteps':
        return <ListChecks className="w-12 h-12 text-muted-foreground" />;
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case 'projects':
        return 'No projects found';
      case 'folders':
        return 'No folders available';
      case 'testCases':
        return 'No test cases found';
      case 'testSteps':
        return 'No test steps available';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {getIcon()}
      <p className="text-muted-foreground mt-4">
        {message || getDefaultMessage()}
      </p>
    </div>
  );
}