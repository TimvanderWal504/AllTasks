import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { CreateTaskRequest, Task } from '../models/task.models';

describe('TaskService', () => {
  let service: TaskService;

  const mockRequest: CreateTaskRequest = {
    title: 'Buy groceries',
    description: 'Milk, eggs, bread',
    deadline: '2026-03-15',
    priority: 'medium',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [TaskService] });
    service = TestBed.inject(TaskService);

    spyOn(window.indexedDB, 'open').and.callFake(() => {
      return {} as IDBOpenDBRequest;
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createTask', () => {
    it('should add a new task to the tasks signal immediately', () => {
      const before = service.tasks().length;
      service.createTask(mockRequest);
      expect(service.tasks().length).toBe(before + 1);
    });

    it('should set the task title from the request', () => {
      service.createTask(mockRequest);
      const created = service.tasks()[service.tasks().length - 1];
      expect(created.title).toBe('Buy groceries');
    });

    it('should set the task description from the request', () => {
      service.createTask(mockRequest);
      const created = service.tasks()[service.tasks().length - 1];
      expect(created.description).toBe('Milk, eggs, bread');
    });

    it('should set the task deadline from the request', () => {
      service.createTask(mockRequest);
      const created = service.tasks()[service.tasks().length - 1];
      expect(created.deadline).toBe('2026-03-15');
    });

    it('should set the task priority from the request', () => {
      service.createTask(mockRequest);
      const created = service.tasks()[service.tasks().length - 1];
      expect(created.priority).toBe('medium');
    });

    it('should initialise task as not completed', () => {
      service.createTask(mockRequest);
      const created = service.tasks()[service.tasks().length - 1];
      expect(created.isCompleted).toBeFalse();
    });

    it('should assign a unique id to each created task', () => {
      service.createTask(mockRequest);
      service.createTask({ ...mockRequest, title: 'Another task' });
      const tasks = service.tasks();
      const lastTwo = tasks.slice(-2);
      expect(lastTwo[0].id).not.toBe(lastTwo[1].id);
    });

    it('should set syncStatus to pending for offline support', () => {
      service.createTask(mockRequest);
      const created = service.tasks()[service.tasks().length - 1];
      expect(created.syncStatus).toBe('pending');
    });

    it('should create a task with null listId by default', () => {
      service.createTask(mockRequest);
      const created = service.tasks()[service.tasks().length - 1];
      expect(created.listId).toBeNull();
    });

    it('should create a task with a null deadline when none is provided', () => {
      service.createTask({ ...mockRequest, deadline: null });
      const created = service.tasks()[service.tasks().length - 1];
      expect(created.deadline).toBeNull();
    });

    it('should not mutate the existing tasks array — signal update is immutable', () => {
      service.createTask(mockRequest);
      const snapshotAfterFirst = service.tasks();
      service.createTask({ ...mockRequest, title: 'Second task' });
      expect(service.tasks()).not.toBe(snapshotAfterFirst);
    });
  });

  describe('tasks signal', () => {
    it('should initially return an empty array', () => {
      expect(service.tasks()).toEqual([]);
    });

    it('should reflect each newly created task', () => {
      service.createTask(mockRequest);
      service.createTask({ ...mockRequest, title: 'Task 2' });
      expect(service.tasks().length).toBe(2);
    });
  });

  describe('toggleComplete', () => {
    let existingTask: Task;

    beforeEach(() => {
      service.createTask(mockRequest);
      existingTask = service.tasks()[service.tasks().length - 1];
    });

    it('should mark an open task as completed when toggleComplete is called', () => {
      service.toggleComplete(existingTask);
      const updated = service.tasks().find((t) => t.id === existingTask.id)!;
      expect(updated.isCompleted).toBeTrue();
    });

    it('should mark a completed task as open again when toggleComplete is called a second time', () => {
      service.toggleComplete(existingTask);
      const afterFirstToggle = service.tasks().find((t) => t.id === existingTask.id)!;
      service.toggleComplete(afterFirstToggle);
      const afterSecondToggle = service.tasks().find((t) => t.id === existingTask.id)!;
      expect(afterSecondToggle.isCompleted).toBeFalse();
    });

    it('should not mutate the original task object — signal update is immutable', () => {
      const snapshotBefore = service.tasks();
      service.toggleComplete(existingTask);
      expect(service.tasks()).not.toBe(snapshotBefore);
    });

    it('should leave all other tasks unchanged when one task is toggled', () => {
      service.createTask({ ...mockRequest, title: 'Other task' });
      const otherTask = service.tasks().find((t) => t.title === 'Other task')!;
      service.toggleComplete(existingTask);
      const otherAfterToggle = service.tasks().find((t) => t.id === otherTask.id)!;
      expect(otherAfterToggle.isCompleted).toBeFalse();
    });

    it('should set syncStatus to pending after toggling completion', () => {
      service.toggleComplete(existingTask);
      const updated = service.tasks().find((t) => t.id === existingTask.id)!;
      expect(updated.syncStatus).toBe('pending');
    });

    it('should not change any other task properties when toggling completion', () => {
      service.toggleComplete(existingTask);
      const updated = service.tasks().find((t) => t.id === existingTask.id)!;
      expect(updated.title).toBe(existingTask.title);
      expect(updated.description).toBe(existingTask.description);
      expect(updated.deadline).toBe(existingTask.deadline);
      expect(updated.priority).toBe(existingTask.priority);
      expect(updated.listId).toBe(existingTask.listId);
      expect(updated.createdAt).toBe(existingTask.createdAt);
    });
  });
});
