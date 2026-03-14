import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';
import { ListFormDialogComponent } from './list-form-dialog.component';
import { ListService } from '../../services/list.service';
import { List } from '../../models/list.models';

describe('ListFormDialogComponent', () => {
  let mockListService: jasmine.SpyObj<ListService>;

  beforeEach(async () => {
    mockListService = jasmine.createSpyObj('ListService', ['createList', 'renameList']);

    await TestBed.configureTestingModule({
      imports: [ListFormDialogComponent],
      providers: [{ provide: ListService, useValue: mockListService }],
    })
      .overrideComponent(ListFormDialogComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  it('should be created', () => {
    const fixture = TestBed.createComponent(ListFormDialogComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render a name input field', () => {
    const fixture = TestBed.createComponent(ListFormDialogComponent);
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('[data-testid="list-name-input"]'));
    expect(input).toBeTruthy();
  });

  it('should render a save button', () => {
    const fixture = TestBed.createComponent(ListFormDialogComponent);
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('[data-testid="save-list-button"]'));
    expect(btn).toBeTruthy();
  });

  it('should render a cancel button', () => {
    const fixture = TestBed.createComponent(ListFormDialogComponent);
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('[data-testid="cancel-button"]'));
    expect(btn).toBeTruthy();
  });

  it('should disable the save button when the name field is empty', () => {
    const fixture = TestBed.createComponent(ListFormDialogComponent);
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('[data-testid="save-list-button"]'));
    expect(btn.nativeElement.disabled).toBeTrue();
  });

  it('should call createList when the form is submitted with a valid name and no existing list', () => {
    const fixture = TestBed.createComponent(ListFormDialogComponent);
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('[data-testid="list-name-input"]'));
    input.nativeElement.value = 'My New List';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('[data-testid="save-list-button"]'));
    btn.nativeElement.click();
    expect(mockListService.createList).toHaveBeenCalledWith(
      jasmine.objectContaining({ name: 'My New List' }),
    );
  });

  it('should call renameList when the form is submitted with an existing list provided', () => {
    const fixture = TestBed.createComponent(ListFormDialogComponent);
    const existingList: List = {
      id: 'list-42',
      ownerId: 'user-1',
      name: 'Old Name',
      createdAt: new Date().toISOString(),
    };
    fixture.componentInstance.existingList = existingList;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('[data-testid="list-name-input"]'));
    input.nativeElement.value = 'Updated Name';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('[data-testid="save-list-button"]'));
    btn.nativeElement.click();
    expect(mockListService.renameList).toHaveBeenCalledWith(
      'list-42',
      jasmine.objectContaining({ name: 'Updated Name' }),
    );
  });

  it('should pre-fill the name input with the existing list name when editing', () => {
    const fixture = TestBed.createComponent(ListFormDialogComponent);
    const existingList: List = {
      id: 'list-42',
      ownerId: 'user-1',
      name: 'Old Name',
      createdAt: new Date().toISOString(),
    };
    fixture.componentInstance.existingList = existingList;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('[data-testid="list-name-input"]'));
    expect(input.nativeElement.value).toBe('Old Name');
  });

  it('should emit a closed event when the cancel button is clicked', () => {
    const fixture = TestBed.createComponent(ListFormDialogComponent);
    fixture.detectChanges();
    const closedSpy = jasmine.createSpy('closed');
    fixture.componentInstance.closed.subscribe(closedSpy);
    const btn = fixture.debugElement.query(By.css('[data-testid="cancel-button"]'));
    btn.nativeElement.click();
    expect(closedSpy).toHaveBeenCalled();
  });

  it('should emit a closed event after successfully saving a new list', () => {
    const fixture = TestBed.createComponent(ListFormDialogComponent);
    fixture.detectChanges();
    const closedSpy = jasmine.createSpy('closed');
    fixture.componentInstance.closed.subscribe(closedSpy);
    const input = fixture.debugElement.query(By.css('[data-testid="list-name-input"]'));
    input.nativeElement.value = 'New List';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('[data-testid="save-list-button"]'));
    btn.nativeElement.click();
    expect(closedSpy).toHaveBeenCalled();
  });
});
