export interface Project {
  id: number;
  name: string;
  description?: string;
}

export interface Folder {
  id: number;
  name: string;
  parentId?: number;
  projectId: number;
}

export interface TestCase {
  id: number;
  name: string;
  reference?: string;
  script?: string;
  charter?: string;
  session_duration?: number;
  projectId: number;
  folderId?: number;
}

export interface TestStep {
  id: number;
  action?: string;
  expectedResult?: string;
  testCaseId: number;
  stepNumber?: number;
}

export interface APIResponse<T> {
  _embedded?: {
    [key: string]: T[];
  };
  _links?: any;
  page?: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export interface StepwiseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSteps: (steps: TestStep[]) => void;
  preSelectedSteps?: TestStep[];
}

export interface ModalStep {
  id: number;
  title: string;
  description: string;
}