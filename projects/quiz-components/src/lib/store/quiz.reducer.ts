import { createReducer, on } from '@ngrx/store';
import { QuizState, initialQuizState } from './quiz.state';
import * as QuizActions from './quiz.actions';

export const quizReducer = createReducer(
  initialQuizState,
  on(QuizActions.createQuizBank, (state): QuizState => ({
    ...state,
    isLoading: true,
    errorMessage: null,
    isSuccess: false
  })),
  on(QuizActions.createQuizBankSuccess, (state, { quiz }): QuizState => ({
    ...state,
    quizzes: [...state.quizzes, quiz],
    currentQuiz: quiz,
    isLoading: false,
    errorMessage: null,
    isSuccess: true
  })),
  on(QuizActions.createQuizBankFailure, (state, { error }): QuizState => ({
    ...state,
    isLoading: false,
    errorMessage: error,
    isSuccess: false
  })),
  on(QuizActions.clearError, (state): QuizState => ({
    ...state,
    errorMessage: null
  })),
  on(QuizActions.resetQuizState, (): QuizState => initialQuizState)
);
