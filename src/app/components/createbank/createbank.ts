import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { 
  QuizData, 
  QuizOption, 
  QuizQuestion, 
  BackendQuizData, 
  BackendQuestion, 
  BackendOption 
} from '../../types/quiz.model';
import { createQuizBank, clearError, selectIsLoading, selectErrorMessage, selectIsSuccess } from '../../store';

@Component({
  selector: 'app-createbank',
  imports: [FormsModule, CommonModule],
  templateUrl: './createbank.html',
  styleUrl: './createbank.scss'
})
export class Createbank implements OnInit, OnDestroy {
  quizData: QuizData = {
    name: '',
    category: '',
    noOfQuestions: 0,
    status: true,
    questions: []
  };

  isLoading$: Observable<boolean>;
  errorMessage$: Observable<string | null>;
  isSuccess$: Observable<boolean>;
  
  successMessage: string = '';
  validationError: string = '';
  private successTimeout?: number;
  private destroy$ = new Subject<void>();

  constructor(private store: Store) {
    this.isLoading$ = this.store.select(selectIsLoading);
    this.errorMessage$ = this.store.select(selectErrorMessage);
    this.isSuccess$ = this.store.select(selectIsSuccess);
    this.addQuestion();
  }

  ngOnInit(): void {
    this.isSuccess$.pipe(takeUntil(this.destroy$)).subscribe(isSuccess => {
      if (isSuccess) {
        this.successMessage = 'Quiz bank created successfully!';
        this.successTimeout = setTimeout(() => {
          this.resetForm();
          this.successMessage = '';
        }, 3000);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.successTimeout) {
      clearTimeout(this.successTimeout);
    }
  }

  /**
   * Adds a new question to the quiz
   * Each question starts with 2 empty options
   */
  addQuestion(): void {
    const newQuestion: QuizQuestion = {
      description: '',
      options: [
        { text: '', isCorrect: true },  
        { text: '', isCorrect: false }  
      ]
    };

    this.quizData.questions.push(newQuestion);
    this.updateQuestionCount();
  }

  /**
   * Removes a question from the quiz
   * @param questionIndex - The index of the question to remove
   */
  removeQuestion(questionIndex: number): void {
    if (this.quizData.questions.length > 1) {
      this.quizData.questions.splice(questionIndex, 1);
      this.updateQuestionCount();
    }
  }

  /**
   * Adds a new option to a specific question
   * @param questionIndex - The index of the question
   */
  addOption(questionIndex: number): void {
    const question = this.quizData.questions[questionIndex];
    if (question) {
      const newOption: QuizOption = {
        text: '',
        isCorrect: false
      };
      question.options.push(newOption);
    }
  }

  /**
   * Removes an option from a specific question
   * @param questionIndex - The index of the question
   * @param optionIndex - The index of the option to remove
   */
  removeOption(questionIndex: number, optionIndex: number): void {
    const question = this.quizData.questions[questionIndex];
    if (question && question.options.length > 2) {
      const isRemovingCorrect = question.options[optionIndex].isCorrect;
      
      question.options.splice(optionIndex, 1);
      
      if (isRemovingCorrect && question.options.length > 0) {
        question.options[0].isCorrect = true;
      }
    }
  }

  /**
   * Sets which option is the correct answer for a question
   * Only one option can be correct per question
   * @param questionIndex - The index of the question
   * @param optionIndex - The index of the option to mark as correct
   */
  setCorrectOption(questionIndex: number, optionIndex: number): void {
    const question = this.quizData.questions[questionIndex];
    if (question) {
      question.options.forEach(option => {
        option.isCorrect = false;
      });
      
      question.options[optionIndex].isCorrect = true;
    }
  }

  /**
   * Updates the number of questions in the quiz data
   * This is needed for backend validation
   */
  private updateQuestionCount(): void {
    this.quizData.noOfQuestions = this.quizData.questions.length;
  }

  /**
   * Resets the entire form to its initial state
   */
  resetForm(): void {
    this.quizData = {
      name: '',
      category: '',
      noOfQuestions: 0,
      status: true,
      questions: []
    };
    
    this.clearMessages();
    this.addQuestion();
  }

  /**
   * Clears all status messages and timeouts
   */
  private clearMessages(): void {
    this.successMessage = '';
    this.validationError = '';
    this.store.dispatch(clearError());
    
    // Clear any existing timeout to prevent race conditions
    if (this.successTimeout) {
      clearTimeout(this.successTimeout);
      this.successTimeout = undefined;
    }
  }

  /**
   * Validates the form before submission
   * @returns validation error message or null if valid
   */
  private validateForm(): string | null {
    this.clearMessages();

    if (!this.quizData.name.trim()) {
      return 'Please enter a quiz name';
    }

    if (!this.quizData.category) {
      return 'Please select a category';
    }

    if (this.quizData.questions.length === 0) {
      return 'Please add at least one question';
    }

    for (let i = 0; i < this.quizData.questions.length; i++) {
      const question = this.quizData.questions[i];
      
      if (!question.description.trim()) {
        return `Question ${i + 1} needs a description`;
      }

      if (question.options.length < 2) {
        return `Question ${i + 1} needs at least 2 options`;
      }

      for (let j = 0; j < question.options.length; j++) {
        if (!question.options[j].text.trim()) {
          return `Question ${i + 1}, Option ${j + 1} needs text`;
        }
      }

      const hasCorrectAnswer = question.options.some(option => option.isCorrect);
      if (!hasCorrectAnswer) {
        return `Question ${i + 1} needs a correct answer`;
      }
    }

    return null;
  }

  /**
   * Submits the form to create the quiz bank
   * Uses NgRx store to dispatch the action
   */
  onSubmit(): void {
    
    const validationError = this.validateForm();
    if (validationError) {
      this.successMessage = '';
      this.validationError = validationError;
      return;
    }

    const backendData: BackendQuizData = {
      name: this.quizData.name.trim(),
      category: this.quizData.category,
      noOfQuestions: this.quizData.noOfQuestions,
      status: this.quizData.status,
      questions: this.quizData.questions.map((question: QuizQuestion): BackendQuestion => ({
        description: question.description.trim(),
        options: question.options.map((option: QuizOption): BackendOption => ({
          text: option.text.trim(),
          isCorrect: option.isCorrect 
        }))
      }))
    };

    this.store.dispatch(createQuizBank({ quizData: backendData }));
  }
}