'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StudentPreferences from './StudentPreference';
import InstructorField from './InstructorField';
import axios from 'axios';
//import login from './login/login.server'; // Import the login function
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff, User, Mail, Lock, GraduationCap } from "lucide-react"
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
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [preferences, setPreferences] = useState<string[]>([])
  const [expertise, setExpertise] = useState("")
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

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));
    setShowAdditionalInfo(value !== '');
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {!isLogin && (
        <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="pl-10 h-12 border-gray-200 focus:border-red-500 focus:ring-red-500 transition-all duration-200"
              placeholder="Enter your full name"
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="pl-10 h-12 border-gray-200 focus:border-red-500 focus:ring-red-500 transition-all duration-200"
            placeholder="Enter your email"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete={isLogin ? "current-password" : "new-password"}
            required
            value={formData.password}
            onChange={handleInputChange}
            className="pl-10 pr-10 h-12 border-gray-200 focus:border-red-500 focus:ring-red-500 transition-all duration-200"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {!isLogin && (
        <div className="space-y-2 animate-in slide-in-from-top-2 duration-500">
          <Label htmlFor="role" className="text-sm font-medium text-gray-700">
            I am a...
          </Label>
          <Select onValueChange={handleRoleChange} required>
            <SelectTrigger className="h-12 border-gray-200 focus:border-red-500 focus:ring-red-500">
              <div className="flex items-center">
                <GraduationCap className="mr-2 h-4 w-4 text-gray-400" />
                <SelectValue placeholder="Select your role" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg">
              <SelectItem 
                value="student" 
                className="hover:bg-red-50 focus:bg-red-50 cursor-pointer py-2  focus:border-red-500"
              >
                Student
              </SelectItem>
              <SelectItem 
                value="instructor" 
                className="hover:bg-red-50 focus:bg-red-50 cursor-pointer py-2  focus:border-red-500"
              >
                Instructor
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {!isLogin && showAdditionalInfo && (
        <div className="animate-in slide-in-from-bottom-3 duration-500">
          {formData.role === "student" ? (
            <StudentPreferences onUpdate={handlePreferencesUpdate} />
          ) : (
            <InstructorField onUpdate={handleExpertiseUpdate} />
          )}
        </div>
      )}

      {error && (
        <Alert className="border-red-200 bg-red-50 animate-in slide-in-from-top-2 duration-300">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{isLogin ? "Signing in..." : "Creating account..."}</span>
          </div>
        ) : (
          <span>{isLogin ? "Sign in" : "Create account"}</span>
        )}
      </Button>
    </form>
  )
}
