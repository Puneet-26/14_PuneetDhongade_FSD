import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

const MUMBAI_ROUTES = [
  "Andheri Station (W) to Bandra Kurla Complex (BKC)",
  "Thane Station to CSMT (Fort)",
  "Borivali (E) to Dadar TT Circle",
  "Kurla West to Vashi Bus Depot",
  "Ghatkopar Station (E) to Powai Hiranandani",
  "Bandra Station (W) to Worli Sea Face",
  "Dombivli to Vashi Station"
];

export default function PassForm({ user, onRequireAuth, onPassCreated }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    passengerName: '',
    route: MUMBAI_ROUTES[0],
    isCustomRoute: false,
    customRoute: '',
    passType: 'Student',
    validityDays: 30
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fare computation helper
  const calculateFare = (type, days) => {
    const baseMonthly = 750;
    const multiplier = Number(days) / 30;
    let rawFare = baseMonthly * multiplier;

    if (type === 'Student') rawFare *= 0.5;
    else if (type === 'Senior Citizen') rawFare *= 0.6;

    return Math.round(rawFare);
  };

  const currentFare = calculateFare(formData.passType, formData.validityDays);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};

    if (!formData.passengerName.trim()) {
      errs.passengerName = 'Passenger name is required.';
    } else if (formData.passengerName.trim().length < 3) {
      errs.passengerName = 'Passenger name must be at least 3 characters.';
    }

    if (formData.isCustomRoute) {
      if (!formData.customRoute.trim()) {
        errs.customRoute = 'Please enter a route description.';
      } else if (formData.customRoute.trim().length < 5) {
        errs.customRoute = 'Route description must be at least 5 characters.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      onRequireAuth();
      return;
    }

    if (!validate()) return;

    setLoading(true);
    setServerError('');
    setSuccessMessage('');

    const finalRoute = formData.isCustomRoute
      ? formData.customRoute.trim()
      : formData.route;

    const payload = {
      passengerName: formData.passengerName.trim(),
      route: finalRoute,
      passType: formData.passType,
      validityDays: Number(formData.validityDays)
    };

    try {
      const res = await api.createPass(payload);
      setSuccessMessage(`Success! Pass ${res.data.passId || ''} created and saved in backend database.`);
      onPassCreated();

      setTimeout(() => {
        navigate('/');
      }, 1200);
    } catch (err) {
      if (err.status === 401) {
        setServerError('Session expired or unauthorized. Please log in again.');
        onRequireAuth();
      } else {
        setServerError(err.message || 'Failed to create pass. Please check your inputs.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page-container">
      <div className="form-card-wrapper">
        <div className="form-header-box">
          <Link to="/" className="back-link">
            ← Back to All Passes
          </Link>
          <h2>Apply for Transit Bus Pass (Full-Stack)</h2>
          <p>Mongoose-validated entry persisted to MongoDB with JWT authorization</p>
        </div>

        {!user && (
          <div className="alert-auth-warning">
            <span>🔒</span>
            <div>
              <strong>Authentication Required:</strong> Creating passes requires a JWT Bearer token.
              <button type="button" onClick={onRequireAuth} className="btn-link-inline">
                Click here to Sign In or Register
              </button>
            </div>
          </div>
        )}

        {serverError && <div className="alert-error">⚠️ {serverError}</div>}
        {successMessage && <div className="alert-success">✅ {successMessage}</div>}

        <form onSubmit={handleSubmit} noValidate className="react-pass-form">
          {/* Passenger Name */}
          <div className="form-field">
            <label htmlFor="passengerName">
              Passenger Full Name <span className="req">*</span>
            </label>
            <input
              type="text"
              id="passengerName"
              name="passengerName"
              placeholder="e.g. Puneet Dhongade"
              value={formData.passengerName}
              onChange={handleChange}
              className={errors.passengerName ? 'input-error' : ''}
            />
            {errors.passengerName && <span className="error-text">{errors.passengerName}</span>}
          </div>

          {/* Route Selection */}
          <div className="form-field">
            <label htmlFor="route">
              Mumbai Bus Route <span className="req">*</span>
            </label>
            {!formData.isCustomRoute ? (
              <select
                id="route"
                name="route"
                value={formData.route}
                onChange={handleChange}
              >
                {MUMBAI_ROUTES.map((r, idx) => (
                  <option key={idx} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                name="customRoute"
                placeholder="e.g. Borivali to Churchgate Express"
                value={formData.customRoute}
                onChange={handleChange}
                className={errors.customRoute ? 'input-error' : ''}
              />
            )}
            {errors.customRoute && <span className="error-text">{errors.customRoute}</span>}

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isCustomRoute"
                checked={formData.isCustomRoute}
                onChange={handleChange}
              />
              <span>Enter custom / non-standard route</span>
            </label>
          </div>

          {/* Category & Validity */}
          <div className="form-split-row">
            <div className="form-field col">
              <label htmlFor="passType">
                Pass Category <span className="req">*</span>
              </label>
              <select
                id="passType"
                name="passType"
                value={formData.passType}
                onChange={handleChange}
              >
                <option value="Student">Student (50% Concession)</option>
                <option value="Monthly">Monthly Standard</option>
                <option value="Senior Citizen">Senior Citizen (40% Concession)</option>
              </select>
            </div>

            <div className="form-field col">
              <label htmlFor="validityDays">
                Validity Duration <span className="req">*</span>
              </label>
              <select
                id="validityDays"
                name="validityDays"
                value={formData.validityDays}
                onChange={handleChange}
              >
                <option value="30">30 Days (1 Month)</option>
                <option value="60">60 Days (2 Months)</option>
                <option value="90">90 Days (Quarterly)</option>
                <option value="180">180 Days (Half-Yearly)</option>
                <option value="365">365 Days (Annual)</option>
              </select>
            </div>
          </div>

          {/* Dynamic Fare Preview Card */}
          <div className="fare-calculation-card">
            <div className="fare-row">
              <span className="fare-label">Estimated Transit Fare:</span>
              <span className="fare-sum">₹{currentFare}</span>
            </div>
            <p className="fare-subtext">
              {formData.passType === 'Student' && 'Student concessional rate (50% OFF) applied.'}
              {formData.passType === 'Senior Citizen' && 'Senior citizen concessional rate (40% OFF) applied.'}
              {formData.passType === 'Monthly' && 'Standard monthly rate applied.'}
            </p>
          </div>

          {/* Actions */}
          <div className="form-button-group">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-submit"
            >
              {loading ? 'Submitting to Backend...' : '💳 Confirm & Issue Bus Pass'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

