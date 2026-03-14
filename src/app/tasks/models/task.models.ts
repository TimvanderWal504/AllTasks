export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskSyncStatus = 'synced' | 'pending' | 'error';
export type TaskStatusFilter = 'all' | 'open' | 'completed' | 'today' | 'week';
export type TaskSortField = 'priority' | 'deadline' | 'createdAt';

export interface TaskFilterState {
  status: TaskStatusFilter;
  sort: TaskSortField;
  search: string;
}

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
