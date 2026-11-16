import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PassCard from './PassCard';

export default function PassList({
  passes,
  loading,
  error,
  onDelete,
  onRefresh,
  dataSource,
  user,
  onRequireAuth
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');

  // Filter and sort passes locally or trigger search
  const filteredPasses = useMemo(() => {
    return passes
      .filter((pass) => {
        const term = searchTerm.toLowerCase();
        const pName = pass.passengerName ? pass.passengerName.toLowerCase() : '';
        const pRoute = pass.route ? pass.route.toLowerCase() : '';
        const pId = (pass.passId || pass._id || '').toLowerCase();

        const matchesSearch = pName.includes(term) || pRoute.includes(term) || pId.includes(term);
        const matchesType = typeFilter === 'ALL' || pass.passType === typeFilter;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.issueDate || 0) - new Date(a.issueDate || 0);
        }
        if (sortBy === 'name') {
          return (a.passengerName || '').localeCompare(b.passengerName || '');
        }
        if (sortBy === 'price-desc') {
          return (b.price || 0) - (a.price || 0);
        }
        return 0;
      });
  }, [passes, searchTerm, typeFilter, sortBy]);

  // Aggregate stats
  const totalCount = passes.length;
  const studentCount = passes.filter((p) => p.passType === 'Student').length;
  const monthlyCount = passes.filter((p) => p.passType === 'Monthly').length;
  const totalFare = passes.reduce((sum, p) => sum + (p.price || 0), 0);

  return (
    <div className="pass-list-page">
      {/* Metrics Row */}
      <section className="stats-row">
        <div className="stat-card">
          <div className="stat-icon blue">🎫</div>
          <div className="stat-info">
            <span className="stat-title">Database Records</span>
            <span className="stat-value">{totalCount}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">🎓</div>
          <div className="stat-info">
            <span className="stat-title">Student Concessions</span>
            <span className="stat-value">{studentCount}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">📅</div>
          <div className="stat-info">
            <span className="stat-title">Monthly Passes</span>
            <span className="stat-value">{monthlyCount}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">₹</div>
          <div className="stat-info">
            <span className="stat-title">Gross Revenue</span>
            <span className="stat-value">₹{totalFare.toLocaleString()}</span>
          </div>
        </div>
      </section>

      {/* Database Connection Pill & Control Bar */}
      <section className="controls-bar">
        <div className="db-status-pill">
          <span className="db-indicator"></span>
          <span>Backend Store: <strong>{dataSource || 'Connecting...'}</strong></span>
        </div>

        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search passenger, route, or pass ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-btn" onClick={() => setSearchTerm('')}>
              ×
            </button>
          )}
        </div>

        <div className="filter-group">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">All Categories</option>
            <option value="Student">Student Only</option>
            <option value="Monthly">Monthly Only</option>
            <option value="Senior Citizen">Senior Citizen Only</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="newest">Sort: Newest</option>
            <option value="name">Sort: Passenger A-Z</option>
            <option value="price-desc">Sort: Highest Fare</option>
          </select>

          <button onClick={onRefresh} className="btn-refresh" title="Reload from API">
            🔄 Refresh
          </button>
        </div>
      </section>

      {/* Main Listing Grid */}
      <section className="passes-section">
        {error && (
          <div className="alert-error-banner">
            ⚠️ <strong>Backend Connection Notice:</strong> {error}
            <button onClick={onRefresh} className="btn-retry">Retry Connection</button>
          </div>
        )}

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Fetching passes from Express & MongoDB backend...</p>
          </div>
        ) : filteredPasses.length === 0 ? (
          <div className="empty-state-box">
            <div className="empty-icon">🎫</div>
            <h3>No Bus Passes Found</h3>
            <p>No passes match your query or database is currently empty.</p>
            <div className="empty-actions">
              <Link to="/apply" className="btn btn-primary">
                ➕ Issue New Bus Pass
              </Link>
            </div>
          </div>
        ) : (
          <div className="passes-cards-grid">
            {filteredPasses.map((pass) => (
              <PassCard
                key={pass.passId || pass._id}
                pass={pass}
                onDelete={onDelete}
                user={user}
                onRequireAuth={onRequireAuth}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

