/**
 * Bus Pass CRUD Routes
 * Protected endpoints (POST, PUT, DELETE) require JWT Bearer Authentication
 */

const express = require('express');
const authenticateToken = require('../middleware/auth');
const { validatePass } = require('../middleware/validator');

const router = express.Router();

// Fare calculation utility
function calculateFare(type, days) {
  const baseMonthly = 750;
  const multiplier = Number(days) / 30;
  let rawFare = baseMonthly * multiplier;

  if (type === 'Student') {
    rawFare *= 0.5;
  } else if (type === 'Senior Citizen') {
    rawFare *= 0.6;
  }

  return Math.round(rawFare);
}

// In-memory bus pass collection initialized with Mumbai seed records
let busPasses = [
  {
    id: 'BP-E101',
    passengerName: 'Puneet Dhongade',
    route: 'Andheri Station (W) to Bandra Kurla Complex (BKC)',
    passType: 'Student',
    validityDays: 90,
    issueDate: '2026-11-01',
    expiryDate: '2027-01-30',
    status: 'Active',
    price: 450,
    issuedBy: 'system'
  },
  {
    id: 'BP-E102',
    passengerName: 'Aarav Mehta',
    route: 'Thane Station to CSMT (Fort)',
    passType: 'Monthly',
    validityDays: 30,
    issueDate: '2026-11-05',
    expiryDate: '2026-12-05',
    status: 'Active',
    price: 750,
    issuedBy: 'system'
  },
  {
    id: 'BP-E103',
    passengerName: 'Sunita Patil',
    route: 'Borivali (E) to Dadar TT Circle',
    passType: 'Senior Citizen',
    validityDays: 180,
    issueDate: '2026-10-15',
    expiryDate: '2027-04-13',
    status: 'Active',
    price: 600,
    issuedBy: 'system'
  },
  {
    id: 'BP-E104',
    passengerName: 'Rohan Deshmukh',
    route: 'Kurla West to Vashi Bus Depot',
    passType: 'Student',
    validityDays: 30,
    issueDate: '2026-11-10',
    expiryDate: '2026-12-10',
    status: 'Active',
    price: 250,
    issuedBy: 'system'
  }
];

/**
 * 1. GET /api/passes (Public: Retrieve all passes with optional search/filter)
 */
router.get('/', (req, res) => {
  const { search, type } = req.query;

  let results = [...busPasses];

  if (search) {
    const s = search.toLowerCase();
    results = results.filter(
      (p) =>
        p.passengerName.toLowerCase().includes(s) ||
        p.route.toLowerCase().includes(s) ||
        p.id.toLowerCase().includes(s)
    );
  }

  if (type && type !== 'ALL') {
    results = results.filter((p) => p.passType === type);
  }

  res.status(200).json({
    success: true,
    count: results.length,
    data: results
  });
});

/**
 * 2. GET /api/passes/:id (Public: Retrieve single pass by ID)
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const pass = busPasses.find((p) => p.id.toUpperCase() === id.toUpperCase());

  if (!pass) {
    return res.status(404).json({
      success: false,
      error: `Bus pass with ID "${id}" was not found.`
    });
  }

  res.status(200).json({
    success: true,
    data: pass
  });
});

/**
 * 3. POST /api/passes (Protected: Issue a new pass, requires JWT)
 */
router.post('/', authenticateToken, validatePass, (req, res) => {
  const { passengerName, route, passType = 'Monthly', validityDays = 30 } = req.body;

  const days = Number(validityDays);
  const issueDateObj = new Date();
  const expiryDateObj = new Date();
  expiryDateObj.setDate(issueDateObj.getDate() + days);

  const newPass = {
    id: `BP-E${Math.floor(200 + Math.random() * 800)}`,
    passengerName: passengerName.trim(),
    route: route.trim(),
    passType,
    validityDays: days,
    issueDate: issueDateObj.toISOString().split('T')[0],
    expiryDate: expiryDateObj.toISOString().split('T')[0],
    status: 'Active',
    price: calculateFare(passType, days),
    issuedBy: req.user.username || 'AuthorizedUser'
  };

  busPasses.unshift(newPass);

  res.status(201).json({
    success: true,
    message: 'Bus pass successfully issued.',
    data: newPass
  });
});

/**
 * 4. PUT /api/passes/:id (Protected: Update existing pass, requires JWT)
 */
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const index = busPasses.findIndex((p) => p.id.toUpperCase() === id.toUpperCase());

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: `Cannot update: Bus pass with ID "${id}" does not exist.`
    });
  }

  const existingPass = busPasses[index];
  const { passengerName, route, passType, validityDays, status } = req.body;

  const updatedType = passType || existingPass.passType;
  const updatedDays = validityDays ? Number(validityDays) : existingPass.validityDays;

  const updatedPass = {
    ...existingPass,
    passengerName: passengerName ? passengerName.trim() : existingPass.passengerName,
    route: route ? route.trim() : existingPass.route,
    passType: updatedType,
    validityDays: updatedDays,
    status: status || existingPass.status,
    price: calculateFare(updatedType, updatedDays),
    lastModifiedBy: req.user.username,
    updatedAt: new Date().toISOString()
  };

  busPasses[index] = updatedPass;

  res.status(200).json({
    success: true,
    message: `Bus pass ${id} updated successfully.`,
    data: updatedPass
  });
});

/**
 * 5. DELETE /api/passes/:id (Protected: Revoke/delete pass, requires JWT)
 */
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const index = busPasses.findIndex((p) => p.id.toUpperCase() === id.toUpperCase());

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: `Cannot revoke: Bus pass with ID "${id}" does not exist.`
    });
  }

  const deletedPass = busPasses.splice(index, 1)[0];

  res.status(200).json({
    success: true,
    message: `Bus pass ${id} revoked and deleted successfully.`,
    data: deletedPass
  });
});

module.exports = router;

