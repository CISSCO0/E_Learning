import styles from './Profile.module.css';
import { Course  } from './CourseType';

interface StudentProfileProps {
  enrolledCourses: Course[];
  performance: string;
}

export default function StudentProfile({ enrolledCourses, performance }: StudentProfileProps) {
  return (
    <div className={styles.profileSection}>
      <h2 className={styles.sectionTitle}>Student Information</h2>
      <div className={styles.courseList}>
        <h3 className={styles.subsectionTitle}>Enrolled Courses:</h3>
        <ul>
          {enrolledCourses.map((course) => (
            <li key={course._id} className={styles.courseItem}>
              {course.title} - Grade: {course.grade}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.performance}>
        <h3 className={styles.subsectionTitle}>Performance:</h3>
        {/* <div className={styles.performanceBar}> */}
          <div className={styles.courseItem}>{performance}</div>
        </div>
      </div>
   
  );
}
