import { createFeatureSelector, createSelector } from '@ngrx/store';
import { QuizState } from './quiz.state';


export const selectQuizState = createFeatureSelector<QuizState>('quiz');


export const selectAllQuizzes = createSelector(
  selectQuizState,
  (state: QuizState) => state.quizzes
);


export const selectCurrentQuiz = createSelector(
  selectQuizState,
  (state: QuizState) => state.currentQuiz
);


export const selectIsLoading = createSelector(
  selectQuizState,
  (state: QuizState) => state.isLoading
);


export const selectErrorMessage = createSelector(
  selectQuizState,
  (state: QuizState) => state.errorMessage
);


export const selectIsSuccess = createSelector(
  selectQuizState,
  (state: QuizState) => state.isSuccess
);


export const selectHasQuizzes = createSelector(
  selectAllQuizzes,
  (quizzes) => quizzes.length > 0
);


export const selectQuizzesCount = createSelector(
  selectAllQuizzes,
  (quizzes) => quizzes.length
);
