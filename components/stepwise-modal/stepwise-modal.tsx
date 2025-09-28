'use client';

import { useEffect, useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StepwiseModalProps, ModalStep, TestStep } from '@/types/squash-tm';
import { useSquashData } from '@/hooks/use-squash-data';
import { storage } from '@/lib/storage';
import { StepIndicator } from './step-indicator';
import { ProjectStep } from './project-step';
import { FolderStep } from './folder-step';
import { TestCaseStep } from './test-case-step';
import { TestStepStep } from './test-step-step';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';

const modalSteps: ModalStep[] = [
  { id: 1, title: 'Project', description: 'Select project' },
  { id: 2, title: 'Folder', description: 'Choose folder' },
  { id: 3, title: 'Test Case', description: 'Pick test case' },
  { id: 4, title: 'Steps', description: 'Select steps' },
];

export function StepwiseModal({
  isOpen,
  onClose,
  onAddSteps,
  preSelectedSteps = [],
}: StepwiseModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const {
    projects,
    folders,
    testCases,
    testSteps,
    selectedProject,
    selectedFolder,
    selectedTestCase,
    selectedSteps,
    loading,
    errors,
    selectProject,
    selectFolder,
    selectTestCase,
    toggleStepSelection,
    setSelectedSteps,
    clearSelections,
    loadProjects,
    loadFolders,
    loadTestCases,
    loadTestSteps,
  } = useSquashData();

  // Initialize with pre-selected steps and stored data
  useEffect(() => {
    if (isOpen) {
      const storedSteps = storage.getSelectedSteps();
      const stepsToSelect = preSelectedSteps.length > 0 ? preSelectedSteps : storedSteps;
      setSelectedSteps(stepsToSelect);
    }
  }, [isOpen, preSelectedSteps, setSelectedSteps]);

  // Update completed steps based on selections
  useEffect(() => {
    const newCompletedSteps = new Set<number>();
    
    if (selectedProject) newCompletedSteps.add(1);
    if (selectedFolder) newCompletedSteps.add(2);
    if (selectedTestCase) newCompletedSteps.add(3);
    if (selectedSteps.length > 0) newCompletedSteps.add(4);
    
    setCompletedSteps(newCompletedSteps);
  }, [selectedProject, selectedFolder, selectedTestCase, selectedSteps]);

  const handleStepClick = useCallback((stepId: number) => {
    setCurrentStep(stepId);
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleAddSteps = useCallback(() => {
    if (selectedSteps.length > 0) {
      storage.setSelectedSteps(selectedSteps);
      onAddSteps(selectedSteps);
      onClose();
    }
  }, [selectedSteps, onAddSteps, onClose]);

  const handleClose = useCallback(() => {
    if (selectedSteps.length > 0) {
      storage.setSelectedSteps(selectedSteps);
    }
    onClose();
  }, [selectedSteps, onClose]);

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!selectedProject;
      case 2: return !!selectedFolder;
      case 3: return !!selectedTestCase;
      case 4: return selectedSteps.length > 0;
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProjectStep
            projects={projects}
            selectedProject={selectedProject}
            loading={loading.projects}
            error={errors.projects}
            onSelectProject={selectProject}
            onRetry={loadProjects}
          />
        );
      case 2:
        return (
          <FolderStep
            folders={folders}
            selectedFolder={selectedFolder}
            loading={loading.folders}
            error={errors.folders}
            onSelectFolder={selectFolder}
            onRetry={() => selectedProject && loadFolders(selectedProject.id)}
          />
        );
      case 3:
        return (
          <TestCaseStep
            testCases={testCases}
            selectedTestCase={selectedTestCase}
            loading={loading.testCases}
            error={errors.testCases}
            onSelectTestCase={selectTestCase}
            onRetry={() => selectedProject && loadTestCases(selectedProject.id, selectedFolder?.id)}
          />
        );
      case 4:
        return (
          <TestStepStep
            testSteps={testSteps}
            selectedSteps={selectedSteps}
            loading={loading.testSteps}
            error={errors.testSteps}
            onToggleStep={toggleStepSelection}
            onRetry={() => selectedTestCase && loadTestSteps(selectedTestCase.id)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] md:h-[80vh] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b bg-red-50 dark:bg-red-950">
          <DialogTitle className="text-xl font-semibold text-red-800 dark:text-red-200">
            Select Test Steps
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col min-h-0">
          <div className="px-6 py-4 border-b">
            <StepIndicator
              steps={modalSteps}
              currentStep={currentStep}
              onStepClick={handleStepClick}
              completedSteps={completedSteps}
            />
          </div>

          <ScrollArea className="flex-1 p-6">
            {renderStepContent()}
          </ScrollArea>

          <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50 dark:bg-gray-900">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {selectedSteps.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {selectedSteps.length} step{selectedSteps.length !== 1 ? 's' : ''} selected
                </span>
              )}
            </div>

            <div className="flex gap-2">
              {currentStep === 4 ? (
                <Button
                  onClick={handleAddSteps}
                  disabled={selectedSteps.length === 0}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Steps ({selectedSteps.length})
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}