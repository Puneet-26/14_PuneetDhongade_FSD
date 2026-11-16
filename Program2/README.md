# Program 2: React Application for Bus Pass Management
**Student Name:** Puneet Dhongade  
**Roll No:** 14  
**Class:** B.Tech (AI & DS), Semester V  
**Subject:** Full Stack Development (Programming Exercise)  
**Course Outcomes Covered:** CO3  

---

## 1. Overview
Program 2 is a single-page React application for metropolitan bus pass management scaffolded with Vite and React Router v6. It features a modular component hierarchy comprising `Navbar`, `PassForm`, `PassList`, and `PassCard`, utilizing unidirectional props data flow and localized state management. Application state is handled using React's `useState` and synchronized across browser sessions using `useEffect` with `localStorage`. The application includes multi-criteria search and category filtering, live fare calculations, conditional rendering for empty states, and seamless client-side routing between the Pass Directory (`/`) and Application Form (`/apply`).

## 2. Component Architecture
- `Navbar.jsx`: Top academic identity banner (Roll 14, Puneet Dhongade) and responsive navigation links with active indicators and dynamic pass count badge.
- `PassList.jsx`: Dashboard metrics (Total, Student, Monthly, Revenue), live text search, category filtering (Student, Monthly, Senior Citizen), sorting, and conditional empty-state rendering.
- `PassCard.jsx`: Reusable pass item card displaying transit details, concession tags, issue/expiry dates, simulated fare, and delete/revoke trigger.
- `PassForm.jsx`: Data-entry interface featuring strict controlled inputs, real-time concession calculations, validation error states, and programmatic redirect via `useNavigate`.

## 3. How to Run
Navigate into the `Program2` directory:
```bash
cd 14_PuneetDhongade_FSD/Program2
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

## 4. File Manifest
- `package.json` — Project metadata and dependencies (`react`, `react-router-dom`, `vite`)
- `vite.config.js` — Vite configuration with `@vitejs/plugin-react`
- `index.html` — HTML shell
- `src/main.jsx` — Application entry point with `BrowserRouter`
- `src/App.jsx` — Root component holding state and routes
- `src/data/initialPasses.js` — Mumbai route seed records and route constants
- `src/components/Navbar.jsx` — Navigation bar component
- `src/components/PassList.jsx` — Pass listing and filtering component
- `src/components/PassCard.jsx` — Reusable card component
- `src/components/PassForm.jsx` — Bus pass application form component
- `src/App.css` & `src/index.css` — CSS styling
- `README.md` — Program documentation

