import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-lg p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Smart Campus</h1>
          <div className="flex gap-4 items-center">
            <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-blue-600">← Back</button>
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
            <Link to="/profile" className="text-gray-700 hover:text-blue-600">Profile</Link>
            <button onClick={() => { logout(); navigate('/login'); }} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">My Projects</h2>
        
        {projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">You haven't joined any projects yet</p>
            <Link to="/dashboard" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-block">
              Browse Projects
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link key={project._id} to={`/projects/${project._id}`} className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800">{project.title}</h3>
                  {project.host._id === user.id && (
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Host</span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-4">{project.description.substring(0, 100)}...</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{project.category}</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{project.status}</span>
                </div>
                <p className="text-sm text-gray-500">Members: {project.members.length}/{project.teamSize}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects;
