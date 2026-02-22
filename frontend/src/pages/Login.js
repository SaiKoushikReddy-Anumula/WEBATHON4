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
    <div className="min-h-screen flex items-center justify-center bg-animated-gradient p-4">
      <div className="max-w-md w-full glass-card rounded-2xl p-8 relative overflow-hidden animate-fade-in-up">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-blue-400 opacity-20 blur-xl"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-purple-400 opacity-20 blur-xl"></div>
        
        <h2 className="text-4xl font-extrabold text-center mb-8 text-slate-800 tracking-tight">
          Welcome <span className="text-gradient">Back</span>
        </h2>
        
        {error && (
          <div className="bg-red-50/80 backdrop-blur-sm border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6 text-sm flex items-center font-medium">
            <span className="mr-2">⚠️</span> {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="relative z-10">
          <div className="mb-5">
            <label className="block text-slate-700 text-sm font-semibold mb-2">Email or Username</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all duration-300"
              placeholder="Enter your email or username"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-slate-700 text-sm font-semibold mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all duration-300 pr-10"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-indigo-600 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? '🫣' : '👁️'}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-xl hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Login
          </button>
        </form>
        
        <div className="mt-6 flex flex-col space-y-3 text-center text-sm">
          <Link to="/forgot-password" className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline transition-colors w-max mx-auto">
            Forgot Password?
          </Link>
          
          <div className="text-slate-500 pt-2 border-t border-slate-200/50">
            <span>Don't have an account? </span>
            <Link to="/signup" className="text-indigo-600 font-bold hover:text-indigo-800 hover:underline transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
