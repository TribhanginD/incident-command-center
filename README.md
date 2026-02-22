# 🛡️ Incident Command Center (ICC)
> **Modern Engineering Dashboard for Real-Time Mission Control**

![Status](https://img.shields.io/badge/Status-Production--Ready-success)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20FastAPI%20%7C%20Kafka-blue)

A high-fidelity dashboard built for engineering teams to monitor system health, manage incidents, and coordinate deployments in real-time. Features a stunning **Glassmorphic UI** and enterprise-grade security.

## ✨ Key Features
- **📡 Real-Time Streaming**: Live metric charts (CPU, Latency, Error Rate) powered by WebSockets and a background Kafka simulation.
- **🛡️ RBAC & Security**: JWT-based authentication with Role-Based Access Control (Admin vs. Engineer).
- **🚨 Incident Handling**: Full CRUD for incidents with a dedicated "Escalate to P0" workflow.
- **🚀 Deployment Tracking**: History of production deployments with developer attribution.

## 🛠️ Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Recharts, Zustand.
- **Backend**: FastAPI (Python), WebSocket Server, SQLAlchemy.
- **Infrastructure**: PostgreSQL, Redis (Caching), Kafka + Zookeeper (Event Bus).
- **Ops**: Docker Compose, Healthchecks, Automated Data Seeding.

## 🏁 Getting Started
1. **Clone & Spin Up**:
   ```bash
   docker-compose up --build -d
   ```
2. **Access Dashboard**: `http://localhost:5173`
3. **Credentials**: 
   - User: `admin` | Pass: `admin` (Administrator)
   - User: `engineer` | Pass: `engineer` (Standard User)

---
*Created as part of a Production Engineering Portfolio series.*
