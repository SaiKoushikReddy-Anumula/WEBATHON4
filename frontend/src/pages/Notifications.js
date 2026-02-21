import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    fetchNotifications();
    fetchInvitations();
    
    const markAllRead = async () => {
      try {
        await api.put('/notifications/read-all');
      } catch (error) {
        console.error('Error marking notifications as read:', error);
      }
    };
    
    markAllRead();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchInvitations = async () => {
    try {
      const { data: userData } = await api.get('/users/profile');
      const userId = userData._id;
      
      const { data } = await api.get('/projects');
      const allProjects = data;
      
      const userInvites = [];
      for (const project of allProjects) {
        const invite = project.invitations?.find(
          inv => inv.user === userId && inv.status === 'Pending'
        );
        if (invite) {
          userInvites.push({ ...project, invitation: invite });
        }
      }
      setInvitations(userInvites);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    }
  };

  const handleInvitation = async (projectId, action) => {
    try {
      await api.post('/projects/invitations/respond', { projectId, action });
      alert(`Invitation ${action}ed successfully`);
      fetchInvitations();
      fetchNotifications();
      
      // Redirect to project if accepted
      if (action === 'accept') {
        navigate(`/projects/${projectId}`);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to respond to invitation');
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 p-6">
      <div className="container mx-auto max-w-4xl">
        <button onClick={() => navigate(-1)} className="mb-4 text-slate-600 hover:text-blue-600 font-medium">
          ← Back
        </button>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-slate-800">🔔 Notifications</h2>

          {invitations.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-blue-600">📨 Project Invitations</h3>
              <div className="space-y-3">
                {invitations.map((project) => (
                  <div key={project._id} className="border border-blue-200 p-4 rounded-xl bg-blue-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg text-slate-800">{project.title}</h4>
                        <p className="text-sm text-slate-600">Host: {project.host?.profile?.name}</p>
                        <p className="text-sm text-slate-500 mt-1">{project.description.substring(0, 100)}...</p>
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{project.category}</span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Team: {project.members?.length}/{project.teamSize}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/projects/${project._id}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleInvitation(project._id, 'accept')}
                          className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-all"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleInvitation(project._id, 'reject')}
                          className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-all"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <h3 className="text-lg font-semibold mb-3 text-slate-800">All Notifications</h3>
          <div className="space-y-3">
            {notifications.length === 0 && invitations.length === 0 && (
              <p className="text-slate-500 text-center py-8">No notifications</p>
            )}
            {notifications.map((notif) => (
              <div
                key={notif._id}
                className={`p-4 rounded-xl border ${
                  notif.read ? 'bg-slate-50 border-slate-200' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800">{notif.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                    <p className="text-xs text-slate-400 mt-2">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {notif.link && (
                      <Link
                        to={notif.link}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View
                      </Link>
                    )}
                    {!notif.read && (
                      <button
                        onClick={() => markAsRead(notif._id)}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
