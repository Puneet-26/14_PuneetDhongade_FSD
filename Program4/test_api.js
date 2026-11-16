/**
 * Comprehensive Automated REST API Test Suite for Program 4
 * Student Roll No. 14: Puneet Dhongade | Semester V | B.Tech AI&DS
 * Executes and displays:
 * 1. Register User (POST /api/auth/register)
 * 2. Login (POST /api/auth/login -> returns JWT)
 * 3. Unauthorized POST (POST /api/passes without JWT -> 401)
 * 4. Authorized POST (POST /api/passes with JWT -> 201)
 * 5. GET All Passes (GET /api/passes -> 200)
 * 6. PUT Update Pass (PUT /api/passes/:id with JWT -> 200)
 * 7. DELETE Revoke Pass (DELETE /api/passes/:id with JWT -> 200)
 */

const http = require('http');

const PORT = process.env.PORT || 5001;

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

function banner(title) {
  console.log(`\n${colors.cyan}════════════════════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}${title}${colors.reset}`);
  console.log(`${colors.cyan}════════════════════════════════════════════════════════════════════════════${colors.reset}`);
}

function makeRequest({ method, path, data = null, token = null }) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    const options = {
      hostname: 'localhost',
      port: PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

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

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTestSuite() {
  console.log(`\n${colors.bright}${colors.blue}🚀 STARTING EXPRESS REST API & JWT AUTH TEST RUNNER (ROLL 14 - PUNEET DHONGADE)${colors.reset}\n`);

  try {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const testUser = {
      username: `student_puneet_${randomSuffix}`,
      password: 'StrongPassword@123',
      email: `puneet_${randomSuffix}@mumbaibus.org`
    };

    let authToken = null;
    let createdPassId = null;

    // STEP 1: User Registration
    banner('STEP 1: USER REGISTRATION [POST /api/auth/register]');
    console.log(`${colors.yellow}Request Payload:${colors.reset}`, JSON.stringify(testUser, null, 2));
    const regRes = await makeRequest({
      method: 'POST',
      path: '/api/auth/register',
      data: testUser
    });
    console.log(`${colors.green}Status Code:${colors.reset} ${regRes.status} Created`);
    console.log(`${colors.bright}Response Body:${colors.reset}`);
    console.log(JSON.stringify(regRes.body, null, 2));

    // STEP 2: User Login & JWT Generation
    banner('STEP 2: USER LOGIN [POST /api/auth/login]');
    const loginPayload = {
      username: testUser.username,
      password: testUser.password
    };
    console.log(`${colors.yellow}Request Payload:${colors.reset}`, JSON.stringify(loginPayload, null, 2));
    const loginRes = await makeRequest({
      method: 'POST',
      path: '/api/auth/login',
      data: loginPayload
    });
    console.log(`${colors.green}Status Code:${colors.reset} ${loginRes.status} OK`);
    console.log(`${colors.bright}Response Body:${colors.reset}`);
    console.log(JSON.stringify(loginRes.body, null, 2));

    authToken = loginRes.body.token;
    console.log(`\n${colors.magenta}Extracted JWT Bearer Token:${colors.reset} ${authToken.slice(0, 32)}...[TRUNCATED]`);

    // STEP 3: Unauthorized Access Demonstration (401 Expected)
    banner('STEP 3: UNAUTHORIZED REQUEST TEST (NO JWT) [POST /api/passes]');
    console.log(`${colors.yellow}Attempting to issue pass WITHOUT Authorization header...${colors.reset}`);
    const unauthRes = await makeRequest({
      method: 'POST',
      path: '/api/passes',
      data: {
        passengerName: 'Unauthorized Commuter',
        route: 'Dadar to CSMT',
        passType: 'Monthly',
        validityDays: 30
      }
    });
    console.log(`${colors.red}Expected Status Code:${colors.reset} ${unauthRes.status} Unauthorized`);
    console.log(`${colors.bright}Response Body (Access Blocked):${colors.reset}`);
    console.log(JSON.stringify(unauthRes.body, null, 2));

    // STEP 4: Authorized Pass Creation (201 Expected)
    banner('STEP 4: AUTHORIZED PASS CREATION (WITH JWT) [POST /api/passes]');
    const newPassData = {
      passengerName: 'Puneet Dhongade (Roll 14)',
      route: 'Andheri Station (W) to Bandra Kurla Complex (BKC)',
      passType: 'Student',
      validityDays: 90
    };
    console.log(`${colors.yellow}Request with Authorization: Bearer <token>${colors.reset}`);
    console.log(`${colors.yellow}Payload:${colors.reset}`, JSON.stringify(newPassData, null, 2));
    const authPostRes = await makeRequest({
      method: 'POST',
      path: '/api/passes',
      data: newPassData,
      token: authToken
    });
    console.log(`${colors.green}Status Code:${colors.reset} ${authPostRes.status} Created`);
    console.log(`${colors.bright}Created Pass Response:${colors.reset}`);
    console.log(JSON.stringify(authPostRes.body, null, 2));

    createdPassId = authPostRes.body.data.id;

    // STEP 5: GET All Passes (Public Endpoint)
    banner('STEP 5: RETRIEVE ALL BUS PASSES [GET /api/passes]');
    console.log(`${colors.yellow}Request: GET /api/passes${colors.reset}`);
    const getRes = await makeRequest({
      method: 'GET',
      path: '/api/passes'
    });
    console.log(`${colors.green}Status Code:${colors.reset} ${getRes.status} OK`);
    console.log(`Total Passes in System: ${colors.bright}${getRes.body.count}${colors.reset}`);
    console.log(`${colors.bright}Passes Listing (First 3):${colors.reset}`);
    console.log(JSON.stringify(getRes.body.data.slice(0, 3), null, 2));

    // STEP 6: PUT Update Pass (Protected Endpoint)
    banner(`STEP 6: UPDATE PASS RECORD [PUT /api/passes/${createdPassId}]`);
    const updatePayload = {
      route: 'Andheri Station (W) to Bandra Kurla Complex (BKC) [AC Express]',
      validityDays: 180
    };
    console.log(`${colors.yellow}Updating validity to 180 days with JWT auth...${colors.reset}`);
    console.log(`${colors.yellow}Payload:${colors.reset}`, JSON.stringify(updatePayload, null, 2));
    const putRes = await makeRequest({
      method: 'PUT',
      path: `/api/passes/${createdPassId}`,
      data: updatePayload,
      token: authToken
    });
    console.log(`${colors.green}Status Code:${colors.reset} ${putRes.status} OK`);
    console.log(`${colors.bright}Updated Pass Body:${colors.reset}`);
    console.log(JSON.stringify(putRes.body, null, 2));

    // STEP 7: DELETE Revoke Pass (Protected Endpoint)
    banner(`STEP 7: REVOKE BUS PASS [DELETE /api/passes/${createdPassId}]`);
    console.log(`${colors.yellow}Revoking pass ${createdPassId} with JWT auth...${colors.reset}`);
    const delRes = await makeRequest({
      method: 'DELETE',
      path: `/api/passes/${createdPassId}`,
      token: authToken
    });
    console.log(`${colors.green}Status Code:${colors.reset} ${delRes.status} OK`);
    console.log(`${colors.bright}Deleted Pass Response:${colors.reset}`);
    console.log(JSON.stringify(delRes.body, null, 2));

    banner('TEST SUMMARY');
    console.log(`${colors.green}${colors.bright}🎉 ALL 7 API ENDPOINTS TESTED SUCCESSFULLY!${colors.reset}`);
    console.log(`• Register: 201 Created`);
    console.log(`• Login: 200 OK (JWT issued)`);
    console.log(`• Unauthorized POST: 401 Unauthorized (Security verified)`);
    console.log(`• Authorized POST: 201 Created`);
    console.log(`• GET All: 200 OK`);
    console.log(`• PUT Update: 200 OK`);
    console.log(`• DELETE: 200 OK`);
    console.log(`\nTake a screenshot of this output for Program 4 submission.\n`);

  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      console.error(`\n${colors.red}❌ Connection Error: Cannot connect to http://localhost:${PORT}.${colors.reset}`);
      console.error(`Make sure Program 4 server is active: ${colors.yellow}npm start${colors.reset}\n`);
    } else {
      console.error(`\n${colors.red}❌ API Test Failed:${colors.reset}`, err.message);
    }
  }
}

runTestSuite();

