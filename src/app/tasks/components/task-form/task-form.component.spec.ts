import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFormComponent } from './task-form.component';
import { TaskService } from '../../services/task.service';
import { DialogRef } from '@angular/cdk/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let dialogRefSpy: jasmine.SpyObj<DialogRef<void>>;

  beforeEach(async () => {
    taskServiceSpy = jasmine.createSpyObj('TaskService', ['createTask']);
    dialogRefSpy = jasmine.createSpyObj('DialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [TaskFormComponent, NoopAnimationsModule],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: DialogRef, useValue: dialogRefSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('form initialisation', () => {
    it('should initialise the form with an empty title', () => {
      expect(component.taskForm.get('title')?.value).toBe('');
    });

    it('should initialise the form with an empty description', () => {
      expect(component.taskForm.get('description')?.value).toBe('');
    });

    it('should initialise the form with a null deadline', () => {
      expect(component.taskForm.get('deadline')?.value).toBeNull();
    });

    it('should initialise the form with medium priority', () => {
      expect(component.taskForm.get('priority')?.value).toBe('medium');
    });
  });

  describe('form validation — title', () => {
    it('should be invalid when title is empty', () => {
      component.taskForm.get('title')?.setValue('');
      expect(component.taskForm.get('title')?.valid).toBeFalse();
    });

    it('should show a required error when title is empty and touched', () => {
      const titleControl = component.taskForm.get('title')!;
      titleControl.setValue('');
      titleControl.markAsTouched();
      expect(titleControl.hasError('required')).toBeTrue();
    });

    it('should be invalid when title exceeds 200 characters', () => {
      component.taskForm.get('title')?.setValue('a'.repeat(201));
      expect(component.taskForm.get('title')?.hasError('maxlength')).toBeTrue();
    });

    it('should be valid when title is exactly 200 characters', () => {
      component.taskForm.get('title')?.setValue('a'.repeat(200));
      expect(component.taskForm.get('title')?.valid).toBeTrue();
    });

    it('should be valid when title has at least one character', () => {
      component.taskForm.get('title')?.setValue('My task');
      expect(component.taskForm.get('title')?.valid).toBeTrue();
    });
  });

  describe('form validation — description', () => {
    it('should be valid when description is empty (optional field)', () => {
      component.taskForm.get('description')?.setValue('');
      expect(component.taskForm.get('description')?.valid).toBeTrue();
    });

    it('should be invalid when description exceeds 2000 characters', () => {
      component.taskForm.get('description')?.setValue('a'.repeat(2001));
      expect(component.taskForm.get('description')?.hasError('maxlength')).toBeTrue();
    });

    it('should be valid when description is exactly 2000 characters', () => {
      component.taskForm.get('description')?.setValue('a'.repeat(2000));
      expect(component.taskForm.get('description')?.valid).toBeTrue();
    });
  });

  describe('submitForm', () => {
    it('should not call createTask when the form is invalid', () => {
      component.taskForm.get('title')?.setValue('');
      component.submitForm();
      expect(taskServiceSpy.createTask).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched when form is invalid and submitted', () => {
      component.taskForm.get('title')?.setValue('');
      component.submitForm();
      expect(component.taskForm.get('title')?.touched).toBeTrue();
    });

    it('should call createTask with the correct values when form is valid', () => {
      component.taskForm.setValue({
        title: 'Buy groceries',
        description: 'Milk and eggs',
        deadline: '2026-03-15',
        priority: 'high',
      });
      component.submitForm();
      expect(taskServiceSpy.createTask).toHaveBeenCalledWith({
        title: 'Buy groceries',
        description: 'Milk and eggs',
        deadline: '2026-03-15',
        priority: 'high',
      });
    });

    it('should close the dialog after a successful task creation', () => {
      component.taskForm.setValue({
        title: 'Buy groceries',
        description: '',
        deadline: null,
        priority: 'medium',
      });
      component.submitForm();
      expect(dialogRefSpy.close).toHaveBeenCalled();
    });

    it('should reset the form after successful task creation', () => {
      component.taskForm.setValue({
        title: 'Buy groceries',
        description: '',
        deadline: null,
        priority: 'medium',
      });
      component.submitForm();
      expect(component.taskForm.get('title')?.value).toBe('');
    });
  });

  describe('closeDialog', () => {
    it('should close the dialog when closeDialog is called', () => {
      component.closeDialog();
      expect(dialogRefSpy.close).toHaveBeenCalled();
    });
  });

  describe('isTitleInvalid', () => {
    it('should return false when title is valid and untouched', () => {
      component.taskForm.get('title')?.setValue('Valid title');
      expect(component.isTitleInvalid).toBeFalse();
    });

    it('should return true when title is empty and touched', () => {
      component.taskForm.get('title')?.setValue('');
      component.taskForm.get('title')?.markAsTouched();
      expect(component.isTitleInvalid).toBeTrue();
    });

    it('should return false when title is empty but not touched', () => {
      component.taskForm.get('title')?.setValue('');
      expect(component.isTitleInvalid).toBeFalse();
    });
  });

  describe('isDescriptionInvalid', () => {
    it('should return true when description exceeds 2000 chars and is touched', () => {
      component.taskForm.get('description')?.setValue('a'.repeat(2001));
      component.taskForm.get('description')?.markAsTouched();
      expect(component.isDescriptionInvalid).toBeTrue();
    });

    it('should return false when description is empty', () => {
      component.taskForm.get('description')?.setValue('');
      expect(component.isDescriptionInvalid).toBeFalse();
    });
  });
});
