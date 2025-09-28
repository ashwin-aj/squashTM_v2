const SQUASH_BASE_URL = 'https://demo.squashtest.org/squash/api/rest/latest';
const SQUASH_AUTH_TOKEN = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwidXVpZCI6IjA0Zjc0NTc5LTg0YTAtNDQ0MS04OTNmLTY4NDEzZDI3YmFjMyIsInBlcm1pc3Npb25zIjoiUkVBRF9XUklURSIsImlhdCI6MTc1ODg5NTAwMiwiZXhwIjoxNzkwMjk0NDAwfQ.GM9kkdH9ML7GsAF10KsFzCj8uMewNcV5qVzF-sTFsabssETEd0gS2qjxBhSV13_AO1Umxga0Y8emo5LhJ8oZpA';

export class SquashApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'SquashApiError';
  }
}

async function fetchWithRetry(url: string, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${SQUASH_AUTH_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new SquashApiError(`HTTP error! status: ${response.status}`, response.status);
      }
      
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
}

export const squashApi = {
  async getProjects(page = 0, size = 10) {
    return fetchWithRetry(`${SQUASH_BASE_URL}/projects?page=${page}&size=${size}`);
  },

  async getFolders(page = 1, size = 20) {
    return fetchWithRetry(`${SQUASH_BASE_URL}/test-case-folders?page=${page}&size=${size}`);
  },

  async getTestCases(page = 1, size = 20) {
    const fields = 'name,reference,script,charter,session_duration';
    return fetchWithRetry(`${SQUASH_BASE_URL}/test-cases?page=${page}&size=${size}&fields=${fields}`);
  },

  async getTestSteps(testCaseId: number) {
    return fetchWithRetry(`${SQUASH_BASE_URL}/test-cases/${testCaseId}/steps`);
  },

  async getTestStep(stepId: number) {
    return fetchWithRetry(`${SQUASH_BASE_URL}/test-steps/${stepId}`);
  }
};