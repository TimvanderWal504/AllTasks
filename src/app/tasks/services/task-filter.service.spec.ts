import { TestBed } from '@angular/core/testing';
import { TaskFilterService } from './task-filter.service';
import { Task } from '../models/task.models';

describe('TaskFilterService', () => {
  let service: TaskFilterService;

  const today = new Date();
  const todayIso = today.toISOString().split('T')[0];

  const nextWeekDate = new Date(today);
  nextWeekDate.setDate(today.getDate() + 5);
  const nextWeekIso = nextWeekDate.toISOString().split('T')[0];

  const pastDate = '2020-01-01';

  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Buy groceries',
      description: 'Milk, eggs, bread',
      deadline: todayIso,
      priority: 'low',
      isCompleted: false,
      syncStatus: 'synced',
      createdAt: '2026-01-01T10:00:00.000Z',
      listId: null,
    },
    {
      id: '2',
      title: 'Write tests',
      description: 'Unit tests for task service',
      deadline: nextWeekIso,
      priority: 'high',
      isCompleted: false,
      syncStatus: 'synced',
      createdAt: '2026-01-02T10:00:00.000Z',
      listId: null,
    },
    {
      id: '3',
      title: 'Read documentation',
      description: 'Angular signals docs',
      deadline: null,
      priority: 'medium',
      isCompleted: true,
      syncStatus: 'synced',
      createdAt: '2026-01-03T10:00:00.000Z',
      listId: null,
    },
    {
      id: '4',
      title: 'Deploy application',
      description: '',
      deadline: pastDate,
      priority: 'high',
      isCompleted: false,
      syncStatus: 'pending',
      createdAt: '2026-01-04T10:00:00.000Z',
      listId: null,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [TaskFilterService] });
    service = TestBed.inject(TaskFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('filterState signal', () => {
    it('should initialise with status "all", sort "createdAt" and empty search', () => {
      expect(service.filterState().status).toBe('all');
      expect(service.filterState().sort).toBe('createdAt');
      expect(service.filterState().search).toBe('');
    });
  });

  describe('setStatus', () => {
    it('should update the status in filterState when setStatus is called', () => {
      service.setStatus('open');
      expect(service.filterState().status).toBe('open');
    });

    it('should not change sort or search when only status is updated', () => {
      service.setSearch('test');
      service.setStatus('completed');
      expect(service.filterState().sort).toBe('createdAt');
      expect(service.filterState().search).toBe('test');
    });
  });

  describe('setSort', () => {
    it('should update the sort field in filterState when setSort is called', () => {
      service.setSort('priority');
      expect(service.filterState().sort).toBe('priority');
    });

    it('should not change status or search when only sort is updated', () => {
      service.setStatus('open');
      service.setSort('deadline');
      expect(service.filterState().status).toBe('open');
      expect(service.filterState().search).toBe('');
    });
  });

  describe('setSearch', () => {
    it('should update the search term in filterState when setSearch is called', () => {
      service.setSearch('groceries');
      expect(service.filterState().search).toBe('groceries');
    });

    it('should not change status or sort when only search is updated', () => {
      service.setSort('priority');
      service.setSearch('deploy');
      expect(service.filterState().status).toBe('all');
      expect(service.filterState().sort).toBe('priority');
    });
  });

  describe('applyFilter', () => {
    it('should return all tasks when status is "all" and search is empty', () => {
      const result = service.applyFilter(mockTasks, service.filterState());
      expect(result.length).toBe(4);
    });

    it('should return only open tasks when status is "open"', () => {
      service.setStatus('open');
      const result = service.applyFilter(mockTasks, service.filterState());
      expect(result.every((t) => !t.isCompleted)).toBeTrue();
      expect(result.length).toBe(3);
    });

    it('should return only completed tasks when status is "completed"', () => {
      service.setStatus('completed');
      const result = service.applyFilter(mockTasks, service.filterState());
      expect(result.every((t) => t.isCompleted)).toBeTrue();
      expect(result.length).toBe(1);
    });

    it('should return only open tasks with a deadline of today when status is "today"', () => {
      service.setStatus('today');
      const result = service.applyFilter(mockTasks, service.filterState());
      expect(result.every((t) => !t.isCompleted && t.deadline === todayIso)).toBeTrue();
    });

    it('should return open tasks with a deadline within the next 7 days when status is "week"', () => {
      service.setStatus('week');
      const result = service.applyFilter(mockTasks, service.filterState());
      result.forEach((t) => {
        expect(t.isCompleted).toBeFalse();
        expect(t.deadline).not.toBeNull();
      });
    });

    it('should filter by search term against task title (case-insensitive)', () => {
      service.setSearch('groceries');
      const result = service.applyFilter(mockTasks, service.filterState());
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('1');
    });

    it('should filter by search term against task description (case-insensitive)', () => {
      service.setSearch('angular signals');
      const result = service.applyFilter(mockTasks, service.filterState());
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('3');
    });

    it('should return an empty array when search term matches no task', () => {
      service.setSearch('zzznomatch');
      const result = service.applyFilter(mockTasks, service.filterState());
      expect(result.length).toBe(0);
    });

    it('should combine status filter and search term correctly', () => {
      service.setStatus('open');
      service.setSearch('deploy');
      const result = service.applyFilter(mockTasks, service.filterState());
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('4');
    });
  });

  describe('applySort', () => {
    it('should sort by createdAt ascending when sort is "createdAt"', () => {
      service.setSort('createdAt');
      const result = service.applySort(mockTasks, service.filterState());
      expect(result[0].id).toBe('1');
      expect(result[result.length - 1].id).toBe('4');
    });

    it('should sort by priority descending (high first) when sort is "priority"', () => {
      service.setSort('priority');
      const result = service.applySort(mockTasks, service.filterState());
      expect(result[0].priority).toBe('high');
    });

    it('should sort by deadline ascending when sort is "deadline", placing null deadlines last', () => {
      service.setSort('deadline');
      const result = service.applySort(mockTasks, service.filterState());
      const lastItem = result[result.length - 1];
      expect(lastItem.deadline).toBeNull();
    });

    it('should not mutate the original tasks array when sorting', () => {
      const original = [...mockTasks];
      service.setSort('priority');
      service.applySort(mockTasks, service.filterState());
      expect(mockTasks).toEqual(original);
    });
  });
});
