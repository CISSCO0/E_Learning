export class UpdateQuizDto {
    questions?: string[]; // Array of question IDs
    totalScore?: number; // Updated score
    difficultyLevel?: number; // Updated difficulty
  }
  