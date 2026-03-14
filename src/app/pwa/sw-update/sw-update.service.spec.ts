import { TestBed } from '@angular/core/testing';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { Subject } from 'rxjs';
import { SwUpdateService } from './sw-update.service';

describe('SwUpdateService', () => {
  let service: SwUpdateService;
  let versionUpdatesSubject: Subject<VersionEvent>;
  let mockSwUpdate: { isEnabled: boolean; versionUpdates: Subject<VersionEvent> };

  beforeEach(() => {
    versionUpdatesSubject = new Subject<VersionEvent>();
    mockSwUpdate = {
      isEnabled: true,
      versionUpdates: versionUpdatesSubject,
    };

    TestBed.configureTestingModule({
      providers: [
        SwUpdateService,
        { provide: SwUpdate, useValue: mockSwUpdate },
      ],
    });

    service = TestBed.inject(SwUpdateService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should have hasUpdate set to false initially', () => {
    expect(service.hasUpdate()).toBe(false);
  });

  it('should set hasUpdate to true when VERSION_READY event is received', () => {
    const versionReadyEvent = {
      type: 'VERSION_READY',
      currentVersion: { hash: 'abc', appData: undefined },
      latestVersion: { hash: 'def', appData: undefined },
    } as VersionEvent;

    versionUpdatesSubject.next(versionReadyEvent);

    expect(service.hasUpdate()).toBe(true);
  });

  it('should not set hasUpdate to true for non-VERSION_READY events', () => {
    const versionDetectedEvent = {
      type: 'VERSION_DETECTED',
      version: { hash: 'abc', appData: undefined },
    } as VersionEvent;

    versionUpdatesSubject.next(versionDetectedEvent);

    expect(service.hasUpdate()).toBe(false);
  });

  it('should not subscribe to versionUpdates when SwUpdate is disabled', () => {
    mockSwUpdate.isEnabled = false;
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        SwUpdateService,
        { provide: SwUpdate, useValue: mockSwUpdate },
      ],
    });

    const disabledService = TestBed.inject(SwUpdateService);

    versionUpdatesSubject.next({
      type: 'VERSION_READY',
      currentVersion: { hash: 'abc', appData: undefined },
      latestVersion: { hash: 'def', appData: undefined },
    } as VersionEvent);

    expect(disabledService.hasUpdate()).toBe(false);
  });
});
