import { Project, Folder, TestCase, TestStep, APIResponse } from '@/types/squash-tm';

// Use Next.js API routes as proxy to avoid CORS issues
const BASE_URL = '/api/squash';

class SquashTMError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'SquashTMError';
  }
}

async function fetchWithErrorHandling<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new SquashTMError(
        `API request failed: ${response.statusText}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof SquashTMError) {
      throw error;
    }
    throw new SquashTMError('Network error occurred');
  }
}

export const squashAPI = {
  async getProjects(page = 0, size = 4): Promise<Project[]> {
    const response = await fetchWithErrorHandling<APIResponse<Project>>(
      `${BASE_URL}/projects?page=${page}&size=${size}`
    );
    
    return response._embedded?.projects || [];
  },

  async getFolders(page = 1, size = 10, projectId?: number): Promise<Folder[]> {
    let url = `${BASE_URL}/folders?page=${page}&size=${size}`;
    if (projectId) {
      url += `&projectId=${projectId}`;
    }
    
    const response = await fetchWithErrorHandling<APIResponse<Folder>>(url);
    return response._embedded?.folders || [];
  },

  async getTestCases(
    page = 1, 
    size = 10, 
    projectId?: number, 
    folderId?: number
  ): Promise<TestCase[]> {
    let url = `${BASE_URL}/test-cases?page=${page}&size=${size}`;
    
    if (projectId) url += `&projectId=${projectId}`;
    if (folderId) url += `&folderId=${folderId}`;
    
    const response = await fetchWithErrorHandling<APIResponse<TestCase>>(url);
    return response._embedded?.testCases || [];
  },

  async getTestStep(stepId: number): Promise<TestStep> {
    return await fetchWithErrorHandling<TestStep>(`${BASE_URL}/test-steps/${stepId}`);
  },

  async getTestSteps(testCaseId: number): Promise<TestStep[]> {
    const response = await fetchWithErrorHandling<APIResponse<TestStep>>(
      `${BASE_URL}/test-steps?testCaseId=${testCaseId}`
    );
    
    return response._embedded?.testSteps || [];
  },
};