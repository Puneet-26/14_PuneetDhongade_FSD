# Full Stack Development – Programming Exercise (Bus Pass Management System)
**Practical Assignment Submission Guide & Execution Manual**

---

### Student Identification & Academic Profile
- **Student Name:** Puneet Dhongade
- **Student Roll No.:** 14
- **Program & Branch:** Bachelor of Technology in Artificial Intelligence & Data Science (B.Tech AI & DS)
- **Semester & Academic Year:** Semester V | 2026–2027
- **Course Title:** Full Stack Development (Web Development Lab)
- **Exercise Topic:** Bus Pass Management System (Five Programs Covering CO1 – CO6)

---

## Course Outcomes (CO) Coverage Matrix

| Program | Title & Technology Stack | Focus Area | Course Outcome |
|---|---|---|:---:|
| **Program 1** | Browser-Based Bus Pass Interface (HTML5, CSS3, ES6+ JavaScript, Fetch API) | DOM Manipulation, Async/Await, Simulated HTTP Console, Validation | **CO1, CO2** |
| **Program 2** | React Bus Pass Application (Vite, React 18, React Router v6) | Functional Components, JSX, Props, State, LocalStorage, Routing | **CO3** |
| **Program 3** | Core Node.js Server-Side Utility (Without Express) | Native HTTP, Path & FS Modules, Streams, Custom EventEmitter | **CO4** |
| **Program 4** | Express.js REST API with JWT Bearer Authentication | REST CRUD, Request Logger & Validator Middleware, bcryptjs, JWT | **CO5** |
| **Program 5** | Full-Stack Integration (React Frontend + Express/Mongoose Backend + Deployment) | MERN Stack, MongoDB Persistence, CORS, Vercel & Render Config | **CO6** |

---

## Program 1: Browser-Based Bus Pass Management Interface
*Course Outcomes: CO1 (Client-Side Markup & Styling) & CO2 (Dynamic DOM & Asynchronous Programming)*

### (a) Brief Technical Explanation (for Assignment Report)
> Program 1 implements a responsive client-side bus pass management interface using semantic HTML5, modern CSS3 card grids, and vanilla JavaScript (ES6+). The system dynamically loads passenger records from `sample_passes.json` using the Fetch API with `async/await`, backed by a resilient in-memory fallback to support execution under the browser's `file://` origin. Strict client-side validation evaluates user inputs with real-time error feedback, and live search and category filtering allow instantaneous record retrieval. Additionally, simulated HTTP request/response activity (GET, POST, DELETE) is rendered in an interactive embedded terminal panel to demonstrate network communication paradigms visually.

### (b) Exact Terminal Commands to Run
You can run Program 1 in two ways:
```bash
# Option 1: Open index.html directly in any web browser
# (Navigate to 14_PuneetDhongade_FSD/Program1 and double click index.html)

# Option 2: Run via lightweight local HTTP server (Recommended for Fetch API)
cd 14_PuneetDhongade_FSD/Program1
npx serve .
# Or using Python:
python -m http.server 3000
```
*Access URL:* `http://localhost:3000/` (or port shown by `npx serve`).

### (c) List of Exact Screenshots to Capture for PDF Report
1. **Screenshot 1.1 — Full Dashboard Overview:** The application loaded in the browser displaying student header banner (Roll No. 14, Puneet Dhongade), the four metric counter cards (Total, Student, Monthly, Fare), the application form, and the initial active pass cards.
2. **Screenshot 1.2 — Form Input Validation:** Attempting to submit the form with invalid or empty fields, showcasing inline error messages under Passenger Name and Route.
3. **Screenshot 1.3 — Dynamic Pass Creation & Console Log:** After submitting a valid pass for a Mumbai route, showing the newly appended pass card at the top and the corresponding `[POST 201 Created]` entry in the Simulated HTTP Activity Console.
4. **Screenshot 1.4 — Live Search and Category Filter:** Entering a search term (e.g., "Andheri") or selecting "Student Only" from the dropdown filter, showing filtered cards and updated count badge.
5. **Screenshot 1.5 — Revoke Pass & DELETE Log:** Clicking "Revoke" on a card, confirming the prompt, and highlighting the `[DELETE 200 OK]` entry in the HTTP console.

---

## Program 2: React Application for Bus Pass Management
*Course Outcome: CO3 (Component-Based UI Architecture & React Framework)*

### (a) Brief Technical Explanation (for Assignment Report)
> Program 2 is a single-page React application engineered using Vite and React Router v6 to deliver a modular transit management system. The architecture divides UI responsibilities into reusable functional components—`Navbar`, `PassList`, `PassCard`, and `PassForm`—passing data through unidirectional props and event callbacks. State is centralized in the root component using `useState` and synchronized to browser `localStorage` via `useEffect` to ensure state persistence across page refreshes. The application incorporates declarative client-side routing between the Pass Directory (`/`) and Application Form (`/apply`), complemented by conditional rendering for empty search states and live fare calculation.

