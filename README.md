# Qvik Map

> Work in progress

A mobile-friendly map of Hungary showing shops that accept the [Qvik](https://qvik.hu) payment method.

## Stack

| Layer | Technology |
|---|---|
| Backend | Java 21 + Spring Boot 3 |
| Database | PostgreSQL 16 + PostGIS |
| Frontend | React + Vite + TypeScript + Tailwind CSS v4 |
| Map | Leaflet / react-leaflet |
| Infra | Docker Compose (local dev) |

## Local development

**Prerequisites:** Docker, Java 21, Node 20+

```bash
# 1. Start the database
cd infra
docker compose up -d db

# 2. Start the backend (in a new terminal)
cd backend
DB_PASSWORD=changeme_in_env ./mvnw spring-boot:run

# 3. Start the frontend (in a new terminal)
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

The backend API is at [http://localhost:8080/api/shops](http://localhost:8080/api/shops).

## Project structure

```
backend/    Java Spring Boot app
frontend/   React + Vite app
infra/      Docker Compose for local PostgreSQL + PostGIS
```

## Status

- [x] Database schema (PostGIS, spatial index)
- [x] Spring Boot REST API (`/api/shops`, `/api/shops/nearby`, `/api/shops/{id}`)
- [x] React frontend with Leaflet map
- [ ] Shop data (crawler / seed data)
- [ ] Filter sidebar
- [ ] Production deployment
