'use client';

import { useState } from 'react';
import axios from 'axios';
import '../forum.css';

export function CreateMessage({ threadid }: { threadid: string }) {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState(''); // This will hold the user's name
  const [loading, setLoading] = useState(false); // Track loading state to disable button while posting
console.log(author)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload on form submit

    // Prepare the data to send in the API request
    const messageData = {
      content,
      threadId: threadid,
      date: new Date(),
    };

    try {
      setLoading(true); // Set loading state

      // Make the API call to create the message
      const response = await axios.post('http://localhost:5000/thread-messages', messageData, {
        withCredentials: true,
      });

      const userId = response.data.senderId;

      // Fetch the user data based on the userId to get the name
      const userResponse = await axios.get(`http://localhost:5000/users/${userId}`, {
        withCredentials: true,
      });

      const userName = userResponse.data.name;

      // Now set the author to the user's name
      setAuthor(userName);

      // Reset content field after successful submission
      setContent('');
    } catch (error) {
      console.error('Error posting message:', error);
    } finally {
      setLoading(false); // Reset loading state after the request completes
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-message-form">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your message..."
        required
        className="textarea-field"
      ></textarea>
      <button type="submit" className="submit-button" disabled={loading}>
        {loading ? 'Posting...' : 'Post Message'}
      </button>
    </form>
  );
}