### (b) Exact Terminal Commands to Run
```bash
cd 14_PuneetDhongade_FSD/Program2
npm install
npm run dev
```
*Access URL:* `http://localhost:5173/`

### (c) List of Exact Screenshots to Capture for PDF Report
1. **Screenshot 2.1 — React Pass Directory (`/`):** The main listing page showing the academic top banner, metric summary statistics, search/sort toolbar, and pre-seeded Mumbai route pass cards.
2. **Screenshot 2.2 — New Pass Application Form (`/apply`):** Navigating to `/apply` showing the clean data-entry form with concession previews (Student 50% discount / Senior Citizen 40% discount) and controlled inputs.
3. **Screenshot 2.3 — Form Submission & Auto-Redirect:** Submitting a newly created bus pass, showing the green success alert banner followed by the updated directory with the new card rendered.
4. **Screenshot 2.4 — Conditional Empty State:** Typing a non-existent name into the search bar or clearing all passes, capturing the conditionally rendered "No Bus Passes Found" empty-state graphic and action buttons.
5. **Screenshot 2.5 — LocalStorage Persistence:** Opening Chrome DevTools > Application tab > Local Storage (`mumbai_bus_passes_roll14`), showing the JSON-serialized passes array persisting in the client storage.

---

## Program 3: Core Node.js Server Utility (Without Express)
*Course Outcome: CO4 (Server-Side JavaScript, File System I/O & Event-Driven Architecture)*

### (a) Brief Technical Explanation (for Assignment Report)
> Program 3 is a backend utility built exclusively with native Node.js standard modules (`http`, `fs`, `path`, and `events`) without using Express or third-party packages. The HTTP server listens on port 3001, dispatching incoming requests based on pathnames and methods while parsing request streams with strict payload size limits. Persistent storage is managed via asynchronous file operations using `fs.promises.readFile` and `fs.promises.writeFile` on `passes.json`. Crucially, state transformations trigger a custom `EventEmitter` instance (`passEmitter`) which streams timestamped audit log entries to `activity.log` using an asynchronous writable stream (`fs.createWriteStream`).

### (b) Exact Terminal Commands to Run & Test
Open two terminal windows:

**Terminal 1 — Start the Server:**
```bash
cd 14_PuneetDhongade_FSD/Program3
node server.js
```
*(Server listens on `http://localhost:3001/`)*

**Terminal 2 — Run the Automated Test Client:**
```bash
cd 14_PuneetDhongade_FSD/Program3
node test_client.js
```

### (c) List of Exact Screenshots to Capture for PDF Report
1. **Screenshot 3.1 — Server Startup Banner:** Terminal 1 showing the startup message with student name (Puneet Dhongade, Roll No. 14), port 3001, and initialized log stream path.
2. **Screenshot 3.2 — Automated Test Execution (GET / and GET /passes):** Terminal 2 output showing Test 1 (GET `/` status JSON) and Test 2 (GET `/passes` returning parsed records from `passes.json`).
3. **Screenshot 3.3 — Pass Creation & EventEmitter Dispatch:** Terminal 2 output showing Test 3 (POST `/passes` returning 201 Created) along with the corresponding cyan/green `[EVENT EMITTED]` logs printed in Terminal 1.
4. **Screenshot 3.4 — Event Stream Output in `activity.log`:** Test 5 console output displaying the latest lines read from `activity.log`, proving that `fs.createWriteStream` recorded `passFetched` and `passAdded` events with ISO timestamps.

---

## Program 4: Express.js REST API with JWT Authentication
*Course Outcome: CO5 (RESTful Web Services, Middleware & Security)*

### (a) Brief Technical Explanation (for Assignment Report)
> Program 4 is a RESTful API built with Express.js that exposes secure CRUD operations for bus pass records using JWT (JSON Web Token) bearer authentication. The application implements layered architecture with custom request-logging middleware for performance monitoring, input validation middleware for payload hygiene, and centralized error-handling middleware for uniform JSON responses. User passwords are encrypted with `bcryptjs` salt rounds during registration (`POST /api/auth/register`), and verified during login (`POST /api/auth/login`) to generate signed tokens. Sensitive endpoints (`POST`, `PUT`, `DELETE` on `/api/passes`) are strictly guarded by JWT verification middleware, rejecting unauthorized requests with HTTP 401 Unauthorized.

### (b) Exact Terminal Commands to Run & Test
Open two terminal windows:

