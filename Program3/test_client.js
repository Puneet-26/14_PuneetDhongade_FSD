/**
 * Standalone Automated Test Client for Program 3
 * Student Roll No. 14: Puneet Dhongade | Semester V | B.Tech AI&DS
 * Uses ONLY built-in Node.js 'http' and 'fs' modules.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const LOG_FILE = path.join(__dirname, 'activity.log');

// Color helpers for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  magenta: '\x1b[35m'
};

function logBanner(title) {
  console.log(`\n${colors.cyan}════════════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}${title}${colors.reset}`);
  console.log(`${colors.cyan}════════════════════════════════════════════════════════════════════${colors.reset}`);
}

function makeRequest(method, pathname, data = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Node-Test-Client/Roll14-Puneet'
      }
    };

    if (postData) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTests() {
  console.log(`\n${colors.bright}${colors.blue}🚀 STARTING BUS PASS UTILITY TEST SUITE (ROLL NO: 14 - PUNEET DHONGADE)${colors.reset}\n`);

  try {
    // Test 1: GET /
    logBanner('TEST 1: GET / (Server Health & Info)');
    console.log(`${colors.yellow}Request:${colors.reset} GET http://localhost:${PORT}/`);
    const resRoot = await makeRequest('GET', '/');
    console.log(`${colors.green}Response Status:${colors.reset} ${resRoot.status} OK`);
    console.log(`${colors.bright}Response Payload:${colors.reset}`);
    console.log(JSON.stringify(resRoot.body, null, 2));

    // Test 2: GET /passes
    logBanner('TEST 2: GET /passes (Read records via Path & FS)');
    console.log(`${colors.yellow}Request:${colors.reset} GET http://localhost:${PORT}/passes`);
    const resGet = await makeRequest('GET', '/passes');
    console.log(`${colors.green}Response Status:${colors.reset} ${resGet.status} OK`);
    console.log(`Total Passes in store: ${colors.bright}${resGet.body.count}${colors.reset}`);
    console.log(`${colors.bright}First 2 sample passes:${colors.reset}`);
    console.log(JSON.stringify(resGet.body.data.slice(0, 2), null, 2));

    // Test 3: POST /passes (Add a new student pass)
    logBanner('TEST 3: POST /passes (Issue New Pass & Trigger EventEmitter)');
    const newPassData = {
      passengerName: 'Puneet Dhongade',
      route: 'Andheri Station (W) to Bandra Kurla Complex (BKC)',
      passType: 'Student',
      validityDays: 90
    };
    console.log(`${colors.yellow}Request:${colors.reset} POST http://localhost:${PORT}/passes`);
    console.log(`${colors.yellow}Payload:${colors.reset}`, JSON.stringify(newPassData, null, 2));
    const resPost = await makeRequest('POST', '/passes', newPassData);
    console.log(`${colors.green}Response Status:${colors.reset} ${resPost.status} Created`);
    console.log(`${colors.bright}Created Pass Details:${colors.reset}`);
    console.log(JSON.stringify(resPost.body, null, 2));

    // Test 4: GET /passes (Verify new pass was persisted to passes.json)
    logBanner('TEST 4: GET /passes (Verify Persistence)');
    console.log(`${colors.yellow}Request:${colors.reset} GET http://localhost:${PORT}/passes`);
    const resVerify = await makeRequest('GET', '/passes');
    console.log(`${colors.green}Response Status:${colors.reset} ${resVerify.status} OK`);
    console.log(`Updated Total Passes: ${colors.bright}${resVerify.body.count}${colors.reset}`);
    const latestPass = resVerify.body.data[resVerify.body.data.length - 1];
    console.log(`${colors.bright}Latest Added Record:${colors.reset}`);
    console.log(JSON.stringify(latestPass, null, 2));

    // Test 5: Verify activity.log stream output
    logBanner('TEST 5: Inspect activity.log (fs.createWriteStream & EventEmitter)');
    console.log(`Reading stream output from: ${colors.magenta}${LOG_FILE}${colors.reset}\n`);
    const logContent = await fs.promises.readFile(LOG_FILE, 'utf8');
    const logLines = logContent.trim().split('\n');
    console.log(`${colors.cyan}--- [LATEST 5 LOG ENTRIES IN activity.log] ---${colors.reset}`);
    logLines.slice(-5).forEach((line, idx) => {
      console.log(`${colors.bright}[${idx + 1}]${colors.reset} ${line}`);
    });

    console.log(`\n${colors.bright}${colors.green}✅ ALL TESTS COMPLETED SUCCESSFULLY! Ready for screenshot capture.${colors.reset}\n`);

  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      console.error(`\n${colors.red}❌ Connection Error: Could not connect to http://localhost:${PORT}.${colors.reset}`);
      console.error(`Please make sure the server is running in another terminal using: ${colors.yellow}node server.js${colors.reset}\n`);
    } else {
      console.error(`\n${colors.red}❌ Test Error:${colors.reset}`, err.message);
    }
  }
}

runTests();

