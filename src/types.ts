// types.ts
export interface Task {
    id: number;
    name: string;
    description: string;
    completed: boolean;
  }
  
  export type ActiveTab = 'all' | 'pending' | 'completed';