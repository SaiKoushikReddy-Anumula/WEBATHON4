import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const SearchUsers = () => {

  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    skills: '',
    availability: '',
    minProjects: '',
    maxProjects: '',
    minScore: '',
    maxScore: ''
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
    <div className="min-h-screen bg-slate-50 relative pb-12">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-600 rounded-b-[4rem] z-0 opacity-90 overflow-hidden">
        <div className="absolute top-10 right-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl mix-blend-overlay"></div>
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-emerald-300 opacity-20 rounded-full blur-3xl mix-blend-overlay"></div>
      </div>

      <nav className="sticky top-4 z-50 mx-4 md:mx-auto max-w-7xl glass rounded-2xl px-6 py-4 shadow-sm border border-white/50 animate-fade-in-up">
        <div className="flex justify-between items-center">
          <Link to="/dashboard">
            <h1 className="text-2xl font-extrabold tracking-tight text-gradient cursor-pointer">Smart Campus</h1>
          </Link>
          <div className="flex gap-4 items-center">
            <Link to="/dashboard" className="text-slate-700 hover:text-emerald-600 font-bold transition-colors">Dashboard</Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto max-w-7xl px-4 relative z-10 pt-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span className="text-4xl">🔍</span> Discover Talent
          </h2>
        </div>

        <form onSubmit={handleSearch} className="glass-card rounded-3xl p-6 md:p-8 shadow-xl border border-white/60 mb-10">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-200/50 pb-4">
            <span className="text-2xl">✨</span>
            <h2 className="text-xl font-bold text-slate-800">Smart Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/50 p-4 rounded-2xl border border-slate-100">
              <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Skills</label>
              <input
                type="text"
                placeholder="e.g. React, Node.js, Python"
                value={filters.skills}
                onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium text-sm"
              />
            </div>

            <div className="bg-white/50 p-4 rounded-2xl border border-slate-100">
              <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Availability</label>
              <select
                value={filters.availability}
                onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium text-sm text-slate-700"
              >
                <option value="">Any Availability</option>
                <option value="Available">Available Full-Time</option>
                <option value="Limited">Limited Availability</option>
                <option value="Not available">Currently Unavailable</option>
              </select>
            </div>

            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50 col-span-1 md:col-span-2 lg:col-span-1">
              <label className="block text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">Experience & Rating</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Projects</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Min / Max</span>
                  </div>
                  <div className="flex gap-2">
                    <input type="number" placeholder="Min" value={filters.minProjects} onChange={(e) => setFilters({ ...filters, minProjects: e.target.value })} className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-lg text-xs" />
                    <input type="number" placeholder="Max" value={filters.maxProjects} onChange={(e) => setFilters({ ...filters, maxProjects: e.target.value })} className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-lg text-xs" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Rating</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Min / Max</span>
                  </div>
                  <div className="flex gap-2">
                    <input type="number" step="0.1" min="1" max="5" placeholder="Min" value={filters.minScore} onChange={(e) => setFilters({ ...filters, minScore: e.target.value })} className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-lg text-xs" />
                    <input type="number" step="0.1" min="1" max="5" placeholder="Max" value={filters.maxScore} onChange={(e) => setFilters({ ...filters, maxScore: e.target.value })} className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-lg text-xs" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3.5 rounded-xl hover:shadow-lg shadow-emerald-500/30 font-bold transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>🔍</span> Filter Talent
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map((user, idx) => (
            <div
              key={user._id}
              className="glass-card rounded-2xl shadow-sm border border-white/60 hover:shadow-xl hover:border-emerald-200 transition-all p-6 group animate-fade-in-up bg-white/60"
              style={{ animationDelay: `${0.1 + (idx * 0.05)}s` }}
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold shadow-sm ring-4 ring-white shrink-0">
                  {user.profile.profilePicture ? (
                    <img src={user.profile.profilePicture} alt={user.profile.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    user.profile.name?.charAt(0)?.toUpperCase()
                  )}
                </div>
                {user.contributionScore > 0 && (
                  <div className="bg-amber-100/80 text-amber-700 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border border-amber-200/50 shadow-sm backdrop-blur-sm">
                    <span>⭐</span> {user.contributionScore.toFixed(1)}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <h3 className="font-extrabold text-xl text-slate-800 leading-tight mb-1">{user.profile.name}</h3>
                <p className="text-sm text-emerald-600 font-medium">@{user.username}</p>
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${user.profile.availability === 'Available' ? 'bg-green-50 text-green-700 border-green-200' :
                  user.profile.availability === 'Limited' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                    'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                  {user.profile.availability || 'Unknown'}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border bg-slate-50 text-slate-600 border-slate-200 flex items-center gap-1">
                  <span>💼</span> {user.activeProjectCount || 0} active
                </span>
              </div>

              <div className="mb-6 h-16">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Top Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {user.profile.skills?.length > 0 ? (
                    <>
                      {user.profile.skills.slice(0, 3).map((skill, i) => (
                        <span key={i} className="text-[11px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-100/50">
                          {skill.name}
                        </span>
                      ))}
                      {user.profile.skills.length > 3 && (
                        <span className="text-[11px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">
                          +{user.profile.skills.length - 3}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-xs text-slate-400 italic">No skills listed</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedUser(user)}
                className="w-full bg-white border-2 border-slate-100 text-slate-700 font-bold py-2.5 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-colors shadow-sm"
              >
                View Profile
              </button>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="glass-card rounded-3xl p-12 shadow-sm border border-white/60 text-center mt-6">
            <div className="text-6xl mb-4 opacity-50">👥</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No talent found</h3>
            <p className="text-slate-500 max-w-md mx-auto">Try adjusting your filters or expanding your search criteria to find the right teammates.</p>
          </div>
        )}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up">
          <div className="bg-white rounded-3xl p-0 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
            <div className="relative h-32 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 flex justify-end p-4">
              <button onClick={() => setSelectedUser(null)} className="w-8 h-8 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-colors">
                ✕
              </button>
            </div>

            <div className="px-8 pb-8 -mt-16">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-5 mb-8">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-4xl font-bold shrink-0">
                  {selectedUser.profile.profilePicture ? (
                    <img src={selectedUser.profile.profilePicture} alt={selectedUser.profile.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    selectedUser.profile.name?.charAt(0)?.toUpperCase()
                  )}
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-3xl font-extrabold text-slate-800">{selectedUser.profile.name}</h3>
                  <p className="text-emerald-600 font-medium text-lg">@{selectedUser.username}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-2">About</h4>
                    <p className="text-slate-700 bg-slate-50 p-4 rounded-xl text-sm leading-relaxed border border-slate-100">
                      {selectedUser.profile.bio || 'No bio provided.'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.profile.skills?.length > 0 ? (
                        selectedUser.profile.skills.map((skill, i) => (
                          <span key={i} className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                            {skill.name} <span className="text-emerald-400 opacity-60 ml-1">• {skill.proficiency}</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 text-sm italic">No skills listed</span>
                      )}
                    </div>
                  </div>

                  {selectedUser.profile.workExperience?.length > 0 && (
                    <div>
                      <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-2">Experience</h4>
                      <div className="space-y-3">
                        {selectedUser.profile.workExperience.map((exp, i) => (
                          <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                            <h5 className="font-bold text-slate-800">{exp.projectName}</h5>
                            <p className="text-xs font-medium text-emerald-600 mb-2">{exp.role} • {exp.duration}</p>
                            <p className="text-[13px] text-slate-600">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="bg-emerald-50/30 p-5 rounded-2xl border border-emerald-100/50">
                    <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-4">Profile Stats</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                        <span className="text-slate-600 text-sm font-medium">Availability</span>
                        <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${selectedUser.profile.availability?.includes('🟢') || selectedUser.profile.availability === 'Available' ? 'bg-green-100 text-green-700' :
                          selectedUser.profile.availability?.includes('🔴') || selectedUser.profile.availability === 'Not available' ? 'bg-rose-100 text-rose-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                          {selectedUser.profile.availability || 'Unknown'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                        <span className="text-slate-600 text-sm font-medium">Branch & Year</span>
                        <span className="font-bold text-sm text-slate-800">
                          {selectedUser.profile.branch || 'N/A'} {selectedUser.profile.year ? `(${selectedUser.profile.year})` : ''}
                        </span>
                      </div>

                      <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                        <span className="text-slate-600 text-sm font-medium">Active Projects</span>
                        <span className="font-bold text-sm text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{selectedUser.activeProjectCount || 0}</span>
                      </div>

                      {selectedUser.contributionScore > 0 && (
                        <div className="bg-gradient-to-r from-amber-100 to-yellow-50 p-3 rounded-xl shadow-sm border border-amber-200">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-amber-800 text-sm font-bold flex items-center gap-1"><span>⭐</span> Rating</span>
                            <span className="font-black text-lg text-amber-600">{selectedUser.contributionScore.toFixed(1)}<span className="text-xs text-amber-400 font-medium">/5.0</span></span>
                          </div>
                          <div className="text-right text-[10px] text-amber-600/70 uppercase tracking-widest font-bold">
                            {selectedUser.totalRatings || 0} Reviews
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
    </div>
  );
};

export default SearchUsers;
