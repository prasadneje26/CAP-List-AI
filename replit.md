# AI College CAP Counseling Platform

## Overview
- Imported GitHub project for an AI-powered Maharashtra engineering admission counseling platform.
- Main runnable web app is a React + Vite frontend in `frontend-web` with an Express API in `backend`.
- A FastAPI AI engine exists in `ai-engine`, but the current Replit development workflow runs the frontend and backend only.

## Replit setup
- Frontend runs on `0.0.0.0:5000` for the Replit web preview.
- Backend runs on `localhost:3001` to avoid conflicting with the frontend preview port.
- `frontend-web/vite.config.js` allows all dev hosts and proxies `/api` plus `/health` to the backend.
- The backend supports Replit PostgreSQL environment variables (`DATABASE_URL` or `PG*` variables).
- Development database was initialized from `database/schema.sql` and `database/seed.sql`.
- For production, the backend can serve the built frontend when `SERVE_FRONTEND=true` or `NODE_ENV=production`.

## Commands
- Frontend dependencies: `frontend-web/package.json`
- Backend dependencies: `backend/package.json`
- Workflow command starts backend first, then starts Vite on port 5000.
- Deployment builds `frontend-web/dist` and runs the Express backend on `0.0.0.0:5000`.

## Notes
- Docker files are kept for the original deployment model but are not used in Replit.
- The frontend uses a relative `/api` base URL so requests work through the preview proxy.