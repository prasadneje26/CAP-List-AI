# AI College CAP Counseling Platform Runner
# This script starts the Frontend, Backend, and AI Engine in separate console windows.

Write-Host "Starting Backend..."
Start-Process node -ArgumentList "server.js" -WorkingDirectory "$PSScriptRoot\backend" -WindowStyle Normal

Write-Host "Starting AI Engine..."
Start-Process uvicorn -ArgumentList "api.main:app","--host","0.0.0.0","--port","8000" -WorkingDirectory "$PSScriptRoot\ai-engine" -WindowStyle Normal

Write-Host "Starting Frontend..."
Start-Process npm -ArgumentList "run","dev" -WorkingDirectory "$PSScriptRoot\frontend-web" -WindowStyle Normal

Write-Host "Project started successfully! You can find the three console windows running the services."
