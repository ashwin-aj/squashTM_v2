'use client';

import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSkeletonProps {
  type: 'projects' | 'folders' | 'testCases' | 'testSteps';
}

export function LoadingSkeleton({ type }: LoadingSkeletonProps) {
  const getSkeletonCount = () => {
    switch (type) {
      case 'projects':
        return 3;
      case 'folders':
        return 4;
      case 'testCases':
        return 5;
      case 'testSteps':
        return 3;
      default:
        return 3;
    }
  };

  const getItemHeight = () => {
    switch (type) {
      case 'testSteps':
        return 'h-24';
      case 'testCases':
        return 'h-20';
      default:
        return 'h-16';
    }
  };

  return (
    <div className="space-y-3">
      {Array.from({ length: getSkeletonCount() }).map((_, index) => (
        <div key={index} className={`${getItemHeight()} p-4 rounded-lg border bg-card`}>
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            {(type === 'testCases' || type === 'testSteps') && (
              <Skeleton className="h-3 w-1/2" />
            )}
            {type === 'testSteps' && (
              <>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}