'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './CreateChat.module.css';

export default function CreateChat() {
  const [title, setTitle] = useState('');
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const courseId = pathname.split('/')[2]; // Extract course ID from the URL

  useEffect(() => {
    if (!courseId) return;

    const fetchUsers = async () => {
      try {
        // Fetch user IDs
        const response = await axios.get(`http://localhost:5000/courses/chats/${courseId}`,{withCredentials:true});
        const userIds: string[] = response.data;

        // Fetch user details for each user ID
        const userDetails = await Promise.all(
          userIds.map(async (id) => {
           // alert(id)
            const userResponse = await axios.get(`http://localhost:5000/users/${id}`,{withCredentials: true});
           // alert(JSON.stringify(userResponse.data))
            return { id, name: userResponse.data.name }; // Extract `id` and `name` from the user object
          })
        );

        setUsers(userDetails);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [courseId]);

  const handleCreateChat = async () => {
    if (!courseId) return;

    try {
      await axios.post(`http://localhost:5000/chats`, {
        title,
        users: selectedUsers,
        courseId,
      },{withCredentials:true});
      router.push(`/courses/${courseId}/chats`); // Navigate back to the chats page
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((u) => u !== userId) : [...prev, userId]
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create New Chat</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter chat title"
        className={styles.input}
      />
      <div className={styles.userSelection}>
        <h2 className={styles.subtitle}>Select Users:</h2>
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => toggleUser(user.id)}
            className={`${styles.userButton} ${selectedUsers.includes(user.id) ? styles.selected : ''}`}
          >
            {user.name}
          </button>
        ))}
      </div>
      <button
        onClick={handleCreateChat}
        disabled={!title || selectedUsers.length === 0}
        className={styles.createButton}
      >
        Create Chat
      </button>
    </div>
  );
}
