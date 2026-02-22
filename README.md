# Merchant Transaction Portal

A production-ready, containerized web application for managing multi-source transaction data with real-time analytics.

## Features

- **Multi-Source Transaction Ingestion**: Webhook endpoints for Stripe, PayPal, Square, and other payment processors
- **Real-time Analytics Dashboard**: Visualize transaction volumes, success rates, and merchant performance
- **RESTful API**: Complete CRUD operations for transactions, merchants, and analytics
- **Database-Backed**: PostgreSQL with optimized schema and indexes
- **Fully Containerized**: One-command Docker setup for development and production

## Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS + Recharts
- **Backend**: Node.js 22 + Express + PostgreSQL
- **Database**: PostgreSQL 16 with full-text search and JSONB support
- **Deployment**: Docker + Docker Compose with multi-stage builds

---

## Quick Start with Docker

### Prerequisites

- Docker Desktop or Docker Engine (20.10+)
- Docker Compose (2.0+)
- 4GB RAM available for containers

### One-Command Startup

```bash
# 1. Clone the repository
git clone <repository-url>
cd merchant-portal

# 2. Create environment configuration
cp .env.example .env

# 3. Update the database password in .env
# Edit .env and change POSTGRES_PASSWORD to a secure value

# 4. Start all services
docker-compose up

# That's it! The application is now running:
# - Frontend: http://localhost
# - API Health: http://localhost/health
# - API Docs: http://localhost/api/transactions
# - Database Admin (dev): http://localhost:8080
```

### Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost | React dashboard for viewing transactions and analytics |
| **API Health** | http://localhost/health | Backend health check with DB connectivity status |
| **Transactions API** | http://localhost/api/transactions | RESTful API for transaction management |
| **Analytics API** | http://localhost/api/analytics | Aggregated metrics and insights |
| **Webhook Ingestion** | http://localhost/api/webhooks/* | Endpoints for payment provider webhooks |
| **Adminer** (dev) | http://localhost:8080 | Database admin UI (dev mode only) |

---

## Development Mode

Development mode includes hot-reload, exposed database port, and debug logging.

```bash
# Start in development mode
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Access points in dev mode:
# - Frontend (Vite): http://localhost:5173
# - Backend API: http://localhost:3000
# - PostgreSQL: localhost:5433 (for DBeaver, pgAdmin, etc.)
# - Adminer: http://localhost:8080
```

### Hot Reload

Both frontend and backend support hot-reload in development mode:
- Edit files in `./frontend/src/` - changes reflect instantly
- Edit files in `./backend/src/` - Node.js restarts automatically

---

## Production Deployment

```bash
# Start in production mode
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Check container health
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop all services
docker-compose down

# Stop and remove all data (WARNING: DATA LOSS)
docker-compose down -v
```

---

## Docker Architecture

### Container Stack

```
┌─────────────────────────────────────────────────────────┐
│  Host Machine                                           │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Docker Network: merchant-portal-network          │ │
│  │                                                     │ │
│  │  ┌──────────┐    ┌──────────┐    ┌─────────────┐ │ │
│  │  │ Frontend │───▶│ Backend  │───▶│ PostgreSQL  │ │ │
│  │  │ (Nginx)  │    │ (Node.js)│    │ (Database)  │ │ │
│  │  │ Port 80  │    │ Port 3000│    │ Port 5432   │ │ │
│  │  └──────────┘    └──────────┘    └─────────────┘ │ │
│  │       │                │                  │       │ │
│  │       │                │                  │       │ │
│  │  ┌────────┐      ┌─────────┐       ┌──────────┐ │ │
│  │  │ React  │      │ Express │       │ pg_data  │ │ │
│  │  │ Build  │      │ API     │       │ Volume   │ │ │
│  │  └────────┘      └─────────┘       └──────────┘ │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Services

| Service | Image | Purpose | Exposed Ports |
|---------|-------|---------|---------------|
| **frontend** | nginx:1.27-alpine | Serves React SPA + API reverse proxy | 80 (HTTP) |
| **backend** | node:22-alpine | Express.js REST API | None (proxied via nginx) |
| **postgres** | postgres:16-alpine | Primary database | None (internal network only) |
| **adminer** (dev) | adminer:4-standalone | Database admin UI | 8080 (dev mode only) |

### Volumes

- **pg_data**: PostgreSQL data directory (persistent)
- **pg_backup**: Automated database backups (persistent)

---

## Environment Variables

### Required Configuration

Edit `.env` file in the root directory:

```bash
# PostgreSQL Configuration
POSTGRES_USER=merchant_portal_user
POSTGRES_PASSWORD=YOUR_SECURE_PASSWORD_HERE  # CHANGE THIS!
POSTGRES_DB=merchant_portal_db

# Application Environment
NODE_ENV=production
LOG_LEVEL=info

# CORS Configuration
CORS_ORIGIN=http://localhost
```

### Frontend Configuration

Edit `frontend/.env` (optional):

```bash
VITE_API_BASE_URL=/api
```

---

## Database Management

### Access Database

```bash
# Using psql inside container
docker-compose exec postgres psql -U merchant_portal_user -d merchant_portal_db

# Or use Adminer (dev mode)
# Open http://localhost:8080
# Server: postgres
# Username: merchant_portal_user
# Password: (from .env)
# Database: merchant_portal_db
```

### Manual Backup

```bash
# Create backup
docker-compose exec postgres pg_dump -U merchant_portal_user merchant_portal_db > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U merchant_portal_user merchant_portal_db < backup.sql
```

### View Sample Data

The database initializes with sample transactions from multiple sources (Stripe, PayPal, Square).

```sql
-- View all transactions
SELECT * FROM transactions;

-- View merchants
SELECT * FROM merchants;

