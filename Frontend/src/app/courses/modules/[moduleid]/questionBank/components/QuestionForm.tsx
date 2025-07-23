'use client'

import { useState } from 'react';
import { Question, QuestionType } from '../types/questions';
import '../../../../../public/question.css'
import axios from 'axios';
interface QuestionFormProps {
  onSubmit: (question: Question) => void;
  onCancel: () => void;
  bank :string;
}

export default function QuestionForm({ onSubmit, onCancel,bank }: QuestionFormProps) {
  const [content, setContent] = useState('');
  const [type, setType] = useState<QuestionType>('mcq');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [level, setLevel] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [possibleAnswers, setPossibleAnswers] = useState<string[]>(['', '']);
  //  const [loading, setLoading] = useState(false);
  //  const [error, setError] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newQuestion: Partial<Question> = {
      content,
      type,
      correctAnswer,
      level,
      possibleAnswers: type === 'mcq' ? possibleAnswers.filter((a) => a !== '') : undefined,
    };

    try {
      // setLoading(true);
      // setError('');

      // Create question in the backend
      const response = await axios.post('http://localhost:5000/questions', newQuestion, {
        withCredentials: true,
      });

      const questionID = response.data._id;

      // Add the question to the question bank
      const insert = { questionId: questionID };
      await axios.post(`http://localhost:5000/question-banks/${bank}/questions`, insert, {
        withCredentials: true,
      });

      // Pass the full question back to parent (including backend-generated fields)
      onSubmit(response.data);
    } catch (err) {
      console.log(err)
     //setError(err.response?.data?.message || 'Failed to create question');
    } finally {
      //setLoading(false);
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
              <button type="button" onClick={() => removePossibleAnswer(index)} className="remove-option">
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
        <button type="submit" onClick={handleSubmit}>Add Question</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

