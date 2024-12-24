'use client';

import { useEffect, useState } from 'react';
import { FaBell, FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
import styles from './notifications.module.css';
import axios from 'axios';

interface Notification {
  id: string;
  title: string; // Notification type as the title
  description: string;
  time: string;
}

function NotificationIcon({ type }: { type: string }) {
  const iconClasses = `${styles.icon}`;
  switch (type) {
    case 'info':
      return <FaInfoCircle className={`${iconClasses} ${styles.infoIcon}`} />;
    case 'success':
      return <FaCheckCircle className={`${iconClasses} ${styles.successIcon}`} />;
    case 'warning':
      return <FaExclamationCircle className={`${iconClasses} ${styles.warningIcon}`} />;
    default:
      return <FaBell className={`${iconClasses} ${styles.defaultIcon}`} />;
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const userId = await axios.get("http://localhost:5000/auth",{withCredentials: true}) // Replace with actual user ID from context/auth
        // Replace with actual user ID
       // alert(userId)
        const response = await axios.get(`http://localhost:5000/notifications/user/${userId.data}`,{withCredentials:true})
        
 //   alert(JSON.stringify(response.data))
        const data = await response.data;

        const formattedNotifications = data.map((n: any) => ({
          id: n._id,
          title: n.type || 'default',
          description: n.content,
          time: new Date(n.createdAt).toLocaleString(),
        }));

        setNotifications(formattedNotifications);
      } catch (error: any) {
        console.error('Error fetching notifications:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, []);

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
        
        </div>
      </div>
      <div className={styles.container}>
        <h2 className={styles.title}>Notifications</h2>
        {notifications.length === 0 ? (
          <div>No notifications available.</div>
        ) : (
          <div className={styles.notificationList}>
            {notifications.map((notification) => (
              <div key={notification.id} className={styles.notificationCard}>
                <div className={styles.notificationContent}>
                  <div className={styles.iconWrapper}>
                    <NotificationIcon type={notification.title} />
                  </div>
                  <div className={styles.textContent}>
                    <h3 className={styles.notificationTitle}>{notification.title}</h3>
                    <p className={styles.notificationDescription}>{notification.description}</p>
                  </div>
                  <div className={styles.timeWrapper}>
                    <span className={styles.notificationTime}>{notification.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
