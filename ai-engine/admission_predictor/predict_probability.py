# ============================================================
# AI COLLEGE CAP COUNSELING PLATFORM
# File: ai-engine/admission_predictor/predict_probability.py
# ============================================================

import os
import numpy as np
import joblib
import logging

logger    = logging.getLogger(__name__)
MODEL_DIR = os.path.dirname(__file__)

CATEGORY_MAP = {"OPEN":0,"OBC":1,"SC":2,"ST":3,"EWS":4,"TFWS":5,"PWD":6}
EXAM_MAP     = {"CET":0,"JEE":1}

try:
    _artifacts = joblib.load(os.path.join(MODEL_DIR, "classifier.pkl"))
    _model     = _artifacts["model"]
    _scaler    = _artifacts["scaler"]
    _loaded    = True
except Exception as e:
    logger.warning(f"Classifier not loaded: {e}. Using sigmoid fallback.")
    _loaded = False


def _sigmoid_fallback(gap: float, category: str) -> float:
    """Rule-based fallback when model is not available."""
    cat_bonus = 0.5 if category in ("SC", "ST", "EWS") else 0.0
    logit     = 0.8 * gap + cat_bonus
    raw       = 1 / (1 + np.exp(-logit))
    return round(float(max(5.0, min(95.0, raw * 90 + 5))), 1)


def predict_admission_probability(
    percentile: float,
    cutoff_percentile: float,
    category: str = "OPEN",
    exam_type: str = "CET",
) -> dict:
    """
    Predict probability (%) of admission for a student at a college.

    Returns:
        dict with probability (%), classification, gap, method
    """
    gap             = float(percentile) - float(cutoff_percentile)
    category_enc    = CATEGORY_MAP.get(category, 0)
    exam_enc        = EXAM_MAP.get(exam_type, 0)
    gap_sq          = gap ** 2
    gap_pos         = int(gap > 0)

    if _loaded:
        try:
            X       = np.array([[percentile, cutoff_percentile, gap, gap_sq,
                                  gap_pos, category_enc, exam_enc]])
            X_s     = _scaler.transform(X)
            raw_p   = float(_model.predict_proba(X_s)[0][1])
            # Scale: 5–95%
            prob    = round(max(5.0, min(95.0, raw_p * 90 + 5)), 1)
            method  = "gradient_boosting"
        except Exception as e:
            logger.warning(f"Model inference failed: {e}")
            prob   = _sigmoid_fallback(gap, category)
            method = "sigmoid_fallback"
    else:
        prob   = _sigmoid_fallback(gap, category)
        method = "sigmoid_fallback"

    classification = "Dream" if gap < 0 else ("Target" if gap <= 3 else "Safe")

    return {
        "probability":        prob,
        "gap":                round(gap, 2),
        "classification":     classification,
        "percentile":         percentile,
        "cutoff_percentile":  cutoff_percentile,
        "method":             method,
    }
