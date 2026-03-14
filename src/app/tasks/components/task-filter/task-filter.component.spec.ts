import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFilterComponent } from './task-filter.component';
import { TaskFilterService } from '../../services/task-filter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { signal } from '@angular/core';
import { TaskFilterState } from '../../models/task.models';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

describe('TaskFilterComponent', () => {
  let component: TaskFilterComponent;
  let fixture: ComponentFixture<TaskFilterComponent>;
  let taskFilterServiceSpy: jasmine.SpyObj<TaskFilterService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const defaultFilterState: TaskFilterState = {
    status: 'all',
    sort: 'createdAt',
    search: '',
  };

  const filterStateSignal = signal<TaskFilterState>(defaultFilterState);

  beforeEach(async () => {
    taskFilterServiceSpy = jasmine.createSpyObj(
      'TaskFilterService',
      ['setStatus', 'setSort', 'setSearch'],
      { filterState: filterStateSignal }
    );
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [TaskFilterComponent, NoopAnimationsModule],
      providers: [
        { provide: TaskFilterService, useValue: taskFilterServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
            snapshot: { queryParams: {} },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('status filter', () => {
    it('should call setStatus on the filter service when onStatusChange is called', () => {
      component.onStatusChange('open');
      expect(taskFilterServiceSpy.setStatus).toHaveBeenCalledWith('open');
    });

    it('should navigate with the status as a query parameter when status changes', () => {
      component.onStatusChange('completed');
      expect(routerSpy.navigate).toHaveBeenCalledWith(
        [],
        jasmine.objectContaining({ queryParams: jasmine.objectContaining({ filter: 'completed' }) })
      );
    });
  });

  describe('sort', () => {
    it('should call setSort on the filter service when onSortChange is called', () => {
      component.onSortChange('priority');
      expect(taskFilterServiceSpy.setSort).toHaveBeenCalledWith('priority');
    });

    it('should navigate with the sort as a query parameter when sort changes', () => {
      component.onSortChange('deadline');
      expect(routerSpy.navigate).toHaveBeenCalledWith(
        [],
        jasmine.objectContaining({ queryParams: jasmine.objectContaining({ sort: 'deadline' }) })
      );
    });
  });

  describe('search', () => {
    it('should call setSearch on the filter service when onSearchChange is called', () => {
      component.onSearchChange('groceries');
      expect(taskFilterServiceSpy.setSearch).toHaveBeenCalledWith('groceries');
    });

    it('should navigate with the search as a query parameter when search changes', () => {
      component.onSearchChange('milk');
      expect(routerSpy.navigate).toHaveBeenCalledWith(
        [],
        jasmine.objectContaining({ queryParams: jasmine.objectContaining({ search: 'milk' }) })
      );
    });

    it('should omit the search query param when the search term is empty', () => {
      component.onSearchChange('');
      expect(routerSpy.navigate).toHaveBeenCalledWith(
        [],
        jasmine.objectContaining({
          queryParams: jasmine.objectContaining({ search: null }),
        })
      );
    });
  });

  describe('URL query param initialisation', () => {
    it('should expose the filterState from the filter service', () => {
      expect(component.filterState()).toEqual(defaultFilterState);
    });
  });
});
