@echo off
REM ============================================================
REM Batch Training Script - Run all ML models
REM Usage: train_models.bat
REM ============================================================

setlocal enabledelayedexpansion

REM Get the project root directory
set "SCRIPT_DIR=%~dp0"
set "AI_ENGINE_DIR=%SCRIPT_DIR%ai-engine"

echo.
echo ========================================
echo   CAP Platform - Model Training Script
echo ========================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo [X] Python not found in PATH
    echo     Please install Python 3.8+ or ensure it's in your PATH
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
echo [OK] %PYTHON_VERSION%

REM Check if AI engine directory exists
if not exist "%AI_ENGINE_DIR%" (
    echo.
    echo [X] ai-engine directory not found at: %AI_ENGINE_DIR%
    pause
    exit /b 1
)

echo Project Root: %SCRIPT_DIR%
echo AI Engine Dir: %AI_ENGINE_DIR%
echo.

REM Change to AI engine directory and run training
echo Starting model training...
echo.

cd /d "%AI_ENGINE_DIR%"
python train_all_models.py

set EXITCODE=%errorlevel%

cd /d "%SCRIPT_DIR%"

echo.
if %EXITCODE% equ 0 (
    echo ========================================
    echo [OK] Training completed successfully!
    echo ========================================
) else (
    echo ========================================
    echo [X] Training failed with exit code: %EXITCODE%
    echo ========================================
)

echo.
pause
exit /b %EXITCODE%
