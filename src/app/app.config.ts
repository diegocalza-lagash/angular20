import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes, 
      withComponentInputBinding(),
      withViewTransitions()
    ),
    provideClientHydration(withEventReplay()),
    provideZoneChangeDetection({
      eventCoalescing: true
    }),
    provideHttpClient(
      withInterceptorsFromDi(),
      withFetch()
    ),
    provideAnimations()
  ]
};
