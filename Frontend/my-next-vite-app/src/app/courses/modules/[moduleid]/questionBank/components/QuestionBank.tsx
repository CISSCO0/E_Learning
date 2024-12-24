'use client';

import { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios
import { Question } from '../types/questions';
import QuestionList from './QuestionList';
import '../../../../../public/question.css';
import QuestionForm from './QuestionForm';

interface QuestionBankProps {
  moduleID: string;
}

export default function QuestionBank({ moduleID }: QuestionBankProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [bank, setBank] = useState<string>(''); // String to store MongoDB ID
  
  const addQuestion = (newQuestion: Question) => {
    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]); // Add the backend response to the questions list
    setShowForm(false);
  };

  useEffect(() => {
    if (moduleID) {
      // Use axios to fetch the question bank for the given module ID
      axios
        .get(`http://localhost:5000/question-banks/module/${moduleID}`, {
          withCredentials: true, // Include cookies with the request
        })
        .then((response) => {
          const data = response.data;

          console.log('Fetched data:', data); // Debug: Log the full response

          if (data && data._id) {
            //alert('Setting bank with ID:'+ data._id); // Debug: Log the _id before setting
            setBank(data._id); // Set the MongoDB ID
          } else {
            alert('No _id found in response data');
          }

          if (data && data.questions) {
            setQuestions(data.questions); // Assuming questions is an array
          } else {
            setQuestions([]); // Handle empty or malformed response
          }

          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching questions:', err);
          setLoading(false); // Stop loading on error
        });
    }
  }, [moduleID]);

  useEffect(() => {
    // Debug: Log the bank value whenever it changes
    console.log('Bank state updated:', bank);
  }, [bank]);

  if (loading) {
    return <p>Loading questions...</p>;
  }

  return (
    <div className="container">
      <h1>Question Bank</h1>
      <button onClick={() => setShowForm(true)} className="add-question-button">
        Add Question
      </button>
      <QuestionList questions={questions} />
      {showForm && (
        <div className="overlay">
          <div className="form-container">
            <QuestionForm onSubmit={addQuestion} onCancel={() => setShowForm(false)} bank={bank} />
          </div>
        </div>
      )}
    </div>
  );
}
