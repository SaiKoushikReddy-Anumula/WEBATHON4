import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [filters, setFilters] = useState({ skills: '', category: '', role: '' });
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    fetchProjects();
    fetchRecommendations();
    fetchUnreadCount();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects', { params: filters });
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const { data } = await api.get('/projects/recommendations');
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const { data } = await api.get('/notifications');
      const unread = data.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50">
      {/* Modern Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/90 border-b border-blue-100 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 relative">
          <div className="flex justify-between items-center">
            {/* Logo - Left */}
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

            {/* Menu Button - Rightmost */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span>Menu</span>
              </button>

              {/* Dropdown Menu - Vertically below menu button */}
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 space-y-2 animate-fade-in bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-blue-100">
              <Link to="/notifications" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-medium">
                <span className="text-xl">🔔</span>
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-medium">
                <span className="text-xl">👤</span>
                <span>Profile</span>
              </Link>
              <Link to="/my-projects" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-medium">
                <span className="text-xl">📁</span>
                <span>My Projects</span>
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
                onClick={() => {
                  logout();
                  window.location.href = '/login';
                }}
                className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-600 hover:text-white transition-all"
              >
                <span className="text-xl">🚪</span>
                <span>Logout</span>
              </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome back, {user?.profile?.name}!
          </h2>
          <p className="text-slate-600 text-lg">Discover and collaborate on amazing projects</p>
        </div>
          
        {/* Search Filters */}
        <form onSubmit={handleSearch} className="mb-12 bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-blue-100 shadow-xl animate-fade-in">
          <h3 className="text-xl font-semibold mb-6 text-slate-800">🔍 Find Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <input
              type="text"
              placeholder="Skills (e.g., React, Python)"
              value={filters.skills}
              onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
              className="px-4 py-3 bg-white border border-blue-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="px-4 py-3 bg-white border border-blue-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="">All Categories</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Research">Research</option>
              <option value="Startup">Startup</option>
              <option value="Academic">Academic</option>
            </select>
            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              className="px-4 py-3 bg-white border border-blue-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="">All Roles</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Guide">Guide</option>
              <option value="Designer">Designer</option>
              <option value="ML Engineer">ML Engineer</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
          >
            Search Projects
          </button>
        </form>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-12 animate-fade-in">
            <h3 className="text-2xl font-bold mb-6 text-slate-800">✨ Recommended for You</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          </div>
        )}

        {/* All Projects */}
        <div className="animate-fade-in">
          <h3 className="text-2xl font-bold mb-6 text-slate-800">🚀 All Open Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({ project }) => {
  const totalSlots = project.teamSize;
  const filledSlots = project.members?.length || 0;
  const slotsLeft = totalSlots - filledSlots;
  
  return (
    <Link 
      to={`/projects/${project._id}`} 
      className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-blue-100 hover:border-blue-400 shadow-lg hover:shadow-blue-200 transition-all duration-300 hover:scale-105"
    >
      <h4 className="text-xl font-bold mb-3 text-slate-800 group-hover:text-blue-600 transition-colors">
        {project.title}
      </h4>
      <p className="text-slate-600 text-sm mb-4 line-clamp-2">
        {project.description.substring(0, 100)}...
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="bg-blue-500/20 text-blue-600 text-xs px-3 py-1 rounded-lg font-medium border border-blue-500/30">
          {project.category}
        </span>
        <span className={`text-xs px-3 py-1 rounded-lg font-semibold border ${
          slotsLeft === 0 
            ? 'bg-red-500/20 text-red-600 border-red-500/30' 
            : 'bg-green-500/20 text-green-600 border-green-500/30'
        }`}>
          {slotsLeft === 0 ? '🔴 Full' : `✅ ${slotsLeft} slots`}
        </span>
      </div>
      <div className="mb-3 text-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-600">Team Progress</span>
          <span className="text-slate-800 font-semibold">{filledSlots}/{totalSlots}</span>
        </div>
        <div className="w-full bg-blue-100 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(filledSlots / totalSlots) * 100}%` }}
          />
        </div>
      </div>
      <div className="text-sm text-slate-600 space-y-1">
        <p>👤 Host: {project.host?.profile?.name}</p>
        <p>📅 Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
      </div>
    </Link>
  );
};

export default Dashboard;
