import '../../../../public/quizzes.css'
interface ResultProps {
    score: number
    total: number
    onComplete: () => void
  }
  
  export default function Result({ score, total, onComplete }: ResultProps) {
    const percentage = (score / total) * 100
  
    const handleComplete = () => {
      if (percentage < 50) {
        console.log('Score is below 50%. In a real app, we would delete the response here.')
        // In a real app, you would call an API to delete the response here
      }
      onComplete()
    }
  
    return (
      <div className="result-container">
        <h2>Quiz Complete</h2>
        <p className="result-score">
          Your score: {score} out of {total} ({percentage.toFixed(2)}%)
        </p>
        <p className={`result-feedback ${percentage < 50 ? 'fail' : 'pass'}`}>
          {percentage < 50
            ? 'Your score is below 50%. We recommend trying again.'
            : 'Great job!'}
        </p>
        <button
          onClick={handleComplete}
          className="btn"
        >
          Back to Quizzes
        </button>
      </div>
    )
  }
  
  