import { createAction, props } from '@ngrx/store';
import { BackendQuizData, QuizResponse } from '../types/quiz.model';

export const createQuizBank = createAction(
  '[Quiz] Create Quiz Bank',
  props<{ quizData: BackendQuizData }>()
);

export const createQuizBankSuccess = createAction(
  '[Quiz] Create Quiz Bank Success',
  props<{ quiz: QuizResponse }>()
);

export const createQuizBankFailure = createAction(
  '[Quiz] Create Quiz Bank Failure',
  props<{ error: string }>()
);

export const clearError = createAction('[Quiz] Clear Error');

export const resetQuizState = createAction('[Quiz] Reset State');
