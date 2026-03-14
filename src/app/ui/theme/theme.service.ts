import { Injectable, computed, effect, signal } from '@angular/core';
import { appConfig } from '../../shared/config/app.config';
import { Theme, VALID_THEMES } from './theme.models';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>(this.loadStoredTheme());

  readonly isDarkModeActive = computed(() => this.resolveTheme(this.theme()) === 'dark');

  constructor() {
    effect(() => this.applyTheme(this.theme()));
  }

  setTheme(theme: Theme): void {
    localStorage.setItem(appConfig.storage.themeKey, theme);
    this.theme.set(theme);
  }

  private loadStoredTheme(): Theme {
    const stored = localStorage.getItem(appConfig.storage.themeKey);
    return this.isValidTheme(stored) ? stored : 'system';
  }

  private isValidTheme(value: string | null): value is Theme {
    return VALID_THEMES.includes(value as Theme);
  }

  private applyTheme(theme: Theme): void {
    const resolvedTheme = this.resolveTheme(theme);
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
  }

  private resolveTheme(theme: Theme): 'light' | 'dark' {
    if (theme !== 'system') return theme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
