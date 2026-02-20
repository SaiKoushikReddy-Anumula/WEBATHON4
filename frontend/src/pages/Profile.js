import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">My Profile</h2>
            <button
              onClick={() => editing ? handleSave() : setEditing(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              {editing ? 'Save' : 'Edit'}
            </button>
          </div>

          <div className="space-y-6">
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
