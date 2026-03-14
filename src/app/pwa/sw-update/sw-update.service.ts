import { Injectable, signal, inject } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SwUpdateService {
  private readonly swUpdate = inject(SwUpdate);

  readonly hasUpdate = signal(false);

  constructor() {
    if (!this.swUpdate.isEnabled) return;

    this.swUpdate.versionUpdates.pipe(
      filter(event => event.type === 'VERSION_READY')
    ).subscribe(() => {
      this.hasUpdate.set(true);
    });
  }
}
