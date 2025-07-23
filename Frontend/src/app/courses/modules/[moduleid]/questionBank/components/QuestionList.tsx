import { Question } from '../types/questions';
import QuestionItem from './QuestionItem';
import '../../../../../public/question.css';
import { useState } from 'react';

interface QuestionListProps {
  questions: Question[];
}

export default function QuestionList({ questions }: QuestionListProps) {
  const [questions2, setQuestions] = useState<Question[]>(questions);

  // Handle deletion of a question
  const handleDelete = (id: string) => {
    setQuestions(questions2.filter((question) => question.toString() !== id)); // Update state by filtering out the deleted question
  };

  // Handle updating a question
  const handleUpdate = (updatedQuestion: Question) => {
    setQuestions(
      questions2.map((question) =>
        question === updatedQuestion ? updatedQuestion : question
      )
    );
  };

  if (questions2.length === 0) {
    return <p>No questions available.</p>;
  }

  return (
    <ul className="question-list">
      {questions2.map((question) => (
        <li key={question.toString()}>
          <QuestionItem
            question={question}
            onDelete={handleDelete}
            onUpdate={handleUpdate} // Pass the update handler to QuestionItem
          />
        </li>
      ))}
    </ul>
  );
}
