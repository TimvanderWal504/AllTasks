import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.models';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItemComponent {
  @Input({ required: true }) task!: Task;
  @Output() readonly toggleComplete = new EventEmitter<Task>();

  onCheckboxChange(): void {
    this.toggleComplete.emit(this.task);
  }
}
