import { Createbank } from './createbank';
import { it, expect, beforeEach, describe } from '@jest/globals';
import { jest } from '@jest/globals';

const mockStore = {
  select: jest.fn(() => ({ pipe: jest.fn(() => ({ subscribe: jest.fn() })) })),
  dispatch: jest.fn()
};

describe('Createbank Component Logic', () => {
  let component: Createbank;

  beforeEach(() => {
    component = new Createbank(mockStore as any);
  });

  it('should remove question but keep minimum one', () => {
    component.addQuestion();
    component.removeQuestion(0);
    expect(component.quizData.questions.length).toBe(1);
    
    component.removeQuestion(0);
    expect(component.quizData.questions.length).toBe(1);
  });

  it('should manage question options', () => {
    component.addOption(0);
    expect(component.quizData.questions[0].options.length).toBe(3);
    
    component.addOption(0);
    expect(component.quizData.questions[0].options.length).toBe(4);
    
    component.removeOption(0, 0);
    expect(component.quizData.questions[0].options.length).toBe(3);
  });

  it('should validate complete form requirements', () => {
    component.quizData.name = 'Test Quiz';
    component.quizData.category = 'Math';
    component.quizData.questions[0].description = 'What is 2+2?';
    component.quizData.questions[0].options[0].text = '3';
    component.quizData.questions[0].options[1].text = '4';
    component.quizData.questions[0].options[1].isCorrect = true;
    
    component.onSubmit();
    
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('should validate question description required', () => {
    component.quizData.name = 'Test Quiz';
    component.quizData.category = 'Math';
    component.quizData.questions[0].description = '';
    
    component.onSubmit();
    
    expect(component.validationError).toBe('Question 1 needs a description');
  });
});