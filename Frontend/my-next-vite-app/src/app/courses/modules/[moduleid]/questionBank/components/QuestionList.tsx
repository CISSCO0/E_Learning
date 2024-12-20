import { Question } from '../types/questions';
import QuestionItem from './QuestionItem';
import '../../../../../public/question.css';
import { useState } from 'react';

interface QuestionListProps {
  questions: Question[];

}

export default function QuestionList({ questions }: QuestionListProps) {
  const [questions2, setQuestions] = useState<Question[]>(questions);
  if (questions.length === 0) {
    return <p>No questions available.</p>;
  }
  const handleDelete = (id: string) => {
    setQuestions(questions.filter((question) => question.toString() !== id));
  };

//alert(JSON.stringify(questions[0]));
  return (
    <ul className="question-list">
      {questions2.map((question) => (
        <li key={question.toString()}>
          <QuestionItem question={question}  onDelete={handleDelete} />
        </li>
      ))}
    </ul>
  );
}
