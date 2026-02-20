import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const SearchUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    skills: '',
    availability: '',
    minProjects: '',
    maxProjects: ''
  });
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.get('/users/search', { params: filters });
      setUsers(data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <nav className="bg-white shadow-lg p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Search Users</h1>
          <div className="flex gap-4">
            <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-blue-600">← Back</button>
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Search Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Skills (comma separated)</label>
              <input
                type="text"
                placeholder="React, Node.js, Python"
                value={filters.skills}
                onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Availability</label>
              <select
                value={filters.availability}
                onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">All</option>
                <option value="Available">Available</option>
                <option value="Limited">Limited</option>
                <option value="Not available">Not available</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Min Projects</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minProjects}
                onChange={(e) => setFilters({ ...filters, minProjects: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Max Projects</label>
              <input
                type="number"
                placeholder="10"
                value={filters.maxProjects}
                onChange={(e) => setFilters({ ...filters, maxProjects: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:shadow-lg"
          >
            Search Users
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  {user.profile.profilePicture ? (
                    <img src={user.profile.profilePicture} alt={user.profile.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    user.profile.name?.charAt(0)?.toUpperCase()
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{user.profile.name}</h3>
                  <p className="text-sm text-gray-600">@{user.username}</p>
                </div>
              </div>
              
              <div className="mb-3">
                <span className={`text-xs px-2 py-1 rounded ${
                  user.profile.availability === 'Available' ? 'bg-green-100 text-green-800' :
                  user.profile.availability === 'Limited' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {user.profile.availability}
                </span>
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {user.activeProjectCount} active projects
                </span>
              </div>

              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-700 mb-1">Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {user.profile.skills?.slice(0, 4).map((skill, i) => (
                    <span key={i} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      {skill.name}
                    </span>
                  ))}
                  {user.profile.skills?.length > 4 && (
                    <span className="text-xs text-gray-500">+{user.profile.skills.length - 4} more</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedUser(user)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                View Profile
              </button>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="text-center text-gray-600 mt-8">
            <p>No users found. Try adjusting your filters.</p>
          </div>
        )}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">User Profile</h2>
              <button onClick={() => setSelectedUser(null)} className="text-gray-600 hover:text-gray-800 text-2xl">×</button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                {selectedUser.profile.profilePicture ? (
                  <img src={selectedUser.profile.profilePicture} alt={selectedUser.profile.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  selectedUser.profile.name?.charAt(0)?.toUpperCase()
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedUser.profile.name}</h3>
                <p className="text-gray-600">@{selectedUser.username}</p>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Bio</h4>
                <p className="text-gray-700">{selectedUser.profile.bio || 'No bio provided'}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Details</h4>
                <p className="text-sm text-gray-700">Branch: {selectedUser.profile.branch || 'N/A'}</p>
                <p className="text-sm text-gray-700">Year: {selectedUser.profile.year || 'N/A'}</p>
                <p className="text-sm text-gray-700">Availability: {selectedUser.profile.availability}</p>
                <p className="text-sm text-gray-700">Active Projects: {selectedUser.activeProjectCount}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.profile.skills?.map((skill, i) => (
                    <span key={i} className="bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm">
                      {skill.name} - {skill.proficiency}
                    </span>
                  ))}
                </div>
              </div>

              {selectedUser.profile.workExperience?.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Work Experience</h4>
                  {selectedUser.profile.workExperience.map((exp, i) => (
                    <div key={i} className="bg-gray-50 p-3 rounded mb-2">
                      <p className="font-semibold">{exp.projectName}</p>
                      <p className="text-sm text-gray-600">{exp.role} - {exp.duration}</p>
                      <p className="text-sm text-gray-700">{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchUsers;
