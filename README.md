# Incident Command Center

Real-time engineering incident dashboard.

## Features
- **Live Metrics**: WebSocket-streamed system health data.
- **Incident Management**: CRUD for incidents with RBAC.
- **Manual Escalation**: P0 escalation with audit trail.
- **Deployment Logs**: Real-time deployment history.

## Architecture
- **Frontend**: React, TypeScript, Vite, Recharts, Zustand.
- **Backend**: FastAPI, WebSockets, JWT, PostgreSQL, Redis, Kafka.

## Getting Started
```bash
docker-compose up --build
```
Access the dashboard at `http://localhost:5173` (Admin: `admin`/`admin`).
