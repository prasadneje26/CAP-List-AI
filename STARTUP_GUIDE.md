# CAP Platform Startup Guide

This guide explains how to run the CAP (College Admission Predictor) List AI Platform with all services.

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (React)                     │
│                    http://localhost:5173               │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP
                      ▼
┌─────────────────────────────────────────────────────────┐
│                 Backend (Node.js/Express)                │
│                 http://localhost:3001/api              │
│  - Authentication, Data Management, Payment Processing │
└─────────┬─────────────────────────────────────┬─────────┘
          │                                     │
          ▼                                     ▼
    PostgreSQL Database           AI Engine (Python/FastAPI)
    localhost:5432               http://localhost:8000
    cap_counseling                - Admission Predictions
                                  - Cutoff Analysis
                                  - Chatbot
```

## Prerequisites

### Required
- **Python 3.8+** - [Download](https://python.org)
- **Node.js 16+** - [Download](https://nodejs.org)
- **PostgreSQL 12+** - [Download](https://postgresql.org)
- **.env configuration file** (created in project root)

### Optional (for Dockerized deployment)
- **Docker & Docker Compose** - [Download](https://docker.com)

## Quick Setup

### 1. Create Configuration File

The `.env` file has already been created at the project root with default settings:

```
PORT=3001
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_long_12345
AI_ENGINE_URL=http://localhost:8000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cap_counseling
DB_USER=postgres
DB_PASSWORD=postgres
```

**To use custom values**, edit `.env`:
```bash
notepad .env
```

### 2. Set Up PostgreSQL Database

PostgreSQL must be running and have a database named `cap_counseling`:

```bash
# If PostgreSQL is installed and running, create the database:
psql -U postgres
CREATE DATABASE cap_counseling;
\q
```

If you don't have PostgreSQL installed:
1. Install from [postgresql.org](https://postgresql.org)
2. During installation, remember the postgres password
3. Update `DB_PASSWORD` in `.env`
4. Run the commands above

### 3. Start All Services

Open **3 separate terminal windows** (Command Prompt, PowerShell, or Terminal):

#### Terminal 1: AI Engine (Python/FastAPI)

**Windows (Command Prompt):**
```bash
start_ai_engine.bat
```

**Windows (PowerShell):**
```powershell
.\start_ai_engine.ps1
```

**Linux/macOS:**
```bash
cd ai-engine
python -m uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected output:**
```
Uvicorn running on http://127.0.0.1:8000
```

#### Terminal 2: Backend (Node.js/Express)

**Windows (Command Prompt):**
```bash
start_backend.bat
```

**Windows (PowerShell):**
```powershell
cd backend
npm install  # First time only
npm run dev
```

**Linux/macOS:**
```bash
cd backend
npm install  # First time only
npm run dev
```

**Expected output:**
```
Server running on port 3001
Connected to database
```

#### Terminal 3: Frontend (React/Vite)

**Windows (Command Prompt):**
```bash
start_frontend.bat
```

**Windows (PowerShell):**
```powershell
cd frontend-web
npm install  # First time only
npm run dev
```

**Linux/macOS:**
```bash
cd frontend-web
npm install  # First time only
npm run dev
```

**Expected output:**
```
VITE v7.3.2  ready in 200 ms
➜  Local:   http://localhost:5173/
```

### 4. Access the Application

Open your web browser and go to:

| Component | URL |
|-----------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend API** | http://localhost:3001/api |
| **AI Engine Docs** | http://localhost:8000/docs |
| **Database** | localhost:5432 |

## Using Docker (Alternative)

If you have Docker installed, you can run the entire platform in containers:

```bash
# Build and start all services
docker compose up --build

# In another terminal, seed the database (if needed)
docker compose exec postgres psql -U postgres -d cap_counseling -f /docker-entrypoint-initdb.d/02_seed.sql

# Stop services
docker compose down
```

**Access:**
- Frontend: http://localhost
- Backend API: http://localhost/api
- AI Engine: http://localhost:8000/docs