-- View analytics
SELECT * FROM v_source_analytics;
```

---

## API Endpoints

### Health Check

```bash
curl http://localhost/health

# Response:
{
  "status": "healthy",
  "timestamp": "2026-02-21T18:00:00.000Z",
  "uptime": 120.5,
  "environment": "production",
  "database": {
    "connected": true,
    "latency_ms": 2
  },
  "memory": {
    "used_mb": 45,
    "total_mb": 512
  }
}
```

### Transactions

```bash
# Get all transactions
curl http://localhost/api/transactions

# Get transaction by ID
curl http://localhost/api/transactions/{id}

# Filter by source
curl http://localhost/api/transactions?source=stripe

# Filter by status
curl http://localhost/api/transactions?status=completed
```

### Analytics

```bash
# Transaction volume by source
curl http://localhost/api/analytics/volume

# Success rates by source
curl http://localhost/api/analytics/success-rate

# Transaction timeline
curl http://localhost/api/analytics/timeline
```

### Webhooks

```bash
# Stripe webhook
curl -X POST http://localhost/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{"event": "charge.succeeded", "data": {...}}'

# PayPal webhook
curl -X POST http://localhost/api/webhooks/paypal \
  -H "Content-Type: application/json" \
  -d '{"event_type": "PAYMENT.CAPTURE.COMPLETED", "data": {...}}'
```

---

## Troubleshooting

### Containers won't start

```bash
# Check logs
docker-compose logs backend
docker-compose logs postgres

# Check container health
docker-compose ps
```

### Database connection issues

```bash
# Remove old volumes and restart fresh
docker-compose down -v
docker-compose up -d

# Check database logs
docker-compose logs postgres
```

### Port already in use

```bash
# Check what's using port 80
lsof -i :80

# Or use custom port
FRONTEND_PORT=8080 docker-compose up
```

### Backend unhealthy

```bash
# Check backend logs
docker-compose logs backend

# Verify database is ready
docker-compose exec postgres pg_isready

# Restart backend
docker-compose restart backend
```

---

## Development

### Project Structure

```
merchant-portal/
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── index.js        # Application entry point
│   │   ├── db/pool.js      # Database connection pool
│   │   ├── routes/         # API route handlers
│   │   ├── middleware/     # Express middleware
│   │   └── utils/          # Utility functions
│   ├── Dockerfile          # Backend container definition
│   └── package.json
│
├── frontend/                # React application
│   ├── src/
│   │   ├── App.jsx         # Main application component
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── services/       # API client services
│   ├── nginx.conf          # Nginx configuration
│   ├── Dockerfile          # Frontend container definition
│   └── package.json
│
├── db/
│   └── schema.sql          # PostgreSQL schema and sample data
│
├── docker-compose.yml      # Base Docker Compose configuration
├── docker-compose.dev.yml  # Development overrides
├── docker-compose.prod.yml # Production overrides
└── .env.example            # Environment template
```

### Running Without Docker

#### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with local PostgreSQL connection
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

#### Database

```bash
# Install PostgreSQL locally
# Create database
createdb merchant_portal_db

# Run schema
psql -d merchant_portal_db -f db/schema.sql
```

---

## Testing

### Backend Tests

```bash
# Run inside container
docker-compose exec backend npm test

# Or locally
cd backend
npm test
```

### Health Check

```bash
# Quick verification
curl http://localhost/health | jq .

# Expected output:
# {
#   "status": "healthy",
#   "database": {
#     "connected": true,
#     "latency_ms": 2
#   }
# }
```

---

## Production Checklist

- [ ] Change `POSTGRES_PASSWORD` in `.env` to a strong password
- [ ] Update `CORS_ORIGIN` to your production domain
- [ ] Set `NODE_ENV=production`
- [ ] Configure SSL/TLS certificates for HTTPS
- [ ] Set up automated backups (see `docker-compose.prod.yml`)
- [ ] Configure resource limits for containers
- [ ] Set up monitoring and alerting
- [ ] Review security headers in `nginx.conf`
- [ ] Enable log aggregation (ELK, Loki, etc.)

---

## License

MIT

---

## AI Impact & DORA Metrics

This project tracks AI's impact on development velocity and quality using comprehensive metrics.

### Quick Metrics

![Deployment Frequency](https://img.shields.io/badge/Deployment_Frequency-Elite-brightgreen)
![Lead Time](https://img.shields.io/badge/Lead_Time-High-blue)
![Change Failure Rate](https://img.shields.io/badge/Change_Failure_Rate-Elite-brightgreen)
![MTTR](https://img.shields.io/badge/MTTR-High-blue)

### Run Metrics

```bash
# AI Impact Metrics (last 30 days)
./metrics/track-ai-impact.sh

# DORA Metrics (last 30 days)
./metrics/dora-metrics.sh

# Custom period (e.g., 60 days)
./metrics/track-ai-impact.sh 60
./metrics/dora-metrics.sh 60
```

### View Dashboard

Metrics are automatically generated weekly via GitHub Actions.
- View latest reports in `metrics/` directory
- HTML Dashboard: `metrics/dashboard.html`
- JSON/CSV/Markdown reports available

### Documentation

- [AI Impact Framework](docs/ai-impact-framework.md) - Complete guide to tracking AI impact
- [DORA Metrics Guide](docs/dora-metrics-guide.md) - DORA metrics definitions and best practices
- [PR Template](.github/PULL_REQUEST_TEMPLATE.md) - How to tag PRs with AI metrics
- [Commit Template](.gitmessage) - How to tag commits with AI metadata

### Configure Git Commit Template

```bash
# Enable AI tracking in your commits
git config commit.template .gitmessage
```

---

## Support

For issues, questions, or contributions, please contact the development team or open an issue in the repository.
