import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BreakpointService } from '../breakpoint/breakpoint.service';
import { OfflineBannerComponent } from '../../pwa/offline-banner/offline-banner.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, OfflineBannerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-offline-banner />

    <div class="flex h-screen flex-col">
      <div class="flex flex-1 overflow-hidden">
        @if (isDesktop()) {
          <nav
            data-testid="sidebar"
            aria-label="Hoofdnavigatie"
            class="hidden md:flex flex-col w-64 border-r bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
          >
            <div class="flex flex-col flex-1 overflow-y-auto p-4 gap-2">
              <a
                routerLink="/tasks"
                class="flex items-center gap-3 min-h-[44px] px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Taken"
              >
                <span aria-hidden="true">&#10003;</span>
                <span>Taken</span>
              </a>
              <a
                routerLink="/lists"
                class="flex items-center gap-3 min-h-[44px] px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Lijsten"
              >
                <span aria-hidden="true">&#128203;</span>
                <span>Lijsten</span>
              </a>
              <a
                routerLink="/settings"
                class="flex items-center gap-3 min-h-[44px] px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Instellingen"
              >
                <span aria-hidden="true">&#9881;</span>
                <span>Instellingen</span>
              </a>
            </div>
          </nav>
        }

        <main class="flex-1 overflow-y-auto">
          <router-outlet />
        </main>
      </div>

      @if (isMobile()) {
        <nav
          data-testid="bottom-nav"
          aria-label="Mobiele navigatie"
          class="fixed bottom-0 inset-x-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-around z-40"
        >
          <a
            routerLink="/tasks"
            class="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] flex-1 py-2 text-xs text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            aria-label="Taken"
          >
            <span aria-hidden="true">&#10003;</span>
            <span>Taken</span>
          </a>
          <a
            routerLink="/lists"
            class="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] flex-1 py-2 text-xs text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            aria-label="Lijsten"
          >
            <span aria-hidden="true">&#128203;</span>
            <span>Lijsten</span>
          </a>
          <a
            routerLink="/settings"
            class="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] flex-1 py-2 text-xs text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            aria-label="Instellingen"
          >
            <span aria-hidden="true">&#9881;</span>
            <span>Instellingen</span>
          </a>
        </nav>
      }
    </div>
  `,
})
export class AppLayoutComponent {
  private readonly breakpointService = inject(BreakpointService);

  isMobile(): boolean {
    return this.breakpointService.isMobile();
  }

  isDesktop(): boolean {
    return this.breakpointService.isDesktop();
  }
}
