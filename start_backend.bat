@echo off
REM ============================================================
REM Start Backend (Node.js + Express)
REM ============================================================

echo.
echo Starting CAP Backend (Node.js)...
echo.

cd /d "%~dp0backend"

echo Checking dependencies...
if not exist "node_modules" (
    echo Installing npm packages...
    call npm install
)

echo.
echo [OK] Starting backend server on http://localhost:3001
echo [OK] API: http://localhost:3001/api
echo [OK] Press Ctrl+C to stop
echo.

call npm run dev

pause
