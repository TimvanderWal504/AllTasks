import { TestBed } from '@angular/core/testing';
import { OfflineService } from './offline.service';

describe('OfflineService', () => {
  let service: OfflineService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [OfflineService] });
    service = TestBed.inject(OfflineService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should reflect navigator.onLine as initial value of online signal', () => {
    expect(service.online()).toBe(navigator.onLine);
  });

  it('should set online signal to true when the online event fires', () => {
    service.online.set(false);
    window.dispatchEvent(new Event('online'));
    expect(service.online()).toBe(true);
  });

  it('should set online signal to false when the offline event fires', () => {
    service.online.set(true);
    window.dispatchEvent(new Event('offline'));
    expect(service.online()).toBe(false);
  });
});
