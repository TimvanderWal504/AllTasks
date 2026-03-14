import { Injectable, signal } from '@angular/core';
import { Task, TaskFilterState, TaskSortField, TaskStatusFilter } from '../models/task.models';
import { appConfig } from '../../shared/config/app.config';

const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

@Injectable({ providedIn: 'root' })
export class TaskFilterService {
  readonly filterState = signal<TaskFilterState>({
    status: appConfig.tasks.filter.defaultStatus as TaskStatusFilter,
    sort: appConfig.tasks.filter.defaultSort as TaskSortField,
    search: '',
  });

  setStatus(status: TaskStatusFilter): void {
    this.filterState.update((current) => ({ ...current, status }));
  }

  setSort(sort: TaskSortField): void {
    this.filterState.update((current) => ({ ...current, sort }));
  }

  setSearch(search: string): void {
    this.filterState.update((current) => ({ ...current, search }));
  }

  applyFilter(tasks: Task[], state: TaskFilterState): Task[] {
    return tasks
      .filter((task) => this.matchesStatus(task, state.status))
      .filter((task) => this.matchesSearch(task, state.search));
  }

  applySort(tasks: Task[], state: TaskFilterState): Task[] {
    return [...tasks].sort((a, b) => this.compareByField(a, b, state.sort));
  }

  private matchesStatus(task: Task, status: TaskStatusFilter): boolean {
    if (status === 'all') return true;
    if (status === 'open') return !task.isCompleted;
    if (status === 'completed') return task.isCompleted;
    if (status === 'today') return !task.isCompleted && this.isToday(task.deadline);
    if (status === 'week') return !task.isCompleted && this.isWithinNextSevenDays(task.deadline);
    return true;
  }

  private matchesSearch(task: Task, search: string): boolean {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      task.title.toLowerCase().includes(term) ||
      task.description.toLowerCase().includes(term)
    );
  }

  private isToday(deadline: string | null): boolean {
    if (!deadline) return false;
    const today = new Date().toISOString().split('T')[0];
    return deadline === today;
  }

  private isWithinNextSevenDays(deadline: string | null): boolean {
    if (!deadline) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    const diffMs = deadlineDate.getTime() - today.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  }

  private compareByField(a: Task, b: Task, sort: TaskSortField): number {
    if (sort === 'priority') return this.compareByPriority(a, b);
    if (sort === 'deadline') return this.compareByDeadline(a, b);
    return this.compareByCreatedAt(a, b);
  }

  private compareByPriority(a: Task, b: Task): number {
    return (PRIORITY_ORDER[a.priority] ?? 3) - (PRIORITY_ORDER[b.priority] ?? 3);
  }

  private compareByDeadline(a: Task, b: Task): number {
    if (!a.deadline && !b.deadline) return 0;
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return a.deadline.localeCompare(b.deadline);
  }

  private compareByCreatedAt(a: Task, b: Task): number {
    return a.createdAt.localeCompare(b.createdAt);
  }
}
