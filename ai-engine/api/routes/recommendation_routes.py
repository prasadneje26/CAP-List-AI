# ============================================================
# File: ai-engine/api/routes/recommendation_routes.py
# ============================================================

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Any
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../recommender"))
from recommend import recommend

router = APIRouter()

class RecommendRequest(BaseModel):
    percentile: float
    exam_type: str
    category: str
    branch_preferences: List[str] = []
    location_preferences: List[str] = []
    college_type: Optional[str] = None
    budget_max: Optional[int] = None
    colleges: List[Any] = []

@router.post("")
def get_recommendations(req: RecommendRequest):
    try:
        recs = recommend(
            percentile=req.percentile,
            exam_type=req.exam_type,
            category=req.category,
            branch_preferences=req.branch_preferences,
            location_preferences=req.location_preferences,
            college_type=req.college_type,
            budget_max=req.budget_max,
            colleges=req.colleges,
        )
        return {"success": True, "recommendations": recs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
