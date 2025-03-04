import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideState, provideStore } from '@ngrx/store';
import { authReducer } from './store/auth/auth.reducer';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from './store/auth/auth.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore(),
    provideState({ name: 'auth', reducer: authReducer }), 
    provideEffects([AuthEffects]),
    provideHttpClient(),
  ]
};
