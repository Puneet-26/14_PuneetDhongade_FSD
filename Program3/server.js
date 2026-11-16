/**
 * Full Stack Development – Programming Exercise (Bus Pass Management System)
 * Student Roll No. 14: Puneet Dhongade | Semester V | B.Tech AI&DS
 * Program 3: Core Node.js Server Utility (Without Express)
 * Modules Used: http, fs, path, events
 * Course Outcome: CO4
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'passes.json');
const LOG_FILE = path.join(__dirname, 'activity.log');

// Initialize EventEmitter
class PassEventEmitter extends EventEmitter {}
const passEmitter = new PassEventEmitter();

// Initialize File Write Stream for asynchronous event logging
const logStream = fs.createWriteStream(LOG_FILE, { flags: 'a', encoding: 'utf8' });

// Log Stream error handling
logStream.on('error', (err) => {
  console.error('[LOG STREAM ERROR]:', err.message);
});

// Event Listener 1: Record fetched passes
passEmitter.on('passFetched', (eventData) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] EVENT [passFetched]: Retrieved ${eventData.count} passes | Requester IP: ${eventData.ip}\n`;
  logStream.write(logEntry);
  console.log(`\x1b[36m[EVENT EMITTED]\x1b[0m passFetched -> Count: ${eventData.count} | IP: ${eventData.ip}`);
});

// Event Listener 2: Record newly added pass
passEmitter.on('passAdded', (pass) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] EVENT [passAdded]: ID: ${pass.id} | Passenger: "${pass.passengerName}" | Route: "${pass.route}" | Fare: ₹${pass.price} | Category: ${pass.passType}\n`;
  logStream.write(logEntry);
  console.log(`\x1b[32m[EVENT EMITTED]\x1b[0m passAdded -> Pass ID: ${pass.id} issued for ${pass.passengerName}`);
});

/**
 * Helper to calculate pass fare
 */
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

/**
 * Helper to send standardized JSON responses
 */
function sendJsonResponse(res, statusCode, payload) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'X-Student-Roll': '14',
    'X-Student-Name': 'Puneet Dhongade'
  };

  res.writeHead(statusCode, headers);
  res.end(JSON.stringify(payload, null, 2));
}

/**
 * Helper to read JSON data safely from file
 */
async function readPassesFromFile() {
  try {
    const rawData = await fs.promises.readFile(DATA_FILE, 'utf8');
    return JSON.parse(rawData);
  } catch (err) {
    if (err.code === 'ENOENT') {
      // File doesn't exist yet, return empty list
      return [];
    }
    throw err;
  }
}

/**
 * Helper to write JSON data safely to file
 */
async function writePassesToFile(passes) {
  await fs.promises.writeFile(DATA_FILE, JSON.stringify(passes, null, 2), 'utf8');
}

/**
 * Helper to parse incoming HTTP request body stream
 */
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    const MAX_SIZE = 1e6; // 1MB limit

    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > MAX_SIZE) {
        reject(new Error('Payload Too Large'));
      }
    });

    req.on('end', () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (err) {
        reject(new Error('Invalid JSON format in request body'));
      }
    });

    req.on('error', (err) => {
      reject(err);
    });
  });
}

// Create Core HTTP Server
const server = http.createServer(async (req, res) => {
  const clientIp = req.socket.remoteAddress || '127.0.0.1';
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS Preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  try {
    // Route 1: GET / (Root Server Status)
    if (pathname === '/' && method === 'GET') {
      sendJsonResponse(res, 200, {
        success: true,
        service: 'Core Node.js Bus Pass Management Utility',
        student: 'Puneet Dhongade',
        rollNo: 14,
        class: 'B.Tech (AI & DS) Semester V',
        courseOutcome: 'CO4',
        port: PORT,
        status: 'Server Operational',
        timestamp: new Date().toISOString(),
        availableEndpoints: [
          { method: 'GET', path: '/', description: 'Server information and status' },
          { method: 'GET', path: '/passes', description: 'Retrieve all bus passes' },
          { method: 'POST', path: '/passes', description: 'Issue a new bus pass' }
        ]
      });
      return;
    }

    // Route 2: GET /passes (Fetch all passes)
    if (pathname === '/passes' && method === 'GET') {
      const passes = await readPassesFromFile();

      // Emit event: passFetched
      passEmitter.emit('passFetched', { count: passes.length, ip: clientIp });

      sendJsonResponse(res, 200, {
        success: true,
        count: passes.length,
        data: passes
      });
      return;
    }

    // Route 3: POST /passes (Add a new pass)
    if (pathname === '/passes' && method === 'POST') {
      const body = await parseRequestBody(req);

      // Validate required fields
      const { passengerName, route, passType = 'Monthly', validityDays = 30 } = body;

      if (!passengerName || typeof passengerName !== 'string' || passengerName.trim().length < 3) {
        sendJsonResponse(res, 400, {
          success: false,
          error: 'Validation Error: passengerName is required and must be at least 3 characters.'
        });
        return;
      }

      if (!route || typeof route !== 'string' || route.trim().length < 3) {
        sendJsonResponse(res, 400, {
          success: false,
          error: 'Validation Error: route is required and must be at least 3 characters.'
        });
        return;
      }

      const days = parseInt(validityDays, 10);
      if (isNaN(days) || days <= 0) {
        sendJsonResponse(res, 400, {
          success: false,
          error: 'Validation Error: validityDays must be a positive integer.'
        });
        return;
      }

      const validTypes = ['Student', 'Monthly', 'Senior Citizen', 'General'];
      const chosenType = validTypes.includes(passType) ? passType : 'Monthly';

      const existingPasses = await readPassesFromFile();

      const issueDateObj = new Date();
      const expiryDateObj = new Date();
      expiryDateObj.setDate(issueDateObj.getDate() + days);

      const newPass = {
        id: `BP-N${Math.floor(1000 + Math.random() * 9000)}`,
        passengerName: passengerName.trim(),
        route: route.trim(),
        passType: chosenType,
        validityDays: days,
        issueDate: issueDateObj.toISOString().split('T')[0],
        expiryDate: expiryDateObj.toISOString().split('T')[0],
        status: 'Active',
        price: calculateFare(chosenType, days)
      };

      existingPasses.push(newPass);
      await writePassesToFile(existingPasses);

      // Emit event: passAdded
      passEmitter.emit('passAdded', newPass);

      sendJsonResponse(res, 201, {
        success: true,
        message: 'Bus pass created and saved successfully',
        data: newPass
      });
      return;
    }

    // 404 Route Not Found
    sendJsonResponse(res, 404, {
      success: false,
      error: `Resource not found: ${method} ${pathname}`,
      validRoutes: ['GET /', 'GET /passes', 'POST /passes']
    });

  } catch (err) {
    console.error('[SERVER ERROR]:', err);
    sendJsonResponse(res, 500, {
      success: false,
      error: 'Internal Server Error',
      details: err.message
    });
  }
});

// Start Server
server.listen(PORT, () => {
  console.log(`\n===============================================================`);
  console.log(`  BUS PASS MANAGEMENT - CORE NODE.JS UTILITY (CO4)             `);
  console.log(`  Student: Puneet Dhongade | Roll No: 14 | B.Tech (AI & DS) Sem V `);
  console.log(`  Server running at: http://localhost:${PORT}/                   `);
  console.log(`  Logging events to: ${LOG_FILE}                              `);
  console.log(`===============================================================\n`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nGracefully shutting down server...');
  logStream.end(() => {
    console.log('Log stream closed.');
    server.close(() => {
      console.log('Server stopped.');
      process.exit(0);
    });
  });
});

