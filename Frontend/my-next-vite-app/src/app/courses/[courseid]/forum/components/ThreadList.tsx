'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import '../forum.css';

interface Thread {
  _id: string;
  title: string;
}

export function ThreadList({ courseId }: { courseId: string }) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThreadDetails = async (threadIds: string[]) => {
      try {
        // Fetch details for each thread ID
        const threadPromises = threadIds.map((id) =>
          axios.get<Thread>(`http://localhost:5000/threads/${id}`, {
            withCredentials: true,
          })
        );

        const threadResponses = await Promise.all(threadPromises);
        const threadDetails = threadResponses.map((res) => res.data);
        setThreads(threadDetails);
      } catch (error) {
        console.error('Error fetching thread details:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchThreads = async () => {
      try {
        // Fetch the forum containing thread IDs for the course
        const response = await axios.get<{ threads: string[] }>(
          `http://localhost:5000/forums/course/${courseId}`,
          {
            withCredentials: true,
          }
        );

        const threadIds = response.data.threads; // Access threads array
        if (threadIds.length > 0) {
          await fetchThreadDetails(threadIds);
        } else {
          setThreads([]);
        }
      } catch (error) {
        console.error('Error fetching threads:', error);
        setThreads([]);
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, [courseId]);

  if (loading) {
    return <p>Loading threads...</p>;
  }

  if (threads.length === 0) {
    return <p>No threads found for this course.</p>;
  }

  return (
    <div className="thread-list">
      {threads.map((thread) => (
        <div key={thread._id} className="thread-item">
          <div>
            <Link href={`http://localhost:3000/courses/${courseId}/forum/thread/${thread._id}`} className="thread-title">
              {thread.title}
            </Link>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Implement the deleteThread action logic here
            }}
          >
            <input type="hidden" name="threadId" value={thread._id} />
            <button type="submit" className="delete-button">Delete</button>
          </form>
        </div>
      ))}
    </div>
  );
}
