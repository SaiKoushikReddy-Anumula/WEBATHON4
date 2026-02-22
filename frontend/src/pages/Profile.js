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
    <div className="min-h-screen bg-slate-50 relative pb-12">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-br from-purple-600 via-pink-500 to-rose-500 rounded-b-[4rem] z-0 opacity-90 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl mix-blend-overlay"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-yellow-400 opacity-20 rounded-full blur-3xl mix-blend-overlay"></div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 relative z-10 pt-10 animate-fade-in-up">
        <button onClick={() => navigate(-1)} className="mb-6 mt-2 text-white/90 hover:text-white flex items-center gap-2 font-medium transition-colors bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20 w-max">
          <span>←</span> Back
        </button>

        <div className="glass-card rounded-3xl p-8 shadow-2xl border border-white/60">
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-200/50">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
              <span className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">My Profile</span>
            </h2>
            <button
              onClick={() => editing ? handleSave() : setEditing(true)}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 shadow-md flex items-center gap-2 ${editing
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/30'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-indigo-600'
                }`}
            >
              {editing ? (
                <><span>💾</span> Save Changes</>
              ) : (
                <><span>✏️</span> Edit Profile</>
              )}
            </button>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 bg-slate-50/50 p-6 rounded-2xl border border-slate-200/50">
              <div className="relative group">
                <div className="w-36 h-36 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-5xl font-bold shadow-xl border-4 border-white overflow-hidden">
                  {profile.profilePicture ? (
                    <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    profile.name?.charAt(0)?.toUpperCase() || '?'
                  )}
                </div>
                {editing && (
                  <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-2xl">📷</span>
                    <span className="text-xs font-bold mt-1">Change</span>
                  </div>
                )}
              </div>
              <div className="flex-1 w-full">
                {editing ? (
                  <div className="space-y-3 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                    <label className="block text-slate-700 text-sm font-bold">Profile Picture URL</label>
                    <input
                      type="text"
                      value={profile.profilePicture}
                      onChange={(e) => setProfile({ ...profile, profilePicture: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm transition-all"
                    />
                    <div className="relative overflow-hidden inline-block w-full">
                      <button className="w-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold py-2.5 px-4 rounded-lg border border-indigo-200 transition-colors text-sm flex items-center justify-center gap-2">
                        <span>📤</span> Upload from device
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setProfile({ ...profile, profilePicture: reader.result });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="absolute left-0 top-0 right-0 bottom-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-3xl font-extrabold text-slate-800">{profile.name || 'Anonymous User'}</h3>
                    <p className="text-indigo-600 font-medium text-lg mt-1">{user?.username ? `@${user.username}` : ''}</p>
                    <div className="flex gap-3 mt-3">
                      <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                        {profile.branch || 'No Branch'}
                      </span>
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                        {profile.year ? `Year ${profile.year}` : 'No Year'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white/40 p-5 rounded-2xl border border-white/50 shadow-sm">
                  <label className="block text-slate-700 text-sm font-bold mb-3 flex items-center gap-2">
                    <span className="text-lg">👤</span> Personal Details
                  </label>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-slate-500 text-xs font-semibold mb-1 uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        disabled={!editing}
                        className="w-full px-4 py-2.5 bg-white/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:bg-slate-50 disabled:text-slate-600 disabled:border-slate-100 transition-all font-medium"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-500 text-xs font-semibold mb-1 uppercase tracking-wider">Branch</label>
                        <input
                          type="text"
                          value={profile.branch}
                          onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
                          disabled={!editing}
                          className="w-full px-4 py-2.5 bg-white/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:bg-slate-50 disabled:text-slate-600 disabled:border-slate-100 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 text-xs font-semibold mb-1 uppercase tracking-wider">Year</label>
                        <input
                          type="text"
                          value={profile.year}
                          onChange={(e) => setProfile({ ...profile, year: e.target.value })}
                          disabled={!editing}
                          className="w-full px-4 py-2.5 bg-white/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:bg-slate-50 disabled:text-slate-600 disabled:border-slate-100 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-500 text-xs font-semibold mb-1 uppercase tracking-wider">Availability</label>
                      <select
                        value={profile.availability}
                        onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
                        disabled={!editing}
                        className="w-full px-4 py-2.5 bg-white/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:bg-slate-50 disabled:text-slate-600 disabled:border-slate-100 disabled:appearance-none transition-all"
                      >
                        <option value="Available">🟢 Available to join projects</option>
                        <option value="Limited">🟡 Limited availability</option>
                        <option value="Not available">🔴 Not available right now</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-white/40 p-5 rounded-2xl border border-white/50 shadow-sm">
                  <label className="block text-slate-700 text-sm font-bold mb-3 flex items-center gap-2">
                    <span className="text-lg">📝</span> Bio / About Me
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    disabled={!editing}
                    rows="5"
                    className="w-full px-4 py-3 bg-white/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:bg-slate-50 disabled:text-slate-600 disabled:border-slate-100 transition-all resize-none leading-relaxed"
                    placeholder="Tell others about yourself, your goals, and what you're looking for..."
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white/40 p-5 rounded-2xl border border-white/50 shadow-sm h-full flex flex-col">
                  <label className="block text-slate-700 text-sm font-bold mb-3 flex items-center gap-2">
                    <span className="text-lg">🛠️</span> Skills & Proficiencies
                  </label>

                  <div className="flex-1 space-y-2 max-h-64 overflow-y-auto pr-2 mb-4">
                    {profile.skills?.length === 0 ? (
                      <p className="text-slate-400 text-sm italic text-center py-4 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">No skills added yet</p>
                    ) : (
                      profile.skills?.map((skill, index) => (
                        <div key={index} className="flex items-center justify-between gap-2 bg-indigo-50/80 border border-indigo-100 p-3 rounded-xl text-sm transition-all hover:bg-indigo-100">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800">{skill.name}</span>
                            <span className="text-xs text-indigo-600 font-medium">{skill.proficiency}</span>
                          </div>
                          {editing && (
                            <button
                              onClick={() => removeSkill(index)}
                              className="w-8 h-8 rounded-full bg-white text-rose-500 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center transition-colors shadow-sm"
                              title="Remove skill"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {editing && (
                    <div className="flex flex-col space-y-3 p-4 bg-slate-50/50 rounded-xl border border-slate-200/50 mt-auto">
                      <input
                        type="text"
                        placeholder="New skill (e.g. React, Python)"
                        value={newSkill.name}
                        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                      />
                      <div className="flex gap-2">
                        <select
                          value={newSkill.proficiency}
                          onChange={(e) => setNewSkill({ ...newSkill, proficiency: e.target.value })}
                          className="flex-1 px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                        <button
                          onClick={addSkill}
                          className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 font-medium transition-colors text-sm"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 relative overflow-hidden bg-gradient-to-r from-slate-900 to-indigo-900 rounded-2xl p-8 shadow-xl border border-indigo-500/30">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 opacity-20 rounded-full blur-3xl -mr-20 -mt-20"></div>

              <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2 relative z-10">
                <span>📈</span> My Statistics
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 flex flex-col items-center justify-center text-center">
                  <div className="text-3xl mb-2 text-yellow-400">⭐</div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {user?.contributionScore?.toFixed(1) || '0.0'}
                  </div>
                  <div className="text-xs text-slate-300 font-medium uppercase tracking-wider">Score</div>
                  <div className="text-[10px] text-slate-400 mt-1">({user?.totalRatings || 0} ratings)</div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 flex flex-col items-center justify-center text-center">
                  <div className="text-3xl mb-2 text-blue-400">🚀</div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {user?.activeProjectCount || 0}
                  </div>
                  <div className="text-xs text-slate-300 font-medium uppercase tracking-wider">Active</div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 flex flex-col items-center justify-center text-center">
                  <div className="text-3xl mb-2 text-green-400">✅</div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {user?.completedProjectsCount || 0}
                  </div>
                  <div className="text-xs text-slate-300 font-medium uppercase tracking-wider">Completed</div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 flex flex-col items-center justify-center text-center">
                  <div className="text-3xl mb-2 text-purple-400">🎯</div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {user?.selectionFrequency || 0}
                  </div>
                  <div className="text-xs text-slate-300 font-medium uppercase tracking-wider">Selections</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
