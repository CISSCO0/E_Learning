import React, { useState, useEffect } from 'react';
interface Quiz {
    _id: string;
    numQuestions: number;
    difficulty: string;
  }
  
interface EditQuizFormProps {
  quiz: Quiz | null; // Pass the existing quiz details or null for a new quiz
  onClose: () => void;
  onUpdate: (id: string, numQuestions: number, difficulty: string) => void;
}

export default function EditQuizForm({ quiz, onClose, onUpdate }: EditQuizFormProps) {
  const [numQuestions, setNumQuestions] = useState(quiz ? quiz.numQuestions : 5);
  const [difficulty, setDifficulty] = useState(quiz ? quiz.difficulty : 'medium');

  // Update state when the quiz prop changes (e.g., when editing a different quiz)
  useEffect(() => {
    if (quiz) {
      setNumQuestions(quiz.numQuestions);
      setDifficulty(quiz.difficulty);
    }
  }, [quiz]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quiz) {
      onUpdate(quiz._id, numQuestions, difficulty); // Call the update handler
    }
    onClose(); // Close the form after submission
  };

  return (
    <div className="edit-quiz-overlay">
      <div className="edit-quiz-form">
        <h2>{quiz ? 'Edit Quiz' : 'Create New Quiz'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="numQuestions">Number of Questions:</label>
            <input
              type="number"
              id="numQuestions"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              min="1"
              max="20"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="difficulty">Difficulty Level:</label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              required
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-submit">
              {quiz ? 'Update Quiz' : 'Create Quiz'}
            </button>
            <button type="button" className="btn btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
