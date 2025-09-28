import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { quizReducer, QuizEffects, qbankReducer, QbankEffects } from 'quiz-components';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideStore({ quiz: quizReducer, qbank: qbankReducer }),
    provideEffects(QuizEffects, QbankEffects),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: true,
      autoPause: true
    }),
  ]
};
