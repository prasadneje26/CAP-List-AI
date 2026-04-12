# ============================================================
# AI COLLEGE CAP COUNSELING PLATFORM
# File: ai-engine/cutoff_predictor/predict.py
# ============================================================

import os
import numpy as np
import joblib
import logging

logger    = logging.getLogger(__name__)
MODEL_DIR = os.path.dirname(__file__)

# ── Load artifacts once at import time ───────────────────────
def _load(name):
    path = os.path.join(MODEL_DIR, name)
    if not os.path.exists(path):
        raise FileNotFoundError(f"Model artifact not found: {path}. Run train_model.py first.")
    return joblib.load(path)

try:
    _models    = _load("model.pkl")
    _scaler    = _load("scaler_cutoff.pkl")
    _le_branch = _load("le_branch.pkl")
    _le_college= _load("le_college.pkl")
    _loaded    = True
except FileNotFoundError as e:
    logger.warning(str(e))
    _loaded = False

CATEGORY_MAP = {
    "OPEN": 0, "OBC": 1, "SC": 2, "ST": 3,
    "EWS": 4, "TFWS": 5, "PWD": 6,
}
EXAM_MAP = {"CET": 0, "JEE": 1}


def _encode_safe(le, value: str) -> int:
    """Encode a label; return 0 if unseen."""
    classes = list(le.classes_)
    return classes.index(value) if value in classes else 0


def predict_cutoff(
    college_code: str,
    branch: str,
    category: str,
    exam_type: str,
    history: list[dict],
    target_year: int | None = None,
) -> dict:
    """
    Predict next year's cutoff percentile.

    Args:
        college_code : e.g. "COEP"
        branch       : e.g. "Computer Engineering"
        category     : e.g. "OPEN"
        exam_type    : "CET" | "JEE"
        history      : list of {"year": int, "cutoff_percentile": float}
        target_year  : year to predict (defaults to max(history)+1)

    Returns:
        dict with predicted_cutoff, confidence_interval, trend
    """
    if not history:
        raise ValueError("History cannot be empty")

    history_sorted = sorted(history, key=lambda x: x["year"])
    latest         = float(history_sorted[-1]["cutoff_percentile"])
    prev           = float(history_sorted[-2]["cutoff_percentile"]) if len(history_sorted) > 1 else latest
    trend          = latest - prev
    pred_year      = target_year or (history_sorted[-1]["year"] + 1)

    # ML prediction if model is loaded
    if _loaded:
        try:
            college_enc  = _encode_safe(_le_college, college_code)
            branch_enc   = _encode_safe(_le_branch,  branch)
            category_enc = CATEGORY_MAP.get(category, 0)
            exam_enc     = EXAM_MAP.get(exam_type, 0)

            X = np.array([[
                college_enc, branch_enc, category_enc,
                exam_enc, pred_year, latest, trend,
            ]])
            X_scaled = _scaler.transform(X)

            gbr_pred = float(_models["gbr"].predict(X_scaled)[0])
            rfr_pred = float(_models["rfr"].predict(X_scaled)[0])
            predicted = round(0.6 * gbr_pred + 0.4 * rfr_pred, 2)

            # Clamp to realistic range
            predicted = max(0.0, min(100.0, predicted))

            return {
                "predicted_cutoff":  predicted,
                "predicted_year":    pred_year,
                "trend":             round(trend, 2),
                "confidence_low":    round(max(0, predicted - 1.5), 2),
                "confidence_high":   round(min(100, predicted + 1.5), 2),
                "method":            "ml_ensemble",
            }
        except Exception as e:
            logger.warning(f"ML prediction failed, falling back to trend: {e}")

    # Fallback: dampened linear trend
    damped     = trend * 0.6
    predicted  = round(max(0.0, min(100.0, latest + damped)), 2)

    return {
        "predicted_cutoff":  predicted,
        "predicted_year":    pred_year,
        "trend":             round(trend, 2),
        "confidence_low":    round(max(0, predicted - 2.0), 2),
        "confidence_high":   round(min(100, predicted + 2.0), 2),
        "method":            "linear_trend_fallback",
    }
