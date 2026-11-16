import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MUMBAI_ROUTES } from '../data/initialPasses';

export default function PassForm({ onAddPass }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    passengerName: '',
    route: MUMBAI_ROUTES[0],
    isCustomRoute: false,
    customRoute: '',
    passType: 'Student',
    validityDays: 30,
    contactNumber: '',
    email: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Fare computation helper
  const calculateFare = (type, days) => {
    const baseMonthly = 750;
    const multiplier = Number(days) / 30;
    let rawFare = baseMonthly * multiplier;

    if (type === 'Student') {
      rawFare *= 0.5; // 50% discount
    } else if (type === 'Senior Citizen') {
      rawFare *= 0.6; // 40% discount
    }

    return Math.round(rawFare);
  };

  const currentFare = calculateFare(formData.passType, formData.validityDays);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for field on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.passengerName.trim()) {
      newErrors.passengerName = 'Passenger name is required.';
    } else if (formData.passengerName.trim().length < 3) {
      newErrors.passengerName = 'Name must be at least 3 characters long.';
    } else if (!/^[A-Za-z\s.'-]+$/.test(formData.passengerName.trim())) {
      newErrors.passengerName = 'Name can only contain alphabets and spaces.';
    }

    if (formData.isCustomRoute) {
      if (!formData.customRoute.trim()) {
        newErrors.customRoute = 'Please specify the custom route.';
      } else if (formData.customRoute.trim().length < 5) {
        newErrors.customRoute = 'Route must be at least 5 characters.';
      }
    } else if (!formData.route) {
      newErrors.route = 'Please select a valid route.';
    }

    if (formData.contactNumber && !/^\d{10}$/.test(formData.contactNumber.trim())) {
      newErrors.contactNumber = 'Contact number must be exactly 10 digits.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const finalRoute = formData.isCustomRoute
      ? formData.customRoute.trim()
      : formData.route;

    const issueDateObj = new Date();
    const expiryDateObj = new Date();
    expiryDateObj.setDate(issueDateObj.getDate() + Number(formData.validityDays));

    const newPass = {
      id: `BP-R${Math.floor(100 + Math.random() * 900)}`,
      passengerName: formData.passengerName.trim(),
      route: finalRoute,
      passType: formData.passType,
      validityDays: Number(formData.validityDays),
      issueDate: issueDateObj.toISOString().split('T')[0],
      expiryDate: expiryDateObj.toISOString().split('T')[0],
      status: 'Active',
      price: currentFare
    };

    onAddPass(newPass);
    setSuccessMessage(`Pass ${newPass.id} successfully generated for ${newPass.passengerName}! Redirecting...`);

    setTimeout(() => {
      navigate('/');
    }, 1200);
  };

  return (
    <div className="form-page-container">
      <div className="form-card-wrapper">
        <div className="form-header-box">
          <Link to="/" className="back-link">
            ← Back to All Passes
          </Link>
          <h2>New Bus Pass Application Form</h2>
          <p>Register a commuter and issue an authenticated digital transit pass</p>
        </div>

        {successMessage && (
          <div className="alert-success">
            <span>✅</span>
            <span>{successMessage}</span>
          </div>
        )}

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
              Mumbai Metropolitan Bus Route <span className="req">*</span>
            </label>
            {!formData.isCustomRoute ? (
              <select
                id="route"
                name="route"
                value={formData.route}
                onChange={handleChange}
                className={errors.route ? 'input-error' : ''}
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
                placeholder="Enter custom route (e.g. Borivali to Churchgate)"
                value={formData.customRoute}
                onChange={handleChange}
                className={errors.customRoute ? 'input-error' : ''}
              />
            )}
            {errors.route && <span className="error-text">{errors.route}</span>}
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

          {/* Contact Details (Optional) */}
          <div className="form-split-row">
            <div className="form-field col">
              <label htmlFor="contactNumber">Mobile Number (Optional)</label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                placeholder="10-digit mobile number"
                value={formData.contactNumber}
                onChange={handleChange}
                className={errors.contactNumber ? 'input-error' : ''}
              />
              {errors.contactNumber && <span className="error-text">{errors.contactNumber}</span>}
            </div>

            <div className="form-field col">
              <label htmlFor="email">Email Address (Optional)</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="passenger@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Dynamic Fare Preview Card */}
          <div className="fare-calculation-card">
            <div className="fare-row">
              <span className="fare-label">Calculated Transit Fare:</span>
              <span className="fare-sum">₹{currentFare}</span>
            </div>
            <p className="fare-subtext">
              {formData.passType === 'Student' && 'Student concessional rate applied (50% subsidy).'}
              {formData.passType === 'Senior Citizen' && 'Senior citizen concessional rate applied (40% subsidy).'}
              {formData.passType === 'Monthly' && 'Standard commuter monthly pass rate applied.'}
            </p>
          </div>

          {/* Buttons */}
          <div className="form-button-group">
            <button type="submit" className="btn btn-primary btn-submit">
              💳 Confirm & Issue Pass
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

