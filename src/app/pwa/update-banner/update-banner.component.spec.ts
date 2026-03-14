import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { UpdateBannerComponent } from './update-banner.component';
import { UpdateService } from './update.service';

describe('UpdateBannerComponent', () => {
  let component: UpdateBannerComponent;
  let fixture: ComponentFixture<UpdateBannerComponent>;
  let mockUpdateService: {
    updateAvailable: ReturnType<typeof signal<boolean>>;
    activateUpdate: jasmine.Spy;
  };

  beforeEach(async () => {
    mockUpdateService = {
      updateAvailable: signal(false),
      activateUpdate: jasmine.createSpy('activateUpdate').and.returnValue(Promise.resolve()),
    };

    await TestBed.configureTestingModule({
      imports: [UpdateBannerComponent],
      providers: [{ provide: UpdateService, useValue: mockUpdateService }],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not show the banner when no update is available', () => {
    mockUpdateService.updateAvailable.set(false);
    fixture.detectChanges();
    const banner = fixture.nativeElement.querySelector('[data-testid="update-banner"]');
    expect(banner).toBeNull();
  });

  it('should show the banner when an update is available', () => {
    mockUpdateService.updateAvailable.set(true);
    fixture.detectChanges();
    const banner = fixture.nativeElement.querySelector('[data-testid="update-banner"]');
    expect(banner).not.toBeNull();
  });

  it('should call activateUpdate when the update button is clicked', () => {
    mockUpdateService.updateAvailable.set(true);
    fixture.detectChanges();
    const updateButton = fixture.nativeElement.querySelector('[data-testid="update-button"]');
    updateButton.click();
    expect(mockUpdateService.activateUpdate).toHaveBeenCalled();
  });

  it('should hide the banner when the dismiss button is clicked', () => {
    mockUpdateService.updateAvailable.set(true);
    fixture.detectChanges();
    const dismissButton = fixture.nativeElement.querySelector('[data-testid="dismiss-button"]');
    dismissButton.click();
    fixture.detectChanges();
    const banner = fixture.nativeElement.querySelector('[data-testid="update-banner"]');
    expect(banner).toBeNull();
  });

  it('should not call activateUpdate when the dismiss button is clicked', () => {
    mockUpdateService.updateAvailable.set(true);
    fixture.detectChanges();
    const dismissButton = fixture.nativeElement.querySelector('[data-testid="dismiss-button"]');
    dismissButton.click();
    expect(mockUpdateService.activateUpdate).not.toHaveBeenCalled();
  });
});
