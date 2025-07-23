'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import styles from './ChatWindow.module.css';

interface Message {
  _id: string;
  senderId: string;
  senderName: string;
  content: string;
  date: string;
}

interface Chat {
  _id: string;
  title: string;
  users: string[];
}

interface ChatWindowProps {
  chat: Chat;
  currentUserId: string; // Current logged-in user's ID
}

export default function ChatWindow({ chat, currentUserId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const fetchChatData = async () => {
      const newSocket = io('http://localhost:5000'); // Adjust the server URL if needed
      setSocket(newSocket);

      try {
        // Fetch existing message IDs for the chat
        const response = await axios.get(`http://localhost:5000/chats/chat/${chat._id}`, {
          withCredentials: true,
        });

        const messageIds = response.data?.messages || []; // Array of message IDs

        // Fetch details for each message by ID
        const messageDetails = await Promise.all(
          messageIds.map(async (id: string) => {
            const messageResponse = await axios.get(`http://localhost:5000/chat-messages/${id}`, {
              withCredentials: true,
            });
            return messageResponse.data; // Assume API returns detailed message
          })
        );

        setMessages(
          messageDetails.map((msg: any) => ({
            ...msg,
            senderName: '', // Placeholder for now
          }))
        );

        // Listen for new messages
        newSocket.on('receiveMessage', (message: Message) => {
          setMessages((prevMessages) => {
            const tempIndex = prevMessages.findIndex(
              (msg) => msg._id.startsWith('temp_') && msg.content === message.content
            );

            if (tempIndex !== -1) {
              // Replace the temporary message with the actual message
              const updatedMessages = [...prevMessages];
              updatedMessages[tempIndex] = message;
              return updatedMessages;
            }

            // Add the message only if it's not a duplicate
            const isDuplicate = prevMessages.some((msg) => msg._id === message._id);
            if (!isDuplicate) {
              return [...prevMessages, message];
            }

            return prevMessages;
          });
        });
      } catch (error) {
        console.error('Error fetching chat data:', error);
      }

      // Cleanup function to disconnect the socket
      return () => {
        newSocket.disconnect();
      };
    };

    fetchChatData();
  }, [chat._id]);

  useEffect(() => {
    const fetchUserNames = async () => {
      const userIds = [...new Set(messages.map((msg) => msg.senderId))];
      const userPromises = userIds.map((id) =>
        axios.get(`http://localhost:5000/users/${id}`, { withCredentials: true })
      );
      const userResponses = await Promise.all(userPromises);

      const userMap = userResponses.reduce(
        (acc, response) => ({ ...acc, [response.data._id]: response.data.name }),
        {}
      );

      setMessages((prevMessages) =>
        prevMessages.map((msg) => ({
          ...msg,
          senderName: userMap[msg.senderId] || 'Unknown',
        }))
      );
    };

    if (messages.length > 0) {
      fetchUserNames();
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && socket) {
      const tempId = `temp_${Date.now()}`; // Prefix temporary ID
      const messagePayload = {
        chatId: chat._id,
        senderId: currentUserId,
        content: newMessage.trim(),
        date: new Date().toISOString(),
      };

      // Emit the message to the server
      socket.emit('sendMessage', messagePayload);

      // Optimistically add the message to the UI
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...messagePayload,
          _id: tempId, // Use the temporary ID
          senderName: 'You',
        },
      ]);

      setNewMessage('');
    }
  };

  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatHeader}>{chat.title}</div>
      <div className={styles.messageList}>
        {messages.map((message) => (
          <div key={message._id} className={styles.message}>
            <div className={styles.messageSender}>{message.senderName}</div>
            <div className={styles.messageContent}>{message.content}</div>
          </div>
        ))}
      </div>
      <div className={styles.inputArea}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          className={styles.messageInput}
        />
        <button onClick={handleSendMessage} className={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
}
