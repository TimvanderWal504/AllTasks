import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InstallPromptComponent } from './install-prompt.component';

describe('InstallPromptComponent', () => {
  let component: InstallPromptComponent;
  let fixture: ComponentFixture<InstallPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstallPromptComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InstallPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have isPromptAvailable set to false initially', () => {
    expect(component.isPromptAvailable()).toBe(false);
  });

  it('should set isPromptAvailable to true when beforeinstallprompt event fires', () => {
    const mockEvent = new Event('beforeinstallprompt') as BeforeInstallPromptEvent;
    mockEvent.prompt = jasmine.createSpy('prompt').and.returnValue(Promise.resolve({ outcome: 'accepted' }));
    (mockEvent as unknown as { userChoice: unknown }).userChoice = Promise.resolve({ outcome: 'accepted', platform: '' });

    window.dispatchEvent(mockEvent);

    expect(component.isPromptAvailable()).toBe(true);
  });

  it('should call prompt on the deferred event when installApp is called', async () => {
    const promptSpy = jasmine.createSpy('prompt').and.returnValue(
      Promise.resolve({ outcome: 'accepted' })
    );
    const mockEvent = new Event('beforeinstallprompt') as BeforeInstallPromptEvent;
    mockEvent.prompt = promptSpy;
    (mockEvent as unknown as { userChoice: unknown }).userChoice = Promise.resolve({ outcome: 'accepted', platform: '' });

    window.dispatchEvent(mockEvent);

    await component.installApp();

    expect(promptSpy).toHaveBeenCalled();
  });

  it('should set isPromptAvailable to false after the prompt is shown', async () => {
    const mockEvent = new Event('beforeinstallprompt') as BeforeInstallPromptEvent;
    mockEvent.prompt = jasmine.createSpy('prompt').and.returnValue(
      Promise.resolve({ outcome: 'accepted' })
    );
    (mockEvent as unknown as { userChoice: unknown }).userChoice = Promise.resolve({ outcome: 'accepted', platform: '' });

    window.dispatchEvent(mockEvent);
    await component.installApp();

    expect(component.isPromptAvailable()).toBe(false);
  });

  it('should not throw when installApp is called without a stored deferred event', async () => {
    await expectAsync(component.installApp()).toBeResolved();
    expect(component.isPromptAvailable()).toBe(false);
  });
});

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<{ outcome: string }>;
  userChoice: Promise<{ outcome: string; platform: string }>;
}
