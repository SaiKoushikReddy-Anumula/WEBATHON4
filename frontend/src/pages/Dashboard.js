import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [filters, setFilters] = useState({ skills: '', category: '', role: '' });
  const [unreadCount, setUnreadCount] = useState(0);
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
    <div className="min-h-screen bg-slate-50 relative pb-12">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500 rounded-b-[4rem] z-0 opacity-90 overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl mix-blend-overlay"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-pink-400 opacity-20 rounded-full blur-3xl mix-blend-overlay"></div>
      </div>

      <nav className="sticky top-4 z-50 mx-4 md:mx-auto max-w-7xl glass rounded-2xl px-6 py-4 shadow-sm border border-white/50 animate-fade-in-up">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-gradient">Smart Campus</h1>
          <div className="hidden md:flex gap-6 items-center">
            <Link to="/notifications" className="relative text-slate-600 hover:text-indigo-600 font-medium transition-colors flex items-center gap-1 group">
              <span className="text-xl group-hover:animate-bounce">🔔</span>
              <span>Alerts</span>
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg shadow-red-500/30">
                  {unreadCount}
                </span>
              )}
            </Link>
            <Link to="/profile" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Profile</Link>
            <Link to="/my-projects" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">My Projects</Link>
            <Link to="/search-users" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Network</Link>
            <Link to="/create-project" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-0.5 ml-2">
              Create Project
            </Link>
            <button
              onClick={() => {
                logout();
                window.location.href = '/login';
              }}
              className="bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl hover:bg-slate-50 hover:text-red-500 hover:border-red-200 transition-all duration-300 font-medium shadow-sm ml-2"
            >
              Logout
            </button>
          </div>
          {/* Mobile menu button (placeholder) */}
          <button className="md:hidden text-slate-800 text-2xl">☰</button>
        </div>
      </nav>

      <div className="container mx-auto px-4 relative z-10 pt-10">
        <div className="mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="text-white mb-8">
            <h2 className="text-4xl font-extrabold mb-2 text-shadow-sm">Welcome back, {user?.profile?.name?.split(' ')[0] || 'Explorer'}! 👋</h2>
            <p className="text-indigo-100 text-lg max-w-2xl">Discover exciting projects, connect with talented peers, and bring your ideas to life.</p>
          </div>

          <form onSubmit={handleSearch} className="glass-card p-3 rounded-2xl shadow-xl border border-white/60">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-3.5 text-slate-400">🔍</span>
                <input
                  type="text"
                  placeholder="Keywords or skills (e.g. React, Node...)"
                  value={filters.skills}
                  onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-white/60 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>
              <div className="md:w-48">
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-4 py-3 bg-white/60 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-700 font-medium transition-all"
                >
                  <option value="">All Categories</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Research">Research</option>
                  <option value="Startup">Startup</option>
                  <option value="Academic">Academic</option>
                </select>
              </div>
              <div className="md:w-56">
                <select
                  value={filters.role}
                  onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                  className="w-full px-4 py-3 bg-white/60 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-700 font-medium transition-all"
                >
                  <option value="">All Roles</option>
                  <option value="Backend Developer">Backend</option>
                  <option value="Frontend Developer">Frontend</option>
                  <option value="Full Stack Developer">Full Stack</option>
                  <option value="Designer">UI/UX Designer</option>
                  <option value="ML Engineer">ML/AI Engineer</option>
                  <option value="Guide">Mentor/Guide</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-slate-900 text-white font-bold px-8 py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-md hover:shadow-lg"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {recommendations.length > 0 && (
          <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <span className="text-yellow-500">✨</span> Recommended for You
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((project, idx) => (
                <div key={project._id} className="animate-fade-in-up" style={{ animationDelay: `${0.3 + (idx * 0.1)}s` }}>
                  <ProjectCard project={project} featured />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Explore Open Projects</h3>
            <span className="text-sm font-medium text-slate-500 bg-slate-200/50 px-3 py-1 rounded-full">{projects.length} found</span>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, idx) => (
                <div key={project._id} className="animate-fade-in-up" style={{ animationDelay: `${0.1 + (idx * 0.05)}s` }}>
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">No projects found</h3>
              <p className="text-slate-500 max-w-md mx-auto">Try adjusting your filters or use different keywords to find what you're looking for.</p>
              <button
                onClick={() => { setFilters({ skills: '', category: '', role: '' }); fetchProjects(); }}
                className="mt-6 text-indigo-600 font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({ project, featured = false }) => {
  const totalSlots = project.teamSize;
  const filledSlots = project.members?.length || 0;
  const slotsLeft = totalSlots - filledSlots;
  const percentageFilled = Math.min(100, (filledSlots / totalSlots) * 100);

  return (
    <Link
      to={`/projects/${project._id}`}
      className={`block bg-white rounded-2xl p-6 transition-all duration-300 transform hover:-translate-y-1 ${featured
          ? 'border-2 border-indigo-100 shadow-xl shadow-indigo-100'
          : 'border border-slate-100 shadow-md hover:shadow-xl hover:border-indigo-100'
        }`}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {project.category}
        </span>
        <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${slotsLeft === 0
            ? 'bg-rose-50 text-rose-600'
            : 'bg-emerald-50 text-emerald-600'
          }`}>
          {slotsLeft === 0 ? 'Full' : `${slotsLeft} Open`}
        </span>
      </div>

      <h4 className="text-xl font-bold mb-2 text-slate-900 line-clamp-1">{project.title}</h4>
      <p className="text-slate-600 text-sm mb-6 line-clamp-2 min-h-[40px] leading-relaxed">
        {project.description}
      </p>

      <div className="mb-5">
        <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1.5">
          <span>Team Progress</span>
          <span>{filledSlots}/{totalSlots} Members</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${slotsLeft === 0 ? 'bg-rose-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`}
            style={{ width: `${percentageFilled}%` }}
          ></div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-[10px] font-bold">
            {project.host?.profile?.name?.charAt(0).toUpperCase() || '?'}
          </div>
          <span className="text-slate-700 font-medium truncate max-w-[120px]">
            {project.host?.profile?.name?.split(' ')[0] || 'Unknown'}
          </span>
        </div>
        <span className="text-slate-400 font-medium flex items-center gap-1 text-xs whitespace-nowrap">
          📅 {new Date(project.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
    </Link>
  );
};

export default Dashboard;
