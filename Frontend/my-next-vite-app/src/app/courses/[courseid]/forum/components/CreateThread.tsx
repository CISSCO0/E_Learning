'use client';

import { useState } from 'react';
import axios from 'axios';
import '../forum.css'
export function CreateThread({ forumId }: { forumId: string }) {
  const [title, setTitle] = useState('');
  //const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!forumId) {
      setMessage('Forum ID is missing.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(`http://localhost:5000/threads/${forumId}`, {
        title,
        messages : []
      });
      alert(JSON.stringify(response))
      setMessage('Thread created successfully!');
      setTitle('');
      // setAuthor('');
    } catch (error) {
      console.error('Error creating thread:', error);
      setMessage('Failed to create thread. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-thread-form">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New thread title"
        required
        className="input-field"
      />
      
      <button type="submit" className="submit-button" disabled={loading}>
        {loading ? 'Creating...' : 'Create Thread'}
      </button>
      {message && <p className="form-message">{message}</p>}
    </form>
  );
}
