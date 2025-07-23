'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import StudentProfile from './StudentProfile';
import InstructorProfile from './InstructorProfile';
import styles from './Profile.module.css';
import axios from 'axios';
import { Course  } from './CourseType';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor';
  profilePicture: string;
  enrolledCourses?: Course[];
  performance?: string; // Grade as A, B, C, D, F
  createdCourses?: Course[];
  ratings?: number;
}

export default function ProfilePage({ params }: { params: Promise<{ userid: string }> }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userid, setUserId] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const resolvedParams = await params;
      setUserId(resolvedParams.userid);
    };

    fetchUserId();
  }, [params]);

  useEffect(() => {
    if (!userid) return;

    async function fetchUserData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch base user data
        const userResponse = await axios.get(`http://localhost:5000/users/${userid}`, { withCredentials: true });
        const userData = userResponse.data;

        // Map base user data
        const mappedUser: User = {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          role: userData.role === "2" ? 'instructor' : 'student',
          profilePicture: userData.profilePicture || '/placeholder.svg?height=200&width=200',
        };

        // Fetch additional data based on role
        if (mappedUser.role === 'student') {
          const studentResponse = await axios.get(`http://localhost:5000/students/user/${userid}`, { withCredentials: true });
          const studentData = studentResponse.data;

          const fetchedCourses = await Promise.all(
            studentData.enrolled_courses.map(async (courseId: string) => {
              const courseResponse = await axios.get(
                `http://localhost:5000/courses/${courseId}`,
                { withCredentials: true }
              );
              const gradeResponse = await axios.get(
                `http://localhost:5000/progress/${userid}/${courseId}/final-grade`,
                { withCredentials: true }
              );
              return {
                _id: courseId,
                title: courseResponse.data.title,
                grade: gradeResponse.data.finalGrade,
              };
            })
          );

          // Calculate average grade
          const gradeToPoint = { A: 4, B: 3, C: 2, D: 1, F: 0 };
          const pointToGrade = ["F", "D", "C", "B", "A"];
          const totalPoints = fetchedCourses.reduce(
            (sum, course) => sum + (gradeToPoint[course.grade] || 0),
            0
          );
          const averagePoints = fetchedCourses.length
            ? totalPoints / fetchedCourses.length
            : 0;
          const performanceGrade = pointToGrade[Math.round(averagePoints)];

          mappedUser.enrolledCourses = fetchedCourses;
          mappedUser.performance = performanceGrade;
        } else if (mappedUser.role === 'instructor') {
            const instructorResponse = await axios.get(
              `http://localhost:5000/instructors/user/${userid}`,
              { withCredentials: true }
            );
            const instructorData = instructorResponse.data;
          
            const coursesResponse = await axios.get(
              `http://localhost:5000/courses/instructor/${instructorData._id}`,
              { withCredentials: true }
            );
           // alert(JSON.stringify(coursesResponse.data))
            const coursesData: Course[] = coursesResponse.data.map((course: any) => ({
                _id: course._id,
                title: course.title,
              }));
          
            mappedUser.createdCourses = coursesData; // Pass full Course objects
            mappedUser.ratings = instructorData.rating || 0;
          }
          

        setUser(mappedUser);
      } catch (err: any) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [userid]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!user) return <div>No user data available.</div>;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <Image
          src={user.profilePicture}
          alt={`${user.name}'s profile picture`}
          width={200}
          height={200}
          className={styles.profilePicture}
        />
        <div className={styles.userInfo}>
          <h1 className={styles.userName}>{user.name}</h1>
          <p className={styles.userEmail}>{user.email}</p>
          <p className={styles.userRole}>{user.role}</p>
        </div>
      </div>
      {user.role === 'student' ? (
        <StudentProfile
          enrolledCourses={user.enrolledCourses || []}
          performance={user.performance || "F"}
        />
      ) : (
        <InstructorProfile
          createdCourses={user.createdCourses || []}
          ratings={user.ratings || 0}
        
        />
      )}
    </div>
  );
}
