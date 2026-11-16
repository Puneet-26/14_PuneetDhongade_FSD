import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar({ passCount }) {
  return (
    <header className="navbar-container">
      {/* Top Academic Tag */}
      <div className="academic-strip">
        <div className="academic-strip-inner">
          <div className="student-tags">
            <span className="badge badge-roll">Roll No: 14</span>
            <span className="student-name">Puneet Dhongade</span>
            <span className="student-meta">B.Tech (AI & DS) — Semester V</span>
          </div>
          <div className="course-tags">
            <span className="badge badge-course">Full Stack Development</span>
            <span className="badge badge-co">CO3 (React)</span>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <nav className="main-nav">
        <div className="nav-inner">
          <NavLink to="/" className="nav-brand">
            <span className="brand-icon">🚌</span>
            <div className="brand-text">
              <span className="brand-title">BEST Bus Pass Portal</span>
              <span className="brand-sub">Metropolitan Transport React App</span>
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
              ➕ Issue New Pass
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
}

