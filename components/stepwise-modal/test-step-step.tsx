'use client';

import { TestStep } from '@/types/squash-tm';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { LoadingSkeleton } from './loading-skeleton';
import { ErrorState } from './error-state';
import { EmptyState } from './empty-state';
import { ListChecks } from 'lucide-react';

interface TestStepStepProps {
  testSteps: TestStep[];
  selectedSteps: TestStep[];
  loading: boolean;
  error: string | null;
  onToggleStep: (step: TestStep) => void;
  onRetry: () => void;
}

export function TestStepStep({
  testSteps,
  selectedSteps,
  loading,
  error,
  onToggleStep,
  onRetry,
}: TestStepStepProps) {
  const isSelected = (stepId: number) => 
    selectedSteps.some(step => step.id === stepId);

  if (loading) {
    return <LoadingSkeleton type="testSteps" />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  if (testSteps.length === 0) {
    return <EmptyState type="testSteps" />;
  }

  return (
    <div className="space-y-3">
      {testSteps.map((step) => (
        <Card
          key={step.id}
          className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
            isSelected(step.id)
              ? 'ring-2 ring-red-500 bg-red-50 dark:bg-red-950'
              : 'hover:bg-accent'
          }`}
          onClick={() => onToggleStep(step)}
        >
          <div className="flex items-start gap-3">
            <Checkbox
              checked={isSelected(step.id)}
              className="mt-1 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
              readOnly
            />
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <ListChecks className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {step.stepNumber && (
                    <Badge variant="outline" className="text-xs">
                      Step {step.stepNumber}
                    </Badge>
                  )}
                </div>
                {step.action && (
                  <div className="mb-2">
                    <h4 className="text-sm font-medium text-foreground">Action:</h4>
                    <p className="text-sm text-muted-foreground">
                      {step.action}
                    </p>
                  </div>
                )}
                {step.expectedResult && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Expected Result:</h4>
                    <p className="text-sm text-muted-foreground">
                      {step.expectedResult}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}