import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PassCard from './PassCard';

export default function PassList({ passes, onDelete, onResetSeed }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('date-desc');

  // Filtered & Sorted Passes
  const filteredPasses = useMemo(() => {
    return passes
      .filter((pass) => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
          pass.passengerName.toLowerCase().includes(term) ||
          pass.route.toLowerCase().includes(term) ||
          pass.id.toLowerCase().includes(term);

        const matchesType = typeFilter === 'ALL' || pass.passType === typeFilter;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.issueDate || 0) - new Date(a.issueDate || 0);
        }
        if (sortBy === 'name-asc') {
          return a.passengerName.localeCompare(b.passengerName);
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
  const seniorCount = passes.filter((p) => p.passType === 'Senior Citizen').length;
  const totalRevenue = passes.reduce((sum, p) => sum + (p.price || 0), 0);

  return (
    <div className="pass-list-page">
      {/* Stats Summary Cards */}
      <section className="stats-row">
        <div className="stat-card">
          <div className="stat-icon blue">🎫</div>
          <div className="stat-info">
            <span className="stat-title">Total Active Passes</span>
            <span className="stat-value">{totalCount}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">🎓</div>
          <div className="stat-info">
            <span className="stat-title">Student Passes</span>
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
            <span className="stat-title">Total Fare Value</span>
            <span className="stat-value">₹{totalRevenue.toLocaleString()}</span>
          </div>
        </div>
      </section>

      {/* Control Bar: Search + Filter + Actions */}
      <section className="controls-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search passenger name, route, or pass ID..."
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
            <option value="ALL">All Categories ({passes.length})</option>
            <option value="Student">Student ({studentCount})</option>
            <option value="Monthly">Monthly ({monthlyCount})</option>
            <option value="Senior Citizen">Senior Citizen ({seniorCount})</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="date-desc">Sort: Newest First</option>
            <option value="name-asc">Sort: Passenger Name (A-Z)</option>
            <option value="price-desc">Sort: Fare (High to Low)</option>
          </select>

          <button
            onClick={onResetSeed}
            className="btn-seed-reset"
            title="Reset to default Mumbai route passes"
          >
            🔄 Reset Seed Data
          </button>
        </div>
      </section>

      {/* Passes Grid or Conditional Empty State */}
      <section className="passes-section">
        <div className="section-header">
          <h2>
            Pass Directory{' '}
            <span className="count-pill">
              Showing {filteredPasses.length} of {passes.length}
            </span>
          </h2>
        </div>

        {filteredPasses.length === 0 ? (
          <div className="empty-state-box">
            <div className="empty-icon">📭</div>
            <h3>No Bus Passes Found</h3>
            <p>
              {passes.length === 0
                ? 'There are currently no bus passes registered in the system.'
                : 'No passes match your search or category filter.'}
            </p>
            <div className="empty-actions">
              <Link to="/apply" className="btn btn-primary">
                ➕ Issue First Bus Pass
              </Link>
              {passes.length === 0 && (
                <button onClick={onResetSeed} className="btn btn-secondary">
                  🔄 Restore Sample Passes
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="passes-cards-grid">
            {filteredPasses.map((pass) => (
              <PassCard key={pass.id} pass={pass} onDelete={onDelete} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

