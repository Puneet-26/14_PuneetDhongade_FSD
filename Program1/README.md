# Program 1: Browser-Based Bus Pass Management Interface
**Student Name:** Puneet Dhongade  
**Roll No:** 14  
**Class:** B.Tech (AI & DS), Semester V  
**Subject:** Full Stack Development (Programming Exercise)  
**Course Outcomes Covered:** CO1, CO2  

---

## 1. Overview
Program 1 provides a responsive, browser-native Bus Pass Management application built using vanilla HTML5, CSS3, and modern JavaScript (ES6+). It utilizes DOM manipulation and event delegation to capture, validate, and dynamically render bus pass entries. Initial data is fetched asynchronously using the Fetch API with `async/await` from `sample_passes.json`, with a robust offline fallback to ensure uninterrupted functionality when opened directly using the `file://` protocol. The interface also incorporates live search, category-based filtering, and a visual HTTP activity console demonstrating GET, POST, and DELETE methods.

## 2. Key Features
- **Semantic HTML5 & Responsive CSS3:** Professional card layout, metrics dashboard, and academic banner.
- **Fetch API & Async/Await:** Loads `sample_passes.json` dynamically with offline fallback.
- **Strict Client-Side Validation:** Inline error feedback for passenger names (length, characters) and route selection.
- **Live Search & Category Filtering:** Instant multi-field filtering by passenger name, route, or category (Student, Monthly, Senior Citizen).
- **Simulated HTTP Method Activity Console:** Color-coded logging of GET (fetch), POST (issue pass), and DELETE (revoke pass) actions.
- **Dynamic Fare Computation:** Real-time calculation showing student (50% off) and senior citizen (40% off) concessions.

## 3. How to Run
### Option A: Open directly in any Web Browser
Double-click `index.html` or right-click and choose **Open with Google Chrome / Microsoft Edge / Firefox**.

### Option B: Run via a lightweight local server (recommended for Fetch API)
From this directory (`14_PuneetDhongade_FSD/Program1`):
```bash
# Using Python built-in server:
python -m http.server 3000

# OR using Node.js npx serve:
npx serve .
```
Then navigate to `http://localhost:3000` in your browser.

## 4. File Manifest
- `index.html` — Semantic markup and UI structure
- `style.css` — Custom responsive styling and theme variables
- `script.js` — DOM manipulation, validation, Fetch API, and state handling
- `sample_passes.json` — Sample Mumbai route bus pass seed records
- `README.md` — Program documentation

