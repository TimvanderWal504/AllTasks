export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskSyncStatus = 'synced' | 'pending' | 'error';

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string | null;
  priority: TaskPriority;
  isCompleted: boolean;
  syncStatus: TaskSyncStatus;
  createdAt: string;
  listId: string | null;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  deadline: string | null;
  priority: TaskPriority;
}
