# ============================================================
# AI COLLEGE CAP COUNSELING PLATFORM
# File: ai-engine/chatbot/counselor_bot.py
# ============================================================

import re
import logging
from typing import Optional
from llm_connector import get_llm_response

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are an expert Maharashtra engineering admission counselor.
You help students understand the CAP (Centralized Admission Process) for engineering colleges.

You know about:
- MHT-CET and JEE scores and percentile calculation
- College cutoffs (COEP, VIT, PICT, PCCOE, MIT, VJTI etc.)
- Category reservations (OPEN, OBC, SC, ST, EWS, TFWS, PWD)
- CAP round process (Round 1, 2, 3 and Institute Level)
- Branch selection strategy
- Document requirements for admission

Always:
- Be specific about Maharashtra colleges
- Use percentile (not marks) when discussing cutoffs
- Mention that cutoffs vary by category, round, and year
- Encourage students to check official DTE Maharashtra portal
- Keep answers concise and helpful

Never make up specific cutoff numbers — say "check the official portal for exact cutoffs."
"""

# ── Intent detection ──────────────────────────────────────────
INTENT_PATTERNS = {
    "cutoff_query": [
        r"cutoff", r"percentile.*get", r"can i get", r"will i get",
        r"chance.*college", r"college.*chance",
    ],
    "college_info": [
        r"about.*college", r"tell me.*college", r"what is.*college",
        r"coep|vjti|pict|vit|pccoe|mit|wce|spce",
    ],
    "cap_process": [
        r"cap round", r"how.*admission", r"process.*admission",
        r"round 1|round 2|round 3", r"cap process",
    ],
    "document": [
        r"document", r"certificate", r"required.*paper", r"what.*bring",
    ],
    "category": [
        r"category|reservation|obc|sc|st|ews|tfws|open category",
    ],
}

def detect_intent(message: str) -> str:
    msg_lower = message.lower()
    for intent, patterns in INTENT_PATTERNS.items():
        if any(re.search(p, msg_lower) for p in patterns):
            return intent
    return "general"

def extract_college_name(message: str) -> Optional[str]:
    colleges = ["COEP", "VIT", "PICT", "PCCOE", "MIT", "VJTI", "WCE", "SPCE", "ICT"]
    for c in colleges:
        if c.lower() in message.lower():
            return c
    return None

# ── Main chat function ────────────────────────────────────────
async def chat(
    message: str,
    history: list[dict] | None = None,
    student_context: dict | None = None,
) -> dict:
    """
    Process a student message and return an AI counselor response.

    Args:
        message        : student's question
        history        : list of {"role": "user"/"assistant", "content": str}
        student_context: optional dict with percentile, category, etc.

    Returns:
        dict with response, intent, suggested_followups
    """
    history = history or []
    intent  = detect_intent(message)
    college = extract_college_name(message)

    # Build context-aware system message
    context_note = ""
    if student_context:
        context_note = (
            f"\n\nStudent context: "
            f"Percentile={student_context.get('percentile')}, "
            f"Category={student_context.get('category')}, "
            f"Exam={student_context.get('exam_type')}, "
            f"Preferred branches={student_context.get('branch_preferences', [])}."
        )

    system = SYSTEM_PROMPT + context_note

    # Build messages for LLM
    messages = [{"role": "system", "content": system}]
    messages += history[-10:]  # last 10 turns for context
    messages.append({"role": "user", "content": message})

    try:
        response_text = await get_llm_response(messages)
    except Exception as e:
        logger.error(f"LLM error: {e}")
        response_text = fallback_response(intent, college, student_context)

    followups = get_followups(intent)

    return {
        "response":          response_text,
        "intent":            intent,
        "college_mentioned": college,
        "suggested_followups": followups,
    }


def fallback_response(intent: str, college: Optional[str], ctx: Optional[dict]) -> str:
    """Rule-based fallback when LLM is unavailable."""
    if intent == "cutoff_query" and ctx:
        p = ctx.get("percentile", "your")
        c = ctx.get("category", "OPEN")
        col = college or "your preferred college"
        return (
            f"With {p} percentile under {c} category, your admission chances at "
            f"{col} depend on that year's cutoff. Cutoffs shift each round — "
            f"check the DTE Maharashtra portal for live data. "
            f"Run a full prediction above to see your personalized chances."
        )
    if intent == "cap_process":
        return (
            "The CAP process has 3 rounds. In each round you can update your preference list. "
            "Fill all 30 slots — put Dream colleges first, Safe colleges last. "
            "Once allotted a seat, you must confirm within the deadline or lose it."
        )
    if intent == "document":
        return (
            "Key documents: 10th & 12th marksheets, MHT-CET / JEE scorecard, "
            "category certificate (if applicable), domicile certificate, "
            "school leaving certificate, passport photos, and Aadhaar card."
        )
    return (
        "I'm here to help with Maharashtra engineering admissions! "
        "Ask me about cutoffs, the CAP process, college comparisons, or documents."
    )


def get_followups(intent: str) -> list[str]:
    followup_map = {
        "cutoff_query":  ["What is the CAP round process?", "Which documents do I need?"],
        "cap_process":   ["How do I fill my preference list?", "What happens in Round 2?"],
        "college_info":  ["What are the cutoffs for CS branch?", "Compare COEP vs VIT"],
        "document":      ["When do I submit documents?", "Is category certificate mandatory?"],
        "category":      ["What is TFWS quota?", "How does OBC reservation work?"],
        "general":       ["Tell me about CAP rounds", "What colleges suit my percentile?"],
    }
    return followup_map.get(intent, followup_map["general"])
