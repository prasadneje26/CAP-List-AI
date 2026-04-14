# CAP Advisor

A full-stack CAP College Advisor application for Maharashtra engineering admissions.

## Project Overview

CAP Advisor helps students enter their MHT-CET percentile, category, and branch preferences to generate a ranked CAP preference list, receive AI-backed strategy, download a PDF report, chat with an AI counselor, and save CAP history.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express, PostgreSQL, Anthropic Claude, JWT, PDFKit |
| Mobile App | Flutter, Dio, flutter_bloc, Hive, flutter_secure_storage, get_it |
| Deployment | Docker, docker-compose, nginx |

## Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Docker and Docker Compose
- Flutter 3.x

## Environment Setup

1. Copy `backend/.env.example` to `backend/.env`.
2. Set values for your PostgreSQL database, JWT secrets, Anthropic API key, and frontend URL.
3. Make sure the database container matches `docker-compose.yml` credentials.

## Docker Quick Start

From `cap_advisor/`:

```bash
docker-compose up -d
```

This will start PostgreSQL and the backend service.

## Manual Backend Start

From `cap_advisor/backend/`:

```bash
npm install
npm run dev
```

## Flutter Setup

From `cap_advisor/flutter_app/`:

```bash
flutter pub get
flutter run
```

## API Documentation

API routes are available under `/api/v1/`.

## Folder Structure

- `backend/`: Node.js API server
- `backend/src/`: API source modules
- `backend/migrations/`: PostgreSQL initialization scripts
- `backend/seeds/`: college seed data
- `flutter_app/`: Flutter mobile application
- `docker-compose.yml`: Docker configuration for backend and PostgreSQL
- `nginx.conf`: Optional reverse proxy configuration

## Contributing

1. Create a branch for your feature or bugfix.
2. Follow the existing code structure.
3. Add tests for backend and Flutter changes.
4. Submit a pull request with a clear description.
