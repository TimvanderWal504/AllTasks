import { bootstrapApplication } from '@angular/platform-browser';
import { isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { appConfig } from './app/shared/config/app.config';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideServiceWorker(appConfig.serviceWorker.scriptUrl, {
      enabled: !isDevMode(),
      registrationStrategy: appConfig.serviceWorker.registrationStrategy,
    }),
  ],
}).catch((err) => console.error(err));
