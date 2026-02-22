import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const data = await signup(formData);
      setSuccess(data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-animated-gradient p-4">
      <div className="max-w-md w-full glass-card rounded-2xl p-8 relative overflow-hidden animate-fade-in-up">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 -ml-8 -mt-8 w-32 h-32 rounded-full bg-pink-400 opacity-20 blur-xl"></div>
        <div className="absolute bottom-0 right-0 -mr-8 -mb-8 w-32 h-32 rounded-full bg-indigo-400 opacity-20 blur-xl"></div>

        <h2 className="text-4xl font-extrabold text-center mb-8 text-slate-800 tracking-tight">
          Create <span className="text-gradient">Account</span>
        </h2>

        {error && (
          <div className="bg-red-50/80 backdrop-blur-sm border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-center font-medium">
            <span className="mr-2">⚠️</span> {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50/80 backdrop-blur-sm border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-center font-medium">
            <span className="mr-2">✅</span> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative z-10">
          <div className="mb-4">
            <label className="block text-slate-700 text-sm font-semibold mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/50 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all duration-300"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-slate-700 text-sm font-semibold mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/50 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all duration-300"
              placeholder="johndoe123"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-slate-700 text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/50 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all duration-300"
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-slate-700 text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/50 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all duration-300"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-xl hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-200/50 text-center text-sm">
          <span className="text-slate-500">Already have an account? </span>
          <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-800 hover:underline transition-colors">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
