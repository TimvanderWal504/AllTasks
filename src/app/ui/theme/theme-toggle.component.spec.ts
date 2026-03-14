import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ThemeToggleComponent } from './theme-toggle.component';
import { ThemeService } from './theme.service';
import { signal, computed } from '@angular/core';
import { Theme } from './theme.models';

describe('ThemeToggleComponent', () => {
  let fixture: ComponentFixture<ThemeToggleComponent>;
  let themeSignal: ReturnType<typeof signal<Theme>>;

  function setupComponent(currentTheme: Theme): void {
    themeSignal = signal<Theme>(currentTheme);

    const themeServiceStub: Pick<ThemeService, 'theme' | 'isDarkModeActive' | 'setTheme'> = {
      theme: themeSignal,
      isDarkModeActive: computed(() => themeSignal() === 'dark'),
      setTheme: jasmine.createSpy('setTheme'),
    };

    TestBed.configureTestingModule({
      imports: [ThemeToggleComponent],
      providers: [{ provide: ThemeService, useValue: themeServiceStub }],
    });

    fixture = TestBed.createComponent(ThemeToggleComponent);
    fixture.detectChanges();
  }

  describe('rendering', () => {
    it('should render a toggle button for each theme option', () => {
      setupComponent('system');
      const buttons = fixture.debugElement.queryAll(By.css('[data-testid^="theme-option-"]'));
      expect(buttons.length).toBe(3);
    });

    it('should render a light theme button', () => {
      setupComponent('light');
      const button = fixture.debugElement.query(By.css('[data-testid="theme-option-light"]'));
      expect(button).not.toBeNull();
    });

    it('should render a dark theme button', () => {
      setupComponent('dark');
      const button = fixture.debugElement.query(By.css('[data-testid="theme-option-dark"]'));
      expect(button).not.toBeNull();
    });

    it('should render a system theme button', () => {
      setupComponent('system');
      const button = fixture.debugElement.query(By.css('[data-testid="theme-option-system"]'));
      expect(button).not.toBeNull();
    });

    it('should mark the active theme button as aria-pressed true', () => {
      setupComponent('dark');
      const darkButton = fixture.debugElement.query(By.css('[data-testid="theme-option-dark"]'));
      expect(darkButton.attributes['aria-pressed']).toBe('true');
    });

    it('should mark inactive theme buttons as aria-pressed false', () => {
      setupComponent('dark');
      const lightButton = fixture.debugElement.query(By.css('[data-testid="theme-option-light"]'));
      expect(lightButton.attributes['aria-pressed']).toBe('false');
    });
  });

  describe('interaction', () => {
    it('should call setTheme with dark when the dark button is clicked', () => {
      setupComponent('light');
      const themeService = TestBed.inject(ThemeService);
      const darkButton = fixture.debugElement.query(By.css('[data-testid="theme-option-dark"]'));
      darkButton.nativeElement.click();
      expect(themeService.setTheme).toHaveBeenCalledWith('dark');
    });

    it('should call setTheme with light when the light button is clicked', () => {
      setupComponent('dark');
      const themeService = TestBed.inject(ThemeService);
      const lightButton = fixture.debugElement.query(By.css('[data-testid="theme-option-light"]'));
      lightButton.nativeElement.click();
      expect(themeService.setTheme).toHaveBeenCalledWith('light');
    });

    it('should call setTheme with system when the system button is clicked', () => {
      setupComponent('dark');
      const themeService = TestBed.inject(ThemeService);
      const systemButton = fixture.debugElement.query(By.css('[data-testid="theme-option-system"]'));
      systemButton.nativeElement.click();
      expect(themeService.setTheme).toHaveBeenCalledWith('system');
    });
  });

  describe('accessibility', () => {
    it('should have a minimum touch target size of 44px for each button', () => {
      setupComponent('system');
      const buttons = fixture.debugElement.queryAll(By.css('[data-testid^="theme-option-"]'));
      buttons.forEach((button) => {
        expect(button.nativeElement.classList.contains('min-h-\\[44px\\]') ||
          button.nativeElement.className.includes('min-h-[44px]')).toBeTrue();
      });
    });

    it('should have an accessible aria-label on the toggle group', () => {
      setupComponent('system');
      const group = fixture.debugElement.query(By.css('[role="group"]'));
      expect(group).not.toBeNull();
      expect(group.attributes['aria-label']).toBeTruthy();
    });
  });
});
