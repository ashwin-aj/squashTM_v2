'use client';

import { TestCase } from '@/types/squash-tm';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSkeleton } from './loading-skeleton';
import { ErrorState } from './error-state';
import { EmptyState } from './empty-state';
import { Check, TestTube } from 'lucide-react';

interface TestCaseStepProps {
  testCases: TestCase[];
  selectedTestCase: TestCase | null;
  loading: boolean;
  error: string | null;
  onSelectTestCase: (testCase: TestCase) => void;
  onRetry: () => void;
}

export function TestCaseStep({
  testCases,
  selectedTestCase,
  loading,
  error,
  onSelectTestCase,
  onRetry,
}: TestCaseStepProps) {
  if (loading) {
    return <LoadingSkeleton type="testCases" />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  if (testCases.length === 0) {
    return <EmptyState type="testCases" />;
  }

  return (
    <div className="space-y-3">
      {testCases.map((testCase) => (
        <Card
          key={testCase.id}
          className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedTestCase?.id === testCase.id
              ? 'ring-2 ring-red-500 bg-red-50 dark:bg-red-950'
              : 'hover:bg-accent'
          }`}
          onClick={() => onSelectTestCase(testCase)}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <TestTube className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">
                  {testCase.name}
                </h3>
                {testCase.reference && (
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {testCase.reference}
                    </Badge>
                  </div>
                )}
                {testCase.session_duration && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Duration: {testCase.session_duration} min
                  </p>
                )}
              </div>
            </div>
            {selectedTestCase?.id === testCase.id && (
              <Check className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}