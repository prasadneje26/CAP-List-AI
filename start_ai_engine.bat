@echo off
REM ============================================================
REM Start AI Engine (FastAPI)
REM ============================================================

echo.
echo Starting CAP AI Engine (FastAPI)...
echo.

cd /d "%~dp0ai-engine"

echo Installing/checking dependencies...
pip install -q -r requirements.txt

echo.
echo [OK] Starting FastAPI server on http://localhost:8000
echo [OK] API Documentation: http://localhost:8000/docs
echo [OK] Press Ctrl+C to stop
echo.

python -m uvicorn api.main:app --reload --host 0.0.0.0 --port 8000

pause
