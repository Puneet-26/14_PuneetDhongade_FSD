# Program 5: Backend (Express + MongoDB/Mongoose + JWT + Render)
**Student Name:** Puneet Dhongade  
**Roll No:** 14  
**Class:** B.Tech (AI & DS), Semester V  
**Course Outcome Covered:** CO6  

---

## 1. Overview
The Program 5 backend is an Express.js server integrated with MongoDB using Mongoose object modeling. It provides secure JWT authentication, password hashing via bcrypt, and strict schema validation for digital bus passes. The service includes CORS support for cross-origin frontend communication, centralized error handling, and deployment configuration targeting Render via `render.yaml`. An in-memory fallback ensures full offline functionality even if MongoDB Atlas credentials are not yet configured.

## 2. Mongoose Schema: `BusPass`
- `passId` (String, required, unique, indexed)
- `passengerName` (String, minlength: 3, required)
- `route` (String, required)
- `passType` (String, enum: `['Student', 'Monthly', 'Senior Citizen', 'General']`)
- `validityDays` (Number, min: 1, required)
- `price` (Number, min: 0, required)
- `issueDate` (Date, default: Date.now)
- `expiryDate` (Date, required)
- `status` (String, enum: `['Active', 'Expired', 'Suspended']`, default: `'Active'`)
- `issuedBy` (String, default: `'BEST Transit Authority'`)

## 3. How to Run
```bash
cd 14_PuneetDhongade_FSD/Program5/backend
npm install
npm start
```
Server runs on `http://localhost:5000/`.

## 4. Render Deployment
The project contains `render.yaml`. To deploy on Render:
1. Push repository to GitHub.
2. In Render dashboard, select **New > Blueprint** and link the repo.
3. Configure the `MONGO_URI` environment variable with your MongoDB Atlas connection string.

