import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(identifier, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-8 animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 relative overflow-visible">
            <div className="relative flex items-center justify-center">
              <span className="text-white text-xl opacity-60 absolute -left-4 top-1 z-0">👤</span>
              <span className="text-white text-3xl z-10">👤</span>
              <span className="text-white text-xl opacity-60 absolute -right-4 top-1 z-0">👤</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Welcome Back</h2>
          <p className="text-slate-600 mt-2">Sign in to continue to Smart Campus</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 animate-fade-in">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-2">Email or Username</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-blue-300"
              placeholder="Enter your email or username"
              required
            />
          </div>
          
          <div>
            <label className="block text-slate-700 font-semibold mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-blue-300"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-600 hover:text-blue-600 transition-colors"
              >
                {showPassword ? '👁️' : '👁️🗨️'}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
          >
            Sign In
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <Link to="/forgot-password" className="text-blue-600 hover:text-indigo-600 font-medium transition-colors">
            Forgot Password?
          </Link>
        </div>
        
        <div className="mt-6 text-center">
          <span className="text-slate-600">Don't have an account? </span>
          <Link to="/signup" className="text-blue-600 hover:text-indigo-600 font-semibold transition-colors">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
