import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { QuizStoreInterface, BackendQuizData } from 'quiz-components';
import { createQuizBank, clearError, selectIsLoading, selectErrorMessage, selectIsSuccess } from '../store';

@Injectable({
  providedIn: 'root'
})
export class QuizStoreService extends QuizStoreInterface {
  readonly isLoading$: Observable<boolean>;
  readonly errorMessage$: Observable<string | null>;
  readonly isSuccess$: Observable<boolean>;

  constructor(private store: Store) {
    super();
    this.isLoading$ = this.store.select(selectIsLoading);
    this.errorMessage$ = this.store.select(selectErrorMessage);
    this.isSuccess$ = this.store.select(selectIsSuccess);
  }

  createQuizBank(quizData: BackendQuizData): void {
    this.store.dispatch(createQuizBank({ quizData }));
  }

  clearError(): void {
    this.store.dispatch(clearError());
  }
}
