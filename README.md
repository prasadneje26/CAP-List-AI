# AI College CAP Counseling Platform

AI-powered Maharashtra engineering admission counseling — Web + Mobile + AI microservices.

---

## Quick Start (Docker)

```bash
# 1. Clone and enter project
git clone <repo> && cd cap-counseling

# 2. Set up environment
cp .env.example .env
# Edit .env — set DB_PASSWORD, JWT_SECRET, and LLM keys

# 3. Start all services
docker compose up --build -d

# 4. Check everything is running
docker compose ps
docker compose logs -f
```

**Access:**
| Service        | URL                          |
|----------------|------------------------------|
| Web app        | http://localhost             |
| Backend API    | http://localhost/api         |
| AI Engine docs | http://localhost:8000/docs   |
| Database       | localhost:5432               |

---

## Service Architecture

```
Browser / Mobile App
        │ HTTPS
        ▼
  Nginx (port 80)          ← Reverse proxy + rate limiting
   ├── /api/*  → Backend   (Node.js :5000)
   ├── /       → Frontend  (React :3000)
   └── /ai/*  → AI Engine  (FastAPI :8000) [internal only]
        │
        ▼
   PostgreSQL (:5432)
```

---

## Local Development (without Docker)

### Backend
```bash
cd backend
npm install
cp ../.env .env
npm run dev        # nodemon server.js
```

### AI Engine
```bash
cd ai-engine
pip install -r requirements.txt

# Train ML models (first time only)
cd cutoff_predictor   && python train_model.py
cd ../admission_predictor && python train_classifier.py

# Start FastAPI
cd .. && uvicorn api.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend-web
npm install
echo "VITE_API_URL=http://localhost:5000/api" > .env.local
npm run dev        # Vite dev server at :5173
```

### Mobile
```bash
cd mobile-app
flutter pub get
flutter run        # Connects to http://10.0.2.2:5000/api (Android emulator)
```

---

## File Structure

```
├── database/           schema.sql + seed.sql
├── backend/            Node.js + Express API
│   ├── controllers/    auth, student, college, prediction, recommendation, feedback, mentorship, pdf
│   ├── services/       filtering, classification, ranking, capOrder, probability, pdfGenerator
│   ├── models/         User, Student, College, Feedback, Mentorship, PredictionLog
│   ├── middleware/     auth, jwt, role, rateLimiter, validation, error
│   ├── security/       helmet, cors, inputSanitizer
│   └── routes/         8 route files
├── ai-engine/          Python FastAPI microservice
│   ├── cutoff_predictor/   ML cutoff prediction (GBR + RF ensemble)
│   ├── admission_predictor/ Admission probability classifier
│   ├── recommender/        College recommender
│   ├── chatbot/            LLM counselor bot
│   └── api/routes/         FastAPI route handlers
├── frontend-web/       React + Vite
│   └── src/            pages, components, services, context
├── mobile-app/         Flutter
│   └── lib/            screens, widgets, services, models
├── docker/             Dockerfiles + nginx.conf
├── data/               Raw cutoffs CSV (2022–2025)
├── docs/               API docs + guides
└── tests/              Test suites
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `DB_PASSWORD` | PostgreSQL password |
| `JWT_SECRET` | JWT signing secret (min 32 chars) |
| `AI_ENGINE_URL` | Internal AI engine URL |
| `LLM_PROVIDER` | `openai` / `anthropic` / `ollama` |
| `OPENAI_API_KEY` | OpenAI key (if using OpenAI) |
| `ANTHROPIC_API_KEY` | Anthropic key (if using Claude) |
| `VITE_API_URL` | Frontend API base URL |

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ✗ | Register new user |
| POST | `/api/auth/login` | ✗ | Login |
| GET  | `/api/auth/me` | ✓ | Current user |
| POST | `/api/student/` | ✓ | Create student profile |
| GET  | `/api/student/profile` | ✓ | Get profile |
| POST | `/api/predict/full` | ✓ | Full AI prediction pipeline |
| POST | `/api/predict/cutoff` | ✓ | Predict single cutoff |
| GET  | `/api/predict/history` | ✓ | Past predictions |
| GET  | `/api/recommendations` | ✓ | AI recommendations |
| POST | `/api/chatbot/ask` | ✓ | Chat with AI counselor |
| GET  | `/api/pdf/download` | ✓ | Download PDF report |
| POST | `/api/feedback/submit` | ✓ | Submit feedback |
| POST | `/api/mentorship/book` | ✓ | Book mentor session |

---

## Default Credentials (seed data)

| Role | Email | Password |
|---|---|---|
| Admin | admin@capcounselor.in | Admin@1234 |
| Mentor | mentor@capcounselor.in | Admin@1234 |

⚠️ Change these immediately in production.

---

## License
MIT — For educational guidance only. Always verify with official DTE Maharashtra portal.
