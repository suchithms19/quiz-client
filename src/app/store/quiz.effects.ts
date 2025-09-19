import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { QuizService } from '../services/quiz.service';
import * as QuizActions from './quiz.actions';

@Injectable()
export class QuizEffects {
  private actions$ = inject(Actions);
  private quizService = inject(QuizService);

  createQuizBank$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuizActions.createQuizBank),
      switchMap(({ quizData }) => {
        return this.quizService.createQuizBank(quizData).pipe(
          map(quiz => {
            return QuizActions.createQuizBankSuccess({ quiz });
          }),
          catchError(error => {
            return of(QuizActions.createQuizBankFailure({ 
              error: error.message || 'Failed to create quiz bank' 
            }));
          })
        );
      })
    )
  );
}
