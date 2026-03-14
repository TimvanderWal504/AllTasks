import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../services/task.service';
import { TaskFilterService } from '../../services/task-filter.service';
import { Dialog } from '@angular/cdk/dialog';
import { signal } from '@angular/core';
import { Task } from '../../models/task.models';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

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
    const filteredTasksSignal = signal<Task[]>(mockTasks);
    taskServiceSpy = jasmine.createSpyObj('TaskService', ['createTask', 'toggleComplete'], {
      tasks: signal<Task[]>(mockTasks),
      filteredTasks: filteredTasksSignal,
    });
    dialogSpy = jasmine.createSpyObj('Dialog', ['open']);

    const filterServiceSpy = jasmine.createSpyObj(
      'TaskFilterService',
      ['setStatus', 'setSort', 'setSearch', 'applyFilter', 'applySort'],
      { filterState: signal({ status: 'all', sort: 'createdAt', search: '' }) }
    );

    await TestBed.configureTestingModule({
      imports: [TaskListComponent, NoopAnimationsModule],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: TaskFilterService, useValue: filterServiceSpy },
        { provide: Dialog, useValue: dialogSpy },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate']),
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
            snapshot: { queryParams: {} },
          },
        },
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
    it('should display the filtered tasks from the service', () => {
      expect(component.tasks().length).toBe(2);
    });

    it('should expose the filteredTasks signal from the service', () => {
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

  describe('onToggleComplete', () => {
    it('should call toggleComplete on the task service with the given task', () => {
      component.onToggleComplete(mockTasks[0]);
      expect(taskServiceSpy.toggleComplete).toHaveBeenCalledWith(mockTasks[0]);
    });
  });
});
