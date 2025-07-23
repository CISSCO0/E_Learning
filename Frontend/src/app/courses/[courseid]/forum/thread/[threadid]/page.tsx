'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../forum.css';
import { CreateMessage } from '../../components/CreateMessage';

interface Message {
  content: string;
  senderId: string; // Include senderId to fetch the author's name
  author?: string; // This will be dynamically set based on the senderId
}

interface Thread {
  _id: string;
  title: string;
  author: string;
  messages: string[]; // Array of message IDs (for now)
}

export default function ThreadPage() {
  const { threadid } = useParams(); // Get threadId from the URL
  const [thread, setThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]); // Store fetched messages
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const response = await axios.get<Thread>(
          `http://localhost:5000/threads/${threadid}`,
          { withCredentials: true }
        );
        setThread(response.data);

        // Fetch messages by their IDs
        const messagePromises = response.data.messages.map((messageId) =>
          axios.get<Message>(`http://localhost:5000/thread-messages/${messageId}`, {
            withCredentials: true,
          })
        );

        // Wait for all message API calls to complete
        const messageResponses = await Promise.all(messagePromises);

        // Extract message data from the responses
        const messagesWithAuthors = await Promise.all(
          messageResponses.map(async (res) => {
            const message = res.data;
            // Fetch user data to get the author's name
            const userResponse = await axios.get(
              `http://localhost:5000/users/${message.senderId}`,
              {
                withCredentials: true,
              }
            );
            // Set the author's name
            message.author = userResponse.data.name;
            return message;
          })
        );

        // Set messages with authors' names
        setMessages(messagesWithAuthors);
      } catch (error) {
        console.error('Error fetching thread and messages:', error);
      } finally {
        setLoading(false);
      }
    };

    if (threadid) {
      fetchThread();
    }
  }, [threadid]);

  if (loading) {
    return <div>Loading thread...</div>;
  }

  if (!thread) {
    return <div>Thread not found</div>;
  }

  return (
    <div className="container">
      <h1 className="page-title">{thread.title}</h1>
      <div className="message-list">
        {messages.map((message, index) => (
          <div key={index} className="message-item">
            <p className="message-content">{message.content}</p>
            {/* Display the author's name here */}
            <p className="message-author">Posted by: {message.author}</p>
          </div>
        ))}
      </div>
      <CreateMessage threadid={thread._id} />
    </div>
  );
}
