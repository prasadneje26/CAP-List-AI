#!/bin/bash
# ============================================================
# Bash Training Script - Run all ML models
# Usage: ./train_models.sh
# ============================================================

# Get the script's directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AI_ENGINE_DIR="$SCRIPT_DIR/ai-engine"

echo ""
echo "========================================"
echo "  CAP Platform - Model Training Script"
echo "========================================"
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    if ! command -v python &> /dev/null; then
        echo "✗ Python not found in PATH"
        echo "  Please install Python 3.8+ or ensure it's in your PATH"
        exit 1
    fi
    PYTHON_CMD="python"
else
    PYTHON_CMD="python3"
fi

PYTHON_VERSION=$($PYTHON_CMD --version 2>&1)
echo "✓ $PYTHON_VERSION"

# Check if AI engine directory exists
if [ ! -d "$AI_ENGINE_DIR" ]; then
    echo "✗ ai-engine directory not found at: $AI_ENGINE_DIR"
    exit 1
fi

echo "Project Root: $SCRIPT_DIR"
echo "AI Engine Dir: $AI_ENGINE_DIR"
echo ""

# Change to AI engine directory and run training
echo "Starting model training..."
echo ""

cd "$AI_ENGINE_DIR"
$PYTHON_CMD train_all_models.py

EXIT_CODE=$?

cd "$SCRIPT_DIR"

echo ""
if [ $EXIT_CODE -eq 0 ]; then
    echo "========================================"
    echo "✓ Training completed successfully!"
    echo "========================================"
else
    echo "========================================"
    echo "✗ Training failed with exit code: $EXIT_CODE"
    echo "========================================"
fi

exit $EXIT_CODE
