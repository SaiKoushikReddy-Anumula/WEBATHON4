import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { getSocket } from '../utils/socket';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    
    const socket = getSocket();
    if (socket) {
      socket.on('notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });
    }
    
    return () => {
      if (socket) {
        socket.off('notification');
      }
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
      // Since backend now marks all as read when fetching, set count to 0
      setUnreadCount(0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return (
    <div className="relative">
      <button className="relative p-2">
        <span className="text-2xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div>
          {notifications.length === 0 ? (
            <p className="p-4 text-center text-gray-600">No notifications</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => !notification.read && markAsRead(notification._id)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <h4 className="font-semibold text-sm">{notification.title}</h4>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
