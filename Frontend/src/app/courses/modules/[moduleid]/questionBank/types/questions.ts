export type QuestionType = 'mcq' | 'true-false';

export interface Question {
  _id: string;
  content: string;
  type: QuestionType;
  correctAnswer: string;
  level: 'easy' | 'medium' | 'hard';
  possibleAnswers?: string[];
}

