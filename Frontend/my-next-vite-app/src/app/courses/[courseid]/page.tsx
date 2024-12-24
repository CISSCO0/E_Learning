"use client";

import './CoursePage.css';
import React, { useEffect, useState } from 'react';
import { Course } from '../courseInterface';
import { Module } from '../moduleInterface';
import { UpdateCourseDto } from '../updatecourseInterface';
import axios from 'axios';
import Link from 'next/link';
import router from 'next/navigation';
import { useRouter } from 'next/navigation';

interface Student{
    _id : string;
    name: string;
}

export default function CoursePage({ params }: { params: Promise<{ courseid: string }> }) {
  const router = useRouter()
  const [courseid, setCourseId] = useState<string | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [rating, setRating] = useState<number>(0);
const [userId, setUserId] = useState(''); 
  const [students, setStudents] = useState<Student[]>([]); // New state to store students
  const [isEditing, setIsEditing] = useState(false);
  const [updatedCourse, setUpdatedCourse] = useState<any>({
    title: '',
    description: '',
    category: '',
    difficulty_level: '',
    instructor: '',
    keywords: [],
  });


 // Unwrap `params`
 useEffect(() => {
  params.then((resolvedParams) => {
    setCourseId(resolvedParams.courseid);
  });
}, [params]);

 // Assuming you can retrieve the user ID

const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setRating(Number(e.target.value));
};

// const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   setUserId(e.target.value);
// };


const handleRatingSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

 // alert(userId)
  if (!courseid || !userId || rating < 0 || rating > 10) {
    alert('Please provide a valid rating between 0 and 10.');
    return;
  }
  try {
    
    await axios.put(
      `http://localhost:5000/courses/${courseid}/rating`,
      { rating, userid: userId },
      { withCredentials: true }
    );
    alert('Rating submitted successfully!');
    window.location.reload(); // Optionally reload to reflect updated rating
  } catch (error) {
  //  console.error('Error updating rating:', error);
    alert('Failed to submit rating.');
  }
};
 
  const [editedModule, setEditedModule] = useState<Module | null>(null);
  const [moduleEditData, setModuleEditData] = useState({
    module_id: '',
    title: '',
    content: '',
  });
  
 
  // Fetch data after courseid is set
  useEffect(() => {
    if (!courseid) return;

    // Fetch Course Data
    const fetchCourseData = async () => {
      try {
        const userid = await axios.get('http://localhost:5000/auth/',{withCredentials:true})
        setUserId(userid.data);
        const res = await axios.get(`http://localhost:5000/courses/public/${courseid}`, {
          withCredentials: true,
        });
        setCourse(res.data);
        setUpdatedCourse({
          title: res.data.title,
          description: res.data.description,
          category: res.data.category,
          difficulty_level: res.data.difficulty_level,
          instructor: res.data.instructor,
          keywords: res.data.keywords || [],
        });
      } catch (error) {
       // console.error('Error fetching course:', error);
      }
    };


    // Fetch Modules Data
    const fetchModulesData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/modules/course/${courseid}`, {
          withCredentials: true,
        });
        setModules(res.data);
      } catch (error) {
        //console.error('Error fetching modules:', error);
      }
    };

    // Fetch Students by Course
    const fetchStudentsData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/courses/students/${courseid}`, {
          withCredentials: true,
        });
        const studentIds = res.data; // Assuming the response contains an array of student IDs
//alert(JSON.stringify(studentIds))
    // Fetch user details for each student ID
    const studentsDetails = await Promise.all(
      studentIds.map(async (studentId) => {
        const userRes = await axios.get(`http://localhost:5000/users/${studentId.user_id}`, {
          withCredentials: true,
        });
        return userRes.data; // Assuming the user data is in the response body
      })
    );
   // alert(JSON.stringify(studentsDetails))
        setStudents(studentsDetails); // Set the students data
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchCourseData();
    fetchModulesData();
    fetchStudentsData(); // Call the new API to fetch students
  }, [courseid]);

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedCourse((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle updating keywords array
  const handleKeywordsChange = (index: number, value: string) => {
    setUpdatedCourse((prev: any) => {
      const updatedKeywords = [...prev.keywords];
      updatedKeywords[index] = value;
      return { ...prev, keywords: updatedKeywords };
    });
  };

  const handleAddKeyword = () => {
    setUpdatedCourse((prev: any) => ({
      ...prev,
      keywords: [...prev.keywords, ''],
    }));
  };

  const handleRemoveKeyword = (index: number) => {
    setUpdatedCourse((prev: any) => {
      const updatedKeywords = prev.keywords.filter((_: any, i: any) => i !== index);
      return { ...prev, keywords: updatedKeywords };
    });
  };

  

  // Submit update course form
  const handleUpdateSubmit = async () => {
    if (!courseid) return;
    try {
      await axios.put(`http://localhost:5000/courses/${courseid}`, updatedCourse, {
        withCredentials: true,
      });
      setIsEditing(false);
      window.location.reload();
    } catch (err) {
     // console.error('Error updating course:', err);
     alert('failed ');
    }
  };

  const handleDeleteCourse = async () => {
    if (!courseid) return;
    const confirmDelete = window.confirm('Are you sure you want to delete this course?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/courses/${courseid}`, {
        withCredentials: true,
      });
      alert('Course deleted successfully!');
      window.location.href = '/courses'; // Redirect to the courses list page
    } catch (err) {
     // console.error('Error deleting course:', err);
      alert('Failed to delete the course. Please try again.');
    }
  };
 
  const [moduleData, setModuleData] = useState({
    course_id: courseid, // Pass course_id from the props
    title: '',
    content: '',
    rating: 0,
    resources: [],
  });

  useEffect(() => {
    if (courseid) {
      setModuleData((prevData) => ({
        ...prevData,
        course_id: courseid,
      }));
    }
  }, [courseid]); // Only run when courseid is updated
  

  const handleInputChange2 = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setModuleData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/modules`, moduleData, {
        withCredentials: true,
      });
      alert('Module added successfully!');
      window.location.reload();

    } catch (error:any) {
     // console.error('Error adding module:', error.message);
      alert(error.message);
    }
  };
  const handleEditModule = (module: Module) => {
    setEditedModule(module);
    setModuleEditData({
      module_id: module._id,
      title: module.title,
      content: module.content,
    });
  };
  const handleModuleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setModuleEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleUpdateModule = async () => {
    try {
      await axios.put(`http://localhost:5000/modules`, moduleEditData, {
        withCredentials: true,
      });
      alert('Module updated successfully!');
      setEditedModule(null);
      window.location.reload(); // Refresh the data
    } catch (error) {
     // console.error('Error updating module:', error);
      alert('Failed to update module. Please try again.');
    }
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadLink, setDownloadLink] = useState(null);

 
  const navigateToChats = () => {
    router.push(`/courses/${courseid}/chats`);
  };
  if (!course) return <div>Loading...</div>;

  return (
    <div className="course-container">
      <h1 className="course-title">{course.title}</h1>
      <p className="course-description">{course.description}</p>
      <div className="course-info">
        <p className="course-instructor">Instructor: {course.instructor}</p>
        <p className= "course-instructor"> Rate : {course.rating}</p>
      </div>
      <div className="rating-form">
  <h3>Rate This Course</h3>
  <form onSubmit={handleRatingSubmit}>
    <div className="form-group">
      <label htmlFor="rating">Rating (0-10):</label>
      <input
        type="number"
        id="rating"
        name="rating"
        value={rating}
        min="0"
        max="10"
        onChange={handleRatingChange}
      />
    </div>
    <div className="form-group">
      {/* <label htmlFor="userid">User ID:</label> */}
      {/* <input
        type="text"
        id="userid"
        name="userid"
        value={userId}
        onChange={handleUserIdChange}
      /> */}
    </div>
    <button type="submit">Submit Rating</button>
  </form>
</div>

      {isEditing ? (
        <div className="course-edit-form">
          <h2 className="module-content-title">Edit Course Details</h2>
          <form className="form" onSubmit={(e) => { e.preventDefault(); handleUpdateSubmit(); }}>
            <div className="form-group">
              <label className="label" htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                className="input"
                value={updatedCourse.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                className="textarea"
                value={updatedCourse.description}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div className="form-group">
              <label className="label" htmlFor="instructor">Instructor</label>
              <input
                type="text"
                id="instructor"
                name="instructor"
                className="input"
                value={updatedCourse.instructor}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="keywords">Keywords</label>
              {updatedCourse.keywords.map((keyword: any, index: any) => (
                <div key={index} className="keyword-item">
                  <input
                    type="text"
                    className="input"
                    value={keyword}
                    onChange={(e) => handleKeywordsChange(index, e.target.value)}
                  />
                  <button type="button" className="remove-button" onClick={() => handleRemoveKeyword(index)}>
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" className="add-button" onClick={handleAddKeyword}>
                Add Keyword
              </button>
            </div>
            <button type="submit" className="submit-button">Update Course</button>
          </form>
        </div>
      ) : (
        <button className="edit-button" onClick={() => setIsEditing(true)}>Edit Course</button>
      )}

      <h2 className="module-content-title">Modules</h2>
      <ul className="course-content-list">
      {modules.map((module) => (
  <li key={module._id} className="module-item">
    <Link href={`/courses/modules/${module._id}`} passHref>
      <div className="module-header">
        <h3 className="module-title">{module.title}</h3>
        <p className="module-content">{module.content}</p>
      </div>
    </Link>
    <button onClick={() => handleEditModule(module)}>Edit</button>
  </li>
))}

      </ul>

      <h2 className="module-content-title">Students Enrolled</h2>
      <ul>
        {students.map((student) => (
          <li key={student._id}>{student.name}</li> // You can display other student details here
        ))}
      </ul>
      <button className="sort-button" onClick={() => navigateToChats()}>
        Chats
      </button>
      <button className="delete-button" onClick={handleDeleteCourse}>
        Delete Course
      </button>

      <p className="error-message"></p>

      <div className="add-module-form">
      <h2>Add a New Module</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Module Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={moduleData.title}
            onChange={handleInputChange2}
          />
        </div>
        <div>
          <label htmlFor="content">Module Content</label>
          <textarea
            id="content"
            name="content"
            value={moduleData.content}
            onChange={handleInputChange2}
          ></textarea>
        </div>
        <button type="submit">Add Module</button>
      </form>
    </div>
    {editedModule && (
  <div className="edit-module-form">
    <h3>Edit Module</h3>
    <form onSubmit={(e) => { e.preventDefault(); handleUpdateModule(); }}>
      <div>
        <label htmlFor="edit-title">Title</label>
        <input
          type="text"
          id="edit-title"
          name="title"
          value={moduleEditData.title}
          onChange={handleModuleEditChange}
        />
      </div>
      <div>
        <label htmlFor="edit-content">Content</label>
        <textarea
          id="edit-content"
          name="content"
          value={moduleEditData.content}
          onChange={handleModuleEditChange}
        ></textarea>

      </div>

      <button type="submit">Update</button>
      <button type="button" onClick={() => setEditedModule(null)}>Cancel</button>
    
     
    </form>
   
  </div>
)}

    </div>
    
  );
}