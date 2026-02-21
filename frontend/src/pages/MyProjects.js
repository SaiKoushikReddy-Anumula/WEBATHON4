import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchMyProjects = React.useCallback(async () => {
    try {
      const { data } = await api.get('/projects', {
        params: { status: '' }
      });
      
      const userId = String(user._id || user.id);
      
      const myProjects = data.filter(p => {
        const isMember = p.members.some(m => String(m._id) === userId);
        const isHost = String(p.host._id) === userId;
        const notDeleted = !p.deletedAt;
        
        return (isMember || isHost) && notDeleted;
      });
      
      setProjects(myProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchMyProjects();
  }, [fetchMyProjects]);

  const activeProjects = projects.filter(p => p.status !== 'Completed' && p.status !== 'Terminated');
  const completedProjects = projects.filter(p => p.status === 'Completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50">
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/90 border-b border-blue-100 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center relative">
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300 relative overflow-visible">
                <div className="relative flex items-center justify-center">
                  <span className="text-white text-xs opacity-60 absolute -left-2 top-0.5 z-0">👤</span>
                  <span className="text-white text-base z-10">👤</span>
                  <span className="text-white text-xs opacity-60 absolute -right-2 top-0.5 z-0">👤</span>
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Smart Campus</span>
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>Menu</span>
            </button>

            {menuOpen && (
              <div className="absolute right-6 top-full mt-2 w-64 space-y-2 animate-fade-in bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-blue-100">
                <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-medium">
                  <span className="text-xl">🏠</span>
                  <span>Dashboard</span>
                </Link>
                <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-medium">
                  <span className="text-xl">👤</span>
                  <span>Profile</span>
                </Link>
                <Link to="/notifications" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-medium">
                  <span className="text-xl">🔔</span>
                  <span>Notifications</span>
                </Link>
                <Link to="/search-users" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-medium">
                  <span className="text-xl">🔍</span>
                  <span>Search Users</span>
                </Link>
                <Link to="/create-project" className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                  <span className="text-xl">➕</span>
                  <span>Create Project</span>
                </Link>
                <button
                  onClick={() => { logout(); navigate('/login'); }}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-600 hover:text-white transition-all"
                >
                  <span className="text-xl">🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">My Projects</h2>
        
        {projects.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-8 text-center">
            <p className="text-slate-600 mb-4">You haven't joined any projects yet</p>
            <Link to="/dashboard" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl hover:shadow-lg inline-block transition-all">
              Browse Projects
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-4 text-slate-800">Active Projects</h3>
              {activeProjects.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-6 text-center">
                  <p className="text-slate-600">No active projects</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeProjects.map((project) => (
                    <Link key={project._id} to={`/projects/${project._id}`} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 hover:border-blue-400 hover:shadow-blue-200 transition-all p-6 hover:scale-105">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-slate-800">{project.title}</h3>
                        {String(project.host._id) === String(user._id || user.id) && (
                          <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-lg font-medium">Host</span>
                        )}
                      </div>
                      <p className="text-slate-600 text-sm mb-4">{project.description.substring(0, 100)}...</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-blue-500/20 text-blue-600 text-xs px-3 py-1 rounded-lg font-medium border border-blue-500/30">{project.category}</span>
                        <span className="bg-green-500/20 text-green-600 text-xs px-3 py-1 rounded-lg font-medium border border-green-500/30">{project.status}</span>
                      </div>
                      <p className="text-sm text-slate-600">Members: {project.members.length}/{project.teamSize}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 text-slate-800">Completed Projects</h3>
              {completedProjects.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-6 text-center">
                  <p className="text-slate-600">No completed projects</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedProjects.map((project) => (
                    <Link key={project._id} to={`/projects/${project._id}`} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-green-100 hover:border-green-400 hover:shadow-green-200 transition-all p-6 hover:scale-105">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-slate-800">{project.title}</h3>
                        <div className="flex gap-2">
                          {String(project.host._id) === String(user._id || user.id) && (
                            <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-lg font-medium">Host</span>
                          )}
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-lg font-medium">✓ Done</span>
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm mb-4">{project.description.substring(0, 100)}...</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-blue-500/20 text-blue-600 text-xs px-3 py-1 rounded-lg font-medium border border-blue-500/30">{project.category}</span>
                      </div>
                      <p className="text-sm text-slate-600">Members: {project.members.length}/{project.teamSize}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyProjects;
