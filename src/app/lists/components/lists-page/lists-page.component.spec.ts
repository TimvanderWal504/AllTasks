import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy, signal } from '@angular/core';
import { ListsPageComponent } from './lists-page.component';
import { ListService } from '../../services/list.service';
import { List } from '../../models/list.models';

describe('ListsPageComponent', () => {
  let mockListService: jasmine.SpyObj<ListService>;

  const buildList = (overrides: Partial<List> = {}): List => ({
    id: 'list-1',
    ownerId: 'user-1',
    name: 'Shopping',
    createdAt: new Date().toISOString(),
    ...overrides,
  });

  beforeEach(async () => {
    mockListService = jasmine.createSpyObj(
      'ListService',
      ['createList', 'renameList', 'deleteList', 'setActiveList'],
      {
        lists: signal<List[]>([]),
        activeList: signal<List | null>(null),
      },
    );

    await TestBed.configureTestingModule({
      imports: [ListsPageComponent],
      providers: [{ provide: ListService, useValue: mockListService }],
    })
      .overrideComponent(ListsPageComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  it('should be created', () => {
    const fixture = TestBed.createComponent(ListsPageComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show the lists sidebar', () => {
    const fixture = TestBed.createComponent(ListsPageComponent);
    fixture.detectChanges();
    const sidebar = fixture.debugElement.query(By.css('app-list-sidebar'));
    expect(sidebar).toBeTruthy();
  });

  it('should not show the create-list dialog when isDialogOpen is false', () => {
    const fixture = TestBed.createComponent(ListsPageComponent);
    fixture.detectChanges();
    const dialog = fixture.debugElement.query(By.css('app-list-form-dialog'));
    expect(dialog).toBeNull();
  });

  it('should show the create-list dialog when isDialogOpen is true', () => {
    const fixture = TestBed.createComponent(ListsPageComponent);
    fixture.componentInstance.isDialogOpen = true;
    fixture.detectChanges();
    const dialog = fixture.debugElement.query(By.css('app-list-form-dialog'));
    expect(dialog).toBeTruthy();
  });

  it('should set isDialogOpen to true when openCreateDialog is called', () => {
    const fixture = TestBed.createComponent(ListsPageComponent);
    fixture.detectChanges();
    fixture.componentInstance.openCreateDialog();
    expect(fixture.componentInstance.isDialogOpen).toBeTrue();
  });

  it('should set isDialogOpen to false when closeDialog is called', () => {
    const fixture = TestBed.createComponent(ListsPageComponent);
    fixture.componentInstance.isDialogOpen = true;
    fixture.componentInstance.closeDialog();
    expect(fixture.componentInstance.isDialogOpen).toBeFalse();
  });

  it('should show a list of lists when lists are present', () => {
    const lists = [buildList()];
    (mockListService.lists as ReturnType<typeof signal<List[]>>).set(lists);
    const fixture = TestBed.createComponent(ListsPageComponent);
    fixture.detectChanges();
    const sidebar = fixture.debugElement.query(By.css('app-list-sidebar'));
    expect(sidebar).toBeTruthy();
  });
});
