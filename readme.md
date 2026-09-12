# KRISHIQ

A full-stack agriculture marketplace project with a working backend scaffold, frontend shell, and Docker-ready setup.

## Project structure

- backend/
  - Express + MongoDB/Mongoose API
  - Auth, products, orders, payments, buyers, farmers, FPO, logistics, AI, notifications
  - Dockerfile, package.json, .env.example, README
- frontend/
  - React + Vite application shell
  - Existing pages, layouts, routes, and API helper files

## Current backend status

The backend has been implemented in the existing structure and verified to start locally.

### Verified behavior

- `GET /api/health` responds successfully when the backend is running
- The app loads without crashing on startup
- Route modules, controllers, services, and middleware are wired into the app

### Known environment caveat

This workspace does not currently have a configured MongoDB URI, so the backend starts in a degraded local mode and logs a warning instead of connecting to a live database. To enable full persistence, create a local `.env` in the backend directory from `.env.example` and set `MONGODB_URI`.

## Backend quick start

1. Open the backend folder
2. Copy `.env.example` to `.env`
3. Fill in the required values, especially `MONGODB_URI`
4. Run:

```bash
npm install
npm run dev
```

Or for production-style startup:

```bash
npm start
```

## Health check

```bash
curl http://localhost:5000/api/health
```

## Docker

```bash
docker build -t krishiq-backend ./backend
docker run -p 5000:5000 --env-file ./backend/.env krishiq-backend
```

## Notes

- The backend already includes route registration for auth, products, orders, payments, buyer/farmer/FPO/logistics, and AI endpoints.
- Frontend API files are present, but the backend should be fully verified before integrating any live frontend calls.
