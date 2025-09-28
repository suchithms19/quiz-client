export interface Qbank {
  _id: string;
  id: string;
  name: string;
  category: string;
  noOfQuestions: number;
  status: boolean;
  createdAt?: string;
}
