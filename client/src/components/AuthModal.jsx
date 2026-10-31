import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, Phone, User, KeyRound, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal = () => {
  const { isAuthOpen, setIsAuthOpen, authMode, setAuthMode, login, register, loginOtp } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    otp: ''
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (authMode === 'login') {
        await login(formData.email, formData.password);
      } else if (authMode === 'register') {
        await register(formData.name, formData.email, formData.phone, formData.password);
      } else if (authMode === 'otp') {
        await loginOtp(formData.phone, formData.otp);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md rounded-2xl glass-card border border-white/20 p-6 sm:p-8 shadow-2xl overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={() => setIsAuthOpen(false)}
            className="absolute top-5 right-5 p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center mb-6">
            <h3 className="font-heading font-extrabold text-2xl text-softWhite">
              {authMode === 'login' && 'Welcome Back'}
              {authMode === 'register' && 'Create Your Account'}
              {authMode === 'otp' && 'Instant OTP Login'}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {authMode === 'login' && 'Sign in to access your ride bookings & invoices'}
              {authMode === 'register' && 'Join Orange Cabs for seamless intercity travels'}
              {authMode === 'otp' && 'Fast access via 4-digit code (use 1234 for demo)'}
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex rounded-xl bg-white/5 p-1 mb-6 border border-white/10">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                authMode === 'login' ? 'bg-orange text-white shadow-glow-orange' : 'text-gray-400 hover:text-white'
              }`}
            >
              Password
            </button>
            <button
              onClick={() => setAuthMode('otp')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                authMode === 'otp' ? 'bg-orange text-white shadow-glow-orange' : 'text-gray-400 hover:text-white'
              }`}
            >
              Quick OTP
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                authMode === 'register' ? 'bg-orange text-white shadow-glow-orange' : 'text-gray-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Rohit Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>
              </div>
            )}

            {authMode !== 'otp' && (
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="user@orangecab.in"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>
              </div>
            )}

            {(authMode === 'register' || authMode === 'otp') && (
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 99999 99999"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>
              </div>
            )}

            {authMode === 'otp' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-gray-300">Enter OTP</label>
                  <span className="text-[11px] text-orange">Demo OTP: 1234</span>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="otp"
                    required
                    maxLength={6}
                    placeholder="1234"
                    value={formData.otp}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm tracking-widest font-mono text-center"
                  />
                </div>
              </div>
            )}

            {authMode !== 'otp' && (
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3 rounded-xl bg-orange hover:bg-orange-glow text-white font-semibold text-sm shadow-glow-orange transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {authMode === 'login' && 'Sign In to Orange Cabs'}
                    {authMode === 'register' && 'Complete Registration'}
                    {authMode === 'otp' && 'Verify & Continue'}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Reminder */}
          {authMode === 'login' && (
            <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-400 text-center">
              <span>Demo Customer Login: </span>
              <button 
                type="button"
                onClick={() => setFormData({ ...formData, email: 'user@orangecab.in', password: 'User@123' })}
                className="text-orange font-semibold hover:underline inline-flex items-center gap-1"
              >
                user@orangecab.in / User@123 (Auto fill)
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
