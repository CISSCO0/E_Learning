'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Next.js routing hook
import axios from 'axios';
import './CourseList.css';

interface Course {
  _id: string; // ID from the MongoDB schema
  title: string;
  description: string;
  category: string;
  difficulty_level: string;
  created_by: string;
  created_at: string;
  instructor: string;
  rating: number;
  ratings: number[];
  keywords: string[];
  modules: string[]
}

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter(); // Initialize Next.js router

  useEffect(() => {
    // Fetch all courses
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/courses', { withCredentials: true });
        setCourses(response.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // // Fetch user's enrolled courses
    // const fetchEnrolledCourses = async () => {
    //   try {
    //     const userId = await axios.get('http://localhost:5000/auth', { withCredentials: true });
    //     const student = await axios.get(`http://localhost:5000/students/user/${userId}`, { withCredentials: true })
    //     setEnrolledCourses(student.data.enrolled_courses);
    //   } catch (err) {
    //     console.error('Error fetching enrolled courses:', err);
    //   }
    // };

    fetchCourses();
   // fetchEnrolledCourses();
  }, []);

  const handleEnroll = async (courseId: string) => {
    try {
     const userId = await axios.get("http://localhost:5000/auth",{withCredentials:true})
        await axios.post(
          'http://localhost:5000/progress/enroll',
          { course_id: courseId,
            user_id : userId.data,

           },
          { withCredentials: true }
        );
        setEnrolledCourses([...enrolledCourses, courseId]);
      }
    catch (err) {
      console.error('Error enrolling/un-enrolling:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  const handleRedirect = (courseId: string) => {
    router.push(`/courses/${courseId}`); // Redirect to the course details page
  };

  if (loading) return <div className="loading">Loading courses...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="course-list">
      {courses.map((course) => (
        <div
          key={course._id}
          className="course-card"
          onClick={() => handleRedirect(course._id)} // Redirect when the card is clicked
        >
          <div className="course-content">
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <p><strong>Instructor:</strong> {course.instructor}</p>
            <p><strong>Category:</strong> {course.category}</p>
            <p><strong>Difficulty:</strong> {course.difficulty_level}</p>
            <p><strong>Rating:</strong> {course.rating.toFixed(1)} ⭐</p>
            <div className="course-footer">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the card click event
                  handleEnroll(course._id);
                }}
                className={`enroll-button `}
              >
                {  'Enroll'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
