#!/usr/bin/env python3
# ============================================================
# Quick Training Script - Run from anywhere
# Usage: python train_models.py [options]
# ============================================================

import subprocess
import sys
import os
from pathlib import Path

def main():
    # Find the AI engine directory
    script_dir = Path(__file__).parent.absolute()
    ai_engine_dir = script_dir / "ai-engine"
    
    if not ai_engine_dir.exists():
        print(f"Error: Could not find ai-engine directory at {ai_engine_dir}")
        sys.exit(1)
    
    # Change to AI engine directory
    os.chdir(ai_engine_dir)
    
    # Run the master training script
    print(f"Starting model training from: {ai_engine_dir}\n")
    result = subprocess.run([sys.executable, "train_all_models.py"], cwd=str(ai_engine_dir))
    
    sys.exit(result.returncode)

if __name__ == "__main__":
    main()
