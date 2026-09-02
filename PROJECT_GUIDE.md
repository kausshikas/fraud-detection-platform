# FraudGuard project guide

## Folder map
- frontend/ = React UI
- backend/ = Express API + fraud engine
- MongoDB = database, populated by backend/src/seed.ts

## Run order in VS Code
Terminal 1:
1. Start MongoDB (local or `docker compose up -d mongodb`)
2. `cd backend`
3. `npm install`
4. Copy `.env.example` to `.env`
5. `npm run seed`
6. `npm run dev`

Terminal 2:
1. `cd frontend`
2. `npm install`
3. `npm run dev`

Open http://localhost:5173

## Demo flow
1. Sign in using the credentials in README.
2. Dashboard loads live MongoDB summary.
3. Transactions page reads MongoDB.
4. Use "Analyze a new transaction" to send a transaction to the backend.
5. The fraud engine calculates score + risk + reasons.
6. Medium/high transactions create fraud alerts.
7. Alerts can be moved Open → Investigating → Resolved.
8. Analytics reads MongoDB aggregations.

## Academic architecture
React UI → REST API → Express routes → Fraud scoring engine → MongoDB
