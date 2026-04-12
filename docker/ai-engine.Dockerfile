# ============================================================
# AI COLLEGE CAP COUNSELING PLATFORM
# File: docker/ai-engine.Dockerfile
# ============================================================

FROM python:3.11-slim AS base

# System deps for scikit-learn
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc g++ libgomp1 curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY ai-engine/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy AI engine source
COPY ai-engine/ .
COPY data/ ./data/

# Train models if pkl files don't exist
RUN cd cutoff_predictor && \
    python -c "import os; os.path.exists('model.pkl') or __import__('subprocess').run(['python','train_model.py'])" || true

RUN cd admission_predictor && \
    python -c "import os; os.path.exists('classifier.pkl') or __import__('subprocess').run(['python','train_classifier.py'])" || true

# Non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=15s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
