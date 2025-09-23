export * from './lib/components/createbank/createbank';
export * from './lib/components/header/header';
export * from './lib/components/landing/landing';
export * from './lib/components/navbar/navbar';
export * from './lib/types/quiz.model';
export * from './lib/services/quiz-store.interface';

import { Createbank } from './lib/components/createbank/createbank';
import { Header } from './lib/components/header/header';
import { Landing } from './lib/components/landing/landing';
import { Navbar } from './lib/components/navbar/navbar';

export const QUIZ_COMPONENTS = [
  Createbank,
  Header,
  Landing,
  Navbar
] as const;