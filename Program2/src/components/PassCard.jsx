import React from 'react';

export default function PassCard({ pass, onDelete }) {
  const {
    id,
    passengerName,
    route,
    passType,
    validityDays,
    issueDate,
    expiryDate,
    status = 'Active',
    price
  } = pass;

  const getTypeClass = (type) => {
    switch (type) {
      case 'Student':
        return 'type-student';
      case 'Senior Citizen':
        return 'type-senior';
      default:
        return 'type-monthly';
    }
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={`pass-card ${getTypeClass(passType)}`}>
      <div className="card-top">
        <span className="card-id">{id}</span>
        <span className={`card-badge ${getTypeClass(passType)}`}>{passType}</span>
      </div>

      <div className="card-body">
        <h3 className="passenger-name">{passengerName}</h3>
        <p className="route-info">
          <span className="route-pin">📍</span>
          <span>{route}</span>
        </p>

        <div className="card-metrics-grid">
          <div className="metric-box">
            <span className="box-label">Issued</span>
            <span className="box-val">{formatDate(issueDate)}</span>
          </div>
          <div className="metric-box">
            <span className="box-label">Expires</span>
            <span className="box-val">{formatDate(expiryDate)}</span>
          </div>
          <div className="metric-box">
            <span className="box-label">Duration</span>
            <span className="box-val">{validityDays} Days</span>
          </div>
          <div className="metric-box">
            <span className="box-label">Status</span>
            <span className="box-val status-active">● {status}</span>
          </div>
        </div>
      </div>

      <div className="card-bottom">
        <div className="price-tag">
          <span className="currency">₹</span>
          <span className="amount">{price}</span>
        </div>
        <button
          onClick={() => onDelete(id)}
          className="btn-card-delete"
          title="Revoke this pass"
        >
          🗑️ Revoke
        </button>
      </div>
    </div>
  );
}

