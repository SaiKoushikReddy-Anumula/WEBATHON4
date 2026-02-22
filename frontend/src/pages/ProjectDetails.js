import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [activeTab, setActiveTab] = useState('details');
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [removeMemberId, setRemoveMemberId] = useState(null);
  const [removeReason, setRemoveReason] = useState('');
  const [viewingProfile, setViewingProfile] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data);
      setEditData({
        teamSize: data.teamSize,
        status: data.status,
        deadline: data.deadline.split('T')[0]
      });
      
      if (data.host._id === user.id) {
        fetchSuggestions();
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const { data } = await api.get(`/projects/${id}/suggestions`);
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleApply = async () => {
    try {
      await api.post(`/projects/${id}/apply`);
      alert('Application submitted successfully!');
      fetchProject();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to apply');
    }
  };

  const handleApplication = async (userId, action) => {
    try {
      await api.post('/projects/applications/handle', {
        projectId: id,
        userId,
        action
      });
      fetchProject();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to process application');
    }
  };

  const handleUpdateProject = async () => {
    try {
      await api.put(`/projects/${id}`, editData);
      setEditing(false);
      fetchProject();
      alert('Project updated successfully');
    } catch (error) {
      alert('Failed to update project');
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to terminate this project? All members will be notified.')) {
      try {
        await api.delete(`/projects/${id}`);
        alert('Project terminated successfully');
        navigate('/dashboard');
      } catch (error) {
        alert('Failed to terminate project');
      }
    }
  };

  const handleRemoveMember = async () => {
    try {
      await api.post(`/projects/${id}/remove-member`, {
        memberId: removeMemberId,
        reason: removeReason.trim() || undefined
      });
      setRemoveMemberId(null);
      setRemoveReason('');
      fetchProject();
      alert('Member removed successfully');
    } catch (error) {
      alert('Failed to remove member');
    }
  };

  const handleSendInvitation = async (userId) => {
    try {
      await api.post(`/projects/${id}/invite`, { userId });
      alert('Invitation sent successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send invitation');
    }
  };

  const handleRateMembers = async () => {
    try {
      const ratingArray = Object.entries(ratings).map(([userId, rating]) => ({
        userId,
        rating: parseInt(rating)
      }));
      
      if (ratingArray.length === 0) {
        alert('Please rate at least one member');
        return;
      }
      
      await api.post(`/projects/${id}/rate-members`, { ratings: ratingArray });
      setShowRatingModal(false);
      setRatings({});
      alert('Ratings submitted successfully');
      fetchProject();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit ratings');
    }
  };

  if (!project) return <div className="p-6">Loading...</div>;

  const isHost = project.host._id === user.id;
  const isMember = project.members.some(m => m._id === user.id);
  const hasApplied = project.applications.some(a => a.user._id === user.id);

return (
    <div className="min-h-screen bg-slate-50 relative pb-12">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-indigo-700 via-blue-600 to-purple-600 rounded-b-[4rem] z-0 opacity-90 overflow-hidden">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl mix-blend-overlay"></div>
            <div className="absolute bottom-10 right-20 w-80 h-80 bg-pink-400 opacity-20 rounded-full blur-3xl mix-blend-overlay"></div>
        </div>

        <div className="container mx-auto max-w-6xl px-4 relative z-10 pt-10 animate-fade-in-up">
            <button onClick={() => navigate(-1)} className="mb-6 mt-2 text-white/90 hover:text-white flex items-center gap-2 font-medium transition-colors bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20 w-max">
                <span>←</span> Back to Projects
            </button>

            <div className="glass-card rounded-3xl p-6 md:p-8 shadow-2xl border border-white/60 mb-6 relative overflow-hidden">
                {/* Header decorative elements */}
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-400 opacity-10 blur-3xl"></div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                {project.category}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${project.status === 'Open' ? 'bg-green-100 text-green-700' :
                                    project.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-700'
                                }`}>
                                {project.status}
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-1 text-slate-800 tracking-tight">{project.title}</h2>
                        <div className="flex items-center gap-3 mt-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold">
                                {project.host.profile.profilePicture ? (
                                    <img src={project.host.profile.profilePicture} alt="Host" className="w-full h-full object-cover" />
                                ) : (
                                    project.host.profile.name?.charAt(0)?.toUpperCase()
                                )}
                            </div>
                            <p className="text-slate-600 font-medium">Hosted by <span className="text-slate-800 font-bold">{project.host.profile.name}</span></p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {!isHost && !isMember && !hasApplied && project.status === 'Open' && (
                            <button
                                onClick={handleApply}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 font-bold"
                            >
                                Apply to Join
                            </button>
                        )}
                        {isMember && (
                            <Link
                                to={`/workspace/${id}`}
                                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all font-bold flex items-center gap-2"
                            >
                                <span>🚀</span> Open Workspace
                            </Link>
                        )}
                        {isHost && (
                            <>
                                <button
                                    onClick={() => setEditing(!editing)}
                                    className={`px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 ${editing
                                            ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                                        }`}
                                >
                                    {editing ? 'Cancel Edit' : 'Edit Project'}
                                </button>
                                {project.status === 'Completed' && (
                                    <button
                                        onClick={() => setShowRatingModal(true)}
                                        className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all font-bold"
                                    >
                                        Rate Members
                                    </button>
                                )}
                                <button
                                    onClick={handleDeleteProject}
                                    className="bg-rose-50 text-rose-600 border border-rose-200 px-6 py-3 rounded-xl hover:bg-rose-100 transition-all font-bold"
                                >
                                    Terminate
                                </button>
                            </>
                        )}
                        {hasApplied && (
                            <div className="bg-amber-50 border border-amber-200 text-amber-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2">
                                <span>⏳</span> Application Pending
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 md:gap-4 border-b border-slate-200/50 pb-[2px]">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`px-4 py-3 font-semibold text-sm md:text-base border-b-2 transition-all ${activeTab === 'details' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                    >
                        Project Details
                    </button>
                    {isHost && (
                        <>
                            <button
                                onClick={() => setActiveTab('applications')}
                                className={`px-4 py-3 font-semibold text-sm md:text-base border-b-2 transition-all flex items-center gap-2 ${activeTab === 'applications' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                            >
                                Applications
                                {project.applications.filter(a => a.status === 'Pending').length > 0 && (
                                    <span className="bg-rose-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                                        {project.applications.filter(a => a.status === 'Pending').length}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('suggestions')}
                                className={`px-4 py-3 font-semibold text-sm md:text-base border-b-2 transition-all flex items-center gap-2 ${activeTab === 'suggestions' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                            >
                                <span className="text-yellow-500">✨</span> AI Match
                            </button>
                            <button
                                onClick={() => setActiveTab('members')}
                                className={`px-4 py-3 font-semibold text-sm md:text-base border-b-2 transition-all ${activeTab === 'members' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                            >
                                Manage Team
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                {activeTab === 'details' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            {editing && isHost && (
                                <div className="bg-amber-50/80 backdrop-blur-sm p-6 rounded-2xl border border-amber-200/50 shadow-sm mb-6">
                                    <h3 className="font-bold text-lg text-amber-800 mb-4 flex items-center gap-2">
                                        <span>✏️</span> Edit Project Settings
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <label className="block text-amber-900/70 text-xs font-bold mb-1 uppercase tracking-wide">Team Size</label>
                                            <input
                                                type="number"
                                                value={editData.teamSize}
                                                onChange={(e) => setEditData({ ...editData, teamSize: parseInt(e.target.value) })}
                                                className="w-full px-4 py-2.5 bg-white border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-amber-900/70 text-xs font-bold mb-1 uppercase tracking-wide">Status</label>
                                            <select
                                                value={editData.status}
                                                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-white border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                            >
                                                <option value="Open">Open</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-amber-900/70 text-xs font-bold mb-1 uppercase tracking-wide">Deadline</label>
                                            <input
                                                type="date"
                                                value={editData.deadline}
                                                onChange={(e) => setEditData({ ...editData, deadline: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-white border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleUpdateProject}
                                        className="w-full bg-amber-500 text-white px-6 py-3 rounded-xl hover:bg-amber-600 font-bold shadow-md hover:shadow-lg transition-all"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            )}

                            <div className="glass-card rounded-3xl p-6 md:p-8 shadow-sm border border-white/60">
                                <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
                                    <span className="text-2xl">📝</span> Overview & Description
                                </h3>
                                <div className="prose max-w-none text-slate-700 leading-relaxed whitespace-pre-line bg-white/40 p-5 rounded-2xl border border-white/50">
                                    {project.description}
                                </div>
                            </div>

                            <div className="glass-card rounded-3xl p-6 md:p-8 shadow-sm border border-white/60">
                                <h3 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                                    <span className="text-2xl">⚡</span> Requirements
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100/50">
                                        <h4 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide">Required Skills</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {project.requiredSkills.map((skill, i) => (
                                                <div key={i} className="bg-white px-3 py-2 rounded-xl text-sm border border-indigo-100 shadow-sm flex flex-col">
                                                    <span className="font-bold text-slate-800">{skill.skill}</span>
                                                    <span className="text-[10px] text-indigo-500 uppercase tracking-widest font-semibold mt-0.5">Min: {skill.minProficiency}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-purple-50/50 p-5 rounded-2xl border border-purple-100/50">
                                        <h4 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide">Open Roles</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {project.requiredRoles.map((role, i) => (
                                                <div key={i} className="bg-white px-3 py-2 rounded-xl text-sm border border-purple-100 shadow-sm flex flex-col">
                                                    <span className="font-bold text-slate-800">{role.role}</span>
                                                    <span className="text-[10px] text-purple-500 uppercase tracking-widest font-semibold mt-0.5">Qty: {role.count}</span>
                                                </div>
                                            ))}
                                            {project.requiredRoles.length === 0 && (
                                                <span className="text-slate-500 text-sm italic">No specific roles defined</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="glass-card rounded-3xl p-6 shadow-sm border border-white/60 text-slate-800 bg-gradient-to-br from-white/80 to-indigo-50/80">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b border-indigo-100 pb-3">
                                    <span>📊</span> Project Logistics
                                </h3>

                                <div className="space-y-4 pt-2">
                                    <div className="flex justify-between items-center bg-white/50 p-3 rounded-xl border border-indigo-50">
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <span className="text-xl">👥</span>
                                            <span className="font-semibold text-sm">Team Size</span>
                                        </div>
                                        <span className="font-bold text-slate-800 text-lg">{project.members.length} / {project.teamSize}</span>
                                    </div>

                                    <div className="px-1 mb-2">
                                        <div className="w-full bg-slate-200/70 rounded-full h-2.5 overflow-hidden shadow-inner flex">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full"
                                                style={{ width: `${(project.members.length / project.teamSize) * 100}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-center text-slate-500 mt-2 font-medium">
                                            {project.teamSize - project.members.length} slots remaining
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-center bg-white/50 p-3 rounded-xl border border-indigo-50">
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <span className="text-xl">⏱️</span>
                                            <span className="font-semibold text-sm">Commitment</span>
                                        </div>
                                        <span className="font-bold text-slate-800 text-sm">{project.weeklyCommitment}</span>
                                    </div>

                                    <div className="flex justify-between items-center bg-white/50 p-3 rounded-xl border border-indigo-50">
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <span className="text-xl">📅</span>
                                            <span className="font-semibold text-sm">Deadline</span>
                                        </div>
                                        <span className="font-bold text-slate-800 text-sm">{new Date(project.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>

                                    <div className="flex justify-between items-center bg-white/50 p-3 rounded-xl border border-indigo-50">
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <span className="text-xl">👑</span>
                                            <span className="font-semibold text-sm">Host Role</span>
                                        </div>
                                        <span className="font-bold text-slate-800 text-sm bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md">{project.hostRole || 'Lead'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card rounded-3xl p-6 shadow-sm border border-white/60">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <span className="text-xl">🤝</span> Current Team
                                </h3>

                                <div className="space-y-3">
                                    {project.members.map((member) => (
                                        <div key={member._id} className="flex items-center justify-between gap-3 p-3 bg-white/60 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setViewingProfile(member)}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 overflow-hidden text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white">
                                                    {member.profile.profilePicture ? (
                                                        <img src={member.profile.profilePicture} alt={member.profile.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        member.profile.name?.charAt(0)?.toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm">{member.profile.name}</p>
                                                    <p className="text-xs text-indigo-500 font-medium">
                                                        {member._id === project.host._id ? 'Project Host' : 'Team Member'}
                                                    </p>
                                                </div>
                                            </div>
                                            {member.contributionScore > 0 && (
                                                <div className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-lg font-bold flex items-center gap-1">
                                                    <span>⭐</span> {member.contributionScore.toFixed(1)}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'applications' && isHost && (
                    <div className="glass-card rounded-3xl p-6 md:p-8 shadow-sm border border-white/60">
                        <h3 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                            <span>📥</span> Pending Applications
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {project.applications.filter(a => a.status === 'Pending').map((app) => (
                                <div key={app.user._id} className="bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-2 h-full bg-indigo-400 opacity-50"></div>
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xl font-bold border-2 border-white shadow-sm ring-2 ring-indigo-50 shrink-0">
                                            {app.user.profile.profilePicture ? (
                                                <img src={app.user.profile.profilePicture} alt={app.user.profile.name} className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                app.user.profile.name?.charAt(0)?.toUpperCase()
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-lg text-slate-800 leading-tight">{app.user.profile.name}</h4>
                                            <p className="text-sm text-indigo-600 font-medium mb-2">@{app.user.username}</p>
                                            <div className="flex flex-wrap gap-1.5 mt-1">
                                                {app.user.profile.skills?.slice(0, 4).map((skill, i) => (
                                                    <span key={i} className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide">
                                                        {skill.name}
                                                    </span>
                                                ))}
                                                {app.user.profile.skills?.length > 4 && (
                                                    <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                                                        +{app.user.profile.skills.length - 4} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-3 border-t border-slate-200/50">
                                        <button
                                            onClick={() => setViewingProfile(app.user)}
                                            className="flex-1 bg-white text-slate-700 border border-slate-200 py-2.5 rounded-xl hover:bg-slate-50 font-bold text-sm transition-colors"
                                        >
                                            Profile
                                        </button>
                                        <button
                                            onClick={() => handleApplication(app.user._id, 'accept')}
                                            className="flex-1 bg-green-500 text-white py-2.5 rounded-xl hover:bg-green-600 font-bold text-sm shadow-sm hover:shadow shadow-green-500/20 transition-all"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleApplication(app.user._id, 'reject')}
                                            className="bg-rose-50 text-rose-600 px-3 py-2.5 rounded-xl hover:bg-rose-100 font-bold text-sm transition-colors"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {project.applications.filter(a => a.status === 'Pending').length === 0 && (
                            <div className="text-center py-12 bg-white/30 rounded-2xl border border-dashed border-slate-300">
                                <div className="text-4xl mb-3 opacity-50">📫</div>
                                <h4 className="text-lg font-bold text-slate-700 mb-1">No pending applications</h4>
                                <p className="text-slate-500 text-sm">New applications will appear here when users apply.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'suggestions' && isHost && (
                    <div className="glass-card rounded-3xl p-6 md:p-8 shadow-sm border border-white/60 bg-gradient-to-br from-white/90 to-amber-50/50">
                        <div className="mb-8 p-5 bg-amber-100/50 rounded-2xl border border-amber-200/50 flex flex-col md:flex-row gap-5 items-center justify-between">
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-2 text-slate-800 flex items-center gap-2">
                                    <span className="text-yellow-500">✨</span> AI Match Suggestions
                                </h3>
                                <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                                    Smart recommendations based on your required skills, roles, user experience levels, and their past contribution ratings on the platform.
                                </p>
                            </div>
                            <div className="w-16 h-16 shrink-0 bg-white rounded-full flex items-center justify-center text-3xl shadow-md rotate-12">
                                🧠
                            </div>
                        </div>

                        <div className="space-y-4">
                            {suggestions.map((candidate, index) => (
                                <div key={candidate.user._id} className="bg-white/80 p-5 rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                    {index === 0 && (
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500"></div>
                                    )}
                                    <div className="flex flex-col md:flex-row gap-5">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="relative">
                                                {index === 0 && (
                                                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm z-10 border-2 border-white">
                                                        1
                                                    </div>
                                                )}
                                                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold border-2 border-white shadow-sm ring-2 ${index === 0 ? 'ring-yellow-400 bg-gradient-to-br from-yellow-400 to-orange-500' : 'ring-indigo-50 bg-gradient-to-br from-blue-400 to-indigo-500'
                                                    }`}>
                                                    {candidate.user.profile.profilePicture ? (
                                                        <img src={candidate.user.profile.profilePicture} alt={candidate.user.profile.name} className="w-full h-full rounded-full object-cover" />
                                                    ) : (
                                                        candidate.user.profile.name?.charAt(0)?.toUpperCase()
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-lg text-slate-800">{candidate.user.profile.name}</h4>
                                                    <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-lg font-bold">
                                                        {(candidate.score * 100).toFixed(0)}% Match
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-500 mb-2">@{candidate.user.username}</p>

                                                <div className="flex flex-wrap gap-2">
                                                    {candidate.user.profile.skills?.slice(0, 4).map((skill, i) => {
                                                        // Highlight skills that match project requirements
                                                        const isMatch = project.requiredSkills.some(req => req.skill.toLowerCase() === skill.name.toLowerCase());
                                                        return (
                                                            <span key={i} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide border ${isMatch
                                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                                    : 'bg-slate-50 text-slate-600 border-slate-200'
                                                                }`}>
                                                                {isMatch && '✓ '}{skill.name}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 md:w-auto w-full pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 md:pl-4 md:border-l">
                                            <button
                                                onClick={() => setViewingProfile(candidate.user)}
                                                className="flex-1 md:flex-none text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-3 rounded-xl font-bold text-sm transition-colors text-center"
                                            >
                                                Profile
                                            </button>
                                            <button
                                                onClick={() => handleSendInvitation(candidate.user._id)}
                                                className="flex-1 md:flex-none bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-3 rounded-xl hover:shadow-lg shadow-indigo-500/30 font-bold text-sm transition-all transform hover:-translate-y-0.5 flex justify-center items-center gap-2 text-center"
                                            >
                                                <span>👋</span> Invite
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {suggestions.length === 0 && (
                            <div className="text-center py-12 bg-white/50 rounded-2xl border border-dashed border-amber-200">
                                <div className="text-4xl mb-3 opacity-50">🔍</div>
                                <h4 className="text-lg font-bold text-slate-700 mb-1">No matches found yet</h4>
                                <p className="text-slate-500 text-sm max-w-sm mx-auto">We couldn't find users matching your skill requirements who are currently available.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'members' && isHost && (
                    <div className="glass-card rounded-3xl p-6 md:p-8 shadow-sm border border-white/60">
                        <h3 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                            <span>👥</span> Manage Team
                        </h3>

                        <div className="space-y-4">
                            {project.members.map((member) => (
                                <div key={member._id} className={`bg-white/60 p-4 md:p-5 rounded-2xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${member._id === project.host._id ? 'border-indigo-300 bg-indigo-50/50' : 'border-slate-200/60'
                                    }`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold border-2 border-white shadow-sm shrink-0 ${member._id === project.host._id ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-blue-400 to-cyan-500'
                                            }`}>
                                            {member.profile.profilePicture ? (
                                                <img src={member.profile.profilePicture} alt={member.profile.name} className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                member.profile.name?.charAt(0)?.toUpperCase()
                                            )}
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-lg text-slate-800 leading-tight">{member.profile.name}</h4>
                                                {member._id === project.host._id && (
                                                    <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Host</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-500 font-medium leading-tight">@{member.username}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 self-start md:self-center w-full md:w-auto border-t md:border-t-0 border-slate-200/50 pt-3 md:pt-0">
                                        <button
                                            onClick={() => setViewingProfile(member)}
                                            className="flex-1 md:flex-none text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors text-center"
                                        >
                                            Profile
                                        </button>

                                        {member._id !== project.host._id && (
                                            <button
                                                onClick={() => setRemoveMemberId(member._id)}
                                                className="text-rose-600 bg-rose-50 hover:bg-rose-100 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors text-center"
                                                title="Remove from project"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Modals using glass effects */}
        {viewingProfile && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up">
                <div className="bg-white rounded-3xl p-0 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
                    <div className="relative h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex justify-end p-4">
                        <button onClick={() => setViewingProfile(null)} className="w-8 h-8 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-colors">
                            ✕
                        </button>
                    </div>

                    <div className="px-8 pb-8 -mt-16">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-5 mb-8">
                            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold shrink-0">
                                {viewingProfile.profile.profilePicture ? (
                                    <img src={viewingProfile.profile.profilePicture} alt={viewingProfile.profile.name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    viewingProfile.profile.name?.charAt(0)?.toUpperCase()
                                )}
                            </div>
                            <div className="text-center md:text-left">
                                <h3 className="text-3xl font-extrabold text-slate-800">{viewingProfile.profile.name}</h3>
                                <p className="text-indigo-600 font-medium text-lg">@{viewingProfile.username}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-2">About</h4>
                                    <p className="text-slate-700 bg-slate-50 p-4 rounded-xl text-sm leading-relaxed border border-slate-100">
                                        {viewingProfile.profile.bio || 'No bio provided.'}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-2">Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {viewingProfile.profile.skills?.length > 0 ? (
                                            viewingProfile.profile.skills.map((skill, i) => (
                                                <span key={i} className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                                                    {skill.name} <span className="text-indigo-400 opacity-60 ml-1">• {skill.proficiency}</span>
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-slate-500 text-sm italic">No skills listed</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100/50">
                                    <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-4">Profile Stats</h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                                            <span className="text-slate-600 text-sm font-medium">Availability</span>
                                            <span className={`px-2 py-1 rounded-md text-xs font-bold ${viewingProfile.profile.availability?.includes('🟢') || viewingProfile.profile.availability === 'Available' ? 'bg-green-100 text-green-700' :
                                                    viewingProfile.profile.availability?.includes('🔴') || viewingProfile.profile.availability === 'Not available' ? 'bg-rose-100 text-rose-700' :
                                                        'bg-amber-100 text-amber-700'
                                                }`}>
                                                {viewingProfile.profile.availability || 'Unknown'}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                                            <span className="text-slate-600 text-sm font-medium">Branch & Year</span>
                                            <span className="font-bold text-sm text-slate-800">
                                                {viewingProfile.profile.branch || 'N/A'} {viewingProfile.profile.year ? `(${viewingProfile.profile.year})` : ''}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                                            <span className="text-slate-600 text-sm font-medium">Active Projects</span>
                                            <span className="font-bold text-sm text-indigo-600">{viewingProfile.activeProjectCount || 0}</span>
                                        </div>

                                        {viewingProfile.contributionScore > 0 && (
                                            <div className="bg-gradient-to-r from-amber-100 to-yellow-50 p-3 rounded-xl shadow-sm border border-amber-200">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-amber-800 text-sm font-bold flex items-center gap-1"><span>⭐</span> Rating</span>
                                                    <span className="font-black text-lg text-amber-600">{viewingProfile.contributionScore.toFixed(1)}<span className="text-xs text-amber-400 font-medium">/5.0</span></span>
                                                </div>
                                                <div className="text-right text-[10px] text-amber-600/70 uppercase tracking-widest font-bold">
                                                    {viewingProfile.totalRatings || 0} Reviews
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {showRatingModal && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up">
                <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl border border-white/20">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                        <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                            <span>⭐</span> Rate Team Members
                        </h2>
                        <button onClick={() => setShowRatingModal(false)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors">
                            ✕
                        </button>
                    </div>

                    <p className="text-slate-600 mb-6 font-medium bg-amber-50 p-3 rounded-xl border border-amber-100 text-sm">
                        Please rate your teammates' contributions to help build their profile scores. Ratings are private.
                    </p>

                    <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 mb-6">
                        {project.members.filter(m => m._id !== project.host._id).length === 0 ? (
                            <div className="text-center py-6 text-slate-500 italic">No other members to rate.</div>
                        ) : (
                            project.members.filter(m => m._id !== project.host._id).map((member) => (
                                <div key={member._id} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 w-full md:w-auto">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold shrink-0">
                                            {member.profile.profilePicture ? (
                                                <img src={member.profile.profilePicture} alt={member.profile.name} className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                member.profile.name?.charAt(0)?.toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm">{member.profile.name}</h4>
                                            <p className="text-xs text-slate-500">@{member.username}</p>
                                        </div>
                                    </div>

                                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-1 w-full md:w-auto justify-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRatings({ ...ratings, [member._id]: star })}
                                                className={`text-2xl transition-transform hover:scale-125 focus:outline-none ${(ratings[member._id] || 0) >= star ? 'text-yellow-400 drop-shadow-sm' : 'text-slate-200 hover:text-yellow-200'
                                                    }`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleRateMembers}
                            className="flex-[2] bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5"
                            disabled={project.members.filter(m => m._id !== project.host._id).length === 0}
                        >
                            Submit Ratings
                        </button>
                        <button
                            onClick={() => setShowRatingModal(false)}
                            className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        )}

        {removeMemberId && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">⚠️</div>
                        <h3 className="text-2xl font-extrabold text-slate-800">Remove Member</h3>
                        <p className="text-slate-500 mt-2 text-sm">Are you sure you want to remove this member from the team?</p>
                    </div>

                    <div className="mb-6">
                        <label className="block text-slate-700 text-sm font-bold mb-2">Provide a reason (optional)</label>
                        <textarea
                            value={removeReason}
                            onChange={(e) => setRemoveReason(e.target.value)}
                            placeholder="Ex: Inactivity, project needs changed..."
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none transition-all"
                            rows="3"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleRemoveMember}
                            className="flex-1 bg-rose-500 text-white font-bold py-3.5 rounded-xl hover:bg-rose-600 hover:shadow-lg shadow-rose-500/30 transition-all"
                        >
                            Confirm Remove
                        </button>
                        <button
                            onClick={() => {
                                setRemoveMemberId(null);
                                setRemoveReason('');
                            }}
                            className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
);
};

export default ProjectDetails;
