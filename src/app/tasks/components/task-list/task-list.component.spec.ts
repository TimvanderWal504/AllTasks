import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../services/task.service';
import { Dialog } from '@angular/cdk/dialog';
import { signal } from '@angular/core';
import { Task } from '../../models/task.models';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let dialogSpy: jasmine.SpyObj<Dialog>;

  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Buy groceries',
      description: 'Milk, eggs, bread',
      deadline: '2026-03-15',
      priority: 'medium',
      isCompleted: false,
      syncStatus: 'synced',
      createdAt: '2026-03-09T10:00:00.000Z',
      listId: null,
    },
    {
      id: '2',
      title: 'Write tests',
      description: '',
      deadline: null,
      priority: 'high',
      isCompleted: false,
      syncStatus: 'pending',
      createdAt: '2026-03-09T11:00:00.000Z',
      listId: null,
    },
  ];

  beforeEach(async () => {
    const tasksSignal = signal<Task[]>(mockTasks);
    taskServiceSpy = jasmine.createSpyObj('TaskService', ['createTask'], {
      tasks: tasksSignal,
    });
    dialogSpy = jasmine.createSpyObj('Dialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [TaskListComponent, NoopAnimationsModule],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: Dialog, useValue: dialogSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('task list rendering', () => {
    it('should display all tasks from the service', () => {
      expect(component.tasks().length).toBe(2);
    });

    it('should expose the tasks signal from the service', () => {
      expect(component.tasks()).toEqual(mockTasks);
    });
  });

  describe('openCreateTaskDialog', () => {
    it('should open the dialog when openCreateTaskDialog is called', async () => {
      await component.openCreateTaskDialog();
      expect(dialogSpy.open).toHaveBeenCalled();
    });

    it('should open the dialog with the TaskFormComponent', async () => {
      const { TaskFormComponent } = await import('../task-form/task-form.component');
      await component.openCreateTaskDialog();
      expect(dialogSpy.open).toHaveBeenCalledWith(TaskFormComponent, jasmine.any(Object));
    });
  });
});
