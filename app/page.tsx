'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StepwiseModal } from '@/components/stepwise-modal/stepwise-modal';
import { TestStep } from '@/types/squash-tm';
import { Plus, Trash2, Settings } from 'lucide-react';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSteps, setSelectedSteps] = useState<TestStep[]>([]);

  const handleAddSteps = (steps: TestStep[]) => {
    // Merge with existing steps, avoiding duplicates
    setSelectedSteps(prevSteps => {
      const existingIds = new Set(prevSteps.map(step => step.id));
      const newSteps = steps.filter(step => !existingIds.has(step.id));
      return [...prevSteps, ...newSteps];
    });
  };

  const handleRemoveStep = (stepId: number) => {
    setSelectedSteps(prevSteps => prevSteps.filter(step => step.id !== stepId));
  };

  const handleClearAll = () => {
    setSelectedSteps([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white dark:from-red-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            SquashTM Test Steps Manager
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Select and manage test steps from your SquashTM projects with an intuitive stepwise interface.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Test Steps Selection
              </h2>
              <Settings className="w-6 h-6 text-red-600" />
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Use the stepwise modal to navigate through your projects, folders, test cases, 
              and select the specific test steps you need.
            </p>
            
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Select Test Steps
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Selected Steps
              </h2>
              <Badge variant="outline" className="text-red-600 border-red-600">
                {selectedSteps.length} selected
              </Badge>
            </div>

            {selectedSteps.length > 0 ? (
              <div className="space-y-4">
                <div className="max-h-64 overflow-y-auto space-y-3">
                  {selectedSteps.map((step) => (
                    <div 
                      key={step.id} 
                      className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {step.stepNumber && (
                            <Badge variant="outline" className="text-xs">
                              Step {step.stepNumber}
                            </Badge>
                          )}
                        </div>
                        {step.action && (
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {step.action}
                          </p>
                        )}
                        {step.expectedResult && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                            {step.expectedResult}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveStep(step.id)}
                        className="ml-2 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={handleClearAll}
                  className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  No test steps selected yet. Click the button above to get started.
                </p>
              </div>
            )}
          </Card>
        </div>

        <StepwiseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddSteps={handleAddSteps}
          preSelectedSteps={selectedSteps}
        />
      </div>
    </div>
  );
}