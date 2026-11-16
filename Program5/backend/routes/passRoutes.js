/**
 * Bus Pass CRUD Routes for Program 5
 * Course Outcome: CO6
 */

const express = require('express');
const mongoose = require('mongoose');
const BusPass = require('../models/BusPass');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

function calculateFare(type, days) {
  const baseMonthly = 750;
  const multiplier = Number(days) / 30;
  let rawFare = baseMonthly * multiplier;

  if (type === 'Student') rawFare *= 0.5;
  else if (type === 'Senior Citizen') rawFare *= 0.6;

  return Math.round(rawFare);
}

// In-memory collection fallback if MongoDB is offline
let fallbackPasses = [
  {
    _id: 'pass_fb_1',
    passId: 'BP-M101',
    passengerName: 'Puneet Dhongade',
    route: 'Andheri Station (W) to Bandra Kurla Complex (BKC)',
    passType: 'Student',
    validityDays: 90,
    price: 450,
    issueDate: new Date('2026-11-01'),
    expiryDate: new Date('2027-01-30'),
    status: 'Active',
    issuedBy: 'BEST Transit Authority'
  },
  {
    _id: 'pass_fb_2',
    passId: 'BP-M102',
    passengerName: 'Aarav Mehta',
    route: 'Thane Station to CSMT (Fort)',
    passType: 'Monthly',
    validityDays: 30,
    price: 750,
    issueDate: new Date('2026-11-05'),
    expiryDate: new Date('2026-12-05'),
    status: 'Active',
    issuedBy: 'BEST Transit Authority'
  },
  {
    _id: 'pass_fb_3',
    passId: 'BP-M103',
    passengerName: 'Sunita Patil',
    route: 'Borivali (E) to Dadar TT Circle',
    passType: 'Senior Citizen',
    validityDays: 180,
    price: 600,
    issueDate: new Date('2026-10-15'),
    expiryDate: new Date('2027-04-13'),
    status: 'Active',
    issuedBy: 'BEST Transit Authority'
  }
];

/**
 * GET /api/passes
 * Query params: ?search=&type=
 */
router.get('/', async (req, res, next) => {
  try {
    const { search, type } = req.query;

    if (mongoose.connection.readyState === 1) {
      const query = {};

      if (type && type !== 'ALL') {
        query.passType = type;
      }

      if (search) {
        query.$or = [
          { passengerName: { $regex: search, $options: 'i' } },
          { route: { $regex: search, $options: 'i' } },
          { passId: { $regex: search, $options: 'i' } }
        ];
      }

      const passes = await BusPass.find(query).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        source: 'MongoDB',
        count: passes.length,
        data: passes
      });
    }

    // Fallback store
    let results = [...fallbackPasses];
    if (type && type !== 'ALL') {
      results = results.filter((p) => p.passType === type);
    }
    if (search) {
      const s = search.toLowerCase();
      results = results.filter(
        (p) =>
          p.passengerName.toLowerCase().includes(s) ||
          p.route.toLowerCase().includes(s) ||
          p.passId.toLowerCase().includes(s)
      );
    }

    return res.status(200).json({
      success: true,
      source: 'MemoryFallback',
      count: results.length,
      data: results
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/passes/:id
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const pass = await BusPass.findOne({
        $or: [{ passId: id }, { _id: mongoose.isValidObjectId(id) ? id : null }]
      });

      if (!pass) {
        return res.status(404).json({ success: false, error: 'Bus pass not found.' });
      }
      return res.status(200).json({ success: true, data: pass });
    }

    const pass = fallbackPasses.find((p) => p.passId === id || p._id === id);
    if (!pass) {
      return res.status(404).json({ success: false, error: 'Bus pass not found.' });
    }
    return res.status(200).json({ success: true, data: pass });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/passes (Protected by JWT)
 */
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { passengerName, route, passType = 'Monthly', validityDays = 30 } = req.body;

    const days = Number(validityDays);
    const issueDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(issueDate.getDate() + days);

    const price = calculateFare(passType, days);
    const passId = `BP-M${Math.floor(1000 + Math.random() * 9000)}`;

    if (mongoose.connection.readyState === 1) {
      const newPass = new BusPass({
        passId,
        passengerName,
        route,
        passType,
        validityDays: days,
        price,
        issueDate,
        expiryDate,
        status: 'Active',
        issuedBy: req.user.username || 'BEST Transit Authority'
      });

      await newPass.save();

      return res.status(201).json({
        success: true,
        source: 'MongoDB',
        message: 'Bus pass successfully created and persisted in database.',
        data: newPass
      });
    }

    // Fallback store
    const newPass = {
      _id: `pass_fb_${Date.now()}`,
      passId,
      passengerName: passengerName.trim(),
      route: route.trim(),
      passType,
      validityDays: days,
      price,
      issueDate,
      expiryDate,
      status: 'Active',
      issuedBy: req.user.username || 'BEST Transit Authority'
    };

    fallbackPasses.unshift(newPass);

    return res.status(201).json({
      success: true,
      source: 'MemoryFallback',
      message: 'Bus pass created (Saved to in-memory fallback store).',
      data: newPass
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/passes/:id (Protected by JWT)
 */
router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { passengerName, route, passType, validityDays, status } = req.body;

    if (mongoose.connection.readyState === 1) {
      const pass = await BusPass.findOne({
        $or: [{ passId: id }, { _id: mongoose.isValidObjectId(id) ? id : null }]
      });

      if (!pass) {
        return res.status(404).json({ success: false, error: 'Pass not found.' });
      }

      if (passengerName) pass.passengerName = passengerName;
      if (route) pass.route = route;
      if (passType) pass.passType = passType;
      if (status) pass.status = status;
      if (validityDays) {
        pass.validityDays = Number(validityDays);
        pass.price = calculateFare(pass.passType, pass.validityDays);
      }

      await pass.save();
      return res.status(200).json({ success: true, message: 'Pass updated.', data: pass });
    }

    const index = fallbackPasses.findIndex((p) => p.passId === id || p._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Pass not found.' });
    }

    const p = fallbackPasses[index];
    if (passengerName) p.passengerName = passengerName;
    if (route) p.route = route;
    if (passType) p.passType = passType;
    if (status) p.status = status;
    if (validityDays) {
      p.validityDays = Number(validityDays);
      p.price = calculateFare(p.passType, p.validityDays);
    }

    fallbackPasses[index] = p;
    return res.status(200).json({ success: true, message: 'Pass updated.', data: p });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/passes/:id (Protected by JWT)
 */
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const pass = await BusPass.findOneAndDelete({
        $or: [{ passId: id }, { _id: mongoose.isValidObjectId(id) ? id : null }]
      });

      if (!pass) {
        return res.status(404).json({ success: false, error: 'Bus pass not found.' });
      }

      return res.status(200).json({
        success: true,
        message: `Bus pass ${id} revoked and deleted successfully from MongoDB.`,
        data: pass
      });
    }

    const index = fallbackPasses.findIndex((p) => p.passId === id || p._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Bus pass not found.' });
    }

    const deleted = fallbackPasses.splice(index, 1)[0];
    return res.status(200).json({
      success: true,
      message: `Bus pass ${id} revoked successfully.`,
      data: deleted
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

