export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  description: string;
  options: QuizOption[];
}

export interface QuizData {
  name: string;
  category: string;
  noOfQuestions: number;
  status: boolean;
  questions: QuizQuestion[];
}

export interface QuizResponse {
  id: string;
  name: string;
  category: string;
  noOfQuestions: number;
  status: boolean;
  createdAt: string;
}

export interface BackendQuizData {
  name: string;
  category: string;
  noOfQuestions: number;
  status: boolean;
  questions: BackendQuestion[];
}

export interface BackendQuestion {
  description: string;
  options: BackendOption[];
}

export interface BackendOption {
  text: string;
  isCorrect: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  error?: string;
  errors?: ValidationError[];
}


