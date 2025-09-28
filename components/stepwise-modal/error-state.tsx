'use client';

import { TriangleAlert as AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Something went wrong
      </h3>
      <p className="text-muted-foreground mb-4 max-w-sm">
        {error}
      </p>
      <Button 
        onClick={onRetry} 
        variant="outline" 
        size="sm"
        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </Button>
    </div>
  );
}