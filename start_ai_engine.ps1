# ============================================================
# Start AI Engine (FastAPI)
# ============================================================

Write-Host ""
Write-Host "Starting CAP AI Engine (FastAPI)..." -ForegroundColor Cyan
Write-Host ""

$aiEngineDir = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) "ai-engine"

Push-Location $aiEngineDir

Write-Host "Installing/checking dependencies..." -ForegroundColor Yellow
pip install -q -r requirements.txt

Write-Host ""
Write-Host "[OK] Starting FastAPI server on http://localhost:8000" -ForegroundColor Green
Write-Host "[OK] API Documentation: http://localhost:8000/docs" -ForegroundColor Green
Write-Host "[OK] Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

python -m uvicorn api.main:app --reload --host 0.0.0.0 --port 8000

Read-Host "Press Enter to exit"
