import { Component, inject, Signal, ChangeDetectionStrategy } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.models';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskFilterComponent } from '../task-filter/task-filter.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskItemComponent, TaskFilterComponent],
  templateUrl: './task-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent {
  private readonly dialog = inject(Dialog);
  private readonly taskService = inject(TaskService);

  readonly tasks: Signal<Task[]> = this.taskService.filteredTasks;

  openCreateTaskDialog(): Promise<void> {
    return import('../task-form/task-form.component').then(({ TaskFormComponent }) => {
      this.dialog.open(TaskFormComponent, {
        width: '100%',
        maxWidth: '32rem',
        panelClass: 'task-dialog-panel',
      });
    });
  }

  onToggleComplete(task: Task): void {
    this.taskService.toggleComplete(task);
  }
}
