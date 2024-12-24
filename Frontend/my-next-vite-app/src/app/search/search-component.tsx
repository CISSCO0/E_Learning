'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';

// Define types
interface Course {
  _id: string;
  title: string;
  description: string;
}

interface User {
  _id: string;
  name: string;
  role: string;
}

export interface SearchResult {
  id: string;
  type: 'course' | 'user';
  title: string;
  description: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams(); // Hook to access query parameters
  const query = searchParams.get('query'); // Get the "query" parameter from the URL
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Hook for navigation

  useEffect(() => {
    if (query) {
      fetchResults(query);
    }
  }, [query]);

  const fetchResults = async (searchQuery: string) => {
    setLoading(true);

    try {
      // Call your APIs to fetch courses and users based on the query
      const [coursesResponse, usersResponse] = await Promise.all([
        axios.get('http://localhost:5000/courses/searchpublic', {
          params: { keywords: searchQuery },
          withCredentials: true,
        }),
        axios.get('http://localhost:5000/users/search', {
          params: { name: searchQuery },
          withCredentials: true,
        }),
      ]);

      // Combine and format results
      const courses = coursesResponse.data.map((course: Course) => ({
        id: course._id,
        type: 'course',
        title: course.title,
        description: course.description,
      }));

      const users = usersResponse.data.map((user: User) => ({
        id: user._id,
        type: 'user',
        title: user.name,
        description: `${user.role === '2' ? 'Instructor' : 'Student'}`,
      }));

      setResults([...courses, ...users]);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'course') {
      router.push(`/courses/${result.id}`);
    } else if (result.type === 'user') {
      router.push(`/profile/${result.id}`);
    }
  };
  return (
    <div className="search-page">
      <h1>Search Results</h1>
      {loading ? (
        <p>Loading...</p>
      ) : results.length > 0 ? (
        <div className="search-results">
          {results.map((result) => (
            <div key={result.id} className="search-result-item" onClick={() => handleResultClick(result)} >
              <h3>{result.title}</h3>
              <p>{result.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No results found for &quot;{query}&quot;.</p>
      )}
    </div>
  );
}
