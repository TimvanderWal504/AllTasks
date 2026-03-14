import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OfflineBannerComponent } from './pwa/offline-banner/offline-banner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, OfflineBannerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-offline-banner />
    <router-outlet />
  `,
})
export class AppComponent {}
