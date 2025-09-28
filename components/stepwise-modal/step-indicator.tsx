'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
  completedSteps: Set<number>;
}

export function StepIndicator({ 
  steps, 
  currentStep, 
  onStepClick, 
  completedSteps 
}: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = completedSteps.has(step.id);
        const isClickable = isCompleted || Math.abs(currentStep - step.id) <= 1;

        return (
          <div key={step.id} className="flex items-center flex-1">
            <button
              onClick={() => isClickable && onStepClick(step.id)}
              disabled={!isClickable}
              className={cn(
                "relative flex flex-col items-center group",
                isClickable ? "cursor-pointer" : "cursor-not-allowed"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-200",
                  isActive
                    ? "border-red-600 bg-red-600 text-white"
                    : isCompleted
                    ? "border-red-600 bg-red-600 text-white"
                    : "border-gray-300 bg-white text-gray-500",
                  isClickable && "group-hover:border-red-500"
                )}
              >
                {isCompleted && currentStep !== step.id ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              <div className="mt-2 text-center">
                <div
                  className={cn(
                    "text-sm font-medium",
                    isActive
                      ? "text-red-600"
                      : isCompleted
                      ? "text-red-600"
                      : "text-gray-500"
                  )}
                >
                  {step.title}
                </div>
                <div className="text-xs text-gray-400 hidden sm:block">
                  {step.description}
                </div>
              </div>
            </button>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-4 transition-colors duration-200",
                  isCompleted && completedSteps.has(steps[index + 1].id)
                    ? "bg-red-600"
                    : "bg-gray-300"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}