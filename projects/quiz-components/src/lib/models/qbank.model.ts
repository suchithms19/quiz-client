import { QuizQuestion } from './quiz.model';

export interface Qbank {
  _id: string;
  id: string;
  name: string;
  category: string;
  noOfQuestions: number;
  status: boolean;
  createdAt?: string;
}
 export interface Option{
  text:string;
  isCorrect:boolean;
 }

 export interface Question{
   description:string;
   options:Option[];
  _id:string;
  
 }
 export interface FullQbank extends Qbank{
  questions:Question[];
 }

export interface QbankWithQuestions extends Qbank {
  questions: QuizQuestion[];
}
