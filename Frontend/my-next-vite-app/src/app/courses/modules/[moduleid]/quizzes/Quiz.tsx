'use client'

import { useState, useEffect } from 'react'
import Question from './Question'
import Result from './Result'
import axios from 'axios'

interface QuizProps {
  quizId: string
  onComplete: () => void
}

interface QuestionData {
  _id: string
  content: string
  type: 'mcq' | 'true-false'
  possibleAnswers?: string[]
  correctAnswer?: string // Only used on the backend for validation
}

export default function Quiz({ quizId, onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null)
  const [answers, setAnswers] = useState<{ [key: string]: string }>({})
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [answerSubmitted, setAnswerSubmitted] = useState(false)
  const [count,setCount] = useState(0);
  const [index,setIndex] = useState(1)
  useEffect(() => {
    // Start the quiz and fetch the first question
    const startQuiz = async () => {
      try {
       
        const response = await axios.post(
          `http://localhost:5000/quizzes/${quizId}/start`,
          {}, // Request body (if needed, replace `{}` with the appropriate data)
          {
            withCredentials: true, // Include cookies in the request
          }
        );
        
          
        const data = response.data;
       // alert(JSON.stringify(data));
        setCurrentQuestion(data.question)
      } catch (error) {
        console.error('Error starting quiz:', error)
      }
    }
    startQuiz()
  }, [quizId])

  const handleAnswer = (answer: string) => {
   
    setAnswers({ ...answers, [currentQuestion?._id || '']: answer })
 //   alert(JSON.stringify(answers))
  }

  const handleSubmit = async () => {
    if (!currentQuestion) return
  
    const response = await axios.get(`http://localhost:5000/quizzes/${quizId}`, { withCredentials: true })

    if(count+1 == response.data.numberOfQuestions){
      handleEndQuiz();
      return;
    }
    setCount(count+1);
    try {
      const response = await axios.post(`http://localhost:5000/quizzes/${quizId}/submit`, {
        answer: answers[currentQuestion._id],
        questionId: currentQuestion._id,
      }, { withCredentials: true })
  
      const data = response.data
      if (data.isCorrect) {
        setScore(score + 1)
      }
      setAnswerSubmitted(true) // Show feedback without moving to the next question
    } catch (error) {
      console.error('Error submitting answer:', error)
    }
  }
  
  const handleNext = async () => {
    try {
      if (!currentQuestion) return
      setIndex(index+1)
      const response = await axios.post(`http://localhost:5000/quizzes/${quizId}/submit`, {
        answer: answers[currentQuestion._id],
        questionId: currentQuestion._id,
      }, { withCredentials: true })
  
      const data = response.data
      if (data.nextQuestion) {
        setCurrentQuestion(data.nextQuestion)
        setAnswerSubmitted(false) // Reset for the next question
      } else {
        setShowResult(true)
      }
    } catch (error) {
      console.error('Error fetching next question:', error)
    }
  }
  

  const handleEndQuiz = async () => {
    try {
       const quiz = await axios.get(`http://localhost:5000/quizzes/${quizId}`, { withCredentials: true })
      const perc = (score/quiz.data.numberOfQuestions) * 100;
      
      let pass :boolean;
      if(perc<50)
        pass = false;
      else
      pass = true;
    
      const response = await axios.post(`http://localhost:5000/quizzes/${quizId}/end`, {
       pass: pass
      }, { withCredentials: true })
     
      const data = await response.data
      console.log('Quiz ended:', data)
      setShowResult(true)
    } catch (error) {
      alert(error)
      console.error('Error ending quiz:', error)
    }
  }

  if (showResult) {
    return (
      <Result
        score={score}
        total={Object.keys(answers).length}
        onComplete={onComplete}
      />
    )
  }

  return (
    <div className="question-container">
      <h2>Question {index}</h2>
      {currentQuestion && (
        <Question
          question={currentQuestion}
          userAnswer={answers[currentQuestion._id]}
          onAnswer={handleAnswer}
          onSubmit={handleSubmit}
          onNext={handleNext}
          answerSubmitted={answerSubmitted}
          isLastQuestion={currentQuestion === null} // Show end button if no more questions
        />
      )}
    </div>
  )
}
