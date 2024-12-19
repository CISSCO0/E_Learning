
import './CoursePage.css';

import { Course } from '../courseInterface';

async function fetchCourseData(courseid: string) {
  const res = await fetch(`http://localhost:3000/courses/public/${courseid}`);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('API Error:', errorText);
    throw new Error(`Failed to fetch course: ${res.status} ${res.statusText}`);
  }

  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('API did not return JSON');
  }

  return await res.json();
}

export default async function CoursePage({ params }: { params: { courseid: string } }) {
  const { courseid } = params;

  let course: Course ;

  try {
    course = await fetchCourseData(courseid);
  } catch (err) {
    console.error(err);
    return <div className="text-red-500">Error loading course. Please try again later.</div>;
  }

  return (
    <div className="course-container">
      <h1 className="course-title">{course.title}</h1>
      <p className="course-description">{course.description}</p>
      <div className="course-info">
        <p className="course-instructor">Instructor: {course.instructor}</p>
        <p className="course-rating">Rating: {course.rating}/10</p>
      </div>
      <h2 className="course-content-title">Course Content</h2>
      <ul className="course-content-list">
        {/* {course.content &&
          course.content.map((item, index) => (
            <li key={index} className="course-content-item">{item}</li>
          ))} */}
      </ul>
    </div>
  );
}
