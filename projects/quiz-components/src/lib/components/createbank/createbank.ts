import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil, filter, map } from 'rxjs/operators';
import { 
  QuizData, 
  QuizOption, 
  QuizQuestion, 
  BackendQuizData, 
  BackendQuestion, 
  BackendOption 
} from '../../models/quiz.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { createQuizBank, clearError, resetQuizState } from '../../store/quiz.actions';
import { selectIsLoading, selectErrorMessage, selectIsSuccess } from '../../store/quiz.selectors';
import { loadQbankById, updateQbank, clearCurrentQbank, updateQbankSuccess } from '../../store/qbank.actions';
import { selectCurrentQbank, selectCurrentQbankLoading } from '../../store/qbank.selectors';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { AiService, AiGeneratedQuestion } from '../../services/ai.service';

@Component({
  selector: 'qc-createbank',
  imports: [FormsModule, CommonModule, DragDropModule],
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

  isEditMode: boolean = false;
  currentQbankId: string | null = null;

  isLoading$: Observable<boolean>;
  errorMessage$: Observable<string | null>;
  isSuccess$: Observable<boolean>;
  
  currentQbank$: Observable<any>;
  currentQbankLoading$: Observable<boolean>;
  
  successMessage: string = '';
  validationError: string = '';
  showConfirmation: boolean = false;
  private successTimeout?: number;
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<AppState>, 
    private router: Router,
    private route: ActivatedRoute,
    private aiService: AiService
  ) {
    this.isLoading$ = this.store.select(selectIsLoading);
    this.errorMessage$ = this.store.select(selectErrorMessage);
    this.isSuccess$ = this.store.select(selectIsSuccess);
    this.currentQbank$ = this.store.select(selectCurrentQbank);
    this.currentQbankLoading$ = this.store.select(selectCurrentQbankLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(resetQuizState());
    this.store.dispatch(clearCurrentQbank());
    
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['mode'] === 'edit' && params['id']) {
        this.isEditMode = true;
        this.currentQbankId = params['id'];

        this.store.dispatch(loadQbankById({ qbankId: params['id'] }));
      } else {
        this.isEditMode = false;
        this.currentQbankId = null;
        
        if (this.quizData.questions.length === 0) {
          this.addQuestion();
        }
      }
    });

    // Handle successful creation
    this.isSuccess$.pipe(takeUntil(this.destroy$)).subscribe(isSuccess => {
      if (isSuccess && !this.isEditMode) {
        this.successMessage = 'Quiz bank created successfully!';
        this.successTimeout = setTimeout(() => {
          this.resetForm();
          this.successMessage = '';
          this.router.navigate(['/view-qbanks'])
        }, 1000); 
      }
    });

    // Handle loading qbank for editing
    this.currentQbank$.pipe(
      takeUntil(this.destroy$),
      filter(qbank => !!qbank)
    ).subscribe(qbank => {
      if (qbank && this.isEditMode) {
        this.populateFormForEdit(qbank);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.successTimeout) {
      clearTimeout(this.successTimeout);
    }
    
    this.store.dispatch(clearCurrentQbank());
  }

  /**
   * Populates the form with existing qbank data for editing
   * @param qbank - The qbank data to populate the form with
   */
  private populateFormForEdit(qbank: any): void {
    this.quizData = {
      name: qbank.name,
      category: qbank.category,
      noOfQuestions: qbank.noOfQuestions,
      status: qbank.status,
      questions: qbank.questions || []
    };
    
    // Ensure each question has proper structure
    this.quizData.questions = this.quizData.questions.map(question => ({
      description: question.description,
      options: question.options.map((option: any, index: number) => ({
        text: option.text,
        isCorrect: option.isCorrect,
        order: index
      }))
    }));
    
    // If no questions exist, add one default question
    if (this.quizData.questions.length === 0) {
      this.addQuestion();
    }
    
    this.updateQuestionCount();
  }

  /**
   * Adds a new question to the quiz
   * Each question starts with 2 empty options
   */
  addQuestion(): void {
    const newQuestion: QuizQuestion = {
      description: '',
      options: [
        { text: '', isCorrect: true, order: 0 },  
        { text: '', isCorrect: false, order: 1 }  
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
        isCorrect: false,
        order: question.options.length
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
      
      question.options.forEach((option, index) => {
        option.order = index;
      });
      
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
   * Shows the confirmation dialog for resetting the form
   */
  showResetConfirmation(): void {
    this.showConfirmation = true;
  }

  /**
   * Closes the confirmation dialog
   */
  closeConfirmation(): void {
    this.showConfirmation = false;
  }

  /**
   * Confirms the reset action and resets the form
   */
  confirmReset(): void {
    this.resetForm();
    this.closeConfirmation();
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
   * Gets the option label for display
   * @param optionIndex - The index of the option
   * @returns The letter label for the option
   */
  getOptionLabel(optionIndex: number): string {
    return String.fromCharCode(97 + optionIndex); // 97 is ASCII for 'a'
  }

  trackByIndex(index: number): number {
    return index;
  }

  /**
   * Handles drag and drop reordering of options
   * @param event - The drag drop event
   * @param questionIndex - The index of the question containing the options
   */
  onOptionDrop(event: CdkDragDrop<QuizOption[]>, questionIndex: number): void {
    const question = this.quizData.questions[questionIndex];
    if (question && event.previousIndex !== event.currentIndex) {
      const newOptions = [...question.options];
      
      moveItemInArray(newOptions, event.previousIndex, event.currentIndex);
      
      const updatedOptions = newOptions.map((option, index) => ({
        text: option.text,
        isCorrect: option.isCorrect,
        order: index
      }));
      
      question.options = updatedOptions;
      
      this.quizData.questions[questionIndex] = { ...question };
    }
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

  // --- AI Generation Feature ---
  aiPromptTopic: string = '';
  aiPromptCount: number = 5;
  aiIsGenerating: boolean = false;
  aiError: string = '';
  aiModalOpen: boolean = false;

  openAiModal(): void {
    this.aiError = '';
    this.aiPromptTopic = this.quizData.name || '';
    this.aiPromptCount = 5 ;
    this.aiModalOpen = true;
  }

  closeAiModal(): void {
    if (this.aiIsGenerating) return;
    this.aiModalOpen = false;
  }

  async generateWithAi(): Promise<void> {
    this.aiError = '';
    const topic = (this.aiPromptTopic || '').trim();
    const count = Number(this.aiPromptCount) || 1;

    if (!topic) {
      this.aiError = 'Please enter a topic';
      return;
    }
    if (count < 1 || count > 20) {
      this.aiError = 'Number of questions must be between 1 and 20';
      return;
    }

    try {
      this.aiIsGenerating = true;
      const questions: AiGeneratedQuestion[] = await this.aiService.generateQuestions(topic, count);
      const mapped: QuizQuestion[] = questions.map((q): QuizQuestion => ({
        description: q.description,
        options: q.options.slice(0, 4).map((opt, idx) => ({
          text: opt.text,
          isCorrect: opt.isCorrect,
          order: idx
        }))
      }));

      this.quizData.questions = [...mapped];
      this.updateQuestionCount();
      this.aiModalOpen = false;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to generate questions';
      this.aiError = message;
    } finally {
      this.aiIsGenerating = false;
    }
  }

  /**
   * Validates the form before submission
   * @returns validation error message or null if valid
   */
  private validateForm(): string | null {
    
    this.clearMessages(); //@todo: improve this

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
   * Submits the form to create or update the quiz bank
   * Uses NgRx store to dispatch the appropriate action
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
          isCorrect: option.isCorrect,
          order: option.order
        }))
      }))
    };

    if (this.isEditMode && this.currentQbankId) {
      // Update existing qbank
      this.store.dispatch(updateQbank({ 
        qbankId: this.currentQbankId, 
        quizData: backendData 
      }));
      
      // Show success message and navigate
      this.successMessage = 'Quiz bank updated successfully!';
      this.successTimeout = setTimeout(() => {
        this.successMessage = '';
        this.router.navigate(['/view-qbanks']);
      }, 1000);
    } else {
      // Create new qbank
      this.store.dispatch(createQuizBank({ quizData: backendData }));
    }
  }
}