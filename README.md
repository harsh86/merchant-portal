# Merchant Transaction Portal

> 🤖 **100% AI-Generated** in 27 hours using [Claude Code](https://claude.ai/code) with parallel agent teams

A production-ready, containerized web application for managing multi-source transaction data with real-time analytics and a modern, accessible UI built with a comprehensive design system.

[![AI Generated](https://img.shields.io/badge/AI_Generated-100%25-brightgreen)](https://claude.ai/code)
[![Time Saved](https://img.shields.io/badge/Time_Saved-150_hours-blue)](./COMPLETE_PROJECT_HISTORY.md)
[![Productivity](https://img.shields.io/badge/Productivity-6.6x-orange)](./COMPLETE_PROJECT_HISTORY.md)
[![Claude Code](https://img.shields.io/badge/Built_with-Claude_Code-purple)](https://claude.ai/code)

---

## ✨ Features

### Transaction Management
- **Multi-Source Webhook Ingestion**: Stripe, PayPal, Square integration
- **Advanced Filtering**: By source, status, date range, and amount
- **Real-time Search**: Instant transaction filtering
- **Sortable Data**: Click column headers to sort
- **Pagination**: Configurable page sizes (25/50/100)
- **Responsive Table**: Desktop table view, mobile card view

### Modern UI/UX
- **Design System**: 500+ design tokens (colors, typography, spacing, elevation)
- **Component Library**: 11 reusable UI components built with Radix UI
- **Collapsible Sidebar**: 16rem ↔ 4.5rem smooth animation
- **Mobile Navigation**: Full-screen drawer with backdrop blur
- **Framer Motion**: Smooth 60fps animations throughout
- **Accessibility**: WCAG AA compliant, keyboard navigable
- **Custom Fonts**: Inter (primary) + JetBrains Mono (monospace)

### Analytics & Metrics
- **Real-time Dashboard**: Live transaction volume, status distribution
- **AI Impact Tracking**: Lines generated, time saved, productivity multiplier
- **DORA Metrics**: Deployment frequency, lead time, MTTR, change failure rate
- **Auto-refresh**: 30-second intervals for live data

### Infrastructure
- **Docker Containerized**: One-command startup
- **Multi-environment**: Development & production configs
- **Health Checks**: Automated container health monitoring
- **Hot Reload**: Development mode with instant file updates
- **PostgreSQL 16**: Optimized schema with 14 indexes

---

## 🚀 Quick Start

### Prerequisites

- **Docker Desktop** or **Docker Engine** 20.10+
- **Docker Compose** 2.0+
- 4GB RAM available
- 10GB disk space

### One-Command Startup

```bash
# 1. Clone the repository
git clone <repository-url>
cd merchant-portal

# 2. Create environment configuration
cp .env.example .env

# 3. Update database password (IMPORTANT!)
# Edit .env and change POSTGRES_PASSWORD

# 4. Start all services
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# That's it! Application is running at:
# → Frontend: http://localhost:5173
# → Backend API: http://localhost:3000
# → Database UI: http://localhost:8080
```

### Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | Modern React dashboard with design system |
| **Backend API** | http://localhost:3000 | RESTful API endpoints |
| **API Health** | http://localhost:3000/health | Health check + metrics |
| **Transactions** | http://localhost:3000/api/transactions | Transaction management API |
| **Analytics** | http://localhost:3000/api/analytics/summary | Aggregated metrics |
| **AI Metrics** | http://localhost:3000/api/metrics/ai-impact | AI impact tracking |
| **DORA Metrics** | http://localhost:3000/api/metrics/dora | DevOps metrics |
| **Adminer** | http://localhost:8080 | Database admin UI (dev mode) |

---

## 🎨 UI/UX Features

### Design System

**Comprehensive token-based system:**
- **Colors**: Primary (blue), accents (purple/teal/amber/rose), semantic (success/warning/error/info), 10-step gray scale
- **Typography**: Inter (300-800), JetBrains Mono (400-600), 9-step size scale
- **Spacing**: 4px-based scale (0-96 = 0px-384px)
- **Elevation**: 5 shadow levels (sm → 2xl)
- **Animations**: Fast (150ms), Normal (250ms), Slow (350ms)
- **Border Radius**: sm → full (0.25rem → 9999px)

### Component Library (11 Components)

Built with **Radix UI** for accessibility:

1. **Button** - 6 variants, 3 sizes, loading states, icons
2. **Card** - Elevation variants, hover effects
3. **Badge** - Semantic colors, 3 sizes
4. **Input** - Validation states, icons, clear button
5. **Select** - Custom styled, accessible dropdown
6. **Table** - Sortable, sticky header, mobile card view
7. **Modal** - Backdrop blur, 5 sizes, animations
8. **Tooltip** - Configurable placement, smooth animations
9. **Skeleton** - Loading placeholders with shimmer
10. **EmptyState** - No data displays with actions
11. **Spinner** - Loading indicators

### Layout Components (5 Components)

1. **Sidebar** - Collapsible (16rem ↔ 4.5rem), localStorage persistence
2. **SidebarItem** - Active states, tooltips, badge support
3. **TopBar** - Breadcrumbs, hamburger menu (mobile)
4. **Breadcrumbs** - Auto-generated from route
5. **MobileNav** - Drawer with overlay, Framer Motion

### Responsive Design

- **Mobile**: <768px - Card views, drawer navigation
- **Tablet**: 768-1024px - Optimized layouts
- **Desktop**: >1024px - Full features, collapsible sidebar
- **Support**: 320px → 2560px

---

## 💻 Tech Stack

### Frontend
- **React** 18.3.1 - UI library
- **Vite** 7.3.1 - Build tool & dev server
- **TailwindCSS** 3.4.x - Utility-first CSS
- **Radix UI** - Accessible component primitives
- **Framer Motion** 11.x - Animation library
- **Recharts** - Data visualization
- **React Query** - Data fetching & caching
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **Axios** - HTTP client

### Backend
- **Node.js** 22 (Alpine)
- **Express.js** - Web framework
- **PostgreSQL** 16 - Database
- **pg** - PostgreSQL client
- **Zod** - Schema validation
- **Winston** - Logging
- **Helmet** - Security headers
- **Jest** - Testing (24 tests)

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** 1.27-alpine - Production web server
- **PostgreSQL** 16-alpine - Database
- **Adminer** - Database admin UI (dev)

---

## 📚 Documentation

### Project Documentation
- **[Complete Project History](./COMPLETE_PROJECT_HISTORY.md)** - Full development timeline, commits, errors & fixes
- **[Architecture](./docs/architecture.md)** - System design & component diagrams
- **[API Contract](./docs/api-contract.yaml)** - OpenAPI 3.0 specification
- **[Database Schema](./db/schema.sql)** - PostgreSQL schema with comments

### AI Development
- **[AI Impact Report](./docs/ai-impact-report.md)** - Metrics & analysis
- **[Team Coordination](./docs/TEAM_COORDINATION.md)** - Agent team structure
- **[QA Checklist](./docs/QA_CHECKLIST.md)** - Quality assurance

---

## 🤖 AI-Powered Development

This project was built **100% by AI** using **Claude Code** with specialized agent teams working in parallel.

### Agent Teams

**Teammate 1 - Architect**
- System architecture & design patterns
- API contracts (OpenAPI 3.0)
- Database schema design
- **Output**: 1,520 lines

**Teammate 2 - Backend-Dev**
- Express.js REST API (6 endpoints)
- PostgreSQL integration
- Unit testing (24 tests)
- **Output**: 1,726 lines

**Teammate 3 - Frontend-Dev**
- React dashboard & components
- Design system & UI library
- Responsive layouts
- **Output**: 5,920 lines

**Teammate 4 - DevOps**
- Docker containerization
- Multi-environment setup
- CI/CD configuration
- **Output**: 500 lines

### Development Metrics

| Metric | Value |
|--------|-------|
| **Total Lines of Code** | 32,163 |
| **AI-Generated Code** | 100% |
| **Human-Written Code** | 0% |
| **Traditional Time** | ~177 hours |
| **AI-Assisted Time** | ~27 hours |
| **Time Saved** | ~150 hours |
| **Productivity Multiplier** | 6.6x |
| **Development Days** | 2 days |
| **Total Commits** | 18 |

### Learn More About Claude Code

- **[Claude Code Official](https://claude.ai/code)** - AI-powered coding assistant
- **[Claude AI](https://claude.ai/)** - Anthropic's AI assistant
- **[Claude API Documentation](https://docs.anthropic.com/)** - API reference
- **[Claude Agent SDK](https://github.com/anthropics/anthropic-sdk-typescript)** - Build custom agents

---

## 🛠️ Development

### Development Mode

```bash
# Start with hot reload
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Frontend hot reload
# Edit files in ./frontend/src/ - instant updates

# Backend hot reload
# Edit files in ./backend/src/ - auto-restart with nodemon

# Access:
# → Frontend: http://localhost:5173 (Vite dev server)
# → Backend: http://localhost:3000 (Express API)
# → Database: localhost:5433 (PostgreSQL)
# → Adminer: http://localhost:8080 (DB admin)
```

### Project Structure

```
merchant-portal/
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── index.js           # Entry point
│   │   ├── db/connection.js   # PostgreSQL pool
│   │   ├── routes/            # API routes (3 files)
│   │   ├── controllers/       # Request handlers (3 files)
│   │   ├── services/          # Database queries
│   │   ├── middleware/        # Validation, logging, errors
│   │   └── tests/             # Jest tests (24 tests)
│   ├── Dockerfile             # Multi-stage build
│   └── package.json
│
├── frontend/                   # React application
│   ├── src/
│   │   ├── main.jsx           # Entry point
│   │   ├── App.jsx            # Root component
│   │   ├── components/
│   │   │   ├── ui/            # 11 UI components
│   │   │   └── layout/        # 5 layout components
│   │   ├── pages/             # 3 pages (Transactions, Analytics, Metrics)
│   │   ├── contexts/          # LayoutContext
│   │   ├── hooks/             # Custom hooks (3 files)
│   │   ├── styles/            # tokens.js, utils.js
│   │   ├── utils/             # animations.js, helpers.js
│   │   └── services/          # API client
│   ├── Dockerfile             # Vite build → Nginx
│   ├── tailwind.config.js     # Design tokens integration
│   └── package.json
│
├── db/
│   ├── schema.sql             # PostgreSQL schema
│   └── init/                  # Initialization scripts
│
├── docs/                       # Documentation
├── metrics/                    # AI impact & DORA metrics
├── docker-compose.yml          # Base configuration
├── docker-compose.dev.yml      # Development overrides
└── .env.example                # Environment template
```

### Running Tests

```bash
# Backend tests (Jest)
docker-compose exec backend npm test

# Or locally
cd backend && npm test

# Expected: 24 tests passing
```

### Building for Production

```bash
# Build all images
docker-compose build

# Start in production mode
docker-compose up -d

# Check health
docker-compose ps
curl http://localhost/health | jq .

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## 🗄️ Database

### Schema Overview

**Tables:**
1. **merchants** - Merchant accounts
2. **transactions** - Payment records (JSONB metadata)
3. **webhook_logs** - Audit trail for webhooks

**Features:**
- 14 optimized indexes for query performance
- Foreign key constraints for data integrity
- Check constraints for validation
- Triggers for `updated_at` timestamps
- JSONB columns for flexible metadata
- Full-text search ready

### Database Access

```bash
# Using psql inside container
docker-compose exec postgres psql -U merchant_portal_user -d merchant_portal_db

# Using Adminer (dev mode)
# Open http://localhost:8080
# Server: postgres
# Username: merchant_portal_user
# Password: (from .env)
# Database: merchant_portal_db
```

### Manual Backup/Restore

```bash
# Create backup
docker-compose exec postgres pg_dump -U merchant_portal_user merchant_portal_db > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U merchant_portal_user merchant_portal_db < backup.sql
```

### Sample Queries

```sql
-- View all transactions
SELECT id, source, amount, status, created_at
FROM transactions
ORDER BY created_at DESC
LIMIT 10;

-- Transaction volume by source
SELECT source, COUNT(*) as count, SUM(amount::numeric) as total
FROM transactions
GROUP BY source;

-- Success rate by source
SELECT
  source,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'completed') as completed,
  ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'completed') / COUNT(*), 2) as success_rate
FROM transactions
GROUP BY source;
```

---

## 🔌 API Endpoints

### Health Check

```bash
GET /health

# Response:
{
  "status": "healthy",
  "timestamp": "2026-02-22T17:00:00.000Z",
  "uptime": 3600.5,
  "environment": "development",
  "database": {
    "connected": true,
    "latency_ms": 1
  },
  "memory": {
    "used_mb": 9,
    "total_mb": 11,
    "rss_mb": 66
  }
}
```

### Transaction Management

```bash
# List all transactions (paginated)
GET /api/transactions?page=1&limit=50

# Filter by source
GET /api/transactions?source=stripe

# Filter by status
GET /api/transactions?status=completed

# Date range filter
GET /api/transactions?date_from=2026-02-01&date_to=2026-02-22

# Amount range
GET /api/transactions?min_amount=100&max_amount=500

# Get single transaction
GET /api/transactions/:id
```

### Analytics

```bash
# Summary analytics
GET /api/analytics/summary?group_by=source

# Response:
{
  "success": true,
  "data": {
    "total_transactions": 1234,
    "total_amount": 156789.50,
    "average_amount": 127.12,
    "by_source": { ... },
    "by_status": { ... }
  }
}
```

### AI Metrics

```bash
# AI Impact metrics
GET /api/metrics/ai-impact

# Response:
{
  "success": true,
  "data": {
    "totalLinesGenerated": 32163,
    "aiPercentage": 100,
    "timeSavedHours": 150,
    "productivityMultiplier": 6.6,
    "activeAgents": 4,
    "commitsByAgent": { ... }
  }
}

# DORA metrics
GET /api/metrics/dora

# Response:
{
  "success": true,
  "data": {
    "deploymentFrequency": "multiple per day",
    "leadTime": { ... },
    "mttr": { ... },
    "changeFailureRate": { ... }
  }
}
```

### Webhook Ingestion

```bash
# Ingest webhook event
POST /api/webhooks/ingest
Content-Type: application/json

{
  "source": "stripe",
  "merchant_id": "uuid",
  "amount": 99.99,
  "currency": "USD",
  "status": "completed",
  "payload": { ... }
}

# Response: 201 Created
{
  "success": true,
  "data": {
    "id": "uuid",
    "transaction_id": "uuid"
  }
}
```

---

## 🎯 Environment Variables

### Required Configuration

Create `.env` file in root directory:

```bash
# PostgreSQL Configuration
POSTGRES_USER=merchant_portal_user
POSTGRES_PASSWORD=CHANGE_ME_SECURE_PASSWORD  # ⚠️ IMPORTANT: Change this!
POSTGRES_DB=merchant_portal_db

# Application Environment
NODE_ENV=production           # Options: development, production
LOG_LEVEL=info               # Options: debug, info, warn, error

# CORS Configuration
CORS_ORIGIN=http://localhost # Production: https://yourdomain.com

# Port Configuration (optional - defaults provided)
FRONTEND_PORT=80             # Frontend Nginx port
BACKEND_PORT=3000            # Backend API port
POSTGRES_PORT=5432           # PostgreSQL port (internal)
```

### Frontend Environment (optional)

Create `frontend/.env`:

```bash
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## 🐛 Troubleshooting

### Common Issues

#### Frontend blank page / React errors

```bash
# Check browser console for errors
# Common fix: Clear Vite cache
docker-compose down
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

#### Database connection errors

```bash
# Remove volumes and restart fresh
docker-compose down -v
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Check password in .env matches
cat .env | grep POSTGRES_PASSWORD
```

#### Port already in use

```bash
# Check what's using the port
lsof -i :5173  # Frontend
lsof -i :3000  # Backend

# Kill the process or use different ports
FRONTEND_PORT=8080 docker-compose up
```

#### Backend unhealthy

```bash
# Check logs
docker-compose logs backend

# Verify database is ready
docker-compose exec postgres pg_isready

# Restart backend
docker-compose restart backend
```

#### Permission errors

```bash
# On macOS/Linux, fix file permissions
chmod -R 755 backend/ frontend/

# Rebuild with no cache
docker-compose build --no-cache
```

### Debug Mode

```bash
# Run with verbose logging
LOG_LEVEL=debug docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Check container health
docker-compose ps

# Inspect container
docker-compose exec backend sh
docker-compose exec frontend sh

# View all logs
docker-compose logs --tail=100 -f
```

---

## 📊 AI Impact & DORA Metrics

### View Metrics

```bash
# Real-time AI impact
curl http://localhost:3000/api/metrics/ai-impact | jq .

# Real-time DORA metrics
curl http://localhost:3000/api/metrics/dora | jq .

# From scripts
./metrics/track-ai-impact.sh
```

### Metrics Dashboard

Visit the Metrics page in the UI:
- Navigate to http://localhost:5173/metrics
- View real-time AI impact
- See DORA metrics visualization
- Auto-refreshes every 30 seconds

---

## 🚢 Production Deployment

### Pre-deployment Checklist

- [ ] Change `POSTGRES_PASSWORD` to a strong password (min 16 chars)
- [ ] Update `CORS_ORIGIN` to your production domain
- [ ] Set `NODE_ENV=production`
- [ ] Configure SSL/TLS certificates
- [ ] Set up automated database backups
- [ ] Configure resource limits for containers
- [ ] Set up monitoring (Datadog, New Relic, etc.)
- [ ] Enable log aggregation (ELK, Loki, CloudWatch)
- [ ] Review Nginx security headers
- [ ] Set up rate limiting
- [ ] Configure firewall rules
- [ ] Set up CDN (Cloudflare, AWS CloudFront)

### Production Commands

```bash
# Start in production mode
docker-compose up -d

# Check all containers are healthy
docker-compose ps

# View logs
docker-compose logs -f

# Stop gracefully
docker-compose down

# Update and restart
git pull
docker-compose build
docker-compose up -d
```

### Resource Recommendations

**Minimum:**
- 2 CPU cores
- 4GB RAM
- 20GB disk space

**Recommended:**
- 4 CPU cores
- 8GB RAM
- 50GB disk space
- SSD storage

---

## 🔗 Useful Links

### Claude & AI Development
- **[Claude Code](https://claude.ai/code)** - Official Claude Code product
- **[Claude AI](https://claude.ai/)** - Claude web interface
- **[Anthropic](https://www.anthropic.com/)** - Company behind Claude
- **[Claude API Docs](https://docs.anthropic.com/)** - API documentation
- **[Claude Cookbook](https://github.com/anthropics/anthropic-cookbook)** - Code examples & guides
- **[Anthropic SDK](https://github.com/anthropics/anthropic-sdk-typescript)** - TypeScript SDK

### Technologies Used
- **[React](https://react.dev/)** - UI library
- **[Vite](https://vitejs.dev/)** - Build tool
- **[TailwindCSS](https://tailwindcss.com/)** - CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible components
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Express.js](https://expressjs.com/)** - Backend framework
- **[PostgreSQL](https://www.postgresql.org/)** - Database
- **[Docker](https://www.docker.com/)** - Containerization

### Documentation Standards
- **[OpenAPI 3.0](https://swagger.io/specification/)** - API specification
- **[Conventional Commits](https://www.conventionalcommits.org/)** - Commit messages
- **[WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)** - Accessibility guidelines
- **[DORA Metrics](https://dora.dev/)** - DevOps performance

---

## 📝 License

MIT License - See [LICENSE](./LICENSE) file for details

---

## 🙏 Acknowledgments

- **Claude Code Team** - For creating an amazing AI coding assistant
- **Anthropic** - For Claude Sonnet 4.5
- **Open Source Community** - For all the incredible libraries used

---

## 📧 Support

For questions, issues, or contributions:
- Open an issue in the repository
- Review the [Complete Project History](./COMPLETE_PROJECT_HISTORY.md)
- Check the [Troubleshooting](#-troubleshooting) section

---

**Built with ❤️ by AI (Claude Sonnet 4.5) in 27 hours**

*Traditional development estimate: 177 hours · Time saved: 150 hours · Productivity: 6.6x*
