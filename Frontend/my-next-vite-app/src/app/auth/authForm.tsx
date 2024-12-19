'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StudentPreferences from './StudentPreference';
import InstructorExpertise from './InstructorField';
import axios from 'axios';
//import login from './login/login.server'; // Import the login function

interface AuthFormProps {
  isLogin: boolean;
}

interface Payload {
  name: string;
  email: string;
  hash_pass: string;
  role: string;
  course_pref?: string[]; // For student role
  field?: string;         // For instructor role
  rating?: number;        // For instructor role
}

export default function AuthForm({ isLogin }: AuthFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: '',
    studentPreferences: [] as string[],
    instructorExpertise: '',
  });
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePreferencesUpdate = (preferences: string[]) => {
    setFormData((prev) => ({ ...prev, studentPreferences: preferences }));
  };

  const handleExpertiseUpdate = (expertise: string) => {
    setFormData((prev) => ({ ...prev, instructorExpertise: expertise }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value;
    setFormData((prev) => ({ ...prev, role }));
    setShowAdditionalInfo(role !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
  
    try {
      const normalizedRole = formData.role === 'student' ? '3' : '2';
      const payload: Payload = {
        name: formData.name,
        email: formData.email,
        hash_pass: formData.password,
        role: normalizedRole,
      };
  
      if (!isLogin) {
        if (normalizedRole === '3') {
          payload.course_pref = formData.studentPreferences;
        } else if (normalizedRole === '2') {
          payload.field = formData.instructorExpertise;
          payload.rating = 0; // Default rating
        }
      }
  
      if (isLogin) {
        const res = await fetch('http://localhost:5000/auth/login', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            hash_pass: formData.password,
          }),
        });
  
        const data = await res.json();
  
        if (!res.ok) {
          throw new Error(data.message || 'Invalid credentials');
        }
  
        alert('Login successful!');

        // alert(JSON.stringify(data));
        // const response2 = await fetch('http://localhost:5000/auth/check-token', {
        //   method: 'GET',
        //   credentials: 'include', // Ensures cookies are sent with the request
        // });
        // const data2 = await response2.json();
        // alert("cookie "+JSON.stringify(data2));

       // router.push('/dashboard');(wait)

    //    try{ (protected route test)
    //    const response3 = await fetch('http://localhost:5000/question-banks/6762b79c5c9c5e6893abfc43', {
    //     method: 'DELETE',
    //     credentials: 'include', // Important to send cookies with the request
    //   });
    //   const data3 = await response3.json();
    //     alert("test "+JSON.stringify(data3));
    // }
    // catch(err){
    //   alert(err);
    // }
      } else {
        const res = await axios.post('http://localhost:5000/auth/register', payload, {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        });
  
        if (res.status === 201) {
          alert('Registration successful!');
          router.push('/auth/login');
        } else {
          throw new Error(res.data.message || 'Registration failed.');
        }
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Axios error:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'An error occurred. Please try again.');
      } else {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred. Please contact support.');
      }
    }
  };
  

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {!isLogin && (
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <div className="mt-1">
            <input
              id="name"
              name="name"
              type="text"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {!isLogin && (
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            id="role"
            name="role"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={formData.role}
            onChange={handleRoleChange}
            required
          >
            <option value="">Select a role</option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
        </div>
      )}

      {!isLogin && showAdditionalInfo && (
        <div>
          {formData.role === 'student' ? (
            <StudentPreferences onUpdate={handlePreferencesUpdate} />
          ) : (
            <InstructorExpertise onUpdate={handleExpertiseUpdate} />
          )}
        </div>
      )}

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isLogin ? 'Sign in' : 'Sign up'}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
}
