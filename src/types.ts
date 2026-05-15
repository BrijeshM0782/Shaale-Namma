export type Language = 'en' | 'kn';

export interface Meal {
  id: string;
  imageUrl: string;
  menuEnglish: string;
  menuKannada: string;
  date: string; // YYYY-MM-DD
}

export interface Facility {
  id: string;
  imageUrl: string;
  category: 'Labs' | 'Library' | 'Toilets' | 'Classroom';
  descriptionEnglish: string;
  descriptionKannada: string;
}

export interface Student {
  id: string;
  name: string;
  achievementEnglish: string;
  achievementKannada: string;
  imageUrl: string;
}

export interface Feedback {
  id: string;
  message: string;
  isAnonymous: boolean;
  timestamp: string;
  userId?: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}