**Terminal 1 — Install & Start Express API:**
```bash
cd 14_PuneetDhongade_FSD/Program4
npm install
npm start
```
*(Server listens on `http://localhost:5001/`)*

**Terminal 2 — Run the Complete REST API Test Suite:**
```bash
cd 14_PuneetDhongade_FSD/Program4
node test_api.js
```

### (c) List of Exact Screenshots to Capture for PDF Report
1. **Screenshot 4.1 — User Registration & Login:** Terminal 2 showing Step 1 (`POST /api/auth/register` returning 201 Created) and Step 2 (`POST /api/auth/login` returning 200 OK with the generated signed JWT string).
2. **Screenshot 4.2 — Unauthorized Request Rejection (401):** Terminal 2 showing Step 3 where an unauthenticated `POST /api/passes` request is blocked with `401 Unauthorized` and an "Access Denied" error message.
3. **Screenshot 4.3 — Authorized Pass Creation (201):** Terminal 2 showing Step 4 where a valid JWT token in the `Authorization: Bearer <token>` header allows the pass to be issued successfully.
4. **Screenshot 4.4 — Pass Update & Revocation (PUT & DELETE):** Terminal 2 showing Step 6 (`PUT /api/passes/:id` updating route/validity) and Step 7 (`DELETE /api/passes/:id` successfully deleting the record).
5. **Screenshot 4.5 — Express Request Logger Console:** Terminal 1 showing the color-coded request logging middleware output displaying HTTP verbs, URLs, status codes (201, 200, 401), and response times in milliseconds.

---

## Program 5: Full-Stack Integration (MERN Architecture & Deployment)
*Course Outcome: CO6 (End-to-End Web Application Integration & Cloud Deployment)*

### (a) Brief Technical Explanation (for Assignment Report)
> Program 5 integrates a React + Vite frontend with an Express.js backend and a MongoDB database managed through Mongoose Object Data Modeling (ODM). The system implements full-stack authentication where frontend users log in or register to receive a JWT token stored in `localStorage`, which is then attached to Axios/Fetch headers for all state-mutating requests. The Mongoose `BusPass` schema enforces strict type constraints, enum validations, and default values, ensuring data integrity across Mumbai bus routes. Deployment manifests are fully prepared, including `render.yaml` for backend containerization on Render and `vercel.json` with client-side rewrite configurations for single-page routing on Vercel.

### (b) Exact Terminal Commands to Run

**Terminal 1 — Start the Express & Mongoose Backend:**
```bash
cd 14_PuneetDhongade_FSD/Program5/backend
npm install
npm start
```
*(Backend runs on `http://localhost:5000/`)*

**Terminal 2 — Start the React + Vite Frontend:**
```bash
cd 14_PuneetDhongade_FSD/Program5/frontend
npm install
npm run dev
```
*(Frontend runs on `http://localhost:5174/`)*

### (c) List of Exact Screenshots to Capture for PDF Report
1. **Screenshot 5.1 — Full-Stack Interface & Database Status:** Browser displaying the Program 5 React UI at `http://localhost:5174/`, highlighting the backend status pill ("Backend Store: MongoDB Atlas / Local" or "In-Memory Fallback") and active pass cards.
2. **Screenshot 5.2 — Authentication Modal (Login / Register):** Clicking "🔑 Login / Register" to show the modal popup, logging in with `puneet14` / `Puneet@123` to obtain a JWT token.
3. **Screenshot 5.3 — User Profile Badge & Protected Action:** Showing the navbar updated with "👤 puneet14" and a logout button, confirming active authenticated status.
4. **Screenshot 5.4 — Full-Stack Pass Creation:** Navigating to `/apply`, filling in a new pass for a commuter, submitting it, and capturing the success message confirming persistence in the backend database.
5. **Screenshot 5.5 — Pass Deletion / Revocation:** Clicking the "Revoke" button on an issued card, confirming the browser prompt, and verifying the card's immediate removal from the UI and backend collection.

---

### (d) Program 5 Specification Tables (Mongoose Schema & API Endpoints)

#### Table 1: Mongoose Schema Model (`BusPass.js`)
| Field Name | BSON / Mongoose Type | Validation Rules / Constraints | Default Value | Description |
|---|---|---|---|---|
| `passId` | `String` | Required, Unique, Indexed, Trimmed | N/A | Unique human-readable pass identifier (e.g. `BP-M101`) |
| `passengerName`| `String` | Required, Min Length: 3, Trimmed | N/A | Full legal name of the pass holder |
| `route` | `String` | Required, Trimmed | N/A | Mumbai metropolitan bus route description |
| `passType` | `String` | Required, Enum: `['Student', 'Monthly', 'Senior Citizen', 'General']` | `'Monthly'` | Concession category for fare computation |
| `validityDays` | `Number` | Required, Minimum: 1 | `30` | Number of consecutive days the pass remains valid |
| `price` | `Number` | Required, Minimum: 0 | Calculated | Fare in Indian Rupees after applying concessions |
| `issueDate` | `Date` | Required | `Date.now` | Date and time when the pass was authorized |
| `expiryDate` | `Date` | Required | Calculated | Date after which the pass becomes invalid |
| `status` | `String` | Enum: `['Active', 'Expired', 'Suspended']` | `'Active'` | Operational status of the transit pass |
| `issuedBy` | `String` | Trimmed | `'BEST Transit Authority'` | User/Admin who authorized pass issuance |
| `timestamps` | `Boolean` | Schema Option | `true` | Automatically generates `createdAt` and `updatedAt` |

