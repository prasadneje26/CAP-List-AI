# AI College CAP Counseling Platform

## Overview
AI-powered Maharashtra engineering admission counseling platform with ML-based cutoff prediction, Dream/Target/Safe college classification, CAP preference list optimization, AI chatbot, PDF reports, and mentorship booking.

## Architecture
- **Frontend**: React + Vite on `0.0.0.0:5000` (port 5000 for Replit preview)
- **Backend**: Node.js/Express on `127.0.0.1:3001`, proxied via `/api` by Vite
- **AI Engine**: Python FastAPI on `127.0.0.1:8000`, called by the backend for ML predictions
- **Database**: PostgreSQL (Replit-managed) with `DATABASE_URL` env var

## Replit Setup
- Frontend proxies `/api` and `/health` to backend at port 3001 (see `frontend-web/vite.config.js`)
- Backend uses `DATABASE_URL` or `PG*` env vars for PostgreSQL
- Backend CORS allows all origins in development; production controlled by `ALLOWED_ORIGINS`
- ML models: `ai-engine/cutoff_predictor/model.pkl` and `ai-engine/admission_predictor/classifier.pkl` (trained on 5,800 rows, R²=0.9959 / AUC=0.9961)

## Key Features
- **Auth**: JWT access tokens (1d) + refresh tokens (7d), bcrypt password hashing, change password endpoint
- **ML Predictions**: Cutoff prediction + admission probability via scikit-learn models
- **CAP List**: Optimized preference ordering with Dream/Target/Safe classification
- **College Comparison**: Side-by-side comparison of up to 3 colleges (`/compare`)
- **AI Chatbot**: Context-aware admission assistant (rule-based fallback if AI engine unavailable)
- **PDF Reports**: Downloadable CAP preference report via PDFKit
- **Mentorship**: Book 1:1 sessions with alumni mentors
- **Document Checklist**: Interactive checklist with progress tracking

## Pages & Routes
- `/` — Home / landing page
- `/login`, `/register` — Auth
- `/dashboard` — Main dashboard with prediction results and college cards
- `/input` — Academic profile form (pre-fills existing data on edit)
- `/results` — Full CAP sequence with PDF download
- `/compare` — Side-by-side college comparison (new)
- `/profile` — User account + academic summary + change password
- `/documents` — Interactive document checklist
- `/mentorship` — Book and view mentor sessions
- `/feedback` — Feedback form

## Important Files
- `backend/controllers/authController.js` — Full auth implementation (register, login, getMe, refreshToken, logout, changePassword)
- `backend/controllers/predictionController.js` — ML prediction pipeline
- `backend/services/capOrderEngine.js` — CAP preference list optimizer
- `backend/controllers/chatbotController.js` — AI chatbot (calls FastAPI or rule-based)
- `frontend-web/src/context/AuthContext.jsx` — Auth state management
- `frontend-web/src/services/api.js` — Axios with JWT interceptor + auto-refresh
- `frontend-web/src/pages/ComparePage.jsx` — College comparison feature

## Database Seed Data
- 20 colleges seeded with 5,760 cutoff records across 3 years
- 3 mentor users pre-seeded

## Commands
- Start: workflow starts ai-engine + backend + frontend in parallel
- Frontend deps: `frontend-web/package.json`
- Backend deps: `backend/package.json`
- Python deps: `ai-engine/requirements.txt`
