# Program 4: Express.js REST API with JWT Authentication
**Student Name:** Puneet Dhongade  
**Roll No:** 14  
**Class:** B.Tech (AI & DS), Semester V  
**Subject:** Full Stack Development (Programming Exercise)  
**Course Outcomes Covered:** CO5  

---

## 1. Overview
Program 4 provides a production-grade Express.js REST API implementing complete CRUD functionality for a Bus Pass Management system, protected by JSON Web Token (JWT) Bearer authentication and bcrypt password encryption. The architecture features modular routing, custom performance/request logging middleware, explicit payload validation, and centralized error handling. Authentication endpoints allow users to register and obtain cryptographically signed tokens. In contrast, sensitive mutation routes (`POST`, `PUT`, `DELETE`) are strictly gated by JWT verification middleware, rejecting unauthorized calls with HTTP 401.

## 2. API Route Summary
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Public | API status, metadata, and routing index |
| `POST` | `/api/auth/register` | Public | Registers a new user with bcrypt password hashing |
| `POST` | `/api/auth/login` | Public | Authenticates credentials and returns signed JWT |
| `GET` | `/api/passes` | Public | Retrieves all bus passes (supports `?search=` and `?type=`) |
| `GET` | `/api/passes/:id` | Public | Retrieves a specific bus pass by ID |
| `POST` | `/api/passes` | Protected (JWT) | Issues a new bus pass |
| `PUT` | `/api/passes/:id` | Protected (JWT) | Updates details of an existing pass |
| `DELETE`| `/api/passes/:id` | Protected (JWT) | Revokes and deletes a bus pass |

## 3. How to Run & Test
### Step 1: Install Dependencies
```bash
cd 14_PuneetDhongade_FSD/Program4
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(A built-in default is automatically provided if `.env` is omitted).*

### Step 3: Start the Express Server
```bash
npm start
```
The server will bind to `http://localhost:5001/`.

### Step 4: Run the Complete Automated Test Suite
In a second terminal window:
```bash
node test_api.js
```
This single command runs through Register -> Login -> 401 Unauthorized Test -> 201 Authorized Creation -> GET -> PUT -> DELETE and prints cleanly formatted color output ready for screenshot capture.

## 4. File Manifest
- `server.js` — Main Express application setup and route mounting
- `package.json` — Dependencies (`express`, `bcryptjs`, `jsonwebtoken`, `cors`, `dotenv`)
- `.env.example` — Template for environment variables
- `middleware/auth.js` — JWT verification middleware
- `middleware/validator.js` — Validation rules for auth and pass payloads
- `middleware/requestLogger.js` — Timing and HTTP status logging middleware
- `middleware/errorHandler.js` — Centralized JSON error responder
- `routes/authRoutes.js` — Register and login endpoints
- `routes/passRoutes.js` — CRUD bus pass endpoints
- `test_api.js` — Comprehensive automated test runner
- `README.md` — Program documentation

