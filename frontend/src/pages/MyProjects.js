import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const fetchMyProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      const myProjects = data.filter(p =>
        p.members.some(m => m._id === user.id) || p.host._id === user.id
      );
      setProjects(myProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative pb-12">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-br from-indigo-600 via-blue-500 to-cyan-500 rounded-b-[4rem] z-0 opacity-90 overflow-hidden">
        <div className="absolute top-10 right-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl mix-blend-overlay"></div>
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-cyan-300 opacity-20 rounded-full blur-3xl mix-blend-overlay"></div>
      </div>

      <nav className="sticky top-4 z-50 mx-4 md:mx-auto max-w-7xl glass rounded-2xl px-6 py-4 shadow-sm border border-white/50 animate-fade-in-up">
        <div className="flex justify-between items-center">
          <Link to="/dashboard">
            <h1 className="text-2xl font-extrabold tracking-tight text-gradient cursor-pointer">Smart Campus</h1>
          </Link>
          <div className="flex gap-4 items-center">
            <Link to="/dashboard" className="text-slate-700 hover:text-indigo-600 font-bold transition-colors">Dashboard</Link>
            <Link to="/profile" className="text-slate-700 hover:text-indigo-600 font-bold transition-colors">Profile</Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto max-w-7xl px-4 relative z-10 pt-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span className="text-4xl">📚</span> My Projects
          </h2>
        </div>

        {projects.length === 0 ? (
          <div className="glass-card rounded-3xl p-10 shadow-xl border border-white/60 text-center max-w-2xl mx-auto mt-10">
            <div className="text-6xl mb-4 opacity-70">🔭</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">You haven't joined any projects yet</h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">Explore available opportunities and start collaborating with peers to build your portfolio.</p>
            <Link to="/dashboard" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3.5 rounded-xl hover:shadow-lg shadow-indigo-500/30 font-bold transition-all transform hover:-translate-y-0.5 inline-block">
              Browse Projects
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, idx) => (
              <Link
                key={project._id}
                to={`/projects/${project._id}`}
                className="glass-card rounded-2xl shadow-sm border border-white/60 hover:shadow-xl hover:border-indigo-200 transition-all p-6 group animate-fade-in-up block"
                style={{ animationDelay: `${0.1 + (idx * 0.05)}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">
                    {project.title}
                  </h3>
                  {project.host._id === user.id ? (
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-lg shadow-sm shrink-0 ml-3">
                      Host
                    </span>
                  ) : (
                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-lg shrink-0 ml-3">
                      Member
                    </span>
                  )}
                </div>

                <p className="text-slate-600 text-sm mb-6 line-clamp-2 leading-relaxed h-10">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-slate-100 text-slate-700 font-bold text-xs px-2.5 py-1 rounded-lg">
                    {project.category}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-lg font-bold border ${project.status === 'Open' ? 'bg-green-50 text-green-700 border-green-200' :
                    project.status === 'In Progress' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}>
                    {project.status}
                  </span>
                </div>

                <div className="border-t border-slate-200/60 pt-4 flex items-center justify-between">
                  <div className="w-full mr-4">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      <span>Team</span>
                      <span>{project.members.length}/{project.teamSize}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${project.members.length === project.teamSize ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                        style={{ width: `${(project.members.length / project.teamSize) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-indigo-600 opacity-0 group-hover:opacity-100 transform translate-x-3 group-hover:translate-x-0 transition-all font-bold text-xl">
                    →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects;
