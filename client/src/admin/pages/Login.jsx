import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import '../styles/admin.css';

export default function Login() {
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setError('Please enter both your email address and password.');
      return;
    }

    setError('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      await login(loginEmail, loginPassword);
      setSuccessMsg('Authentication successful! Opening dashboard...');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 400);
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setLoginEmail('admin@skbtravels.com');
    setLoginPassword('admin123');
    setError('');
    setSuccessMsg('');
  };

  return (
    <div className="admin-login-page-wrapper">
      {/* Decorative background glow circles */}
      <div
        style={{
          position: 'absolute',
          width: 550,
          height: 550,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(231, 184, 77, 0.14) 0%, transparent 70%)',
          top: '-12%',
          right: '-6%',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          bottom: '-12%',
          left: '-6%',
          pointerEvents: 'none',
        }}
      />

      <div className="admin-login-card">
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: 64,
              height: 64,
              margin: '0 auto 0.85rem',
              borderRadius: 16,
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 8px 22px rgba(231, 184, 77, 0.4)',
              border: '2px solid #E7B84D',
            }}
          >
            <img
              src="/assets/images/skb-logo.jpeg"
              alt="SKB Tour and Travels"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#071426',
              fontFamily: 'Manrope, sans-serif',
              marginBottom: '0.25rem',
            }}
          >
            SKB Tour and Travels
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Administrator Access & Control Console
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              padding: '0.75rem 0.95rem',
              borderRadius: 8,
              fontSize: '0.82rem',
              marginBottom: '1.25rem',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Success notification */}
        {successMsg && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#047857',
              padding: '0.75rem 0.95rem',
              borderRadius: 8,
              fontSize: '0.82rem',
              marginBottom: '1.25rem',
            }}
          >
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ===================== SIGN IN FORM ===================== */}
        <form onSubmit={handleLoginSubmit}>
          <div className="admin-form-group" style={{ marginBottom: '1.15rem' }}>
            <label className="admin-form-label">Admin Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                }}
              />
              <input
                type="email"
                placeholder="admin@skbtravels.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="admin-form-input"
                style={{ paddingLeft: '2.5rem' }}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="admin-form-group" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="admin-form-label">Password</label>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Secure session</span>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                }}
              />
              <input
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="admin-form-input"
                style={{ paddingLeft: '2.5rem' }}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-admin-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '0.75rem',
              fontSize: '0.95rem',
            }}
          >
            <span>{submitting ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Quick Demo Helper / Back to Home */}
        <div
          style={{
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            alignItems: 'center',
          }}
        >
          <button
            type="button"
            onClick={handleFillDemo}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '0.5rem 0.95rem',
              borderRadius: 8,
              fontSize: '0.78rem',
              color: '#334155',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 600,
            }}
          >
            <ShieldCheck size={14} className="text-gold" />
            <span>Fill Default Admin Credentials</span>
          </button>

          <Link
            to="/"
            style={{
              fontSize: '0.78rem',
              color: '#94a3b8',
              textDecoration: 'none',
              marginTop: '0.25rem',
            }}
          >
            ← Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
