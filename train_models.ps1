# ============================================================
# PowerShell Training Script - Run all ML models
# Usage: .\train_models.ps1
# ============================================================

param(
    [switch]$NoWait,
    [switch]$Verbose
)

# Resolve the project root
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$aiEngineDir = Join-Path $projectRoot "ai-engine"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CAP Platform - Model Training Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is available
$pythonCmd = "python"
try {
    $pythonVersion = & $pythonCmd --version 2>&1
    Write-Host "✓ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Python not found in PATH" -ForegroundColor Red
    Write-Host "  Please install Python 3.8+ or ensure it's in your PATH" -ForegroundColor Yellow
    exit 1
}

# Check if AI engine directory exists
if (-not (Test-Path $aiEngineDir)) {
    Write-Host "✗ ai-engine directory not found at: $aiEngineDir" -ForegroundColor Red
    exit 1
}

Write-Host "Project Root: $projectRoot" -ForegroundColor Gray
Write-Host "AI Engine Dir: $aiEngineDir" -ForegroundColor Gray
Write-Host ""

# Change to AI engine directory
Push-Location $aiEngineDir

Write-Host "Starting model training..." -ForegroundColor Yellow
Write-Host ""

# Run the master training script
if ($Verbose) {
    & $pythonCmd train_all_models.py -Verbose
} else {
    & $pythonCmd train_all_models.py
}

$exitCode = $LASTEXITCODE

Pop-Location

Write-Host ""
if ($exitCode -eq 0) {
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✓ Training completed successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
} else {
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "✗ Training failed with exit code: $exitCode" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
}

if (-not $NoWait) {
    Write-Host ""
    Write-Host "Press any key to continue..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

exit $exitCode
