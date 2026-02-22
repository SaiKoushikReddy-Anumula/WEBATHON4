import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setMessage(data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const { data } = await api.post('/auth/reset-password', { email, otp, newPassword });
      setMessage(data.message);
      setTimeout(() => window.location.href = '/login', 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-animated-gradient p-4">
      <div className="max-w-md w-full glass-card rounded-2xl p-8 relative overflow-hidden animate-fade-in-up">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-amber-400 opacity-20 blur-xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-rose-400 opacity-20 blur-xl"></div>

        <h2 className="text-4xl font-extrabold text-center mb-8 text-slate-800 tracking-tight">
          Reset <span className="text-gradient">Password</span>
        </h2>

        {error && (
          <div className="bg-red-50/80 backdrop-blur-sm border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-center font-medium">
            <span className="mr-2">⚠️</span> {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50/80 backdrop-blur-sm border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-center font-medium">
            <span className="mr-2">✅</span> {message}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="relative z-10">
            <div className="mb-6">
              <label className="block text-slate-700 text-sm font-semibold mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all duration-300"
                placeholder="Enter your registered email"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-xl hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Send Reset Link
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="relative z-10">
            <div className="mb-5">
              <label className="block text-slate-700 text-sm font-semibold mb-2">OTP / Reset Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all duration-300 text-center tracking-widest font-mono text-lg"
                placeholder="000000"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-slate-700 text-sm font-semibold mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all duration-300"
                placeholder="Enter new password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-xl hover:shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Confirm New Password
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-200/50 text-center text-sm">
          <Link to="/login" className="text-slate-500 font-medium hover:text-indigo-600 transition-colors flex items-center justify-center gap-2">
            <span>←</span> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
