import { TestBed } from '@angular/core/testing';
import { SyncService } from './sync.service';
import { OfflineService } from '../offline/offline.service';
import { signal } from '@angular/core';

/* eslint-disable @typescript-eslint/no-explicit-any */
describe('SyncService', () => {
  let service: SyncService;
  let mockOfflineService: { online: ReturnType<typeof signal<boolean>> };
  let mockSyncManager: { register: jasmine.Spy };
  let mockRegistration: any;

  beforeEach(() => {
    mockSyncManager = { register: jasmine.createSpy('register').and.returnValue(Promise.resolve()) };
    mockRegistration = { sync: mockSyncManager };

    mockOfflineService = { online: signal(true) };

    spyOnProperty(navigator, 'serviceWorker', 'get').and.returnValue({
      ready: Promise.resolve(mockRegistration),
    } as any);

    TestBed.configureTestingModule({
      providers: [
        SyncService,
        { provide: OfflineService, useValue: mockOfflineService },
      ],
    });

    service = TestBed.inject(SyncService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should register a background sync tag when the device is offline', async () => {
    mockOfflineService.online.set(false);
    await service.registerSync('sync-tasks');
    expect(mockSyncManager.register).toHaveBeenCalledWith('sync-tasks');
  });

  it('should not register a background sync tag when the device is online', async () => {
    mockOfflineService.online.set(true);
    await service.registerSync('sync-tasks');
    expect(mockSyncManager.register).not.toHaveBeenCalled();
  });

  it('should register sync with the default tag when no tag is provided', async () => {
    mockOfflineService.online.set(false);
    await service.registerSync();
    expect(mockSyncManager.register).toHaveBeenCalledWith('sync-tasks');
  });
});
/* eslint-enable @typescript-eslint/no-explicit-any */
