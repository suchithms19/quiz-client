import { QuizService } from './quiz.service';
import { BackendQuizData } from '../types/quiz.model';
import { it, expect, beforeEach, describe } from '@jest/globals';
import { jest } from '@jest/globals';
import { of, throwError } from 'rxjs';

describe('QuizService Logic', () => {
  let service: QuizService;
  let mockHttp: any;
  
  const mockQuizData: BackendQuizData = {
    name: 'Test Quiz',
    category: 'Science', 
    noOfQuestions: 1,
    status: true,
    questions: [{
      description: 'What is 2+2?',
      options: [
        { text: '3', isCorrect: false },
        { text: '4', isCorrect: true }
      ]
    }]
  };

  beforeEach(() => {
    mockHttp = {
      post: jest.fn()
    };
    service = new QuizService(mockHttp);
  });

  it('should create quiz bank successfully', () => {
    const mockResponse = { id: '123', name: 'Test Quiz' };
    mockHttp.post.mockReturnValue(of(mockResponse));
    
    service.createQuizBank(mockQuizData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
    
    expect(mockHttp.post).toHaveBeenCalledWith(
      expect.stringContaining('/createQbanks'),
      mockQuizData
    );
  });

  it('should handle API validation errors', () => {
    const errorResponse = {
      error: { 
        errors: [{ field: 'name', message: 'Name is required' }] 
      },
      status: 400
    };
    
    mockHttp.post.mockReturnValue(throwError(() => errorResponse));
    
    service.createQuizBank(mockQuizData).subscribe({
      error: (error) => {
        expect(error.message).toBe('name: Name is required');
      }
    });
  });

  it('should handle server errors', () => {
    const serverError = { status: 500, error: 'Internal Server Error' };
    mockHttp.post.mockReturnValue(throwError(() => serverError));
    
    service.createQuizBank(mockQuizData).subscribe({
      error: (error) => {
        expect(error.message).toBe('Server error occurred. Please try again later.');
      }
    });
  });

  it('should handle network errors', () => {
    const networkError = { status: 0 };
    mockHttp.post.mockReturnValue(throwError(() => networkError));
    
    service.createQuizBank(mockQuizData).subscribe({
      error: (error) => {
        expect(error.message).toBe('Unable to connect to server. Please check your internet connection.');
      }
    });
  });
});