import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
import { TaskService } from '../../services/task.service';
import { CreateTaskRequest, TaskPriority } from '../../models/task.models';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
})
export class TaskFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly taskService = inject(TaskService);
  private readonly dialogRef = inject(DialogRef<void>);

  readonly priorities: TaskPriority[] = ['low', 'medium', 'high'];

  readonly taskForm: FormGroup = this.formBuilder.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.maxLength(2000)]],
    deadline: [null],
    priority: ['medium'],
  });

  get isTitleInvalid(): boolean {
    const control = this.taskForm.get('title')!;
    return control.invalid && control.touched;
  }

  get isDescriptionInvalid(): boolean {
    const control = this.taskForm.get('description')!;
    return control.invalid && control.touched;
  }

  submitForm(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const request = this.buildCreateRequest();
    this.taskService.createTask(request);
    this.taskForm.reset({ title: '', description: '', deadline: null, priority: 'medium' });
    this.dialogRef.close();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  private buildCreateRequest(): CreateTaskRequest {
    const { title, description, deadline, priority } = this.taskForm.value as {
      title: string;
      description: string;
      deadline: string | null;
      priority: TaskPriority;
    };
    return { title, description, deadline, priority };
  }
}
