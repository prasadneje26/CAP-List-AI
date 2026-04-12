# ============================================================
# File: ai-engine/api/routes/cutoff_routes.py
# ============================================================

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../cutoff_predictor"))
from predict import predict_cutoff

router = APIRouter()

class HistoryItem(BaseModel):
    year: int
    cutoff_percentile: float

class CutoffRequest(BaseModel):
    college_code: str
    branch: str
    category: str = Field(..., pattern="^(OPEN|OBC|SC|ST|EWS|TFWS|PWD)$")
    exam_type: str = Field(..., pattern="^(CET|JEE)$")
    history: List[HistoryItem]
    target_year: Optional[int] = None

@router.post("/predict")
def predict(req: CutoffRequest):
    try:
        result = predict_cutoff(
            college_code=req.college_code,
            branch=req.branch,
            category=req.category,
            exam_type=req.exam_type,
            history=[h.dict() for h in req.history],
            target_year=req.target_year,
        )
        return {"success": True, **result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
