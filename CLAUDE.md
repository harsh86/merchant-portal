# Merchant Portal Project

## What We're Building
Full-stack merchant transaction portal:
- Webhooks + REST API ingest transactions from multiple sources
- PostgreSQL stores all transactions locally
- Node.js/Express backend API
- React frontend dashboard for merchants
- Use design patterns while designing and deciding design elements of the application
- Use Open AI spec while designing services and APIs

## Stack
- Backend: Node.js, Express, PostgreSQL (pg driver), Zod, Jest
- Frontend: React 18, Vite, TailwindCSS, React Query, Recharts
- Infra: Docker Compose, GitHub Actions

## Folder Structure
```
merchant-portal/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── db/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── hooks/
│   └── package.json
├── db/
│   └── schema.sql
└── docs/
```

## Key Rules for All Agents
- Never commit .env files
- All DB queries go in /services layer only, never in routes
- Use environment variables for all credentials
- JSDoc comments on all exported functions
- Log AI-generated vs human lines in every PR description
