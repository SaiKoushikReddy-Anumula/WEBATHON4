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
    <div className="min-h-screen bg-slate-50 py-10 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-400 opacity-10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-indigo-400 opacity-10 blur-3xl"></div>

      <div className="container mx-auto max-w-4xl px-4 relative z-10 animate-fade-in-up">
        <div className="glass-card rounded-3xl p-8 md:p-10 shadow-2xl border border-white/60">
          <div className="flex items-center mb-8 pb-6 border-b border-slate-200/60">
            <button onClick={() => navigate(-1)} className="mr-4 w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-indigo-600 transition-all">
              ←
            </button>
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">Create <span className="text-gradient">Project</span></h2>
              <p className="text-slate-500 mt-1 font-medium">Bring your ideas to life and build your dream team</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white/40 p-6 rounded-2xl border border-white/50 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">1</span>
                Basic Details
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-slate-700 text-sm font-bold mb-2">Project Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-white/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    placeholder="E.g., Next-Gen Campus Navigation App"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 text-sm font-bold mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="4"
                    className="w-full px-4 py-3 bg-white/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                    placeholder="Describe what your project is about, its goals, and what you hope to achieve..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-slate-700 text-sm font-bold mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-white/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    >
                      <option value="Hackathon">Hackathon</option>
                      <option value="Research">Research</option>
                      <option value="Startup">Startup</option>
                      <option value="Academic">Academic</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 text-sm font-bold mb-2">Team Size</label>
                    <input
                      type="number"
                      value={formData.teamSize}
                      onChange={(e) => setFormData({ ...formData, teamSize: parseInt(e.target.value) })}
                      min="2"
                      className="w-full px-4 py-3 bg-white/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/40 p-6 rounded-2xl border border-white/50 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="bg-purple-100 text-purple-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">2</span>
                Logistics & Roles
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-slate-700 text-sm font-bold mb-2">Your Role in Project</label>
                  <input
                    type="text"
                    placeholder="e.g., Team Lead, Backend Developer"
                    value={formData.hostRole}
                    onChange={(e) => setFormData({ ...formData, hostRole: e.target.value })}
                    className="w-full px-4 py-3 bg-white/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-slate-700 text-sm font-bold mb-2">Deadline</label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="w-full px-4 py-3 bg-white/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 text-sm font-bold mb-2">Weekly Commitment</label>
                    <input
                      type="text"
                      placeholder="e.g., 10-15 hours"
                      value={formData.weeklyCommitment}
                      onChange={(e) => setFormData({ ...formData, weeklyCommitment: e.target.value })}
                      className="w-full px-4 py-3 bg-white/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/40 p-6 rounded-2xl border border-white/50 shadow-sm">
                <label className="block text-slate-700 font-bold mb-3 flex items-center gap-2 text-lg">
                  <span className="text-xl">🛠️</span> Required Skills
                </label>
                <div className="space-y-2 mb-5 min-h-[60px]">
                  {requiredSkills.length === 0 ? (
                    <p className="text-slate-400 text-sm italic text-center py-2">No skills added yet</p>
                  ) : (
                    requiredSkills.map((skill, index) => (
                      <div key={index} className="flex items-center justify-between gap-2 bg-indigo-50/80 border border-indigo-100 p-2.5 rounded-xl text-sm">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{skill.skill}</span>
                          <span className="text-xs text-indigo-600 font-medium">Min: {skill.minProficiency}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setRequiredSkills(requiredSkills.filter((_, i) => i !== index))}
                          className="w-8 h-8 rounded-full bg-white text-rose-500 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center transition-colors shadow-sm"
                          title="Remove skill"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex flex-col space-y-3 p-4 bg-slate-50/50 rounded-xl border border-slate-200/50">
                  <input
                    type="text"
                    placeholder="e.g. React, Python"
                    value={newSkill.skill}
                    onChange={(e) => setNewSkill({ ...newSkill, skill: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                  />
                  <div className="flex gap-2">
                    <select
                      value={newSkill.minProficiency}
                      onChange={(e) => setNewSkill({ ...newSkill, minProficiency: e.target.value })}
                      className="flex-1 px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                    <button
                      type="button"
                      onClick={addSkill}
                      className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 font-medium transition-colors text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white/40 p-6 rounded-2xl border border-white/50 shadow-sm">
                <label className="block text-slate-700 font-bold mb-3 flex items-center gap-2 text-lg">
                  <span className="text-xl">👥</span> Required Roles
                </label>
                <div className="space-y-2 mb-5 min-h-[60px]">
                  {requiredRoles.length === 0 ? (
                    <p className="text-slate-400 text-sm italic text-center py-2">No roles added yet</p>
                  ) : (
                    requiredRoles.map((role, index) => (
                      <div key={index} className="flex items-center justify-between gap-2 bg-purple-50/80 border border-purple-100 p-2.5 rounded-xl text-sm">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{role.role}</span>
                          <span className="text-xs text-purple-600 font-medium">Quantity: {role.count}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setRequiredRoles(requiredRoles.filter((_, i) => i !== index))}
                          className="w-8 h-8 rounded-full bg-white text-rose-500 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center transition-colors shadow-sm"
                          title="Remove role"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex flex-col space-y-3 p-4 bg-slate-50/50 rounded-xl border border-slate-200/50">
                  <input
                    type="text"
                    placeholder="e.g. UI Designer, Dev Ops"
                    value={newRole.role}
                    onChange={(e) => setNewRole({ ...newRole, role: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                  />
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-slate-400 text-sm">Qty:</span>
                      <input
                        type="number"
                        min="1"
                        value={newRole.count}
                        onChange={(e) => setNewRole({ ...newRole, count: parseInt(e.target.value) })}
                        className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addRole}
                      className="bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 font-medium transition-colors text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 rounded-xl hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1 font-bold text-lg tracking-wide"
              >
                Launch Project 🚀
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
