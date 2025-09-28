'use client';

import { useState, useEffect, useCallback } from 'react';
import { Project, Folder, TestCase, TestStep } from '@/types/squash-tm';
import { squashAPI } from '@/lib/api/squash-tm';

export function useSquashData() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [testSteps, setTestSteps] = useState<TestStep[]>([]);
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null);
  const [selectedSteps, setSelectedSteps] = useState<TestStep[]>([]);
  
  const [loading, setLoading] = useState({
    projects: false,
    folders: false,
    testCases: false,
    testSteps: false,
  });

  const [errors, setErrors] = useState({
    projects: null as string | null,
    folders: null as string | null,
    testCases: null as string | null,
    testSteps: null as string | null,
  });

  const setError = (key: keyof typeof errors, error: string | null) => {
    setErrors(prev => ({ ...prev, [key]: error }));
  };

  const setLoadingState = (key: keyof typeof loading, isLoading: boolean) => {
    setLoading(prev => ({ ...prev, [key]: isLoading }));
  };

  const loadProjects = useCallback(async () => {
    setLoadingState('projects', true);
    setError('projects', null);
    
    try {
      const projectsData = await squashAPI.getProjects();
      setProjects(projectsData);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load projects';
      setError('projects', message);
      setProjects([]);
    } finally {
      setLoadingState('projects', false);
    }
  }, []);

  const loadFolders = useCallback(async (projectId?: number) => {
    setLoadingState('folders', true);
    setError('folders', null);
    
    try {
      const foldersData = await squashAPI.getFolders(1, 10, projectId);
      setFolders(foldersData);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load folders';
      setError('folders', message);
      setFolders([]);
    } finally {
      setLoadingState('folders', false);
    }
  }, []);

  const loadTestCases = useCallback(async (projectId?: number, folderId?: number) => {
    setLoadingState('testCases', true);
    setError('testCases', null);
    
    try {
      const testCasesData = await squashAPI.getTestCases(1, 10, projectId, folderId);
      setTestCases(testCasesData);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load test cases';
      setError('testCases', message);
      setTestCases([]);
    } finally {
      setLoadingState('testCases', false);
    }
  }, []);

  const loadTestSteps = useCallback(async (testCaseId: number) => {
    setLoadingState('testSteps', true);
    setError('testSteps', null);
    
    try {
      const testStepsData = await squashAPI.getTestSteps(testCaseId);
      setTestSteps(testStepsData);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load test steps';
      setError('testSteps', message);
      setTestSteps([]);
    } finally {
      setLoadingState('testSteps', false);
    }
  }, []);

  const selectProject = useCallback((project: Project | null) => {
    setSelectedProject(project);
    setSelectedFolder(null);
    setSelectedTestCase(null);
    setFolders([]);
    setTestCases([]);
    setTestSteps([]);
    
    if (project) {
      loadFolders(project.id);
    }
  }, [loadFolders]);

  const selectFolder = useCallback((folder: Folder | null) => {
    setSelectedFolder(folder);
    setSelectedTestCase(null);
    setTestCases([]);
    setTestSteps([]);
    
    if (selectedProject) {
      loadTestCases(selectedProject.id, folder?.id);
    }
  }, [selectedProject, loadTestCases]);

  const selectTestCase = useCallback((testCase: TestCase | null) => {
    setSelectedTestCase(testCase);
    setTestSteps([]);
    
    if (testCase) {
      loadTestSteps(testCase.id);
    }
  }, [loadTestSteps]);

  const toggleStepSelection = useCallback((step: TestStep) => {
    setSelectedSteps(prev => {
      const isSelected = prev.find(s => s.id === step.id);
      if (isSelected) {
        return prev.filter(s => s.id !== step.id);
      } else {
        return [...prev, step];
      }
    });
  }, []);

  const clearSelections = useCallback(() => {
    setSelectedProject(null);
    setSelectedFolder(null);
    setSelectedTestCase(null);
    setSelectedSteps([]);
    setFolders([]);
    setTestCases([]);
    setTestSteps([]);
  }, []);

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return {
    // Data
    projects,
    folders,
    testCases,
    testSteps,
    
    // Selections
    selectedProject,
    selectedFolder,
    selectedTestCase,
    selectedSteps,
    
    // Loading states
    loading,
    errors,
    
    // Actions
    selectProject,
    selectFolder,
    selectTestCase,
    toggleStepSelection,
    setSelectedSteps,
    clearSelections,
    
    // Manual loaders
    loadProjects,
    loadFolders,
    loadTestCases,
    loadTestSteps,
  };
}