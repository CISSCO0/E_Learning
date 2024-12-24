import { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css';
type User = {
    name: string;
  };
  
  type Student = {
    _id: string;
    user_id: string;
    user: User;
  };
  
  type Course = {
    _id: string;
    title: string;
  };
export default function InstructorDashboard({ activeTab, userId,name }: { activeTab: string; userId: string ,name:string}) {
    const [instructor, setInstructor] = useState<{ _id: string; rating: number } | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [studentsByCourse, setStudentsByCourse] = useState<Record<string, Student[]>>({});
    const [newCourse, setNewCourse] = useState({
        title: '',
        description: '',
        category: '',
        difficulty_level: '',
        created_by: '', // Assuming `userId` is the ID of the logged-in instructor
        instructor: name, // This will be set dynamically after fetching instructor data
        rating: 0, // Default rating
      });
  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        // Fetch instructor details
        const instructorResponse = await axios.get(`http://localhost:5000/instructors/user/${userId}`, {
          withCredentials: true,
        });
        const instructorData = instructorResponse.data;
        setInstructor(instructorData);
//alert(JSON.stringify(instructor))
        // Fetch courses by instructor ID
        const coursesResponse = await axios.get(
          `http://localhost:5000/courses/instructor/${instructorData._id}`,{
            withCredentials: true,
          }
        );
        const coursesData = coursesResponse.data;
        setCourses(coursesData);

        // Fetch students for each course
        const studentsByCourseTemp = {};
        await Promise.all(
          coursesData.map(async (course) => {
            const studentIdsResponse = await axios.get(
              `http://localhost:5000/courses/students/${course._id}`,{
                withCredentials: true,
              }
            );
            const studentIds = studentIdsResponse.data;
//alert(JSON.stringify(studentIds))
            // Fetch user information for each student ID
            const studentDetails = await Promise.all(
              studentIds.map(async (studentId) => {
                const studentResponse = await axios.get(`http://localhost:5000/students/${studentId._id}`, {
                  withCredentials: true,
                });
                const student = studentResponse.data;
              //  alert(JSON.stringify(student))
                // Fetch user details using student.user_id
                const userResponse = await axios.get(`http://localhost:5000/users/${student.user_id}`, {
                  withCredentials: true,
                });
           //     alert(JSON.stringify(userResponse.data))
                return { ...student, user: userResponse.data };
              })
            );

            studentsByCourseTemp[course._id] = studentDetails;
          })
        );

        setStudentsByCourse(studentsByCourseTemp);
      } catch (error) {
        console.error('Error fetching instructor data:', error);
      }
    };

    fetchInstructorData();
  }, [userId]);
//   useEffect(() => {
//     if (instructor) {
//       alert(instructor.rating); // Trigger alert when instructor is updated
//     }
//   }, [instructor]);
  const handleChange = (e) => {
    const { id, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [id]: value }));
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!instructor) {
      console.error('Instructor data not loaded yet.');
      return;
    }
  
    try {
      // Send the data matching the DTO structure
      const response = await axios.post('http://localhost:5000/courses', {
        ...newCourse,
        created_by: instructor._id, // Ensure `created_by` is set correctly
        instructor: name, // Link the course to the instructor
      },{
        withCredentials: true,
      });
  
      // Update the state to include the newly created course
      setCourses((prevCourses) => [...prevCourses, response.data]);
  
      // Reset the form
      setNewCourse({
        title: '',
        description: '',
        category: '',
        difficulty_level: '',
        created_by: userId,
        instructor: instructor._id,
        rating: 0,
      });
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };
  if (!instructor) return <div>Loading...</div>;

  return (
    <>
      <div className={`tab-content ${activeTab === 'courses' ? 'active' : ''}`}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'semibold', marginBottom: '1rem' }}>Your Courses</h2>
        <div className="course-grid">
          {courses.map((course) => (
            <div key={course._id} className="dashboard-card">
              <h3 className="card-title">{course.title}</h3>
              <div className="card-content">
                <p>
                  Students Enrolled:{' '}
                  {studentsByCourse[course._id]
                    ? studentsByCourse[course._id].map((student) => student.user.name).join(', ')
                    : 'Loading...'}
                </p>
                <a href={`/courses/${course._id}`} className="button">View Course</a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={`tab-content ${activeTab === 'reviews' ? 'active' : ''}`}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'semibold', marginBottom: '1rem' }}>Your Reviews</h2>
        <div className="dashboard-card">
          <h3 className="card-title">Overall Rating</h3>
          <div className="card-content">
            <p style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>{instructor.rating } / 5.0</p>
            <p>Based on {courses.length * 10 || 0} reviews</p>
          </div>
        </div>
      </div>
      <div className={`tab-content ${activeTab === 'students' ? 'active' : ''}`}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'semibold', marginBottom: '1rem' }}>Your Students</h2>
        <div className="course-grid">
          {Object.entries(studentsByCourse).map(([courseId, students]) => (
            <div key={courseId} className="dashboard-card">
              <h3 className="card-title">Course: {courses.find((course) => course._id === courseId)?.title}</h3>
              <div className="card-content">
                {students.map((student) => (
                  <p key={student._id}>{student.user.name}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={`tab-content ${activeTab === 'create-course' ? 'active' : ''}`}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'semibold', marginBottom: '1rem' }}>Create New Course</h2>
        <div className="dashboard-card">
          <h3 className="card-title">Course Details</h3>
          <p>Fill in the details for your new course</p>
          <div className="card-content">
            <form className="form-group" onSubmit={handleCreateCourse}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input id="title" type="text" value={newCourse.title} onChange={handleChange} placeholder="Enter course title" />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <input id="category" type="text" value={newCourse.category} onChange={handleChange} placeholder="Enter course category" />
              </div>
              <div className="form-group">
                <label htmlFor="difficulty_level">Difficulty Level</label>
                <select
                id="difficulty_level"
                value={newCourse.difficulty_level}
                onChange={handleChange}
                >
                  <option value="">Select difficulty level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea id="description" value={newCourse.description} onChange={handleChange} placeholder="Enter course description"></textarea>
              </div>
              <button type="submit" className="button">Create Course</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
