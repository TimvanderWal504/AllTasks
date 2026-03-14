import { Injectable, signal, inject } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UpdateService {
  private readonly swUpdate = inject(SwUpdate);

  readonly updateAvailable = signal(false);

  constructor() {
    if (!this.swUpdate.isEnabled) return;

    this.swUpdate.versionUpdates.pipe(
      filter(event => event.type === 'VERSION_READY')
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
