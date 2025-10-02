import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './Core/interceptors/auth-interceptor';
import { provideMarkdown } from 'ngx-markdown';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({
        scrollPositionRestoration: 'enabled', // Restores position when navigating back
        anchorScrolling: 'enabled',           // Enables scrolling to anchors like #features
      })),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideMarkdown(),
    provideAnimations(),   // ✅ enables Angular animations
    provideToastr({        // ✅ config Toastr globally
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ]
};
