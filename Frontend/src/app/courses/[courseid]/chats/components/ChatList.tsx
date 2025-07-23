'use client';

import styles from './ChatList.module.css';

interface Chat {
  _id: string;
  title: string;
  users: string[];
}

interface ChatListProps {
  chats: Chat[];
  selectedChat: string | null;
  onSelectChat: (chatId: string) => void;
}

export default function ChatList({ chats, selectedChat, onSelectChat }: ChatListProps) {
  return (
    <div className={styles.chatList}>
      {chats.map((chat) => (
        <button
          key={chat._id}
          className={`${styles.chatButton} ${selectedChat === chat._id ? styles.selected : ''}`}
          onClick={() => onSelectChat(chat._id)}
          aria-pressed={selectedChat === chat._id}
        >
          {chat.title}
        </button>
      ))}
    </div>
  );
}
