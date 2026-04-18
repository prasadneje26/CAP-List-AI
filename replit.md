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

## Client-Server Architecture
- **Dev**: Vite dev server (port 5000) proxies `/api` to Express backend (port 3001)
- **Prod**: `SERVE_FRONTEND=true` or `NODE_ENV=production` → backend serves `frontend-web/dist` as static files
- **API URL**: Frontend uses `VITE_API_URL` env var or falls back to relative `/api` (Vite proxy)
- **CORS**: Dev allows all origins; prod controlled by `ALLOWED_ORIGINS` env var
- **Payment API**: `GET /api/payment/plans` (public) + `POST /api/payment/create-intent` + `POST /api/payment/confirm` (authenticated)
- **Stripe**: If `STRIPE_SECRET_KEY` env var is set, uses real Stripe; otherwise simulates payment (demo mode)

## Responsive / Mobile Design
- **Navbar**: Hamburger menu works on mobile (< 768px), shows full menu in dropdown with user info
- **Layout breakpoints**: `layout-two-col` collapses at 900px; `hide-mobile` at 768px; `hide-desktop` at 1024px
- **Grids**: `grid-2/3/4` use `auto-fit` and collapse on mobile; `grid-4` → 2-col on tablet
- **Login/Register**: Dark feature panel hidden on mobile (`hide-mobile`), form takes full width
- **MentorshipPage**: Two-col layout on desktop, tab switcher + single-col on mobile (< 900px)
- **ChatbotWidget**: Repositioned to full-width on mobile

## Mentorship Payment Plans
- **Explorer (Free)**: ₹0 — 1 complimentary session/month
- **Standard**: ₹299/session — Video call, priority booking, session notes
- **Pro**: ₹999/month — Unlimited sessions, WhatsApp support, dedicated mentor
- **Flow**: Plan selection → Payment modal (card form) → Payment confirmation → Book session
- **DB**: `mentorship.plan_type` column added automatically on first booking
- **Files**: `frontend-web/src/components/PaymentModal.jsx`, `backend/controllers/paymentController.js`, `backend/routes/paymentRoutes.js`

## UI Design System (Updated)
- **Fonts**: Plus Jakarta Sans (sans-serif) + Playfair Display (display/headings)
- **Palette**: Navy `#0A192F` + Amber `#FFB703` accent
- **Radius scale**: xs(4px) sm(6px) md(12px) lg(20px) xl(32px) full(9999px)
- **Shadow scale**: xs sm md lg xl
- **CSS**: `frontend-web/src/assets/styles/index.css` — animations, skeleton loader, toasts, progress bars, chips, badges, stat cards, tabs, empty states, responsive helpers
- **Libraries**: `recharts` (probability bar chart on Dashboard), `framer-motion` (installed, available)

### Redesigned Pages / Components
- **Home** — Animated hero, count-up stats, How It Works 3-steps, 6-feature grid, testimonials, dark CTA section
- **Login / Register** — Split-screen with dark feature panel + form panel, password visibility toggle, password strength meter (Register)
- **Dashboard** — Recharts horizontal bar chart of admission probabilities, animated stat cards, tab filter (Dream/Target/Safe), skeleton loading, college card grid
- **CollegeCard** — SVG probability ring gauge, expandable detail panel, click-to-expand, location badge, fees/rating/placement data
- **InputPage** — 3-step wizard with progress indicator (Academic Details → Branch Preferences → Filters)
- **Navbar** — Scroll-blur effect, mobile hamburger menu support
- **ChatbotWidget** — Quick-start chips, typing animation, reset button, emoji avatar
- **MentorshipPage** — Mentor selector cards, topic chip quick-fill, status-colored session cards
- **ResultsPage** — Ranked list with amber/navy/gray rank badges, filter bar with search, DTE strategy tip
- **ProfilePage** — Profile completion progress bar, password show/hide on all fields, quick-link footer

## Database Seed Data
- 20 colleges seeded with 5,760 cutoff records across 3 years
- 3 mentor users pre-seeded

## Commands
- Start: workflow starts ai-engine + backend + frontend in parallel
- Frontend deps: `frontend-web/package.json`
- Backend deps: `backend/package.json`
- Python deps: `ai-engine/requirements.txt`
