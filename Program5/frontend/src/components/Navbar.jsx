import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar({ user, onOpenAuth, onLogout, passCount }) {
  return (
    <header className="navbar-container">
      {/* Top Academic Banner */}
      <div className="academic-strip">
        <div className="academic-strip-inner">
          <div className="student-tags">
            <span className="badge badge-roll">Roll No: 14</span>
            <span className="student-name">Puneet Dhongade</span>
            <span className="student-meta">B.Tech (AI & DS) — Semester V</span>
          </div>
          <div className="course-tags">
            <span className="badge badge-course">Full Stack Development</span>
            <span className="badge badge-co">CO6 (Full Stack MERN)</span>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="main-nav">
        <div className="nav-inner">
          <NavLink to="/" className="nav-brand">
            <span className="brand-icon">🚌</span>
            <div className="brand-text">
              <span className="brand-title">Mumbai Metro Bus Pass (MERN)</span>
              <span className="brand-sub">Express + MongoDB + React Full-Stack</span>
            </div>
          </NavLink>

          <div className="nav-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              📋 All Passes
              <span className="nav-count-badge">{passCount}</span>
            </NavLink>

            <NavLink
              to="/apply"
              className={({ isActive }) => `nav-link btn-apply ${isActive ? 'active' : ''}`}
            >
              ➕ Issue Pass
            </NavLink>

            {user ? (
              <div className="user-profile-badge">
                <span className="user-icon">👤</span>
                <span className="username">{user.username}</span>
                <button onClick={onLogout} className="btn-logout" title="Log Out">
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={onOpenAuth} className="btn-auth-trigger">
                🔑 Login / Register
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

