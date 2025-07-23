'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import styles from './page.module.css';
import axios from 'axios';

interface Chat {
  _id: string;
  title: string;
  users: string[];
  messages: Message[];
}

interface Message {
  id: string;
  sender: string;
  content: string;
}

export default function Home({ params }: { params: Promise<{ courseid: string }> }) {
  const [courseId, setCourseId] = useState<string>('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [leftWidth, setLeftWidth] = useState(50);
  const isDragging = useRef(false);
  const [currentUserId,setCurrentUserId] = useState('')
  useEffect(() => {
    const fetchCourseId = async () => {
      const resolvedParams = await params;
      setCourseId(resolvedParams.courseid);
    };

    fetchCourseId();
  }, [params]);

  useEffect(() => {
    if (courseId) {
      const fetchChats = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/chats/${courseId}`,{withCredentials: true});
        //  alert(courseId)
          setChats(response.data);
          const response2 = await axios.get(`http://localhost:5000/auth`,{withCredentials: true});
          //alert(response2.data)
          setCurrentUserId(response2.data)
        } catch (error) {
          console.error('Error fetching chats:', error);
        }
      };

      fetchChats();
    
    }
  }, [courseId]);

  const handleMouseDown = () => (isDragging.current = true);
  const handleMouseUp = () => (isDragging.current = false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const newLeftWidth = (e.clientX / window.innerWidth) * 100;
    setLeftWidth(Math.max(20, Math.min(80, newLeftWidth)));
  };

  return (
    <div className={styles.container} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <div className={styles.leftPanel} style={{ width: `${leftWidth}%` }}>
        <div className={styles.createChatWrapper}>
          <Link href={`/courses/${courseId}/chats/create-chat`}>
            <button className={styles.button}>Create Chat</button>
          </Link>
        </div>
        <ChatList chats={chats} selectedChat={selectedChat} onSelectChat={setSelectedChat} />
      </div>
      <div className={styles.draggableHandle} onMouseDown={handleMouseDown} />
      <div className={styles.rightPanel} style={{ width: `${100 - leftWidth}%` }}>
        {selectedChat ? (
          <ChatWindow currentUserId = {currentUserId} chat={chats.find((chat) => chat._id === selectedChat)!} />
        ) : (
          <div className={styles.emptyState}>Select a chat to start messaging</div>
        )}
      </div>
    </div>
  );
}
