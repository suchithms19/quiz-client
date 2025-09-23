import { QuizResponse } from 'quiz-components';

export interface QuizState {
  quizzes: QuizResponse[];
  currentQuiz: QuizResponse | null;
  isLoading: boolean;
  errorMessage: string | null;
  isSuccess: boolean;
}

export const initialQuizState: QuizState = {
  quizzes: [],
  currentQuiz: null,
  isLoading: false,
  errorMessage: null,
  isSuccess: false
};
