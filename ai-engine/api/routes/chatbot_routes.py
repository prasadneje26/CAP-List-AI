# ============================================================
# File: ai-engine/api/routes/chatbot_routes.py
# ============================================================

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Any
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../chatbot"))
from counselor_bot import chat

router = APIRouter()

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Message]] = []
    student_context: Optional[Any] = None

@router.post("/ask")
async def ask(req: ChatRequest):
    try:
        result = await chat(
            message=req.message,
            history=[m.dict() for m in (req.history or [])],
            student_context=req.student_context,
        )
        return {"success": True, **result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
