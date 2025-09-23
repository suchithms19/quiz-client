import { Observable } from 'rxjs';
import { BackendQuizData } from '../types/quiz.model';

export abstract class QuizStoreInterface {
  abstract readonly isLoading$: Observable<boolean>;
  abstract readonly errorMessage$: Observable<string | null>;
  abstract readonly isSuccess$: Observable<boolean>;
  
  abstract createQuizBank(quizData: BackendQuizData): void;
  abstract clearError(): void;
}
