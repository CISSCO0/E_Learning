'use client'

import { useState, useEffect } from 'react'
import '../../../../public/quizzes.css'

interface QuestionProps {
  question: {
    _id: string
    content: string
    type: 'mcq' | 'true-false'
    possibleAnswers?: string[]
    correctAnswer?: string
  }
  userAnswer: string
  onAnswer: (answer: string) => void
  onSubmit: () => void
  onNext: () => void
  answerSubmitted: boolean
  isLastQuestion: boolean
}

export default function Question({
  question,
  userAnswer,
  onAnswer,
  onSubmit,
  onNext,
  answerSubmitted,
  isLastQuestion
}: QuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState('')

  useEffect(() => {
    setSelectedAnswer(userAnswer || '')
  }, [userAnswer])

  const handleAnswerChange = (answer: string) => {
    setSelectedAnswer(answer)
    onAnswer(answer)
  }

  const isCorrect = selectedAnswer === question.correctAnswer

  return (
    <div>
      <p className="question-content">{question.content}</p>
      <div className="answer-options">
        {question.type === 'mcq' && question.possibleAnswers ? (
          question.possibleAnswers.map((answer, index) => (
            <label
              key={index}
              className={`answer-option ${
                answerSubmitted
                  ? answer === question.correctAnswer
                    ? 'correct'
                    : answer === selectedAnswer
                    ? 'incorrect'
                    : ''
                  : ''
              }`}
            >
              <input
                type="radio"
                name="answer"
                value={answer}
                checked={selectedAnswer === answer}
                onChange={() => handleAnswerChange(answer)}
                disabled={answerSubmitted}
              />
              <span>{answer}</span>
            </label>
          ))
        ) : (
          <>
            <label
              className={`answer-option ${
                answerSubmitted
                  ? 'true' === question.correctAnswer
                    ? 'correct'
                    : 'true' === selectedAnswer
                    ? 'incorrect'
                    : ''
                  : ''
              }`}
            >
              <input
                type="radio"
                name="answer"
                value="true"
                checked={selectedAnswer === 'true'}
                onChange={() => handleAnswerChange('true')}
                disabled={answerSubmitted}
              />
              <span>True</span>
            </label>
            <label
              className={`answer-option ${
                answerSubmitted
                  ? 'false' === question.correctAnswer
                    ? 'correct'
                    : 'false' === selectedAnswer
                    ? 'incorrect'
                    : ''
                  : ''
              }`}
            >
              <input
                type="radio"
                name="answer"
                value="false"
                checked={selectedAnswer === 'false'}
                onChange={() => handleAnswerChange('false')}
                disabled={answerSubmitted}
              />
              <span>False</span>
            </label>
          </>
        )}
      </div>
      {answerSubmitted && (
        <div className={`answer-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
          <p>{isCorrect ? 'Correct!' : 'Incorrect'}</p>
          <p>The correct answer is: {question.correctAnswer}</p>
        </div>
      )}
      {!answerSubmitted ? (
        <button
          onClick={onSubmit}
          disabled={!selectedAnswer}
          className="btn btn-submit"
        >
          Submit
        </button>
      ) : (
        <button
          onClick={onNext}
          className="btn btn-next"
        >
          {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
        </button>
      )}
    </div>
  )
}
