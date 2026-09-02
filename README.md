# FraudGuard — Financial Fraud Detection Platform

A professional full-stack final-year project for real-time transaction monitoring and fraud detection.

## Stack
- Frontend: React + TypeScript + Vite + React Router + Recharts + Lucide
- Backend: Node.js + Express + TypeScript
- Database: MongoDB + Mongoose
- Authentication: JWT + bcrypt
- DevOps: Docker Compose
- API: REST

## Features
- Dashboard with KPIs, fraud trend, risk distribution and recent transactions
- Transaction monitoring with search/filtering
- Customer monitoring
- Fraud alert management
- Analytics by country, payment method and risk
- Settings/system status
- Demo transaction simulator
- Rule-based fraud scoring engine
- MongoDB seed data
- JWT authentication
- Responsive professional UI
- REST API with validation and error handling

## Prerequisites
- Node.js 20+
- MongoDB 7+ OR Docker Desktop

## 1. Start MongoDB
Option A: local MongoDB, then use the default URI in backend/.env.example.

Option B:
```bash
docker compose up -d mongodb
```

## 2. Backend
```bash
cd backend
copy .env.example .env
npm install
npm run seed
npm run dev
```
Backend runs on http://localhost:5000

Demo login:
- Email: admin@fraudguard.local
- Password: Admin@123

## 3. Frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:5173

## 4. Docker full stack
```bash
docker compose up --build
```
Then open http://localhost:5173

## API
- POST /api/auth/login
- GET /api/dashboard/summary
- GET /api/transactions
- POST /api/transactions/analyze
- GET /api/customers
- GET /api/alerts
- PATCH /api/alerts/:id
- GET /api/analytics
- GET /api/health

## Important
This is a demonstration/academic fraud detection system. It uses explainable rule-based scoring and dummy data; it is not production banking software.
