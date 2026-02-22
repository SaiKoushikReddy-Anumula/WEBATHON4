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
      const { data } = await api.get('/projects');
      const allProjects = data;

      const userInvites = [];
      for (const project of allProjects) {
        const invite = project.invitations?.find(inv => inv.status === 'Pending');
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
    <div className="min-h-screen bg-slate-50 relative pb-12">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-b-[4rem] z-0 opacity-90 overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl mix-blend-overlay"></div>
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-pink-300 opacity-20 rounded-full blur-3xl mix-blend-overlay"></div>
      </div>

      <nav className="sticky top-4 z-50 mx-4 md:mx-auto max-w-4xl glass rounded-2xl px-6 py-4 shadow-sm border border-white/50 animate-fade-in-up">
        <div className="flex justify-between items-center">
          <Link to="/dashboard">
            <h1 className="text-2xl font-extrabold tracking-tight text-gradient cursor-pointer">Smart Campus</h1>
          </Link>
          <div className="flex gap-4 items-center">
            <Link to="/dashboard" className="text-slate-700 hover:text-indigo-600 font-bold transition-colors">Dashboard</Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto max-w-4xl px-4 relative z-10 pt-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span className="text-4xl">🔔</span> Notifications
          </h2>
        </div>

        <div className="glass-card rounded-3xl p-6 md:p-8 shadow-xl border border-white/60 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400 opacity-10 rounded-full blur-3xl"></div>

          {invitations.length > 0 && (
            <div className="mb-10 relative z-10">
              <div className="flex items-center gap-2 mb-6 border-b border-slate-200/50 pb-4">
                <span className="text-2xl">📨</span>
                <h3 className="text-xl font-bold text-slate-800">Project Invitations</h3>
                <span className="bg-purple-100 text-purple-700 font-bold text-xs px-2.5 py-0.5 rounded-full ml-2">
                  {invitations.length} New
                </span>
              </div>

              <div className="space-y-4">
                {invitations.map((project, idx) => (
                  <div
                    key={project._id}
                    className="bg-white/80 border border-purple-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group animate-fade-in-up"
                    style={{ animationDelay: `${0.1 + (idx * 0.05)}s` }}
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-purple-400 to-indigo-500"></div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 pl-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-extrabold text-lg text-slate-800 leading-tight">{project.title}</h4>
                          <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border border-indigo-100">
                            {project.category}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-purple-600 mb-2">Hosted by {project.host?.profile?.name}</p>
                        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-3">
                          {project.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Team Status:</span>
                          <div className="flex gap-1">
                            {Array.from({ length: project.teamSize }).map((_, i) => (
                              <div key={i} className={`w-2 h-2 rounded-full ${i < (project.members?.length || 0) ? 'bg-indigo-500' : 'bg-slate-200'}`}></div>
                            ))}
                          </div>
                          <span className="text-xs font-bold text-slate-700 ml-1">{project.members?.length || 0}/{project.teamSize}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap md:flex-nowrap gap-2 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                        <Link
                          to={`/projects/${project._id}`}
                          className="flex-1 md:flex-none text-center bg-white border-2 border-slate-100 text-slate-700 font-bold px-4 py-2.5 rounded-xl hover:bg-slate-50 hover:border-slate-200 transition-colors text-sm"
                        >
                          Details
                        </Link>
                        <button
                          onClick={() => handleInvitation(project._id, 'accept')}
                          className="flex-[2] md:flex-none bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold px-5 py-2.5 rounded-xl hover:shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 text-sm"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleInvitation(project._id, 'reject')}
                          className="flex-1 md:flex-none text-center bg-rose-50 text-rose-600 font-bold px-4 py-2.5 rounded-xl hover:bg-rose-100 transition-colors text-sm"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6 border-b border-slate-200/50 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📋</span>
                <h3 className="text-xl font-bold text-slate-800">Recent Activity</h3>
              </div>
              {notifications.some(n => !n.read) && (
                <button
                  onClick={() => {
                    const unread = notifications.filter(n => !n.read);
                    unread.forEach(n => markAsRead(n._id));
                  }}
                  className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Mark All Read
                </button>
              )}
            </div>

            <div className="space-y-3">
              {notifications.length === 0 && invitations.length === 0 && (
                <div className="text-center py-12 bg-white/40 rounded-2xl border border-dashed border-slate-300">
                  <div className="text-5xl mb-3 opacity-40">📭</div>
                  <h4 className="text-lg font-bold text-slate-700 mb-1">You're all caught up</h4>
                  <p className="text-slate-500 text-sm">No new notifications to show right now.</p>
                </div>
              )}

              {notifications.map((notif, idx) => (
                <div
                  key={notif._id}
                  className={`p-5 rounded-2xl border transition-all animate-fade-in-up relative overflow-hidden ${notif.read
                      ? 'bg-white/40 border-slate-200/60 opacity-70'
                      : 'bg-white border-indigo-100 shadow-sm hover:shadow-md'
                    }`}
                  style={{ animationDelay: `${0.1 + (idx * 0.05)}s` }}
                >
                  {!notif.read && (
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pl-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {!notif.read && <span className="flex w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse"></span>}
                        <h4 className={`font-bold text-lg ${notif.read ? 'text-slate-700' : 'text-slate-900'} leading-tight`}>
                          {notif.title}
                        </h4>
                      </div>
                      <p className={`text-sm mb-2 leading-relaxed ${notif.read ? 'text-slate-500' : 'text-slate-600 font-medium'}`}>
                        {notif.message}
                      </p>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <span>🕒</span> {new Date(notif.createdAt).toLocaleString(undefined, {
                          month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      {notif.link && (
                        <Link
                          to={notif.link}
                          className={`flex-1 sm:flex-none text-center font-bold px-4 py-2 rounded-xl text-sm transition-colors ${notif.read
                              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                            }`}
                        >
                          View Let's Go
                        </Link>
                      )}
                      {!notif.read && (
                        <button
                          onClick={() => markAsRead(notif._id)}
                          className="flex-1 sm:flex-none text-center bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 font-bold px-4 py-2 rounded-xl text-sm transition-colors"
                        >
                          Dismiss
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
    </div>
  );
};

export default Notifications;
