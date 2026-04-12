# ============================================================
# File: ai-engine/api/routes/admission_routes.py
# ============================================================

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../admission_predictor"))
from predict_probability import predict_admission_probability

router = APIRouter()

class AdmissionRequest(BaseModel):
    percentile: float = Field(..., ge=0, le=100)
    cutoff_percentile: float = Field(..., ge=0, le=100)
    category: str = Field(default="OPEN")
    exam_type: str = Field(default="CET")

@router.post("/predict")
def predict(req: AdmissionRequest):
    try:
        result = predict_admission_probability(
            percentile=req.percentile,
            cutoff_percentile=req.cutoff_percentile,
            category=req.category,
            exam_type=req.exam_type,
        )
        return {"success": True, **result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
