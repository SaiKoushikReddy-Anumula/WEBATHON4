import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    profilePicture: '',
    branch: '',
    year: '',
    bio: '',
    skills: [],
    interests: [],
    workExperience: [],
    availability: 'Available'
  });
  const [newSkill, setNewSkill] = useState({ name: '', proficiency: 'Beginner' });

  useEffect(() => {
    if (user?.profile) {
      setProfile(user.profile);
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const { data } = await api.put('/users/profile', profile);
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const addSkill = () => {
    if (newSkill.name) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill]
      });
      setNewSkill({ name: '', proficiency: 'Beginner' });
    }
  };

  const removeSkill = (index) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="container mx-auto max-w-4xl">
        <button onClick={() => navigate(-1)} className="mb-4 text-gray-600 hover:text-blue-600 flex items-center">
          ← Back
        </button>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">My Profile</h2>
            <button
              onClick={() => editing ? handleSave() : setEditing(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition"
            >
              {editing ? 'Save' : 'Edit'}
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {profile.profilePicture ? (
                    <img src={profile.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    profile.name?.charAt(0)?.toUpperCase() || '?'
                  )}
                </div>
              </div>
              <div className="flex-1">
                {editing && (
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Profile Picture URL</label>
                    <input
                      type="text"
                      value={profile.profilePicture}
                      onChange={(e) => setProfile({ ...profile, profilePicture: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                disabled={!editing}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Branch</label>
                <input
                  type="text"
                  value={profile.branch}
                  onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
                  disabled={!editing}
                  className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Year</label>
                <input
                  type="text"
                  value={profile.year}
                  onChange={(e) => setProfile({ ...profile, year: e.target.value })}
                  disabled={!editing}
                  className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                disabled={!editing}
                rows="4"
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Availability</label>
              <select
                value={profile.availability}
                onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
                disabled={!editing}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
              >
                <option value="Available">Available</option>
                <option value="Limited">Limited</option>
                <option value="Not available">Not available</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Skills</label>
              <div className="space-y-2">
                {profile.skills?.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                    <span className="flex-1">{skill.name}</span>
                    <span className="text-sm text-gray-600">{skill.proficiency}</span>
                    {editing && (
                      <button
                        onClick={() => removeSkill(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {editing && (
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Skill name"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    className="flex-1 px-3 py-2 border rounded-lg"
                  />
                  <select
                    value={newSkill.proficiency}
                    onChange={(e) => setNewSkill({ ...newSkill, proficiency: e.target.value })}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <button
                    onClick={addSkill}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">Statistics</h3>
              <p>Active Projects: {user?.activeProjectCount || 0}</p>
              <p>Selection Frequency: {user?.selectionFrequency || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
