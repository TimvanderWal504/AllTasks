import { TestBed } from '@angular/core/testing';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { Subject } from 'rxjs';
import { UpdateService } from './update.service';

describe('UpdateService', () => {
  let service: UpdateService;
  let versionUpdatesSubject: Subject<VersionEvent>;
  let mockSwUpdate: {
    isEnabled: boolean;
    versionUpdates: Subject<VersionEvent>;
    checkForUpdate: jasmine.Spy;
    activateUpdate: jasmine.Spy;
  };

  beforeEach(() => {
    versionUpdatesSubject = new Subject<VersionEvent>();
    mockSwUpdate = {
      isEnabled: true,
      versionUpdates: versionUpdatesSubject,
      checkForUpdate: jasmine.createSpy('checkForUpdate').and.returnValue(Promise.resolve(false)),
      activateUpdate: jasmine.createSpy('activateUpdate').and.returnValue(Promise.resolve()),
    };

    TestBed.configureTestingModule({
      providers: [
        UpdateService,
        { provide: SwUpdate, useValue: mockSwUpdate },
      ],
    });

    service = TestBed.inject(UpdateService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should have updateAvailable set to false initially', () => {
    expect(service.updateAvailable()).toBe(false);
  });

  it('should set updateAvailable to true when a VERSION_READY event is emitted', () => {
    const versionReadyEvent = {
      type: 'VERSION_READY',
      currentVersion: { hash: 'abc', appData: undefined },
      latestVersion: { hash: 'def', appData: undefined },
    } as VersionEvent;

    versionUpdatesSubject.next(versionReadyEvent);

    expect(service.updateAvailable()).toBe(true);
  });

  it('should not set updateAvailable to true for non-VERSION_READY events', () => {
    const versionDetectedEvent = {
      type: 'VERSION_DETECTED',
      version: { hash: 'abc', appData: undefined },
    } as VersionEvent;

    versionUpdatesSubject.next(versionDetectedEvent);

    expect(service.updateAvailable()).toBe(false);
  });

  it('should not subscribe to versionUpdates when SwUpdate is disabled', () => {
    mockSwUpdate.isEnabled = false;
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        UpdateService,
        { provide: SwUpdate, useValue: mockSwUpdate },
      ],
    });

    const disabledService = TestBed.inject(UpdateService);

    versionUpdatesSubject.next({
      type: 'VERSION_READY',
      currentVersion: { hash: 'abc', appData: undefined },
      latestVersion: { hash: 'def', appData: undefined },
    } as VersionEvent);

    expect(disabledService.updateAvailable()).toBe(false);
  });

  it('should call swUpdate.checkForUpdate when checkForUpdate is called', () => {
    service.checkForUpdate();
    expect(mockSwUpdate.checkForUpdate).toHaveBeenCalled();
  });

  it('should not call swUpdate.checkForUpdate when SwUpdate is disabled', () => {
    mockSwUpdate.isEnabled = false;
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        UpdateService,
        { provide: SwUpdate, useValue: mockSwUpdate },
      ],
    });

    const disabledService = TestBed.inject(UpdateService);
    disabledService.checkForUpdate();

    expect(mockSwUpdate.checkForUpdate).not.toHaveBeenCalled();
  });

  it('should call swUpdate.activateUpdate and reload the page when activateUpdate is called', async () => {
    const reloadSpy = spyOn(service, 'reloadPage');

    await service.activateUpdate();

    expect(mockSwUpdate.activateUpdate).toHaveBeenCalled();
    expect(reloadSpy).toHaveBeenCalled();
  });
});
