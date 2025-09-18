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
  quiz_data: QuizData = {
    name: '',
    category: '',
    no_of_questions: 0,
    status: true,
    questions: []
  };

  is_loading: boolean = false;
  success_message: string = '';
  error_message: string = '';

  constructor(private quiz_service: QuizService) {
    this.addQuestion();
  }

  /**
   * Adds a new question to the quiz
   * Each question starts with 2 empty options
   */
  addQuestion(): void {
    const new_question: QuizQuestion = {
      description: '',
      options: [
        { text: '', is_correct: true },  
        { text: '', is_correct: false }  
      ]
    };

    this.quiz_data.questions.push(new_question);
    this.updateQuestionCount();
  }

  /**
   * Removes a question from the quiz
   * @param question_index - The index of the question to remove
   */
  removeQuestion(question_index: number): void {
    if (this.quiz_data.questions.length > 1) {
      this.quiz_data.questions.splice(question_index, 1);
      this.updateQuestionCount();
    }
  }

  /**
   * Adds a new option to a specific question
   * @param question_index - The index of the question
   */
  addOption(question_index: number): void {
    const question = this.quiz_data.questions[question_index];
    if (question) {
      const new_option: QuizOption = {
        text: '',
        is_correct: false
      };
      question.options.push(new_option);
    }
  }

  /**
   * Removes an option from a specific question
   * @param question_index - The index of the question
   * @param option_index - The index of the option to remove
   */
  removeOption(question_index: number, option_index: number): void {
    const question = this.quiz_data.questions[question_index];
    if (question && question.options.length > 2) {
      const is_removing_correct = question.options[option_index].is_correct;
      
      question.options.splice(option_index, 1);
      
      if (is_removing_correct && question.options.length > 0) {
        question.options[0].is_correct = true;
      }
    }
  }

  /**
   * Sets which option is the correct answer for a question
   * Only one option can be correct per question
   * @param question_index - The index of the question
   * @param option_index - The index of the option to mark as correct
   */
  setCorrectOption(question_index: number, option_index: number): void {
    const question = this.quiz_data.questions[question_index];
    if (question) {
      question.options.forEach(option => {
        option.is_correct = false;
      });
      
      question.options[option_index].is_correct = true;
    }
  }

  /**
   * Updates the number of questions in the quiz data
   * This is needed for backend validation
   */
  private updateQuestionCount(): void {
    this.quiz_data.no_of_questions = this.quiz_data.questions.length;
  }

  /**
   * Resets the entire form to its initial state
   */
  resetForm(): void {
    this.quiz_data = {
      name: '',
      category: '',
      no_of_questions: 0,
      status: true,
      questions: []
    };
    
    this.success_message = '';
    this.error_message = '';
    
    this.addQuestion();
  }

  /**
   * Validates the form before submission
   * @returns true if form is valid, false otherwise
   */
  private validateForm(): boolean {
    this.error_message = '';

    if (!this.quiz_data.name.trim()) {
      this.error_message = 'Please enter a quiz name';
      return false;
    }

    if (!this.quiz_data.category) {
      this.error_message = 'Please select a category';
      return false;
    }

    if (this.quiz_data.questions.length === 0) {
      this.error_message = 'Please add at least one question';
      return false;
    }

    for (let i = 0; i < this.quiz_data.questions.length; i++) {
      const question = this.quiz_data.questions[i];
      
      if (!question.description.trim()) {
        this.error_message = `Question ${i + 1} needs a description`;
        return false;
      }

      if (question.options.length < 2) {
        this.error_message = `Question ${i + 1} needs at least 2 options`;
        return false;
      }

      for (let j = 0; j < question.options.length; j++) {
        if (!question.options[j].text.trim()) {
          this.error_message = `Question ${i + 1}, Option ${j + 1} needs text`;
          return false;
        }
      }

      const has_correct_answer = question.options.some(option => option.is_correct);
      if (!has_correct_answer) {
        this.error_message = `Question ${i + 1} needs a correct answer`;
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

    this.is_loading = true;
    this.error_message = '';
    this.success_message = '';

    try {
      const backend_data: BackendQuizData = {
        name: this.quiz_data.name.trim(),
        category: this.quiz_data.category,
        noOfQuestions: this.quiz_data.no_of_questions,
        status: this.quiz_data.status,
        questions: this.quiz_data.questions.map((question: QuizQuestion): BackendQuestion => ({
          description: question.description.trim(),
          options: question.options.map((option: QuizOption): BackendOption => ({
            text: option.text.trim(),
            isCorrect: option.is_correct 
          }))
        }))
      };

      await firstValueFrom(this.quiz_service.create_quiz_bank(backend_data));
      
      this.success_message = 'Quiz bank created successfully!';
      
      setTimeout(() => {
        this.resetForm();
        this.success_message = '';
      }, 3000);

    } catch (error: any) {
      console.error('Error creating quiz bank:', error);
      this.error_message = error.message || 'Failed to create quiz bank. Please try again.';
    } finally {
      this.is_loading = false;
    }
  }
}
