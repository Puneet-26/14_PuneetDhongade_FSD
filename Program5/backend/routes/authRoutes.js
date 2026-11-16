/**
 * Authentication Routes for Program 5
 * Handles User Registration & Login with JWT Generation
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fullstack_program5_secret_key_roll14';

// In-memory fallback if MongoDB connection is pending or offline
const fallbackUsers = [];

// Seed default student account
(async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('Puneet@123', salt);
  fallbackUsers.push({
    _id: 'user_fallback_1',
    username: 'puneet14',
    email: 'puneet@mumbaibus.gov.in',
    password: hashedPassword,
    role: 'Student'
  });
})();

/**
 * POST /api/auth/register
 */
router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide username, email, and password.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.'
      });
    }

    // Check if connected to MongoDB
    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({
        $or: [{ email: email.toLowerCase() }, { username }]
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'User with this email or username already exists.'
        });
      }

      const user = new User({ username, email, password });
      await user.save();

      const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully.',
        token,
        user: { id: user._id, username: user.username, email: user.email, role: user.role }
      });
    }

    // Offline / In-memory fallback
    const exists = fallbackUsers.find(
      (u) => u.username === username || u.email === email.toLowerCase()
    );
    if (exists) {
      return res.status(409).json({
        success: false,
        error: 'User with this email or username already exists.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = {
      _id: `user_fb_${Date.now()}`,
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'Student'
    };
    fallbackUsers.push(newUser);

    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully (Memory fallback).',
      token,
      user: { id: newUser._id, username: newUser.username, email: newUser.email, role: newUser.role }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/login
 */
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide username and password.'
      });
    }

    // 1. Mongoose / MongoDB path
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid username or password.'
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Invalid username or password.'
        });
      }

      const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        success: true,
        message: 'Logged in successfully.',
        token,
        user: { id: user._id, username: user.username, email: user.email, role: user.role }
      });
    }

    // 2. Offline / In-memory fallback path
    const fallbackUser = fallbackUsers.find((u) => u.username === username);
    if (!fallbackUser) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, fallbackUser.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password.'
      });
    }

    const token = jwt.sign(
      { id: fallbackUser._id, username: fallbackUser.username, role: fallbackUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully (Memory fallback).',
      token,
      user: {
        id: fallbackUser._id,
        username: fallbackUser.username,
        email: fallbackUser.email,
        role: fallbackUser.role
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