#### Table 2: User Authentication Schema (`User.js`)
| Field Name | Type | Constraints | Description |
|---|---|---|---|
| `username` | `String` | Required, Unique, Min Length: 3, Trim | Unique login identifier |
| `email` | `String` | Required, Unique, Valid Email Regex | User's contact email address |
| `password` | `String` | Required, Min Length: 6, bcrypt Hashed | Salted & hashed password hash |
| `role` | `String` | Enum: `['Student', 'Admin', 'Officer']` | Access control role |

#### Table 3: REST API Endpoints Specification
| Method | URL Endpoint | Auth Level | Request Body (JSON) | Success Response | Status Code |
|---|---|---|---|---|:---:|
| `GET` | `/` | Public | None | API Health, Roll No 14 Metadata | 200 OK |
| `POST` | `/api/auth/register`| Public | `{ username, email, password }` | `{ success, token, user }` | 201 Created |
| `POST` | `/api/auth/login` | Public | `{ username, password }` | `{ success, token, user }` | 200 OK |
| `GET` | `/api/passes` | Public | Query: `?search=&type=` | `{ success, count, data: [...] }` | 200 OK |
| `GET` | `/api/passes/:id` | Public | None | `{ success, data: { ... } }` | 200 OK |
| `POST` | `/api/passes` | Bearer JWT | `{ passengerName, route, passType, validityDays }` | `{ success, message, data: { ... } }` | 201 Created |
| `PUT` | `/api/passes/:id` | Bearer JWT | `{ route, validityDays, status }` | `{ success, message, data: { ... } }` | 200 OK |
| `DELETE`| `/api/passes/:id` | Bearer JWT | None | `{ success, message, data: { ... } }` | 200 OK |

---

## Cloud Deployment Configurations

### 1. Backend Deployment on Render (`render.yaml`)
The file `14_PuneetDhongade_FSD/Program5/backend/render.yaml` contains standard Infrastructure-as-Code for Render:
```yaml
services:
  - type: web
    name: bus-pass-backend-roll14
    env: node
    region: oregon
    plan: free
    rootDir: Program5/backend
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: MONGO_URI
        sync: false
      - key: JWT_SECRET
        generateValue: true
```
**Steps to Deploy:**
1. Commit and push the code to a GitHub repository.
2. Log into [Render.com](https://render.com) and click **New > Blueprint**.
3. Select your repository; Render will parse `render.yaml` and prompt for `MONGO_URI`.
4. Paste your MongoDB Atlas URI string and click **Apply**.

### 2. Frontend Deployment on Vercel (`vercel.json`)
The file `14_PuneetDhongade_FSD/Program5/frontend/vercel.json` configures single-page application (SPA) routing:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
**Steps to Deploy:**
1. Log into [Vercel.com](https://vercel.com) and select **Add New Project**.
2. Select your repository and set the **Root Directory** to `14_PuneetDhongade_FSD/Program5/frontend`.
3. In the **Environment Variables** section, add:
   - `VITE_API_URL` = `https://<your-render-backend-url>/api`
4. Click **Deploy**. Vercel will build the React application and deploy it globally on the Edge Network.

---

## Summary Checklist for Student Submission
- [x] All 5 sub-projects created inside `14_PuneetDhongade_FSD/`.
- [x] Program 1: HTML5, CSS3, DOM manipulation, Fetch API, and simulated HTTP console.
- [x] Program 2: Vite + React, React Router, 4 components, `useState`, `useEffect`, `localStorage`.
- [x] Program 3: Core Node.js without Express, `http`, `fs`, `path`, `events`, `activity.log`, and `test_client.js`.
- [x] Program 4: Express REST API, `bcryptjs`, `jsonwebtoken`, custom middleware, and `test_api.js`.
- [x] Program 5: Full-Stack MERN, Mongoose `BusPass` model, `render.yaml`, `vercel.json`, and JWT auth.
- [x] Sample Mumbai transit routes seeded across all programs.
- [x] Zero hardcoded secrets; `.env.example` templates provided.

