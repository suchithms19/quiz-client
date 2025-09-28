export * from './quiz.state';
export * from './quiz.actions';
export * from './quiz.reducer';
export * from './quiz.effects';
export * from './quiz.selectors';

export * from './qbank.actions';
export * from './qbank.reducer';
export * from './qbank.effects';
export * from './qbank.selectors';

export interface AppState {
  quiz: import('./quiz.state').QuizState;
  qbank: import('./qbank.reducer').QbankState;
}