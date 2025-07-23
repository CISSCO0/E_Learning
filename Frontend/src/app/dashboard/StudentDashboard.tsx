import React, { useState, useEffect } from "react";
import axios from "axios";

type Course = {
  _id: string;
  title: string;
  grade: string; // Grade for the course
};

type Instructor = {
  _id: string;
  name: string;
};

type Certificate = {
  _id: string;
  title: string;
};

export default function StudentDashboard({ activeTab, userId }: { activeTab: string; userId: string }) {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [averageGrade, setAverageGrade] = useState<string>(""); // Average grade
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      try {
        // Fetch student data
        const studentResponse = await axios.get(
          `http://localhost:5000/students/user/${userId}`,
          { withCredentials: true }
        );
        const studentData = studentResponse.data;
        console.log('Student Data:', studentData);

        if (!studentData) {
          throw new Error("Student data not found.");
        }
        const formattedCertificates = studentData.certificates.map((cert: string, index: number) => ({
          _id: index.toString(),
          title: cert,
        }));
      
        setCertificates(formattedCertificates);

        
        // Fetch enrolled courses and their grades
        const fetchedCourses = await Promise.all(
          studentData.enrolled_courses.map(async (courseId: string) => {
            const courseResponse = await axios.get(
              `http://localhost:5000/courses/${courseId}`,
              { withCredentials: true }
            );
          //  alert(courseId)
            const gradeResponse = await axios.get(
              `http://localhost:5000/progress/${userId}/${courseId}/final-grade`,
              { withCredentials: true }
            );
            // alert("ok")
            return {
              _id: courseId,
              title: courseResponse.data.title,
              grade: gradeResponse.data.finalGrade,
            };
          })
        );
       
        setEnrolledCourses(fetchedCourses);

   // Map certificates
   

        // Calculate average grade
        const gradeToPoint = { A: 4, B: 3, C: 2, D: 1, F: 0 };
        const pointToGrade = ["F", "D", "C", "B", "A"];

        const totalPoints = fetchedCourses.reduce(
          (sum, course) => sum + gradeToPoint[course.grade],
          0
        );
        const averagePoints = fetchedCourses.length
          ? totalPoints / fetchedCourses.length
          : 0;
        setAverageGrade(pointToGrade[Math.round(averagePoints)]);

// alert(studentData.instructors)
        // Fetch instructors (check if the instructors array exists)
        // if (studentData.instructors && Array.isArray(studentData.instructors)) {
       

     
      } catch (error) {
        console.error("Error fetching student data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [userId]);

  return (
    <>
      {/* Enrolled Courses Tab */}
      <div className={`tab-content ${activeTab === "courses" ? "active" : ""}`}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "semibold", marginBottom: "1rem" }}>Enrolled Courses</h2>
        <div className="course-grid">
          {enrolledCourses.map((course) => (
            <div key={course._id} className="dashboard-card">
              <h3 className="card-title">{course.title}</h3>
              <p>Grade: {course.grade}</p>
              <div className="card-content">
                <a href={`/courses/${course._id}`} className="button">
                  View Course
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Tab */}
      <div className={`tab-content ${activeTab === "performance" ? "active" : ""}`}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "semibold", marginBottom: "1rem" }}>Performance</h2>
        <div className="dashboard-card">
          <h3 className="card-title">Your Progress</h3>
          <p>Overall performance across all courses</p>
          <div className="card-content"></div>
          {loading ? (
            <p>Loading performance...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : (
            <div className="card-content">
              <p style={{ fontSize: "1.875rem", fontWeight: "bold" }}>Average Grade: {averageGrade}</p>
              <p style={{ fontSize: "1.25rem" }}>Level: {averageGrade === "A" ? "Advanced" : "Intermediate"}</p>
            </div>
          )}
        </div>
      </div>

      {/* Instructors Tab */}
      <div className={`tab-content ${activeTab === "instructors" ? "active" : ""}`}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "semibold", marginBottom: "1rem" }}>Instructors</h2>
        <div className="course-grid">
          {instructors.map((instructor) => (
            <div key={instructor._id} className="dashboard-card">
              <h3 className="card-title">{instructor.name}</h3>
              <div className="card-content">
                <a href={`/profile/${instructor._id}`} className="button">
                  View Profile
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certificates Tab */}
      <div className={`tab-content ${activeTab === "certificates" ? "active" : ""}`}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "semibold", marginBottom: "1rem" }}>Certificates</h2>
        <div className="course-grid">
          {certificates.map((certificate) => (
            <div key={certificate._id} className="dashboard-card" style={{ cursor: "pointer" }}>
              <h3 className="card-title">{certificate.title}</h3>
              <div className="card-content">
                <button
                  className="button"
                  onClick={() =>
                    alert(`Congratulations on earning the ${certificate.title} certificate!`)
                  }
                >
                  View Certificate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
