@echo off
REM ============================================================
REM Start Frontend (React + Vite)
REM ============================================================

echo.
echo Starting CAP Frontend (React + Vite)...
echo.

cd /d "%~dp0frontend-web"

echo Checking dependencies...
if not exist "node_modules" (
    echo Installing npm packages...
    call npm install
)

echo Creating .env.local...
(
echo VITE_API_URL=http://localhost:3001/api
) > .env.local

echo.
echo [OK] Starting frontend dev server on http://localhost:5173
echo [OK] API Backend: http://localhost:3001
echo [OK] AI Engine: http://localhost:8000
echo [OK] Press Ctrl+C to stop
echo.

call npm run dev

pause
