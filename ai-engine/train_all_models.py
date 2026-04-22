# ============================================================
# AI COLLEGE CAP COUNSELING PLATFORM
# File: ai-engine/train_all_models.py
# Master Training Script for All Models
# ============================================================

import sys
import os
import time
from datetime import datetime
from pathlib import Path

# Add ai-engine to path
sys.path.insert(0, os.path.dirname(__file__))

from admission_predictor.train_classifier import train as train_admission
from cutoff_predictor.train_model import train as train_cutoff

# ── Configuration ────────────────────────────────────────────
PROJECT_ROOT = Path(__file__).parent.parent
AI_ENGINE_DIR = Path(__file__).parent
DATA_DIR = PROJECT_ROOT / "data"
MODELS_DIR = AI_ENGINE_DIR / "models"

# ── Logging utility ──────────────────────────────────────────
def log_header(title):
    """Print a formatted section header"""
    print("\n" + "="*70)
    print(f"  {title}")
    print("="*70)

def log_step(step_num, title):
    """Print a formatted step header"""
    print(f"\n[{step_num}] {title}")
    print("-" * 70)

def log_success(message):
    """Print success message"""
    print(f"[OK] {message}")

def log_warning(message):
    """Print warning message"""
    print(f"[!] {message}")

def log_error(message):
    """Print error message"""
    print(f"[X] {message}")

def verify_data_exists():
    """Verify that required training data files exist"""
    log_step(1, "Verifying Training Data")
    
    required_files = {
        "admission_training.csv": DATA_DIR / "training-data" / "admission_training.csv",
        "cutoff_2022.csv": DATA_DIR / "raw-cutoffs" / "cutoff_2022.csv",
        "cutoff_2023.csv": DATA_DIR / "raw-cutoffs" / "cutoff_2023.csv",
        "cutoff_2024.csv": DATA_DIR / "raw-cutoffs" / "cutoff_2024.csv",
        "cutoff_2025.csv": DATA_DIR / "raw-cutoffs" / "cutoff_2025.csv",
    }
    
    missing_files = []
    for name, path in required_files.items():
        if path.exists():
            log_success(f"Found: {name}")
        else:
            log_warning(f"Missing: {name}")
            missing_files.append(name)
    
    if missing_files:
        log_warning(f"{len(missing_files)} file(s) missing - synthetic/generated data will be used")
    
    return len(missing_files) == 0

def train_all():
    """Train all models in sequence"""
    
    log_header("CAP COUNSELING PLATFORM - MODEL TRAINING ORCHESTRATOR")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Project Root: {PROJECT_ROOT}")
    print(f"AI Engine Dir: {AI_ENGINE_DIR}")
    print(f"Data Dir: {DATA_DIR}")
    
    # Track results
    results = {
        "admission_predictor": None,
        "cutoff_predictor": None,
        "errors": [],
        "start_time": time.time(),
    }
    
    # Step 1: Verify data
    verify_data_exists()
    
    # Step 2: Train Admission Predictor
    log_step(2, "Training Admission Predictor Classifier")
    try:
        print("Training model on admission data...")
        train_admission()
        results["admission_predictor"] = "SUCCESS"
        log_success("Admission Predictor training completed")
    except Exception as e:
        error_msg = f"Admission Predictor training failed: {str(e)}"
        log_error(error_msg)
        results["admission_predictor"] = "FAILED"
        results["errors"].append(error_msg)
        import traceback
        traceback.print_exc()
    
    # Step 3: Train Cutoff Predictor
    log_step(3, "Training Cutoff Predictor Regressor")
    try:
        print("Training model on historical cutoff data...")
        metrics = train_cutoff()
        results["cutoff_predictor"] = metrics
        log_success("Cutoff Predictor training completed")
        if metrics:
            for key, value in metrics.items():
                print(f"  └─ {key}: {value}")
    except Exception as e:
        error_msg = f"Cutoff Predictor training failed: {str(e)}"
        log_error(error_msg)
        results["cutoff_predictor"] = "FAILED"
        results["errors"].append(error_msg)
        import traceback
        traceback.print_exc()
    
    # Step 4: Summary
    log_header("TRAINING SUMMARY")
    print(f"Admission Predictor:  {results['admission_predictor']}")
    print(f"Cutoff Predictor:     {results['cutoff_predictor']}")
    
    elapsed_time = time.time() - results["start_time"]
    print(f"\nTotal Training Time: {elapsed_time:.2f} seconds ({elapsed_time/60:.2f} minutes)")
    
    if results["errors"]:
        print(f"\n[!] {len(results['errors'])} error(s) encountered:")
        for i, error in enumerate(results["errors"], 1):
            print(f"  {i}. {error}")
        return False
    else:
        log_success("All models trained successfully!")
        return True

if __name__ == "__main__":
    try:
        success = train_all()
        exit_code = 0 if success else 1
        sys.exit(exit_code)
    except Exception as e:
        print(f"\n[X] Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
