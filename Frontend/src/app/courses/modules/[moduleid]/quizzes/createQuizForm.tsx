import React, { useState } from 'react';

interface CreateQuizFormProps {
  onClose: () => void;
  onSubmit: (numQuestions: number, difficulty: string, type: string) => void;
}

export default function CreateQuizForm({ onClose, onSubmit }: CreateQuizFormProps) {
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');
  const [type, setType] = useState('mcq'); // Default type

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !difficulty) {
      alert('Please fill out all required fields.');
      return;
    }
    onSubmit(numQuestions, difficulty, type);
    onClose();
  };

  return (
    <div className="create-quiz-overlay">
      <div className="create-quiz-form">
        <h2>Create New Quiz</h2>
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
          <div className="form-group">
            <label htmlFor="type">Quiz Type:</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="mcq">Multiple Choice</option>
              <option value="true-false">True/False</option>
              <option value="short-answer">Short Answer</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-submit">Create Quiz</button>
            <button type="button" className="btn btn-cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
