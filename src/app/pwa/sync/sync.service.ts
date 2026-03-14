import { Injectable, inject } from '@angular/core';
import { OfflineService } from '../offline/offline.service';
import { appConfig } from '../../shared/config/app.config';

interface SyncManager {
  register(tag: string): Promise<void>;
}

interface SyncCapableRegistration extends ServiceWorkerRegistration {
  sync: SyncManager;
}

@Injectable({ providedIn: 'root' })
export class SyncService {
  private readonly offlineService = inject(OfflineService);

  async registerSync(tag = appConfig.sync.defaultTag): Promise<void> {
    if (this.offlineService.online()) return;

    const registration = (await navigator.serviceWorker.ready) as SyncCapableRegistration;
    await registration.sync.register(tag);
  }
}
