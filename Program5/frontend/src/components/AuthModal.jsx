import React, { useState } from 'react';
import { api, setStoredToken, setStoredUser } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isLoginTab) {
        // Login
        const res = await api.login({
          username: formData.username.trim(),
          password: formData.password
        });
        setStoredToken(res.token);
        setStoredUser(res.user);
        setSuccessMsg('Login successful! Enjoy full access.');
        setTimeout(() => {
          onAuthSuccess(res.user);
          onClose();
        }, 800);
      } else {
        // Register
        const res = await api.register({
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password
        });
        setStoredToken(res.token);
        setStoredUser(res.user);
        setSuccessMsg('Registration successful! Authenticated.');
        setTimeout(() => {
          onAuthSuccess(res.user);
          onClose();
        }, 800);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="tab-buttons">
            <button
              className={`tab-btn ${isLoginTab ? 'active' : ''}`}
              onClick={() => {
                setIsLoginTab(true);
                setErrorMsg('');
              }}
            >
              Sign In
            </button>
            <button
              className={`tab-btn ${!isLoginTab ? 'active' : ''}`}
              onClick={() => {
                setIsLoginTab(false);
                setErrorMsg('');
              }}
            >
              Create Account
            </button>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-subtext">
            {isLoginTab
              ? 'Log in with your transit credentials to issue or revoke passes.'
              : 'Register a student/commuter account to access JWT protected endpoints.'}
          </p>

          {errorMsg && <div className="alert-error">⚠️ {errorMsg}</div>}
          {successMsg && <div className="alert-success">✅ {successMsg}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-field">
              <label>Username</label>
              <input
                type="text"
                name="username"
                placeholder="e.g. puneet14"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
              />
            </div>

            {!isLoginTab && (
              <div className="form-field">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="e.g. puneet@college.edu"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
            )}

            <div className="form-field">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete={isLoginTab ? 'current-password' : 'new-password'}
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary auth-submit">
              {loading ? 'Authenticating...' : isLoginTab ? 'Sign In & Get JWT' : 'Register Account'}
            </button>
          </form>

          {isLoginTab && (
            <div className="demo-credentials-box">
              <strong>Quick Test Account:</strong>
              <p>Username: <code>puneet14</code></p>
              <p>Password: <code>Puneet@123</code></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

