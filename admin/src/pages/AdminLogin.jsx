import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAdminAuth();

  const isLocalDevelopment = import.meta.env.DEV
    && ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const [email, setEmail] = useState(
    isLocalDevelopment ? import.meta.env.VITE_ADMIN_DEMO_EMAIL || '' : ''
  );
  const [password, setPassword] = useState(
    isLocalDevelopment ? import.meta.env.VITE_ADMIN_DEMO_PASSWORD || '' : ''
  );
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const ok = await login(email, password);
      if (ok) {
        navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy text-softWhite flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background glow orbs */}
      <div className="absolute w-[500px] h-[500px] bg-orange/20 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-80 h-80 bg-orange-glow/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="relative w-full max-w-md rounded-3xl glass-card border border-white/20 p-8 shadow-2xl">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <img
            src="/images/orange-cabs-premium-logo.png"
            alt="Orange Cabs — Premium Chauffeur & Mobility"
            className="mx-auto mb-5 h-24 w-full max-w-[18rem] rounded-xl bg-white object-contain p-2"
          />
          <span className="inline-flex rounded-md bg-brandRed/10 px-2 py-0.5 text-xs font-semibold tracking-wide text-brandRed">
            ADMIN PORTAL
          </span>
          <p className="text-xs text-gray-400 mt-2">
            Centralized Dispatch & Operations Console
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="block text-xs font-semibold text-gray-300 mb-1.5">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-xs font-semibold text-gray-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your admin password"
                className="w-full pl-10 pr-11 py-2.5 rounded-xl glass-input text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-shine w-full mt-2 py-3 rounded-xl bg-orange hover:bg-orange-glow text-white font-bold text-sm shadow-glow-orange flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-white/10 text-center">
          <p className="text-[11px] text-gray-400">
            Sign in with the administrator account configured for this installation.
          </p>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
