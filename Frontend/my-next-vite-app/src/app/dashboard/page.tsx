'use client';

import { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure to install axios using `npm install axios`
import StudentDashboard from './StudentDashboard';
import InstructorDashboard from './InstructorDashboard';
import AdminDashboard from './AdminDashboard';
import UserInfo from './UserInfo';
import './dashboard.css';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("info");

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const id = await axios.get('http://localhost:5000/auth',{withCredentials: true})
       // alert(id.data)
        const response = await axios.get(`http://localhost:5000/users/${id.data}`,{withCredentials: true}); // Replace with your actual API endpoint
      // alert(JSON.stringify(response.data))
        const fetchedUser = response.data;

        // Map numeric roles to role strings
        const roleMap = {
          "1": "admin",
          "2": "instructor",
          "3": "student",
        };
        const mappedUser = {
          ...fetchedUser,
          role: roleMap[fetchedUser.role],
        };
        setUser(mappedUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Show a loading indicator until user data is loaded
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>Dashboard</h1>
      <UserInfo user={user} />
      <div className="tabs">
        <div className={`tab ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>Info</div>
        {user.role === "student" && (
          <>
            <div className={`tab ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => setActiveTab('courses')}>Enrolled Courses</div>
            <div className={`tab ${activeTab === 'instructors' ? 'active' : ''}`} onClick={() => setActiveTab('instructors')}>Instructors</div>
            <div className={`tab ${activeTab === 'performance' ? 'active' : ''}`} onClick={() => setActiveTab('performance')}>Performance</div>
            <div className={`tab ${activeTab === 'certificates' ? 'active' : ''}`} onClick={() => setActiveTab('certificates')}>Certificates</div>
          </>
        )}
        {user.role === "instructor" && (
          <>
            <div className={`tab ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => setActiveTab('courses')}>Courses</div>
            <div className={`tab ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews</div>
            <div className={`tab ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}>Students</div>
            <div className={`tab ${activeTab === 'create-course' ? 'active' : ''}`} onClick={() => setActiveTab('create-course')}>Create Course</div>
          </>
        )}
        {user.role === "admin" && (
          <>
            <div className={`tab ${activeTab === 'manage-accounts' ? 'active' : ''}`} onClick={() => setActiveTab('manage-accounts')}>Manage Accounts</div>
            <div className={`tab ${activeTab === 'create-backup' ? 'active' : ''}`} onClick={() => setActiveTab('create-backup')}>Create Backup</div>
            <div className={`tab ${activeTab === 'announce' ? 'active' : ''}`} onClick={() => setActiveTab('announce')}>Announce</div>
          </>
        )}
      </div>
      <div className={`tab-content ${activeTab === 'info' ? 'active' : ''}`}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'semibold', marginBottom: '1rem' }}>User Information</h2>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
      </div>
      {user.role === "student" && <StudentDashboard  userId={user._id} activeTab={activeTab} />}
      {user.role === "instructor" && <InstructorDashboard name = {user.name} userId={user._id} activeTab={activeTab} />}
      {user.role === "admin" && <AdminDashboard userId={user._id} activeTab={activeTab} />}
    </div>
  );
}