## Troubleshooting

### PostgreSQL Connection Error

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solution:**
```bash
# Windows: Start PostgreSQL service
net start PostgreSQL-x64-16  # adjust version number

# macOS: Start PostgreSQL
brew services start postgresql

# Linux: Start PostgreSQL
sudo systemctl start postgresql
```

### Port Already in Use

If port 3001, 5173, or 8000 are already in use:

```bash
# Change port in .env
PORT=3002

# Change AI engine port in terminal:
python -m uvicorn api.main:app --reload --port 8001

# Change frontend port in terminal:
npm run dev -- --port 5174
```

### npm Install Fails

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -r node_modules package-lock.json
npm install
```

### Python Module Not Found

```bash
# Install Python dependencies
cd ai-engine
pip install -r requirements.txt
```

### Database Connection Timeout

Check that:
1. PostgreSQL is running: `psql -U postgres`
2. Database exists: `createdb cap_counseling`
3. `.env` has correct credentials
4. Firewall isn't blocking port 5432

## Development Workflow

### Making Changes

**Frontend (React):**
- Changes in `frontend-web/src/` auto-reload (hot module replacement)
- Check http://localhost:5173 for updates

**Backend (Node.js):**
- Changes in `backend/` auto-reload (nodemon)
- Check console for errors or restart if needed

**AI Engine (Python):**
- Changes in `ai-engine/` auto-reload (uvicorn)
- Refresh API docs at http://localhost:8000/docs

### Training ML Models

The AI engine models have already been trained. To retrain:

```bash
cd ai-engine

# Train all models
python train_all_models.py

# Or train individual models
python admission_predictor/train_classifier.py
python cutoff_predictor/train_model.py
```

### Running Tests

**Backend:**
```bash
cd backend
npm test
```

## Performance Tips

- **Frontend builds slowly?** Try: `npm run dev -- --host 0.0.0.0`
- **Backend requests slow?** Check PostgreSQL performance
- **AI Engine predictions slow?** Models are cached after first load

## Environment Variables Reference

```
# Backend Settings
PORT                    - Backend server port (default: 3001)
HOST                    - Bind address (default: 0.0.0.0)
JWT_SECRET              - Secret key for JWT tokens (min 32 chars)
AI_ENGINE_URL           - URL to AI engine API
NODE_ENV                - Environment (development/production)

# Database
DB_HOST                 - PostgreSQL host
DB_PORT                 - PostgreSQL port
DB_NAME                 - Database name
DB_USER                 - Database user
DB_PASSWORD             - Database password
DB_SSL                  - Use SSL (default: false)

# Rate Limiting
DISABLE_RATE_LIMIT      - Disable in development (default: false)
RATE_LIMIT_MAX          - Max requests per 15 min (default: 1000)

# AI/LLM
OPENAI_API_KEY          - OpenAI API key (optional)
ANTHROPIC_API_KEY       - Anthropic API key (optional)

# Frontend (in frontend-web/.env.local)
VITE_API_URL            - Backend API URL
```

## Next Steps

1. ✓ Prerequisites installed
2. ✓ Services started
3. → Create user account in frontend
4. → Test college recommendation engine
5. → Check admission predictions
6. → Explore AI chatbot

## Support & Resources

- **Backend API Docs:** http://localhost:3001/api/docs (Swagger)
- **AI Engine Docs:** http://localhost:8000/docs (Swagger)
- **Project README:** [README.md](README.md)
- **Training Guide:** [TRAINING_GUIDE.md](TRAINING_GUIDE.md)
- **Database Schema:** [database/schema.sql](database/schema.sql)

## Stopping Services

Press `Ctrl+C` in each terminal window to stop the respective service.

To stop everything:
```bash
# Stop each service terminal with Ctrl+C
```

---

**Last Updated:** April 18, 2026  
**Platform Version:** 1.0.0  
**Status:** Ready for Development
