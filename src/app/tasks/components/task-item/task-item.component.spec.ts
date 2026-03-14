import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskItemComponent } from './task-item.component';
import { Task } from '../../models/task.models';
import { By } from '@angular/platform-browser';

describe('TaskItemComponent', () => {
  let component: TaskItemComponent;
  let fixture: ComponentFixture<TaskItemComponent>;

  const openTask: Task = {
    id: '1',
    title: 'Buy groceries',
    description: 'Milk, eggs, bread',
    deadline: '2026-03-15',
    priority: 'medium',
    isCompleted: false,
    syncStatus: 'synced',
    createdAt: '2026-03-09T10:00:00.000Z',
    listId: null,
  };

  const completedTask: Task = {
    ...openTask,
    id: '2',
    isCompleted: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('task', openTask);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('task title rendering', () => {
    it('should display the task title', () => {
      const titleElement = fixture.debugElement.query(By.css('[data-testid="task-title"]'));
      expect(titleElement.nativeElement.textContent.trim()).toBe('Buy groceries');
    });

    it('should apply a line-through style when the task is completed', () => {
      fixture.componentRef.setInput('task', completedTask);
      fixture.detectChanges();
      const titleElement = fixture.debugElement.query(By.css('[data-testid="task-title"]'));
      expect(titleElement.nativeElement.classList).toContain('line-through');
    });

    it('should not apply a line-through style when the task is open', () => {
      const titleElement = fixture.debugElement.query(By.css('[data-testid="task-title"]'));
      expect(titleElement.nativeElement.classList).not.toContain('line-through');
    });
  });

  describe('completion checkbox', () => {
    it('should render a checkbox for the task', () => {
      const checkbox = fixture.debugElement.query(By.css('[data-testid="task-checkbox"]'));
      expect(checkbox).toBeTruthy();
    });

    it('should have the checkbox checked when the task is completed', () => {
      fixture.componentRef.setInput('task', completedTask);
      fixture.detectChanges();
      const checkbox = fixture.debugElement.query(By.css('[data-testid="task-checkbox"]'));
      expect(checkbox.nativeElement.checked).toBeTrue();
    });

    it('should have the checkbox unchecked when the task is open', () => {
      const checkbox = fixture.debugElement.query(By.css('[data-testid="task-checkbox"]'));
      expect(checkbox.nativeElement.checked).toBeFalse();
    });

    it('should emit toggleComplete with the task when the checkbox is clicked', () => {
      spyOn(component.toggleComplete, 'emit');
      const checkbox = fixture.debugElement.query(By.css('[data-testid="task-checkbox"]'));
      checkbox.nativeElement.click();
      expect(component.toggleComplete.emit).toHaveBeenCalledWith(openTask);
    });
  });

  describe('priority badge', () => {
    it('should display the task priority', () => {
      const badge = fixture.debugElement.query(By.css('[data-testid="task-priority"]'));
      expect(badge.nativeElement.textContent.trim()).toBe('medium');
    });
  });

  describe('deadline display', () => {
    it('should display the deadline when the task has one', () => {
      const deadlineElement = fixture.debugElement.query(By.css('[data-testid="task-deadline"]'));
      expect(deadlineElement).toBeTruthy();
      expect(deadlineElement.nativeElement.textContent.trim()).toBe('2026-03-15');
    });

    it('should not display a deadline element when the task has none', () => {
      fixture.componentRef.setInput('task', { ...openTask, deadline: null });
      fixture.detectChanges();
      const deadlineElement = fixture.debugElement.query(By.css('[data-testid="task-deadline"]'));
      expect(deadlineElement).toBeNull();
    });
  });

  describe('sync status indicator', () => {
    it('should show an offline indicator when syncStatus is pending', () => {
      fixture.componentRef.setInput('task', { ...openTask, syncStatus: 'pending' });
      fixture.detectChanges();
      const syncIndicator = fixture.debugElement.query(By.css('[data-testid="task-sync-pending"]'));
      expect(syncIndicator).toBeTruthy();
    });

    it('should not show an offline indicator when syncStatus is synced', () => {
      const syncIndicator = fixture.debugElement.query(By.css('[data-testid="task-sync-pending"]'));
      expect(syncIndicator).toBeNull();
    });
  });
});
