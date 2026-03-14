import { TestBed } from '@angular/core/testing';
import { IndexedDbService } from './indexed-db.service';
import { appConfig } from '../../shared/config/app.config';

/* eslint-disable @typescript-eslint/no-explicit-any */
describe('IndexedDbService', () => {
  let service: IndexedDbService;
  let mockDb: any;
  let mockStore: any;
  let mockTransaction: any;
  let mockRequest: any;

  beforeEach(() => {
    mockStore = {
      put: jasmine.createSpy('put'),
      getAll: jasmine.createSpy('getAll'),
      delete: jasmine.createSpy('delete'),
      clear: jasmine.createSpy('clear'),
    };

    mockTransaction = {
      objectStore: jasmine.createSpy('objectStore').and.returnValue(mockStore),
      oncomplete: null as any,
      onerror: null as any,
    };

    mockDb = {
      transaction: jasmine.createSpy('transaction').and.returnValue(mockTransaction),
      objectStoreNames: { contains: jasmine.createSpy('contains').and.returnValue(true) },
      createObjectStore: jasmine.createSpy('createObjectStore'),
    };

    mockRequest = {
      onsuccess: null as any,
      onerror: null as any,
      onupgradeneeded: null as any,
    };

    spyOn(window.indexedDB, 'open').and.callFake(() => {
      Promise.resolve().then(() => {
        if (mockRequest.onsuccess) {
          mockRequest.onsuccess({ target: { result: mockDb } });
        }
      });
      return mockRequest;
    });

    TestBed.configureTestingModule({ providers: [IndexedDbService] });
    service = TestBed.inject(IndexedDbService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should open the database with the configured name and version', () => {
    service.openDatabase();
    expect(window.indexedDB.open).toHaveBeenCalledWith(
      appConfig.database.name,
      appConfig.database.version
    );
  });

  it('should write all records to the object store when putAll is called', async () => {
    const items = [{ id: '1', title: 'Task A' }, { id: '2', title: 'Task B' }];

    const promise = service.putAll(appConfig.database.stores.tasks, items);
    await Promise.resolve();
    mockTransaction.oncomplete();
    await promise;

    expect(mockStore.put).toHaveBeenCalledTimes(2);
    expect(mockStore.put).toHaveBeenCalledWith(items[0]);
    expect(mockStore.put).toHaveBeenCalledWith(items[1]);
  });

  it('should return an empty array from getAll when the store is empty', async () => {
    const getAllRequest: any = { result: [], onsuccess: null, onerror: null };
    mockStore.getAll.and.callFake(() => {
      Promise.resolve().then(() => {
        if (getAllRequest.onsuccess) {
          getAllRequest.onsuccess({ target: getAllRequest });
        }
      });
      return getAllRequest;
    });

    const result = await service.getAll(appConfig.database.stores.tasks);
    expect(result).toEqual([]);
  });

  it('should return all records from getAll when the store has items', async () => {
    const records = [{ id: '1', title: 'Task A' }];
    const getAllRequest: any = { result: records, onsuccess: null, onerror: null };
    mockStore.getAll.and.callFake(() => {
      Promise.resolve().then(() => {
        if (getAllRequest.onsuccess) {
          getAllRequest.onsuccess({ target: getAllRequest });
        }
      });
      return getAllRequest;
    });

    const result = await service.getAll(appConfig.database.stores.tasks);
    expect(result).toEqual(records);
  });

  it('should delete a record by key when deleteRecord is called', async () => {
    const deleteRequest: any = { onsuccess: null, onerror: null };
    mockStore.delete.and.callFake(() => {
      Promise.resolve().then(() => {
        if (deleteRequest.onsuccess) deleteRequest.onsuccess();
      });
      return deleteRequest;
    });

    await service.deleteRecord(appConfig.database.stores.tasks, '1');
    expect(mockStore.delete).toHaveBeenCalledWith('1');
  });

  it('should clear all records from the store when clearStore is called', async () => {
    const clearRequest: any = { onsuccess: null, onerror: null };
    mockStore.clear.and.callFake(() => {
      Promise.resolve().then(() => {
        if (clearRequest.onsuccess) clearRequest.onsuccess();
      });
      return clearRequest;
    });

    await service.clearStore(appConfig.database.stores.tasks);
    expect(mockStore.clear).toHaveBeenCalled();
  });

  it('should create the object store on database upgrade if it does not exist', () => {
    mockDb.objectStoreNames.contains.and.returnValue(false);

    const upgradeEvent = { target: { result: mockDb } } as unknown as IDBVersionChangeEvent;
    service.handleUpgrade(upgradeEvent, appConfig.database.stores.tasks, 'id');

    expect(mockDb.createObjectStore).toHaveBeenCalledWith(
      appConfig.database.stores.tasks,
      { keyPath: 'id' }
    );
  });

  it('should not create the object store on upgrade if it already exists', () => {
    mockDb.objectStoreNames.contains.and.returnValue(true);

    const upgradeEvent = { target: { result: mockDb } } as unknown as IDBVersionChangeEvent;
    service.handleUpgrade(upgradeEvent, appConfig.database.stores.tasks, 'id');

    expect(mockDb.createObjectStore).not.toHaveBeenCalled();
  });
});
/* eslint-enable @typescript-eslint/no-explicit-any */
