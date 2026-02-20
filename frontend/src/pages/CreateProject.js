import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CreateProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Hackathon',
    teamSize: 3,
    deadline: '',
    weeklyCommitment: '',
    hostRole: ''
  });
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [requiredRoles, setRequiredRoles] = useState([]);
  const [newSkill, setNewSkill] = useState({ skill: '', minProficiency: 'Beginner' });
  const [newRole, setNewRole] = useState({ role: '', count: 1 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const projectData = {
        ...formData,
        requiredSkills,
        requiredRoles
      };
      
      const { data } = await api.post('/projects', projectData);
      navigate(`/projects/${data._id}`);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const addSkill = () => {
    if (newSkill.skill) {
      setRequiredSkills([...requiredSkills, newSkill]);
      setNewSkill({ skill: '', minProficiency: 'Beginner' });
    }
  };

  const addRole = () => {
    if (newRole.role) {
      setRequiredRoles([...requiredRoles, newRole]);
      setNewRole({ role: '', count: 1 });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <button onClick={() => navigate(-1)} className="mb-4 text-gray-600 hover:text-blue-600">
            ← Back
          </button>
          <h2 className="text-3xl font-bold mb-6">Create New Project</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Project Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="4"
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="Hackathon">Hackathon</option>
                  <option value="Research">Research</option>
                  <option value="Startup">Startup</option>
                  <option value="Academic">Academic</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Team Size</label>
                <input
                  type="number"
                  value={formData.teamSize}
                  onChange={(e) => setFormData({ ...formData, teamSize: parseInt(e.target.value) })}
                  min="2"
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Your Role in Project</label>
              <input
                type="text"
                placeholder="e.g., Team Lead, Backend Developer"
                value={formData.hostRole}
                onChange={(e) => setFormData({ ...formData, hostRole: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Weekly Commitment</label>
                <input
                  type="text"
                  placeholder="e.g., 10-15 hours"
                  value={formData.weeklyCommitment}
                  onChange={(e) => setFormData({ ...formData, weeklyCommitment: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Required Skills</label>
              <div className="space-y-2 mb-4">
                {requiredSkills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                    <span className="flex-1">{skill.skill}</span>
                    <span className="text-sm text-gray-600">Min: {skill.minProficiency}</span>
                    <button
                      type="button"
                      onClick={() => setRequiredSkills(requiredSkills.filter((_, i) => i !== index))}
                      className="text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Skill name"
                  value={newSkill.skill}
                  onChange={(e) => setNewSkill({ ...newSkill, skill: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
                <select
                  value={newSkill.minProficiency}
                  onChange={(e) => setNewSkill({ ...newSkill, minProficiency: e.target.value })}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <button
                  type="button"
                  onClick={addSkill}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Required Roles</label>
              <div className="space-y-2 mb-4">
                {requiredRoles.map((role, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                    <span className="flex-1">{role.role}</span>
                    <span className="text-sm text-gray-600">Count: {role.count}</span>
                    <button
                      type="button"
                      onClick={() => setRequiredRoles(requiredRoles.filter((_, i) => i !== index))}
                      className="text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Role name"
                  value={newRole.role}
                  onChange={(e) => setNewRole({ ...newRole, role: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
                <input
                  type="number"
                  min="1"
                  value={newRole.count}
                  onChange={(e) => setNewRole({ ...newRole, count: parseInt(e.target.value) })}
                  className="w-20 px-3 py-2 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={addRole}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Add
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Create Project
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
