import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { 
  QuizData, 
  QuizOption, 
  QuizQuestion, 
  BackendQuizData, 
  BackendQuestion, 
  BackendOption 
} from '../../types/quiz.model';
import { QuizService } from '../../services/quiz.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-createbank',
  imports: [FormsModule, CommonModule],
  templateUrl: './createbank.html',
  styleUrl: './createbank.scss'
})
export class Createbank {
  quizData: QuizData = {
    name: '',
    category: '',
    noOfQuestions: 0,
    status: true,
    questions: []
  };

  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  private successTimeout?: number;

  constructor(private quizService: QuizService) {
    this.addQuestion();
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
    this.errorMessage = '';
    
    // Clear any existing timeout to prevent race conditions
    if (this.successTimeout) {
      clearTimeout(this.successTimeout);
      this.successTimeout = undefined;
    }
  }

  /**
   * Validates the form before submission
   * @returns true if form is valid, false otherwise
   */
  private validateForm(): boolean {
    this.clearMessages();

    if (!this.quizData.name.trim()) {
      this.errorMessage = 'Please enter a quiz name';
      return false;
    }

    if (!this.quizData.category) {
      this.errorMessage = 'Please select a category';
      return false;
    }

    if (this.quizData.questions.length === 0) {
      this.errorMessage = 'Please add at least one question';
      return false;
    }

    for (let i = 0; i < this.quizData.questions.length; i++) {
      const question = this.quizData.questions[i];
      
      if (!question.description.trim()) {
        this.errorMessage = `Question ${i + 1} needs a description`;
        return false;
      }

      if (question.options.length < 2) {
        this.errorMessage = `Question ${i + 1} needs at least 2 options`;
        return false;
      }

      for (let j = 0; j < question.options.length; j++) {
        if (!question.options[j].text.trim()) {
          this.errorMessage = `Question ${i + 1}, Option ${j + 1} needs text`;
          return false;
        }
      }

      const hasCorrectAnswer = question.options.some(option => option.isCorrect);
      if (!hasCorrectAnswer) {
        this.errorMessage = `Question ${i + 1} needs a correct answer`;
        return false;
      }
    }

    return true;
  }

  /**
   * Submits the form to create the quiz bank
   * Uses the QuizService to handle the API call
   */
  async onSubmit(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    try {
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

      await firstValueFrom(this.quizService.createQuizBank(backendData));
      
      this.clearMessages();
      this.successMessage = 'Quiz bank created successfully!';
      
      this.successTimeout = setTimeout(() => {
        this.resetForm();
      }, 3000);

    } catch (error: any) {
      console.error('Error creating quiz bank:', error);
      this.errorMessage = error.message || 'Failed to create quiz bank. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}
