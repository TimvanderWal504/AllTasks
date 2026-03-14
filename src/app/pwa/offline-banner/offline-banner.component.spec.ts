import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfflineBannerComponent } from './offline-banner.component';
import { OfflineService } from '../offline/offline.service';
import { signal } from '@angular/core';

describe('OfflineBannerComponent', () => {
  let component: OfflineBannerComponent;
  let fixture: ComponentFixture<OfflineBannerComponent>;
  let mockOfflineService: { online: ReturnType<typeof signal<boolean>> };

  beforeEach(async () => {
    mockOfflineService = { online: signal(true) };

    await TestBed.configureTestingModule({
      imports: [OfflineBannerComponent],
      providers: [{ provide: OfflineService, useValue: mockOfflineService }],
    }).compileComponents();

    fixture = TestBed.createComponent(OfflineBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not show the offline banner when the device is online', () => {
    mockOfflineService.online.set(true);
    fixture.detectChanges();
    const banner = fixture.nativeElement.querySelector('[data-testid="offline-banner"]');
    expect(banner).toBeNull();
  });

  it('should show the offline banner when the device is offline', () => {
    mockOfflineService.online.set(false);
    fixture.detectChanges();
    const banner = fixture.nativeElement.querySelector('[data-testid="offline-banner"]');
    expect(banner).not.toBeNull();
  });

  it('should expose the online signal from OfflineService', () => {
    expect(component.isOnline()).toBe(true);
    mockOfflineService.online.set(false);
    expect(component.isOnline()).toBe(false);
  });
});
