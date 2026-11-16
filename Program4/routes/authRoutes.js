/**
 * Authentication Routes (Register & Login)
 * Uses bcryptjs for password hashing and jsonwebtoken for signed tokens.
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validateRegister, validateLogin } = require('../middleware/validator');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_buspass_roll14';

// In-memory user store (preloaded with a demo test account)
const users = [];

// Seed default admin/student account for immediate testing
(async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('Puneet@123', salt);
  users.push({
    id: 'user_1',
    username: 'puneet14',
    email: 'puneet.roll14@college.edu',
    password: hashedPassword,
    role: 'StudentAdmin',
    createdAt: new Date().toISOString()
  });
})();

/**
 * POST /api/auth/register
 */
router.post('/register', validateRegister, async (req, res, next) => {
  try {
    const { username, password, email = '' } = req.body;

    const existingUser = users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    );
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: `Conflict: Username "${username}" is already registered. Please choose another.`
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: `user_${users.length + 1}`,
      username: username.trim(),
      email: email.trim(),
      password: hashedPassword,
      role: 'PassHolder',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    res.status(201).json({
      success: true,
      message: 'User registered successfully. You may now log in.',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/login
 */
router.post('/login', validateLogin, async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication Failed: Invalid username or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Authentication Failed: Invalid username or password.'
      });
    }

    const tokenPayload = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '2h' });

    res.status(200).json({
      success: true,
      message: 'Login successful. Bearer JWT generated.',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

