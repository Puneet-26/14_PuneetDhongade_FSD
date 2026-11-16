# Program 3: Core Node.js Server Utility for Bus Pass Management
**Student Name:** Puneet Dhongade  
**Roll No:** 14  
**Class:** B.Tech (AI & DS), Semester V  
**Subject:** Full Stack Development (Programming Exercise)  
**Course Outcomes Covered:** CO4  

---

## 1. Overview
Program 3 is a server-side Bus Pass Management utility engineered purely using Node.js standard built-in modules (`http`, `fs`, `path`, and `events`) without Express or third-party packages. It exposes an HTTP server on port `3001` to serve server metadata (`GET /`), read records from `passes.json` using `fs.promises.readFile` (`GET /passes`), and append new passes after payload validation (`POST /passes`). Application state mutations trigger a custom `EventEmitter` (`passEmitter`) which streams timestamped audit trails directly to `activity.log` using an asynchronous `fs.createWriteStream`. A dedicated test client (`test_client.js`) is included to verify all operations automatically.

## 2. Key Modules & Technical Implementation
- `http`: Configures a raw Node.js HTTP server handling routing, status codes, CORS headers, and chunked request streams.
- `fs` & `path`: Safely locates and reads/writes `passes.json` using absolute file paths and promise-based I/O.
- `events` (`EventEmitter`): Decouples core logic by publishing custom domain events (`passFetched`, `passAdded`).
- `fs.createWriteStream`: Captures emitted events and writes structured log entries to `activity.log` efficiently without blocking the event loop.

## 3. How to Run & Test
### Step 1: Start the Core Server
In your first terminal:
```bash
cd 14_PuneetDhongade_FSD/Program3
node server.js
```
The server will start listening on `http://localhost:3001/`.

### Step 2: Run the Automated Test Client
In a second terminal:
```bash
cd 14_PuneetDhongade_FSD/Program3
node test_client.js
```
This script runs GET, POST, verification, and logs inspection, displaying formatted color output ideal for screenshots.

## 4. File Manifest
- `server.js` — Core HTTP server with routing and EventEmitter stream logging
- `passes.json` — Persistent JSON database of bus passes
- `activity.log` — Continuous stream log written by `fs.createWriteStream`
- `test_client.js` — Automated HTTP test script using built-in `http.request`
- `package.json` — Convenient npm script runners (`npm start`, `npm test`)
- `README.md` — Program documentation

