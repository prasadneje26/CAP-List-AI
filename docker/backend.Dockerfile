# ============================================================
# AI COLLEGE CAP COUNSELING PLATFORM
# File: docker/backend.Dockerfile
# ============================================================

FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies first (cache layer)
COPY backend/package.json ./
RUN npm install --omit=dev

# Copy source
COPY backend/ .

# Create logs directory
RUN mkdir -p logs

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:5000/health || exit 1

CMD ["node", "server.js"]
