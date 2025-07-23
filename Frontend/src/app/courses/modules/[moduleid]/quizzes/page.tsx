'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Quiz from './Quiz';
import '../../../../public/quizzes.css';
import CreateQuizForm from './createQuizForm';
import EditQuizForm from './EditQuiz'; // Import EditQuizForm

interface QuizData {
  _id: string;
  name: string;
  level: string;
  numberOfQuestions: number;
  score?: number;
  type:string;
}

export default function Quizzes() {
  const { moduleid } = useParams(); // Extract moduleid from the dynamic route
  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<QuizData | null>(null); // Track the quiz being edited
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!moduleid) return;

    // Fetch quizzes for the module
    axios
      .get(`http://localhost:5000/quizzes/module/${moduleid}`, { withCredentials: true })
      .then((response) => {
        setQuizzes(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching quizzes:', err);
        setError('Failed to fetch quizzes');
        setLoading(false);
      });
  }, [moduleid]);

  const handleCreateQuiz = async (numQuestions: number, difficulty: string, type: string) => {
    try {
      const bank = await axios.get(
        `http://localhost:5000/question-banks/module/${moduleid}`,
        { withCredentials: true }
      );
  
      const response = await axios.post(
        `http://localhost:5000/quizzes`,
        {
          moduleId: moduleid,
          numberOfQuestions: numQuestions,
          difficultyLevel: difficulty,
          questionBank_id: bank.data._id,
          type: type, // Ensure 'type' is included
        },
        { withCredentials: true }
      );
  
      setQuizzes((prev) => [...prev, response.data]);
    } catch (err) {
      console.error('Error creating quiz:', err);
    } finally {
      setShowCreateForm(false);
    }
  };
  
  const handleEditQuiz = async (id: string, numberOfQuestions: number, level: string) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/quizzes/${id}`,
        { numberOfQuestions, level },
        { withCredentials: true }
      );

      setQuizzes((prev) =>
        prev.map((quiz) =>
          quiz._id === id ? { ...quiz, ...response.data } : quiz
        )
      ); // Update the quiz in the list
    } catch (err) {
      console.error('Error editing quiz:', err);
    } finally {
      setEditingQuiz(null);
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/quizzes/${id}`, {
        withCredentials: true,
      });
      setQuizzes((prev) => prev.filter((quiz) => quiz._id !== id)); // Remove the quiz from the list
    } catch (err) {
      console.error('Error deleting quiz:', err);
    }
  };

  if (loading) return <p>Loading quizzes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <h1>Quizzes</h1>
      <button className="btn btn-create" onClick={() => setShowCreateForm(true)}>
        Create Quiz
      </button>
      {selectedQuiz ? (
        <Quiz quizId={selectedQuiz} onComplete={() => setSelectedQuiz(null)} />
      ) : (
        <ul className="quiz-list">
          {quizzes.map((quiz, index) => (
            <li
              key={quiz._id}
              className="quiz-item"
              onClick={() => setSelectedQuiz(quiz._id)} // Clicking the item selects the quiz
            >
              <h2>Quiz {index + 1}</h2>
              <p>Level: {quiz.level}</p>
              <p>Number of Questions: {quiz.numberOfQuestions}</p>
              <p>Type: {quiz.type}</p>
              <div className="quiz-item-actions">
                {/* Prevent bubbling to list item click */}
                <button
                  className="btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingQuiz(quiz);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteQuiz(quiz._id);
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {showCreateForm && (
        <CreateQuizForm
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateQuiz}
        />
      )}
      {editingQuiz && (
        <EditQuizForm
          quiz={{
            _id: editingQuiz._id,
            numQuestions: editingQuiz.numberOfQuestions,
            difficulty: editingQuiz.level,
          }}
          onClose={() => setEditingQuiz(null)}
          onUpdate={handleEditQuiz}
        />
      )}
    </div>
  );
}
