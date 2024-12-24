import { Course } from './CourseType';

interface InstructorProfileProps {
  createdCourses: Course[];
  ratings: number;
 
}

export default function InstructorProfile({
  createdCourses,
  ratings,
 
}: InstructorProfileProps) {
  return (
    <div>
      <h2>Instructor's Courses</h2>
      <ul>
        {createdCourses.map((course) => (
          <li key={course._id}>{course.title}</li>
        ))}
      </ul>
      <p>Ratings: {ratings}</p>
    </div>
  );
}
