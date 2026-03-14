import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from './theme.service';
import { Theme } from './theme.models';

interface ThemeOption {
  value: Theme;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div role="group" aria-label="Thema kiezen" class="flex gap-1">
      @for (option of themeOptions; track option.value) {
        <button
          [attr.data-testid]="'theme-option-' + option.value"
          [attr.aria-pressed]="isActiveTheme(option.value)"
          [attr.aria-label]="option.label"
          (click)="selectTheme(option.value)"
          class="flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg px-3 py-2 text-sm transition-colors"
          [class.bg-blue-600]="isActiveTheme(option.value)"
          [class.text-white]="isActiveTheme(option.value)"
          [class.bg-gray-100]="!isActiveTheme(option.value)"
          [class.dark:bg-gray-800]="!isActiveTheme(option.value)"
          [class.text-gray-700]="!isActiveTheme(option.value)"
          [class.dark:text-gray-200]="!isActiveTheme(option.value)"
          type="button"
        >
          <span aria-hidden="true" class="mr-1">{{ option.icon }}</span>
          <span>{{ option.label }}</span>
        </button>
      }
    </div>
  `,
})
export class ThemeToggleComponent {
  private readonly themeService = inject(ThemeService);

  readonly theme = this.themeService.theme;

  readonly themeOptions: ThemeOption[] = [
    { value: 'light', label: 'Licht', icon: '☀️' },
    { value: 'dark', label: 'Donker', icon: '🌙' },
    { value: 'system', label: 'Automatisch', icon: '💻' },
  ];

  isActiveTheme(value: Theme): boolean {
    return this.theme() === value;
  }

  selectTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }
}
