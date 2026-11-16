/**
 * Full Stack Development – Programming Exercise (Bus Pass Management System)
 * Student Roll No. 14: Puneet Dhongade | Semester V | B.Tech AI&DS
 * Program 5: Full-Stack Integration Backend (Express + MongoDB/Mongoose + JWT)
 * Course Outcome: CO6
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const passRoutes = require('./routes/passRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors({
  origin: '*', // Allows Vercel frontend or local development
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const elapsed = Date.now() - start;
    console.log(`[P5-BACKEND] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${elapsed}ms)`);
  });
  next();
});

// Root Health & API Explorer Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'Full-Stack Bus Pass Management Backend API',
    student: 'Puneet Dhongade',
    rollNo: 14,
    class: 'B.Tech (AI & DS) Semester V',
    courseOutcome: 'CO6',
    database: mongoose.connection.readyState === 1 ? 'Connected to MongoDB' : 'Running in Memory Fallback Mode',
    deploymentTarget: 'Render (render.yaml configured)',
    endpoints: {
      auth: ['POST /api/auth/register', 'POST /api/auth/login'],
      passes: [
        'GET /api/passes (Public)',
        'GET /api/passes/:id (Public)',
        'POST /api/passes (JWT Required)',
        'PUT /api/passes/:id (JWT Required)',
        'DELETE /api/passes/:id (JWT Required)'
      ]
    }
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/passes', passRoutes);

// Error Handler
app.use(errorHandler);

// Attempt MongoDB Connection with fallback
async function connectDatabase() {
  if (!MONGO_URI) {
    console.log('\x1b[33m[DATABASE NOTICE]\x1b[0m No MONGO_URI provided in environment. Running with in-memory fallback store.');
    return;
  }

  try {
    console.log('[DATABASE] Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000 // Fast failover to fallback if offline
    });
    console.log('\x1b[32m[DATABASE CONNECTED]\x1b[0m Successfully connected to MongoDB database.');
  } catch (err) {
    console.warn(`\x1b[33m[DATABASE WARNING]\x1b[0m MongoDB connection failed: ${err.message}`);
    console.warn('\x1b[33m[DATABASE NOTICE]\x1b[0m Operating with in-memory fallback database. All API routes remain fully functional.');
  }
}

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`\n===============================================================`);
    console.log(`  PROGRAM 5: FULL-STACK EXPRESS & MONGOOSE BACKEND (CO6)        `);
    console.log(`  Student: Puneet Dhongade | Roll No: 14 | B.Tech (AI & DS) Sem V `);
    console.log(`  Server listening on: http://localhost:${PORT}/                 `);
    console.log(`  Render Configuration: render.yaml Ready                      `);
    console.log(`===============================================================\n`);
  });
});

module.exports = app;

