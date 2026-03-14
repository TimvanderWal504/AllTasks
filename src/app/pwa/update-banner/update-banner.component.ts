import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { UpdateService } from './update.service';

@Component({
  selector: 'app-update-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (updateService.updateAvailable()) {
      <div
        data-testid="update-banner"
        class="fixed bottom-0 inset-x-0 mb-16 sm:mb-0 z-50 flex justify-center px-4 pb-4"
        role="status"
        aria-live="polite"
      >
        <div class="bg-gray-900 text-white rounded-xl shadow-xl px-4 py-3 flex items-center gap-3 max-w-sm w-full">
          <span class="flex-1 text-sm font-medium">Er is een nieuwe versie beschikbaar.</span>
          <button
            type="button"
            data-testid="update-button"
            class="bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium px-3 py-1.5 rounded-lg"
            (click)="onUpdateClick()"
          >
            Nu bijwerken
          </button>
          <button
            type="button"
            data-testid="dismiss-button"
            class="ml-auto text-gray-400 hover:text-white"
            aria-label="Banner sluiten"
            (click)="onDismissClick()"
          >
            &#x2715;
          </button>
        </div>
      </div>
    }
  `,
})
export class UpdateBannerComponent {
  readonly updateService = inject(UpdateService);

  onUpdateClick(): void {
    this.updateService.activateUpdate();
  }

  onDismissClick(): void {
    this.updateService.updateAvailable.set(false);
  }
}
