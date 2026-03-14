import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let darkMediaQuery: { matches: boolean; addEventListener: jasmine.Spy; removeEventListener: jasmine.Spy };

  function setupService(storedTheme: string | null, prefersColorSchemeDark: boolean): void {
    darkMediaQuery = {
      matches: prefersColorSchemeDark,
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener'),
    };

    spyOn(localStorage, 'getItem').and.callFake((key: string) =>
      key === 'theme' ? storedTheme : null
    );
    spyOn(localStorage, 'setItem');
    spyOn(window, 'matchMedia').and.returnValue(darkMediaQuery as unknown as MediaQueryList);

    document.documentElement.classList.remove('dark');

    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  }

  describe('initial theme — no stored preference', () => {
    it('should default to system theme when no preference is stored', () => {
      setupService(null, false);
      expect(service.theme()).toBe('system');
    });

    it('should apply dark class when system preference is dark and theme is system', () => {
      setupService(null, true);
      TestBed.flushEffects();
      expect(document.documentElement.classList.contains('dark')).toBeTrue();
    });

    it('should not apply dark class when system preference is light and theme is system', () => {
      setupService(null, false);
      TestBed.flushEffects();
      expect(document.documentElement.classList.contains('dark')).toBeFalse();
    });
  });

  describe('initial theme — stored preference', () => {
    it('should restore the dark theme from localStorage on init', () => {
      setupService('dark', false);
      expect(service.theme()).toBe('dark');
    });

    it('should restore the light theme from localStorage on init', () => {
      setupService('light', true);
      expect(service.theme()).toBe('light');
    });

    it('should restore the system theme from localStorage on init', () => {
      setupService('system', false);
      expect(service.theme()).toBe('system');
    });

    it('should apply dark class when stored theme is dark', () => {
      setupService('dark', false);
      TestBed.flushEffects();
      expect(document.documentElement.classList.contains('dark')).toBeTrue();
    });

    it('should not apply dark class when stored theme is light', () => {
      setupService('light', true);
      TestBed.flushEffects();
      expect(document.documentElement.classList.contains('dark')).toBeFalse();
    });

    it('should fall back to system when stored value is invalid', () => {
      setupService('invalid-value', false);
      expect(service.theme()).toBe('system');
    });
  });

  describe('setTheme()', () => {
    beforeEach(() => setupService(null, false));

    it('should update the theme signal when setTheme is called with dark', () => {
      service.setTheme('dark');
      expect(service.theme()).toBe('dark');
    });

    it('should update the theme signal when setTheme is called with light', () => {
      service.setTheme('light');
      expect(service.theme()).toBe('light');
    });

    it('should update the theme signal when setTheme is called with system', () => {
      service.setTheme('system');
      expect(service.theme()).toBe('system');
    });

    it('should persist the theme choice to localStorage when setTheme is called', () => {
      service.setTheme('dark');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    it('should add the dark class to html when setTheme is called with dark', () => {
      service.setTheme('dark');
      TestBed.flushEffects();
      expect(document.documentElement.classList.contains('dark')).toBeTrue();
    });

    it('should remove the dark class from html when setTheme is called with light', () => {
      document.documentElement.classList.add('dark');
      service.setTheme('light');
      TestBed.flushEffects();
      expect(document.documentElement.classList.contains('dark')).toBeFalse();
    });
  });

  describe('isDarkModeActive computed signal', () => {
    it('should return true when theme is dark', () => {
      setupService('dark', false);
      expect(service.isDarkModeActive()).toBeTrue();
    });

    it('should return false when theme is light', () => {
      setupService('light', false);
      expect(service.isDarkModeActive()).toBeFalse();
    });

    it('should return true when theme is system and system prefers dark', () => {
      setupService('system', true);
      expect(service.isDarkModeActive()).toBeTrue();
    });

    it('should return false when theme is system and system prefers light', () => {
      setupService('system', false);
      expect(service.isDarkModeActive()).toBeFalse();
    });
  });
});
