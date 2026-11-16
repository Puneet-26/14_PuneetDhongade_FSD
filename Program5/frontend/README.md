# Program 5: Frontend (React + Vite + React Router + Vercel)
**Student Name:** Puneet Dhongade  
**Roll No:** 14  
**Class:** B.Tech (AI & DS), Semester V  
**Course Outcome Covered:** CO6  

---

## 1. Overview
The Program 5 frontend is a single-page React application built with Vite and React Router v6 that connects to the Program 5 Express backend API. It implements JWT token handling via `localStorage`, login and register modal workflows, real-time fare computation, live search and category filtering, and full CRUD operations (view, create, revoke passes). The application includes `vercel.json` configured with SPA rewrite rules for production deployment on Vercel.

## 2. Key Features
- **API Integration:** Centralized fetch client in `services/api.js` that automatically attaches JWT `Bearer` headers to protected mutation endpoints.
- **Authentication State:** Global auth state with sign-in and sign-up modals; provides immediate feedback if unauthenticated users attempt to issue or revoke passes.
- **Dynamic Dashboard Metrics:** Displays counts, concession breakdowns, total fare value, and active database connection mode (MongoDB vs. Memory Fallback).
- **Vercel SPA Deployment Ready:** Contains `vercel.json` rewrite routing.

## 3. How to Run
```bash
cd 14_PuneetDhongade_FSD/Program5/frontend
npm install
npm run dev
```
Open `http://localhost:5174/` in your browser. (Ensure the backend is running on `http://localhost:5000/`).

## 4. Vercel Deployment
To deploy this frontend to Vercel:
1. Push project to GitHub.
2. In Vercel, import the repository and set the root directory to `Program5/frontend`.
3. Set the Environment Variable:
   - `VITE_API_URL` = `<your-render-backend-url>/api` (e.g., `https://bus-pass-backend-roll14.onrender.com/api`)
4. Click **Deploy**. Vercel will build the SPA using `vercel.json` rewrites.

