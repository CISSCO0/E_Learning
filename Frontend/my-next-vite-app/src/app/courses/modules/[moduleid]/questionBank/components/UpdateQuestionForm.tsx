'use client';

import { useState } from 'react';
import { Question, QuestionType } from '../types/questions';
import '../../../../../public/question.css';
import axios from 'axios';

interface QuestionUpdateFormProps {
  question: Question; // Existing question to be updated
  onSubmit: (updatedQuestion: Question) => void; // Callback after successful update
  onCancel: () => void; // Cancel editing
}

export default function QuestionUpdateForm({
  question,
  onSubmit,
  onCancel,
}: QuestionUpdateFormProps) {
  const [content, setContent] = useState(question.content);
  const [type, setType] = useState<QuestionType>(question.type);
  const [correctAnswer, setCorrectAnswer] = useState(question.correctAnswer);
  const [level, setLevel] = useState<'easy' | 'medium' | 'hard'>(question.level);
  const [possibleAnswers, setPossibleAnswers] = useState<string[]>(
    question.possibleAnswers || ['', '']
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedQuestion: Partial<Question> = {
      content,
      type,
      correctAnswer,
      level,
      possibleAnswers: type === 'mcq' ? possibleAnswers.filter((a) => a !== '') : undefined,
    };

    try {
       
      const response = await axios.patch(
        `http://localhost:5000/questions/${question._id}`,
        updatedQuestion,
        { withCredentials: true }
      );

      onSubmit(response.data); // Pass the updated question back to the parent
      alert('Question updated successfully!');
    } catch (error) {
      alert('Failed to update question: ' + error);
    }
  };

  const handlePossibleAnswerChange = (index: number, value: string) => {
    const newPossibleAnswers = [...possibleAnswers];
    newPossibleAnswers[index] = value;
    setPossibleAnswers(newPossibleAnswers);
  };

  const addPossibleAnswer = () => {
    setPossibleAnswers([...possibleAnswers, '']);
  };

  const removePossibleAnswer = (index: number) => {
    const newPossibleAnswers = possibleAnswers.filter((_, i) => i !== index);
    setPossibleAnswers(newPossibleAnswers);
    if (correctAnswer === possibleAnswers[index]) {
      setCorrectAnswer('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="question-form">
      <div className="form-group">
        <label htmlFor="content">Question Content:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="type">Question Type:</label>
        <select
          id="type"
          value={type}
          onChange={(e) => {
            setType(e.target.value as QuestionType);
            setCorrectAnswer('');
            setPossibleAnswers(e.target.value === 'mcq' ? ['', ''] : []);
          }}
          required
        >
          <option value="mcq">Multiple Choice</option>
          <option value="true-false">True/False</option>
        </select>
      </div>
      {type === 'mcq' && (
        <div className="form-group">
          <label>Possible Answers:</label>
          {possibleAnswers.map((answer, index) => (
            <div key={index} className="possible-answer">
              <input
                type="text"
                value={answer}
                onChange={(e) => handlePossibleAnswerChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                required
              />
              <button
                type="button"
                onClick={() => removePossibleAnswer(index)}
                className="remove-option"
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addPossibleAnswer} className="add-option">
            Add Option
          </button>
        </div>
      )}
      <div className="form-group">
        <label htmlFor="correctAnswer">Correct Answer:</label>
        {type === 'true-false' ? (
          <select
            id="correctAnswer"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            required
          >
            <option value="">Select correct answer</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        ) : (
          <select
            id="correctAnswer"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            required
          >
            <option value="">Select correct answer</option>
            {possibleAnswers.map((answer, index) => (
              <option key={index} value={answer}>
                {answer}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="level">Difficulty Level:</label>
        <select
          id="level"
          value={level}
          onChange={(e) => setLevel(e.target.value as 'easy' | 'medium' | 'hard')}
          required
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <div className="form-actions">
        <button type="submit">Update Question</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
