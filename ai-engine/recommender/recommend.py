# ============================================================
# AI COLLEGE CAP COUNSELING PLATFORM
# File: ai-engine/recommender/recommend.py
# ============================================================

import os
import numpy as np
import joblib
import logging
from typing import List, Optional

logger    = logging.getLogger(__name__)
MODEL_DIR = os.path.dirname(__file__)

CATEGORY_MAP = {"OPEN":0,"OBC":1,"SC":2,"ST":3,"EWS":4,"TFWS":5,"PWD":6}
EXAM_MAP     = {"CET":0,"JEE":1}
TYPE_BONUS   = {"Government":10,"Aided":8,"Autonomous":7,"Unaided":5}

try:
    _rec_model = joblib.load(os.path.join(MODEL_DIR, "recommender.pkl"))
    _loaded    = True
except Exception:
    _loaded = False
    logger.warning("Recommender model not found — using rule-based fallback")


def score_college(college: dict, student: dict) -> float:
    """
    Compute a fit score for a student-college pair.
    Mirrors backend rankingEngine.js for consistency.
    """
    rating    = float(college.get("rating", 5) or 5)
    placement = float(college.get("placement_score", 50) or 50) / 10  # normalise to 0-10
    c_type    = college.get("college_type", "Unaided")
    type_b    = TYPE_BONUS.get(c_type, 5)

    branch     = college.get("branch", "")
    prefs      = student.get("branch_preferences", []) or []
    branch_idx = next((i for i, p in enumerate(prefs)
                       if p.lower() in branch.lower()), len(prefs))
    branch_sc  = max(0, 10 - branch_idx * 2)

    score = (rating    * 0.40 +
             branch_sc * 0.30 +
             placement * 0.20 +
             type_b    * 0.10)
    return round(score, 4)


def recommend(
    percentile: float,
    exam_type: str,
    category: str,
    branch_preferences: List[str],
    location_preferences: List[str],
    college_type: Optional[str],
    budget_max: Optional[int],
    colleges: List[dict],
    top_n: int = 10,
) -> List[dict]:
    """
    Rank and return top N recommended colleges for a student.

    Args:
        colleges: list of college dicts (from DB) with cutoff_percentile attached
    Returns:
        Sorted list of top N recommended colleges with scores and reasons
    """
    student = {
        "percentile":           percentile,
        "exam_type":            exam_type,
        "category":             category,
        "branch_preferences":   branch_preferences,
        "location_preferences": location_preferences,
    }

    results = []
    for college in colleges:
        cutoff = float(college.get("cutoff_percentile", 100))
        gap    = percentile - cutoff

        # Skip if way out of range
        if gap < -10:
            continue

        fit_score = score_college(college, student)

        classification = "Dream" if gap < 0 else ("Target" if gap <= 3 else "Safe")

        reason_parts = []
        if classification == "Safe":
            reason_parts.append(f"Your {percentile:.1f} percentile is {gap:.1f} pts above cutoff.")
        elif classification == "Target":
            reason_parts.append(f"Close match — {gap:.1f} pts above cutoff.")
        else:
            reason_parts.append(f"Aspirational — {abs(gap):.1f} pts below cutoff.")

        if float(college.get("rating", 0)) >= 8.5:
            reason_parts.append(f"Top-rated ({college['rating']}/10).")
        if float(college.get("placement_score", 0)) >= 80:
            reason_parts.append("Strong placements.")
        if college.get("college_type") == "Government":
            reason_parts.append("Government college.")

        results.append({
            **college,
            "fit_score":      fit_score,
            "gap":            round(gap, 2),
            "classification": classification,
            "reason":         " ".join(reason_parts),
        })

    # Sort: Safe/Target first by score, Dream last
    order = {"Safe": 0, "Target": 1, "Dream": 2}
    results.sort(key=lambda x: (order[x["classification"]], -x["fit_score"]))

    return results[:top_n]
