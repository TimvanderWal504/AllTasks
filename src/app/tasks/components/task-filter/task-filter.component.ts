import { Component, inject, Signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskFilterService } from '../../services/task-filter.service';
import { TaskFilterState, TaskSortField, TaskStatusFilter } from '../../models/task.models';
import { appConfig } from '../../../shared/config/app.config';

@Component({
  selector: 'app-task-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFilterComponent implements OnInit {
  private readonly taskFilterService = inject(TaskFilterService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly filterState: Signal<TaskFilterState> = this.taskFilterService.filterState;

  readonly statusOptions: TaskStatusFilter[] = ['all', 'open', 'completed', 'today', 'week'];
  readonly sortOptions: TaskSortField[] = ['createdAt', 'priority', 'deadline'];

  ngOnInit(): void {
    this.readQueryParams();
  }

  onStatusChange(status: TaskStatusFilter): void {
    this.taskFilterService.setStatus(status);
    this.updateQueryParams({ [appConfig.tasks.filter.queryParamStatus]: status });
  }

  onSortChange(sort: TaskSortField): void {
    this.taskFilterService.setSort(sort);
    this.updateQueryParams({ [appConfig.tasks.filter.queryParamSort]: sort });
  }

  onSearchChange(search: string): void {
    this.taskFilterService.setSearch(search);
    const searchParam = search || null;
    this.updateQueryParams({ [appConfig.tasks.filter.queryParamSearch]: searchParam });
  }

  private readQueryParams(): void {
    const params = this.activatedRoute.snapshot.queryParams;
    const status = params[appConfig.tasks.filter.queryParamStatus] as TaskStatusFilter;
    const sort = params[appConfig.tasks.filter.queryParamSort] as TaskSortField;
    const search = params[appConfig.tasks.filter.queryParamSearch] as string;

    if (status) this.taskFilterService.setStatus(status);
    if (sort) this.taskFilterService.setSort(sort);
    if (search) this.taskFilterService.setSearch(search);
  }

  private updateQueryParams(params: Record<string, string | null>): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }
}
