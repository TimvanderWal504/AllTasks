import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy, signal } from '@angular/core';
import { ListSidebarComponent } from './list-sidebar.component';
import { ListService } from '../../services/list.service';
import { List } from '../../models/list.models';

describe('ListSidebarComponent', () => {
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
      imports: [ListSidebarComponent],
      providers: [{ provide: ListService, useValue: mockListService }],
    })
      .overrideComponent(ListSidebarComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  it('should be created', () => {
    const fixture = TestBed.createComponent(ListSidebarComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display a list item for each list in the lists signal', () => {
    const lists = [buildList({ id: 'l1', name: 'Shopping' }), buildList({ id: 'l2', name: 'Work' })];
    (mockListService.lists as ReturnType<typeof signal<List[]>>).set(lists);
    const fixture = TestBed.createComponent(ListSidebarComponent);
    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('[data-testid="list-item"]'));
    expect(items.length).toBe(2);
  });

  it('should show the list name in each list item', () => {
    const lists = [buildList({ id: 'l1', name: 'Shopping' })];
    (mockListService.lists as ReturnType<typeof signal<List[]>>).set(lists);
    const fixture = TestBed.createComponent(ListSidebarComponent);
    fixture.detectChanges();
    const item = fixture.debugElement.query(By.css('[data-testid="list-item"]'));
    expect(item.nativeElement.textContent).toContain('Shopping');
  });

  it('should show an empty state message when there are no lists', () => {
    const fixture = TestBed.createComponent(ListSidebarComponent);
    fixture.detectChanges();
    const empty = fixture.debugElement.query(By.css('[data-testid="empty-lists"]'));
    expect(empty).toBeTruthy();
  });

  it('should call setActiveList with the selected list when a list item is clicked', () => {
    const list = buildList();
    (mockListService.lists as ReturnType<typeof signal<List[]>>).set([list]);
    const fixture = TestBed.createComponent(ListSidebarComponent);
    fixture.detectChanges();
    const item = fixture.debugElement.query(By.css('[data-testid="list-item"]'));
    item.nativeElement.click();
    expect(mockListService.setActiveList).toHaveBeenCalledWith(list);
  });

  it('should call deleteList with the list id when the delete button is clicked', () => {
    const list = buildList();
    (mockListService.lists as ReturnType<typeof signal<List[]>>).set([list]);
    const fixture = TestBed.createComponent(ListSidebarComponent);
    fixture.detectChanges();
    const deleteBtn = fixture.debugElement.query(By.css('[data-testid="delete-list-button"]'));
    deleteBtn.nativeElement.click();
    expect(mockListService.deleteList).toHaveBeenCalledWith('list-1');
  });

  it('should mark the active list item with an aria-current attribute', () => {
    const list = buildList();
    (mockListService.lists as ReturnType<typeof signal<List[]>>).set([list]);
    (mockListService.activeList as ReturnType<typeof signal<List | null>>).set(list);
    const fixture = TestBed.createComponent(ListSidebarComponent);
    fixture.detectChanges();
    const item = fixture.debugElement.query(By.css('[data-testid="list-item"]'));
    expect(item.nativeElement.getAttribute('aria-current')).toBe('true');
  });

  it('should show a create-list button', () => {
    const fixture = TestBed.createComponent(ListSidebarComponent);
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('[data-testid="create-list-button"]'));
    expect(btn).toBeTruthy();
  });
});
