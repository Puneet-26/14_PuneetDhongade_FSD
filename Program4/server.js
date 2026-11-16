/**
 * Full Stack Development – Programming Exercise (Bus Pass Management System)
 * Student Roll No. 14: Puneet Dhongade | Semester V | B.Tech AI&DS
 * Program 4: Express.js REST API with JWT Authentication
 * Course Outcome: CO5
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const passRoutes = require('./routes/passRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Built-in & third-party middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom Request Logger Middleware
app.use(requestLogger);

// API Documentation / Health Check Root
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'Express.js Bus Pass Management REST API with JWT Auth',
    student: 'Puneet Dhongade',
    rollNo: 14,
    class: 'B.Tech (AI & DS) Semester V',
    courseOutcome: 'CO5',
    status: 'Operational',
    documentation: {
      authEndpoints: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      busPassEndpoints: {
        getAllPasses: 'GET /api/passes (Public)',
        getPassById: 'GET /api/passes/:id (Public)',
        createPass: 'POST /api/passes (Protected - Bearer JWT)',
        updatePass: 'PUT /api/passes/:id (Protected - Bearer JWT)',
        deletePass: 'DELETE /api/passes/:id (Protected - Bearer JWT)'
      }
    }
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/passes', passRoutes);

// Catch-all 404 for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl}. Route not registered on this API.`
  });
});

// Centralized Error-Handling Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`\n===============================================================`);
  console.log(`  EXPRESS REST API - JWT AUTHENTICATION (CO5)                  `);
  console.log(`  Student: Puneet Dhongade | Roll No: 14 | B.Tech (AI & DS) Sem V `);
  console.log(`  Server listening on: http://localhost:${PORT}/                 `);
  console.log(`===============================================================\n`);
});

module.exports = app;

