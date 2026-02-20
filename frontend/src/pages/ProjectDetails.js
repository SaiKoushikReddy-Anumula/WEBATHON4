import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data);
      
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

  if (!project) return <div className="p-6">Loading...</div>;

  const isHost = project.host._id === user.id;
  const isMember = project.members.some(m => m._id === user.id);
  const hasApplied = project.applications.some(a => a.user._id === user.id);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">{project.title}</h2>
              <p className="text-gray-600">Host: {project.host.profile.name}</p>
            </div>
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
                </>
              )}
            </div>
          </div>

          {activeTab === 'details' && (
            <div className="space-y-6">
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
                    <div key={member._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-semibold">{member.profile.name}</p>
                        <p className="text-sm text-gray-600">@{member.username}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'applications' && isHost && (
            <div className="space-y-4">
              {project.applications.filter(a => a.status === 'Pending').map((app) => (
                <div key={app.user._id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start">
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
                    <div className="flex gap-2">
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
              <p className="text-gray-600 mb-4">AI-powered candidate suggestions based on skills, experience, and fairness</p>
              {suggestions.map((candidate, index) => (
                <div key={candidate.user._id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">#{index + 1} {candidate.user.profile.name}</h4>
                      <p className="text-sm text-gray-600">@{candidate.user.username}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Match Score: {(candidate.score * 100).toFixed(1)}%
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {candidate.user.profile.skills?.slice(0, 5).map((skill, i) => (
                          <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {skill.name} - {skill.proficiency}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {suggestions.length === 0 && (
                <p className="text-gray-600 text-center py-8">No suggestions available</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
