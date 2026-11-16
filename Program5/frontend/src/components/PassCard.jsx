import React from 'react';

export default function PassCard({ pass, onDelete, user, onRequireAuth }) {
  const {
    _id,
    passId,
    passengerName,
    route,
    passType,
    validityDays,
    issueDate,
    expiryDate,
    status = 'Active',
    price,
    issuedBy
  } = pass;

  const id = passId || _id;

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

  const handleDelete = () => {
    if (!user) {
      onRequireAuth();
      return;
    }
    onDelete(id);
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
            <span className="box-label">Valid Until</span>
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

        {issuedBy && (
          <div className="card-authority">
            <small>Auth: {issuedBy}</small>
          </div>
        )}
      </div>

      <div className="card-bottom">
        <div className="price-tag">
          <span className="currency">₹</span>
          <span className="amount">{price}</span>
        </div>
        <button
          onClick={handleDelete}
          className="btn-card-delete"
          title={user ? 'Revoke this pass' : 'Login required to revoke'}
        >
          🗑️ Revoke
        </button>
      </div>
    </div>
  );
}

