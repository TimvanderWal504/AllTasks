import { Injectable, signal, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate } from '@angular/service-worker';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UpdateService {
  private readonly swUpdate = inject(SwUpdate);
  private readonly destroyRef = inject(DestroyRef);

  readonly updateAvailable = signal(false);

  constructor() {
    if (!this.swUpdate.isEnabled) return;

    this.swUpdate.versionUpdates.pipe(
      filter(event => event.type === 'VERSION_READY'),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.updateAvailable.set(true);
    });
  }

  checkForUpdate(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.checkForUpdate();
    }
  }

  activateUpdate(): Promise<void> {
    return this.swUpdate.activateUpdate().then(() => {
      this.reloadPage();
    });
  }

  reloadPage(): void {
    document.location.reload();
  }
}
