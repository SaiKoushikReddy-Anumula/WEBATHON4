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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <button onClick={() => navigate(-1)} className="mb-4 text-gray-600 hover:text-blue-600">
            ← Back
          </button>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">{project.title}</h2>
              <p className="text-gray-600">Host: {project.host.profile.name}</p>
            </div>
            <div className="flex gap-2">
              {!isHost && !isMember && !hasApplied && (
                <button
                  onClick={handleApply}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Apply
                </button>
              )}
              {isMember && (
                <Link
                  to={`/workspace/${id}`}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                  Open Workspace
                </Link>
              )}
              {isHost && (
                <>
                  <button
                    onClick={() => setEditing(!editing)}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
                  >
                    {editing ? 'Cancel' : 'Edit'}
                  </button>
                  {project.status === 'Completed' && (
                    <button
                      onClick={() => setShowRatingModal(true)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                    >
                      Rate Members
                    </button>
                  )}
                  <button
                    onClick={handleDeleteProject}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Terminate
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="border-b mb-6">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2 ${activeTab === 'details' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              >
                Details
              </button>
              {isHost && (
                <>
                  <button
                    onClick={() => setActiveTab('applications')}
                    className={`pb-2 ${activeTab === 'applications' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                  >
                    Applications ({project.applications.filter(a => a.status === 'Pending').length})
                  </button>
                  <button
                    onClick={() => setActiveTab('suggestions')}
                    className={`pb-2 ${activeTab === 'suggestions' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                  >
                    AI Suggestions
                  </button>
                  <button
                    onClick={() => setActiveTab('members')}
                    className={`pb-2 ${activeTab === 'members' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                  >
                    Manage Members
                  </button>
                </>
              )}
            </div>
          </div>

          {activeTab === 'details' && (
            <div className="space-y-6">
              {editing && isHost ? (
                <div className="bg-yellow-50 p-4 rounded-lg space-y-4">
                  <h3 className="font-semibold text-lg">Edit Project</h3>
                  <div>
                    <label className="block text-gray-700 mb-2">Team Size</label>
                    <input
                      type="number"
                      value={editData.teamSize}
                      onChange={(e) => setEditData({ ...editData, teamSize: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Status</label>
                    <select
                      value={editData.status}
                      onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Deadline</label>
                    <input
                      type="date"
                      value={editData.deadline}
                      onChange={(e) => setEditData({ ...editData, deadline: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <button
                    onClick={handleUpdateProject}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              ) : null}
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-gray-700">{project.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Category</h3>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">{project.category}</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Team Size</h3>
                  <p>{project.members.length}/{project.teamSize}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Deadline</h3>
                  <p>{new Date(project.deadline).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Weekly Commitment</h3>
                  <p>{project.weeklyCommitment}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {project.requiredSkills.map((skill, i) => (
                    <span key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm">
                      {skill.skill} (Min: {skill.minProficiency})
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Team Members</h3>
                <p className="text-gray-700 mb-2">{project.members.length}/{project.teamSize} members</p>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${(project.members.length / project.teamSize) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {project.teamSize - project.members.length} slots remaining
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Host Role</h3>
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded">{project.hostRole || 'Project Lead'}</span>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Required Roles</h3>
                <div className="flex flex-wrap gap-2">
                  {project.requiredRoles.map((role, i) => (
                    <span key={i} className="bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm">
                      {role.role} (x{role.count})
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Team Members</h3>
                <div className="space-y-2">
                  {project.members.map((member) => (
                    <div key={member._id} className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                          {member.profile.profilePicture ? (
                            <img src={member.profile.profilePicture} alt={member.profile.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            member.profile.name?.charAt(0)?.toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">{member.profile.name}</p>
                          <p className="text-sm text-gray-600">@{member.username}</p>
                          {member.contributionScore && (
                            <p className="text-xs text-yellow-600">⭐ {member.contributionScore.toFixed(1)}/5.0</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {removeMemberId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full">
                    <h3 className="text-xl font-bold mb-4">Remove Member</h3>
                    <p className="text-gray-600 mb-4">Optionally provide a reason for removing this member:</p>
                    <textarea
                      value={removeReason}
                      onChange={(e) => setRemoveReason(e.target.value)}
                      placeholder="Reason for removal (optional)..."
                      className="w-full px-3 py-2 border rounded-lg mb-4"
                      rows="3"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleRemoveMember}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                      >
                        Confirm Remove
                      </button>
                      <button
                        onClick={() => {
                          setRemoveMemberId(null);
                          setRemoveReason('');
                        }}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'applications' && isHost && (
            <div className="space-y-4">
              {project.applications.filter(a => a.status === 'Pending').map((app) => (
                <div key={app.user._id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                        {app.user.profile.profilePicture ? (
                          <img src={app.user.profile.profilePicture} alt={app.user.profile.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          app.user.profile.name?.charAt(0)?.toUpperCase()
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold">{app.user.profile.name}</h4>
                        <p className="text-sm text-gray-600">@{app.user.username}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {app.user.profile.skills?.slice(0, 5).map((skill, i) => (
                            <span key={i} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                              {skill.name} - {skill.proficiency}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewingProfile(app.user)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => handleApplication(app.user._id, 'accept')}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleApplication(app.user._id, 'reject')}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {project.applications.filter(a => a.status === 'Pending').length === 0 && (
                <p className="text-gray-600 text-center py-8">No pending applications</p>
              )}
            </div>
          )}

          {activeTab === 'suggestions' && isHost && (
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">AI-powered candidate suggestions based on skills, experience, contribution score, and fairness</p>
              {suggestions.map((candidate, index) => (
                <div key={candidate.user._id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-xl font-bold">
                        {candidate.user.profile.profilePicture ? (
                          <img src={candidate.user.profile.profilePicture} alt={candidate.user.profile.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          candidate.user.profile.name?.charAt(0)?.toUpperCase()
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold">#{index + 1} {candidate.user.profile.name}</h4>
                        <p className="text-sm text-gray-600">@{candidate.user.username}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Match Score: {(candidate.score * 100).toFixed(1)}%
                        </p>
                        {candidate.user.contributionScore && (
                          <p className="text-sm text-yellow-600">⭐ Contribution: {candidate.user.contributionScore.toFixed(1)}/5.0</p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {candidate.user.profile.skills?.slice(0, 5).map((skill, i) => (
                            <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {skill.name} - {skill.proficiency}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewingProfile(candidate.user)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => handleSendInvitation(candidate.user._id)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Invite
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {suggestions.length === 0 && (
                <p className="text-gray-600 text-center py-8">No suggestions available</p>
              )}
            </div>
          )}

          {activeTab === 'members' && isHost && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Manage Team Members</h3>
              {project.members.map((member) => (
                <div key={member._id} className="border p-4 rounded-lg">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                        {member.profile.profilePicture ? (
                          <img src={member.profile.profilePicture} alt={member.profile.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          member.profile.name?.charAt(0)?.toUpperCase()
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold">{member.profile.name}</h4>
                        <p className="text-sm text-gray-600">@{member.username}</p>
                        {member.contributionScore && (
                          <p className="text-sm text-yellow-600">⭐ {member.contributionScore.toFixed(1)}/5.0</p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {member.profile.skills?.slice(0, 5).map((skill, i) => (
                            <span key={i} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                              {skill.name} - {skill.proficiency}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewingProfile(member)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        View Profile
                      </button>
                      {member._id !== project.host._id && (
                        <button
                          onClick={() => setRemoveMemberId(member._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {viewingProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">User Profile</h2>
              <button onClick={() => setViewingProfile(null)} className="text-gray-600 hover:text-gray-800 text-2xl">×</button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                {viewingProfile.profile.profilePicture ? (
                  <img src={viewingProfile.profile.profilePicture} alt={viewingProfile.profile.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  viewingProfile.profile.name?.charAt(0)?.toUpperCase()
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold">{viewingProfile.profile.name}</h3>
                <p className="text-gray-600">@{viewingProfile.username}</p>
                <p className="text-sm text-gray-500">{viewingProfile.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Bio</h4>
                <p className="text-gray-700">{viewingProfile.profile.bio || 'No bio provided'}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Details</h4>
                <p className="text-sm text-gray-700">Branch: {viewingProfile.profile.branch || 'N/A'}</p>
                <p className="text-sm text-gray-700">Year: {viewingProfile.profile.year || 'N/A'}</p>
                <p className="text-sm text-gray-700">Availability: {viewingProfile.profile.availability}</p>
                <p className="text-sm text-gray-700">Active Projects: {viewingProfile.activeProjectCount}</p>
                {viewingProfile.contributionScore && (
                  <p className="text-sm text-yellow-600 font-semibold">⭐ Contribution Score: {viewingProfile.contributionScore.toFixed(1)}/5.0 ({viewingProfile.totalRatings || 0} ratings)</p>
                )}
              </div>

              <div>
                <h4 className="font-semibold mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {viewingProfile.profile.skills?.map((skill, i) => (
                    <span key={i} className="bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm">
                      {skill.name} - {skill.proficiency}
                    </span>
                  ))}
                </div>
              </div>

              {viewingProfile.profile.workExperience?.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Work Experience</h4>
                  {viewingProfile.profile.workExperience.map((exp, i) => (
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

      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">Rate Team Members</h2>
              <button onClick={() => setShowRatingModal(false)} className="text-gray-600 hover:text-gray-800 text-2xl">×</button>
            </div>

            <p className="text-gray-600 mb-6">Rate each member's contribution to the project (1-5 stars)</p>

            <div className="space-y-4">
              {project.members.filter(m => m._id !== project.host._id).map((member) => (
                <div key={member._id} className="border p-4 rounded-lg">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                      {member.profile.profilePicture ? (
                        <img src={member.profile.profilePicture} alt={member.profile.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        member.profile.name?.charAt(0)?.toUpperCase()
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold">{member.profile.name}</h4>
                      <p className="text-sm text-gray-600">@{member.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold">Rating:</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRatings({ ...ratings, [member._id]: star })}
                          className={`text-2xl ${
                            ratings[member._id] >= star ? 'text-yellow-500' : 'text-gray-300'
                          } hover:text-yellow-400`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    {ratings[member._id] && (
                      <span className="text-sm text-gray-600 ml-2">{ratings[member._id]}/5</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleRateMembers}
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
              >
                Submit Ratings
              </button>
              <button
                onClick={() => setShowRatingModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
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
