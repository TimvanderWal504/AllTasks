import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ListService } from './list.service';
import { CreateListRequest, List, UpdateListRequest } from '../models/list.models';

describe('ListService', () => {
  let service: ListService;

  const mockCreateRequest: CreateListRequest = {
    name: 'Shopping',
    color: '#ff5733',
    icon: 'cart',
  };

  const buildList = (overrides: Partial<List> = {}): List => ({
    id: 'list-1',
    ownerId: 'user-1',
    name: 'Work',
    createdAt: new Date().toISOString(),
    ...overrides,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ListService);

    spyOn(window.indexedDB, 'open').and.callFake(() => ({} as IDBOpenDBRequest));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('lists signal', () => {
    it('should initially return an empty array', () => {
      expect(service.lists()).toEqual([]);
    });
  });

  describe('activeList signal', () => {
    it('should initially return null', () => {
      expect(service.activeList()).toBeNull();
    });
  });

  describe('createList', () => {
    it('should add a new list to the lists signal', () => {
      const before = service.lists().length;
      service.createList(mockCreateRequest);
      expect(service.lists().length).toBe(before + 1);
    });

    it('should set the list name from the request', () => {
      service.createList(mockCreateRequest);
      const created = service.lists()[service.lists().length - 1];
      expect(created.name).toBe('Shopping');
    });

    it('should set the optional color from the request', () => {
      service.createList(mockCreateRequest);
      const created = service.lists()[service.lists().length - 1];
      expect(created.color).toBe('#ff5733');
    });

    it('should set the optional icon from the request', () => {
      service.createList(mockCreateRequest);
      const created = service.lists()[service.lists().length - 1];
      expect(created.icon).toBe('cart');
    });

    it('should assign a unique id to each created list', () => {
      service.createList(mockCreateRequest);
      service.createList({ name: 'Work' });
      const lists = service.lists();
      const lastTwo = lists.slice(-2);
      expect(lastTwo[0].id).not.toBe(lastTwo[1].id);
    });

    it('should set a createdAt timestamp on the new list', () => {
      service.createList(mockCreateRequest);
      const created = service.lists()[service.lists().length - 1];
      expect(created.createdAt).toBeTruthy();
    });

    it('should not mutate the existing lists array when a new list is created', () => {
      service.createList(mockCreateRequest);
      const snapshotAfterFirst = service.lists();
      service.createList({ name: 'Work' });
      expect(service.lists()).not.toBe(snapshotAfterFirst);
    });

    it('should create a list without color when only a name is provided', () => {
      service.createList({ name: 'Simple' });
      const created = service.lists()[service.lists().length - 1];
      expect(created.color).toBeUndefined();
    });

    it('should create a list without icon when only a name is provided', () => {
      service.createList({ name: 'Simple' });
      const created = service.lists()[service.lists().length - 1];
      expect(created.icon).toBeUndefined();
    });
  });

  describe('renameList', () => {
    let existingList: List;

    beforeEach(() => {
      service.createList({ name: 'Old Name' });
      existingList = service.lists()[service.lists().length - 1];
    });

    it('should update the name of the list with the given id', () => {
      const request: UpdateListRequest = { name: 'New Name' };
      service.renameList(existingList.id, request);
      const updated = service.lists().find((l) => l.id === existingList.id)!;
      expect(updated.name).toBe('New Name');
    });

    it('should leave all other lists unchanged when one list is renamed', () => {
      service.createList({ name: 'Another List' });
      const otherList = service.lists().find((l) => l.name === 'Another List')!;
      service.renameList(existingList.id, { name: 'New Name' });
      const otherAfterRename = service.lists().find((l) => l.id === otherList.id)!;
      expect(otherAfterRename.name).toBe('Another List');
    });

    it('should not mutate the existing lists array when a list is renamed', () => {
      const snapshotBefore = service.lists();
      service.renameList(existingList.id, { name: 'Changed' });
      expect(service.lists()).not.toBe(snapshotBefore);
    });

    it('should update the color of the list when a color is provided', () => {
      service.renameList(existingList.id, { color: '#00ff00' });
      const updated = service.lists().find((l) => l.id === existingList.id)!;
      expect(updated.color).toBe('#00ff00');
    });

    it('should preserve existing list properties that are not included in the update request', () => {
      service.renameList(existingList.id, { name: 'Updated' });
      const updated = service.lists().find((l) => l.id === existingList.id)!;
      expect(updated.id).toBe(existingList.id);
      expect(updated.createdAt).toBe(existingList.createdAt);
    });
  });

  describe('deleteList', () => {
    let existingList: List;

    beforeEach(() => {
      service.createList({ name: 'To Delete' });
      existingList = service.lists()[service.lists().length - 1];
    });

    it('should remove the list with the given id from the lists signal', () => {
      service.deleteList(existingList.id);
      const found = service.lists().find((l) => l.id === existingList.id);
      expect(found).toBeUndefined();
    });

    it('should decrease the lists count by one when a list is deleted', () => {
      const countBefore = service.lists().length;
      service.deleteList(existingList.id);
      expect(service.lists().length).toBe(countBefore - 1);
    });

    it('should leave all other lists unchanged when one list is deleted', () => {
      service.createList({ name: 'Keeper' });
      const keeperList = service.lists().find((l) => l.name === 'Keeper')!;
      service.deleteList(existingList.id);
      const keeperAfterDelete = service.lists().find((l) => l.id === keeperList.id)!;
      expect(keeperAfterDelete).toBeDefined();
    });

    it('should not mutate the existing lists array when a list is deleted', () => {
      const snapshotBefore = service.lists();
      service.deleteList(existingList.id);
      expect(service.lists()).not.toBe(snapshotBefore);
    });

    it('should clear the activeList when the active list is deleted', () => {
      service.setActiveList(existingList);
      expect(service.activeList()).toEqual(existingList);
      service.deleteList(existingList.id);
      expect(service.activeList()).toBeNull();
    });

    it('should not clear the activeList when a different list is deleted', () => {
      service.createList({ name: 'Active List' });
      const activeList = service.lists().find((l) => l.name === 'Active List')!;
      service.setActiveList(activeList);
      service.deleteList(existingList.id);
      expect(service.activeList()).toEqual(activeList);
    });
  });

  describe('setActiveList', () => {
    it('should update the activeList signal to the given list', () => {
      const list = buildList();
      service.setActiveList(list);
      expect(service.activeList()).toEqual(list);
    });

    it('should replace the previous activeList when a new list is set', () => {
      const firstList = buildList({ id: 'list-1', name: 'First' });
      const secondList = buildList({ id: 'list-2', name: 'Second' });
      service.setActiveList(firstList);
      service.setActiveList(secondList);
      expect(service.activeList()).toEqual(secondList);
    });

    it('should set activeList to null when called with null', () => {
      const list = buildList();
      service.setActiveList(list);
      service.setActiveList(null);
      expect(service.activeList()).toBeNull();
    });
  });
});
