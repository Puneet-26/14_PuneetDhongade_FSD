/**
 * JWT Authentication Middleware for Program 5
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fullstack_program5_secret_key_roll14';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'Authentication Required: No token provided in Authorization header.'
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      error: 'Malformed Token: Format should be "Bearer <token>".'
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Authentication Failed: Token is expired or invalid.'
    });
  }
}

module.exports = authenticateToken;

