/**
 * Input Validation Middleware
 * Validates registration, login, and pass creation/update requests
 */

function validateRegister(req, res, next) {
  const { username, password, email } = req.body;

  if (!username || typeof username !== 'string' || username.trim().length < 3) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error: "username" is required and must be at least 3 characters.'
    });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error: "password" is required and must be at least 6 characters.'
    });
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error: "email" must be a valid email address.'
    });
  }

  next();
}

function validateLogin(req, res, next) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error: Both "username" and "password" are required.'
    });
  }

  next();
}

function validatePass(req, res, next) {
  const { passengerName, route, passType, validityDays } = req.body;

  if (!passengerName || typeof passengerName !== 'string' || passengerName.trim().length < 3) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error: "passengerName" is required and must be at least 3 characters.'
    });
  }

  if (!route || typeof route !== 'string' || route.trim().length < 3) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error: "route" is required and must be at least 3 characters.'
    });
  }

  const validTypes = ['Student', 'Monthly', 'Senior Citizen', 'General'];
  if (passType && !validTypes.includes(passType)) {
    return res.status(400).json({
      success: false,
      error: `Validation Error: "passType" must be one of [${validTypes.join(', ')}].`
    });
  }

  if (validityDays !== undefined) {
    const days = Number(validityDays);
    if (isNaN(days) || days <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: "validityDays" must be a positive integer.'
      });
    }
  }

  next();
}

module.exports = {
  validateRegister,
  validateLogin,
  validatePass
};

