export type QuestionType = 'mcq' | 'true-false';

export interface Question {
  id: string;
  content: string;
  type: QuestionType;
  correctAnswer: string;
  level: 'easy' | 'medium' | 'hard';
  possibleAnswers?: string[];
}

