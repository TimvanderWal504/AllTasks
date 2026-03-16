import { Component, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { OfflineService } from '../offline/offline.service';

@Component({
  selector: 'app-offline-banner',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!isOnline()) {
      <div
        data-testid="offline-banner"
        class="fixed top-0 inset-x-0 z-50 flex items-center justify-center gap-2 bg-yellow-400 text-yellow-900 text-sm font-medium py-2 px-4"
        role="status"
        aria-live="polite"
      >
        <span aria-hidden="true">⚠</span>
        <span>Geen internetverbinding — wijzigingen worden gesynchroniseerd zodra je weer online bent.</span>
      </div>
    }
  `,
})
export class OfflineBannerComponent {
  private readonly offlineService = inject(OfflineService);

  readonly isOnline = computed(() => this.offlineService.online());
}
