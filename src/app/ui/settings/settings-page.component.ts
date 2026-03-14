import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Instellingen</h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Instellingen — komt bron.</p>
    </div>
  `,
})
export class SettingsPageComponent {}
