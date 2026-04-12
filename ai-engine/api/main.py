# ============================================================
# AI COLLEGE CAP COUNSELING PLATFORM
# File: ai-engine/api/main.py
# ============================================================

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time
import logging

from api.routes.cutoff_routes         import router as cutoff_router
from api.routes.admission_routes      import router as admission_router
from api.routes.recommendation_routes import router as recommendation_router
from api.routes.chatbot_routes        import router as chatbot_router

# ── Logging ──────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)
logger = logging.getLogger(__name__)

# ── App ───────────────────────────────────────────────────────
app = FastAPI(
    title="CAP Counseling AI Engine",
    description="ML microservices for Maharashtra engineering admission counseling",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ─────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tightened per env in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Request timing middleware ─────────────────────────────────
@app.middleware("http")
async def add_process_time(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    elapsed = round((time.time() - start) * 1000, 2)
    response.headers["X-Process-Time-Ms"] = str(elapsed)
    logger.info(f"{request.method} {request.url.path} — {elapsed}ms")
    return response

# ── Global exception handler ──────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error on {request.url.path}: {exc}")
    return JSONResponse(
        status_code=500,
        content={"success": False, "message": str(exc)},
    )

# ── Health check ──────────────────────────────────────────────
@app.get("/health", tags=["Health"])
def health():
    return {
        "status": "ok",
        "service": "CAP AI Engine",
        "version": "1.0.0",
    }

# ── Routers ───────────────────────────────────────────────────
app.include_router(cutoff_router,         prefix="/cutoff",          tags=["Cutoff Predictor"])
app.include_router(admission_router,      prefix="/admission",       tags=["Admission Predictor"])
app.include_router(recommendation_router, prefix="/recommendations",  tags=["Recommender"])
app.include_router(chatbot_router,        prefix="/chatbot",          tags=["Chatbot"])
