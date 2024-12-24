'use client'

import { useState } from 'react'
import styles from './Profile.module.css'

interface RatingComponentProps {
  instructorId: string;
}

export default function RatingComponent({ instructorId }: RatingComponentProps) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)

  const handleRating = (value: number) => {
    setRating(value)
    // In a real app, you would send this rating to your backend
    console.log(`Rated instructor ${instructorId} with ${value} stars`)
  }

  return (
    <div className={styles.ratingComponent}>
      <h3 className={styles.subsectionTitle}>Rate this Instructor:</h3>
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${styles.star} ${star <= (hover || rating) ? styles.starFilled : styles.starEmpty}`}
            onClick={() => handleRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  )
}

