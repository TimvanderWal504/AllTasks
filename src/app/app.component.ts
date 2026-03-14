import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UpdateBannerComponent } from './pwa/update-banner/update-banner.component';
import { UpdateService } from './pwa/update-banner/update.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UpdateBannerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <router-outlet />
    <app-update-banner />
  `,
})
export class AppComponent implements OnInit {
  private readonly updateService = inject(UpdateService);

  ngOnInit(): void {
    this.updateService.checkForUpdate();
  }
}
