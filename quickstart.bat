@echo off
REM Quick Start Script for Cyber Fraud Support System
REM This script helps set up and run both backend and frontend

echo ========================================
echo Cyber Fraud Support System - Quick Start
echo ========================================
echo.

REM Check if running from correct directory
if not exist "backend" (
    echo Error: backend folder not found
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

if not exist "frontend" (
    echo Error: frontend folder not found
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

echo Choose an option:
echo 1. Full Setup (backend + frontend)
echo 2. Backend Only
echo 3. Frontend Only
echo 4. Start Servers (if already set up)
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto full_setup
if "%choice%"=="2" goto backend_only
if "%choice%"=="3" goto frontend_only
if "%choice%"=="4" goto start_servers
goto invalid_choice

:full_setup
echo.
echo ========== Setting up Backend ==========
cd backend
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate.bat

if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
    echo.
    echo ⚠️  Please edit backend\.env if needed
    echo.
)

echo Installing dependencies...
pip install -r requirements.txt

cd ..

echo.
echo ========== Setting up Frontend ==========
cd frontend
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
)

cd ..

echo.
echo ✓ Setup complete!
echo.
goto start_servers

:backend_only
echo.
echo ========== Setting up Backend ==========
cd backend
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate.bat

if not exist ".env" (
    copy .env.example .env
)

echo Installing dependencies...
pip install -r requirements.txt
cd ..
echo ✓ Backend setup complete!
pause
exit /b 0

:frontend_only
echo.
echo ========== Setting up Frontend ==========
cd frontend
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

if not exist ".env" (
    copy .env.example .env
)
cd ..
echo ✓ Frontend setup complete!
pause
exit /b 0

:start_servers
echo.
echo ========== Starting Servers ==========
echo.
echo Open TWO TERMINAL WINDOWS
echo.
echo Terminal 1 - Backend:
echo   cd backend
echo   venv\Scripts\activate.bat
echo   python main.py
echo.
echo Terminal 2 - Frontend:
echo   cd frontend
echo   npm run dev
echo.
echo Then open your browser to: http://localhost:3000 or http://localhost:3000
echo.
echo ========================================
echo.
pause
exit /b 0

:invalid_choice
echo Invalid choice. Please enter 1, 2, 3, or 4.
pause
exit /b 1
