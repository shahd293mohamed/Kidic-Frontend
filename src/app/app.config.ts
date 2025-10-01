import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './Core/interceptors/auth-interceptor';
import { provideMarkdown } from 'ngx-markdown';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({
        scrollPositionRestoration: 'enabled', // Restores position when navigating back
        anchorScrolling: 'enabled',           // Enables scrolling to anchors like #features
      })),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideMarkdown()
  ]
};
