import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [filters, setFilters] = useState({ skills: '', category: '', role: '' });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProjects();
    fetchRecommendations();
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

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Smart Campus</h1>
          <div className="flex gap-4">
            <Link to="/profile" className="text-gray-700 hover:text-blue-600">Profile</Link>
            <Link to="/my-projects" className="text-gray-700 hover:text-blue-600">My Projects</Link>
            <Link to="/create-project" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Create Project
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Welcome, {user?.profile?.name}!</h2>
          
          <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Skills (comma separated)"
                value={filters.skills}
                onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              />
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="">All Categories</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Research">Research</option>
                <option value="Startup">Startup</option>
                <option value="Academic">Academic</option>
              </select>
              <input
                type="text"
                placeholder="Role"
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Search Projects
            </button>
          </form>
        </div>

        {recommendations.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Recommended for You</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-xl font-bold mb-4">All Open Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({ project }) => (
  <Link to={`/projects/${project._id}`} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
    <h4 className="text-lg font-bold mb-2">{project.title}</h4>
    <p className="text-gray-600 text-sm mb-3">{project.description.substring(0, 100)}...</p>
    <div className="flex flex-wrap gap-2 mb-3">
      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{project.category}</span>
      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
        {project.members?.length || 0}/{project.teamSize} members
      </span>
    </div>
    <div className="text-sm text-gray-500">
      <p>Host: {project.host?.profile?.name}</p>
      <p>Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
    </div>
  </Link>
);

export default Dashboard;
