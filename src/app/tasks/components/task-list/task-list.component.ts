import { Component, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.models';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
})
export class TaskListComponent {
  private readonly dialog = inject(Dialog);
  private readonly taskService = inject(TaskService);

  readonly tasks: Signal<Task[]> = this.taskService.tasks;

  openCreateTaskDialog(): Promise<void> {
    return import('../task-form/task-form.component').then(({ TaskFormComponent }) => {
      this.dialog.open(TaskFormComponent, {
        width: '100%',
        maxWidth: '32rem',
        panelClass: 'task-dialog-panel',
      });
    });
  }
}
