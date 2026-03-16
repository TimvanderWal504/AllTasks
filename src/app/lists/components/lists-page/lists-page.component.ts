import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-lists-page',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-full items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
      <p>Selecteer een lijst om taken te bekijken.</p>
    </div>
  `,
})
export class ListsPageComponent {}
