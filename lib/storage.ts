import { TestStep } from '@/types/squash-tm';

const STORAGE_KEY = 'squash-tm-selected-steps';

export const storage = {
  getSelectedSteps(): TestStep[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  setSelectedSteps(steps: TestStep[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(steps));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  clearSelectedSteps(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};