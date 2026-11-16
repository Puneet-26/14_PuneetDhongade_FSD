# ==============================================================================
# Full Stack Development - Multi-Program Launcher
# Student: Puneet Dhongade | Roll No: 14 | B.Tech (AI & DS) Semester V
# Launches Programs 2, 3, 4, 5 (Backend & Frontend) in separate terminal windows/tabs
# and opens them in your web browser.
# ==============================================================================

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host " LAUNCHING PROGRAMS 2 TO 5 IN SEPARATE TERMINALS & BROWSER TABS   " -ForegroundColor Green
Write-Host " Student: Puneet Dhongade | Roll No: 14 | B.Tech (AI & DS) Sem V " -ForegroundColor White
Write-Host "=================================================================" -ForegroundColor Cyan

# 1. Program 2: React + Vite (Port 5173)
Write-Host "[1/5] Launching Program 2 (React Frontend - Port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$baseDir\Program2'; `$Host.UI.RawUI.WindowTitle = 'Program 2: React Frontend (Port 5173)'; Write-Host '--- PROGRAM 2: REACT FRONTEND (PORT 5173) ---' -ForegroundColor Cyan; npm run dev"

# 2. Program 3: Core Node.js HTTP Server (Port 3001)
Write-Host "[2/5] Launching Program 3 (Core Node.js Server - Port 3001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$baseDir\Program3'; `$Host.UI.RawUI.WindowTitle = 'Program 3: Core Node.js Server (Port 3001)'; Write-Host '--- PROGRAM 3: CORE NODE.JS SERVER (PORT 3001) ---' -ForegroundColor Cyan; node server.js"

# 3. Program 4: Express.js REST API with JWT (Port 5001)
Write-Host "[3/5] Launching Program 4 (Express REST API - Port 5001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$baseDir\Program4'; `$Host.UI.RawUI.WindowTitle = 'Program 4: Express REST API (Port 5001)'; Write-Host '--- PROGRAM 4: EXPRESS REST API (PORT 5001) ---' -ForegroundColor Cyan; node server.js"

# 4. Program 5 Backend: Express + Mongoose (Port 5000)
Write-Host "[4/5] Launching Program 5 Backend (Express/Mongoose - Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$baseDir\Program5\backend'; `$Host.UI.RawUI.WindowTitle = 'Program 5: Express & MongoDB Backend (Port 5000)'; Write-Host '--- PROGRAM 5: BACKEND (PORT 5000) ---' -ForegroundColor Cyan; node server.js"

# 5. Program 5 Frontend: React + Vite (Port 5174)
Write-Host "[5/5] Launching Program 5 Frontend (React - Port 5174)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$baseDir\Program5\frontend'; `$Host.UI.RawUI.WindowTitle = 'Program 5: React Frontend (Port 5174)'; Write-Host '--- PROGRAM 5: REACT FRONTEND (PORT 5174) ---' -ForegroundColor Cyan; npm run dev"

# Wait 3 seconds for servers to initialize
Write-Host "`nWaiting for servers to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 3

# Open browser tabs for each running program
Write-Host "Opening web browser tabs..." -ForegroundColor Green
Start-Process "http://localhost:5173"  # Program 2 React UI
Start-Process "http://localhost:3001"  # Program 3 Core Node Utility
Start-Process "http://localhost:5001"  # Program 4 Express REST API
Start-Process "http://localhost:5000"  # Program 5 Backend Explorer
Start-Process "http://localhost:5174"  # Program 5 Full-Stack React UI

Write-Host "`nAll 5 servers launched in individual windows and opened in browser tabs!" -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Cyan
