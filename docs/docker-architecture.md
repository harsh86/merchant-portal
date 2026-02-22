# Docker Architecture Design
## Merchant Transaction Portal - Containerization Strategy

**Version:** 1.0.0
**Last Updated:** 2026-02-21
**Status:** Architecture Design - Ready for Implementation

---

## Executive Summary

This document defines the production-ready containerization strategy for the Merchant Transaction Portal. The architecture prioritizes security, reliability, and developer experience while maintaining one-command startup simplicity.

**Core Principle:** `docker-compose up` should spin up a fully functional, production-grade environment.

---

## Table of Contents

1. [Container Architecture](#1-container-architecture)
2. [Container Responsibilities](#2-container-responsibilities)
3. [Network Architecture](#3-network-architecture)
4. [Volume Strategy](#4-volume-strategy)
5. [Security Best Practices](#5-security-best-practices)
6. [Environment Configuration](#6-environment-configuration)
7. [Health Checks & Readiness Probes](#7-health-checks--readiness-probes)
8. [Logging Strategy](#8-logging-strategy)
9. [Backup & Restore Strategy](#9-backup--restore-strategy)
10. [Development vs Production Differences](#10-development-vs-production-differences)
11. [Implementation Specifications](#11-implementation-specifications)
12. [Base Image Recommendations](#12-base-image-recommendations)
13. [Port Mapping Strategy](#13-port-mapping-strategy)
14. [Orchestration Readiness](#14-orchestration-readiness)

---

## 1. Container Architecture

### Architecture Diagram (Mermaid)

```mermaid
graph TB
    subgraph "Host Machine"
        subgraph "Docker Network: merchant-portal-network"
            NGINX[Frontend Container<br/>nginx:1.27-alpine<br/>Port 80/443]
            API[Backend Container<br/>node:22-alpine<br/>Port 3000]
            DB[(PostgreSQL Container<br/>postgres:16-alpine<br/>Port 5432)]
            ADMINER[Database Admin<br/>adminer:4-standalone<br/>Port 8080<br/>DEV ONLY]
        end

        subgraph "Docker Volumes"
            PG_DATA[pg_data<br/>PostgreSQL Data]
            PG_BACKUP[pg_backup<br/>Backup Storage]
            LOGS[logs<br/>Application Logs]
        end
    end

    USER[External User] -->|HTTP/HTTPS| NGINX
    NGINX -->|Proxy API Requests| API
    API -->|PostgreSQL Protocol| DB
    DB -->|Data Persistence| PG_DATA
    DB -->|Scheduled Backups| PG_BACKUP
    API -->|Log Files| LOGS
    ADMINER -.->|Admin Access| DB
    DEV[Developer] -.->|Web UI| ADMINER

    style NGINX fill:#4CAF50
    style API fill:#2196F3
    style DB fill:#FF9800
    style ADMINER fill:#9E9E9E,stroke-dasharray: 5 5
    style PG_DATA fill:#FFE082
    style PG_BACKUP fill:#FFE082
    style LOGS fill:#FFE082
```

### Container Stack Overview

| Container | Base Image | Purpose | Exposed Ports | Network Access |
|-----------|-----------|---------|---------------|----------------|
| **frontend** | nginx:1.27-alpine | Serve React SPA + Proxy API | 80, 443 | Public |
| **backend** | node:22-alpine | Express.js API server | 3000 (internal) | Private (via nginx) |
| **postgres** | postgres:16-alpine | Primary database | 5432 (internal) | Private |
| **adminer** (dev) | adminer:4-standalone | Database admin UI | 8080 | Public (dev only) |

---

## 2. Container Responsibilities

### 2.1 Frontend Container (`frontend`)

**Base Image:** `nginx:1.27-alpine`
**Build Strategy:** Multi-stage build (Node.js build → Nginx serve)

#### Responsibilities:
- Serve optimized production React build (static files)
- Reverse proxy `/api/*` requests to backend container
- Handle GZIP compression for static assets
- Serve security headers (CSP, HSTS, X-Frame-Options)
- SSL/TLS termination (production)
- Serve optimized cache headers for static assets

#### Key Files:
- Custom `nginx.conf` with API proxy configuration
- Built React static files in `/usr/share/nginx/html`
- SSL certificates (production volume mount)

#### Health Check:
- HTTP GET to `/` (expect 200 OK)
- Frequency: Every 30s
- Timeout: 5s
- Retries: 3

---

### 2.2 Backend Container (`backend`)

**Base Image:** `node:22-alpine`
**Build Strategy:** Multi-stage build (dependencies → production)

#### Responsibilities:
- Run Express.js API server
- Handle webhook ingestion (`/api/webhooks/*`)
- Serve transaction APIs (`/api/transactions/*`)
- Provide analytics endpoints (`/api/analytics/*`)
- Database connection pooling
- Request validation and error handling
- Graceful shutdown on SIGTERM

#### Key Configuration:
- Run as non-root user (`node` user, UID 1000)
- Environment-based configuration (no hardcoded secrets)
- Production dependencies only (devDependencies excluded)
- Database connection with retry logic
- Health check endpoint at `/health`

#### Health Check:
- HTTP GET to `/health` (expect 200 OK with JSON response)
- Includes database connectivity check
- Frequency: Every 15s
- Timeout: 3s
- Retries: 3

---

### 2.3 PostgreSQL Container (`postgres`)

**Base Image:** `postgres:16-alpine`
**Configuration:** Production-hardened settings

#### Responsibilities:
- Primary data storage for merchants, transactions, webhook_logs
- Auto-initialize schema on first run (`/docker-entrypoint-initdb.d/`)
- Data persistence via named volume
- Connection pooling support (max_connections=100)
- Automated backups to backup volume
- Query performance optimization (shared_buffers, work_mem)

#### Key Configuration:
- Custom `postgresql.conf` for production tuning
- Named volume `pg_data` for `/var/lib/postgresql/data`
- Named volume `pg_backup` for `/backups`
- Schema initialization via `schema.sql` auto-execution
- Run as non-root `postgres` user

#### Health Check:
- `pg_isready -U merchant_portal_user -d merchant_portal_db`
- Frequency: Every 10s
- Timeout: 5s
- Retries: 5
- Start period: 30s (allow time for initialization)

---

### 2.4 Adminer Container (`adminer`) - Development Only

**Base Image:** `adminer:4-standalone`
**Purpose:** Database management UI

#### Responsibilities:
- Web-based PostgreSQL administration
- Query execution and debugging
- Schema inspection
- Data exploration

#### Access:
- Only enabled in development mode (`docker-compose.dev.yml`)
- Accessible at `http://localhost:8080`
- **NEVER** deployed to production

---

## 3. Network Architecture

### Network Design

#### Bridge Network: `merchant-portal-network`
- **Driver:** Bridge (default)
- **Subnet:** Auto-assigned by Docker
- **DNS:** Automatic container name resolution
- **Isolation:** Containers communicate only within this network

### Service Communication

```
Frontend (nginx) → Backend (http://backend:3000)
Backend (node) → Database (postgresql://postgres:5432)
Adminer → Database (postgres:5432) [dev only]
```

### DNS Resolution
- Containers resolve each other by service name
- Example: Backend connects to `postgres:5432` (not `localhost:5432`)
- Network-level isolation prevents external direct access to internal services

### Port Exposure Strategy

| Service | Internal Port | External Port | Public Access |
|---------|--------------|---------------|---------------|
| Frontend | 80 | 80 | Yes |
| Frontend (HTTPS) | 443 | 443 | Yes (production) |
| Backend | 3000 | None | No (proxied via nginx) |
| PostgreSQL | 5432 | None (5433 in dev) | No (5433 dev only) |
| Adminer | 8080 | 8080 | Dev only |

**Security Note:** Only the frontend container exposes ports to the host. Backend and database are network-isolated and accessible only through internal Docker DNS.

---

## 4. Volume Strategy

### Named Volumes (Persistent Data)

#### 4.1 `pg_data` - PostgreSQL Data Directory
- **Mount Point:** `/var/lib/postgresql/data` (inside postgres container)
- **Purpose:** Persist all database tables, indexes, and configurations
- **Lifecycle:** Persistent across container restarts/rebuilds
- **Backup:** Included in automated backup strategy
- **Driver:** local (host-managed)

#### 4.2 `pg_backup` - Database Backups
- **Mount Point:** `/backups` (inside postgres container)
- **Purpose:** Store automated database dumps
- **Backup Schedule:** Daily at 2:00 AM (configured via cron in postgres container)
- **Retention:** Last 7 daily backups
- **Format:** SQL dump files (`merchant_portal_YYYYMMDD.sql`)
- **Driver:** local (host-managed)

#### 4.3 `logs` - Application Logs
- **Mount Point:** `/var/log/app` (inside backend container)
- **Purpose:** Centralized logging for backend API
- **Rotation:** 7 days retention, max 100MB per file
- **Format:** JSON structured logs
- **Driver:** local (host-managed)

### Bind Mounts (Development Only)

#### Development Mode Overrides (`docker-compose.dev.yml`)

```yaml
# Backend hot-reload
backend:
  volumes:
    - ./backend/src:/app/src:ro  # Read-only source code mount
    - /app/node_modules  # Prevent overwrite of container node_modules

# Frontend development server
frontend:
  volumes:
    - ./frontend/src:/app/src:ro
    - /app/node_modules
```

**Purpose:** Enable hot-reload for development without rebuilding containers

---

## 5. Security Best Practices

### 5.1 Non-Root Users

**All containers run as non-root users:**

| Container | User | UID/GID | Implementation |
|-----------|------|---------|----------------|
| Frontend | nginx | 101/101 | Default nginx:alpine user |
| Backend | node | 1000/1000 | Default node:alpine user |
| PostgreSQL | postgres | 999/999 | Default postgres:alpine user |

**Dockerfile enforcement:**
```dockerfile
# Backend example
USER node
```

### 5.2 Secret Management

**Principle:** NEVER commit secrets to version control

#### Environment Variable Hierarchy:
1. `.env` file (gitignored, developer-created from `.env.example`)
2. Docker secrets (production: Docker Swarm or Kubernetes)
3. External secret management (AWS Secrets Manager, HashiCorp Vault)

#### Secrets to Protect:
- `POSTGRES_PASSWORD`
- `DATABASE_URL`
- API keys (if added in future)
- SSL certificates (production)

#### Implementation:
```yaml
# docker-compose.yml
services:
  backend:
    env_file:
      - ./backend/.env  # Loads environment variables
    environment:
      - DATABASE_URL=${DATABASE_URL}  # Override from .env
```

**Production Recommendation:** Use Docker secrets or external vault:
```yaml
# docker-compose.prod.yml
services:
  backend:
    secrets:
      - db_password
secrets:
  db_password:
    external: true
```

### 5.3 Network Isolation

**Default-deny architecture:**
- Only frontend container exposes ports to host
- Backend and database accessible ONLY via internal Docker network
- No direct database access from host (except dev mode on 5433)

**Production Network Hardening:**
```yaml
networks:
  merchant-portal-network:
    driver: bridge
    internal: false  # Allow outbound internet (for npm installs, etc.)
    ipam:
      config:
        - subnet: 172.28.0.0/16
```

### 5.4 Image Security

**Multi-stage builds:**
- Minimize final image size
- Exclude build tools and devDependencies
- Copy only necessary artifacts

**Dependency scanning:**
- Use `npm audit` during build
- Fail build on high/critical vulnerabilities

**Base image updates:**
- Pin specific versions (e.g., `node:22.11.0-alpine`)
- Regular security patching schedule
- Use official Alpine-based images (smaller attack surface)

### 5.5 Read-Only Filesystem (Where Possible)

```yaml
# Example: Frontend container
frontend:
  read_only: true
  tmpfs:
    - /var/cache/nginx
    - /var/run
```

**Note:** Backend and PostgreSQL require write access to volumes

### 5.6 Resource Limits

Prevent DoS and resource exhaustion:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

---

## 6. Environment Configuration

### 6.1 Environment Variable Strategy

**Three-tier configuration:**

1. **`.env.example`** (committed to git)
   - Template with placeholder values
   - Serves as documentation
   - Developers copy to `.env` and customize

2. **`.env`** (gitignored)
   - Developer-specific configuration
   - Contains real secrets (not committed)
   - Loaded by Docker Compose

3. **`docker-compose.override.yml`** (optional, gitignored)
   - Developer-specific service overrides
   - Custom port mappings, debug settings

### 6.2 Backend Environment Variables

**File:** `/backend/.env`

```bash
# Database Configuration
DATABASE_URL=postgresql://merchant_portal_user:CHANGE_ME_STRONG_PASSWORD@postgres:5432/merchant_portal_db

# Server Configuration
PORT=3000
NODE_ENV=production  # or 'development'

# CORS Configuration
CORS_ORIGIN=http://localhost  # Frontend origin (production: https://yourdomain.com)

# Logging
LOG_LEVEL=info  # debug | info | warn | error
LOG_FORMAT=json  # json | pretty

# Health Check
HEALTH_CHECK_TIMEOUT=5000  # milliseconds
```

### 6.3 Frontend Environment Variables

**File:** `/frontend/.env`

```bash
# API Configuration (build-time variable for Vite)
VITE_API_BASE_URL=/api  # Relative URL (nginx proxies to backend)
```

**Important:** Vite embeds `VITE_*` variables at build time. Changes require rebuild.

### 6.4 PostgreSQL Environment Variables

**File:** `/.env` (root-level for docker-compose)

```bash
# PostgreSQL Configuration
POSTGRES_USER=merchant_portal_user
POSTGRES_PASSWORD=CHANGE_ME_STRONG_PASSWORD  # Use strong password!
POSTGRES_DB=merchant_portal_db

# PostgreSQL Performance Tuning
POSTGRES_MAX_CONNECTIONS=100
POSTGRES_SHARED_BUFFERS=256MB
POSTGRES_WORK_MEM=16MB
```

### 6.5 Production Overrides

**File:** `docker-compose.prod.yml`

```yaml
services:
  backend:
    environment:
      - NODE_ENV=production
      - LOG_LEVEL=warn
      - CORS_ORIGIN=https://merchant.example.com
```

**Usage:**
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## 7. Health Checks & Readiness Probes

### 7.1 Backend Health Check Endpoint

**Endpoint:** `GET /health`

**Response (Healthy):**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-21T10:30:00.000Z",
  "uptime": 3600.5,
  "database": {
    "connected": true,
    "latency_ms": 12
  },
  "memory": {
    "used_mb": 145,
    "total_mb": 512
  }
}
```

**Response (Unhealthy - 503):**
```json
{
  "status": "unhealthy",
  "timestamp": "2026-02-21T10:30:00.000Z",
  "database": {
    "connected": false,
    "error": "Connection timeout"
  }
}
```

**Implementation:**
```javascript
// src/routes/health.js
import pool from '../db/pool.js';

app.get('/health', async (req, res) => {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };

  try {
    // Check database connectivity
    const start = Date.now();
    await pool.query('SELECT 1');
    const latency = Date.now() - start;

    healthCheck.database = {
      connected: true,
      latency_ms: latency
    };

    res.status(200).json(healthCheck);
  } catch (error) {
    healthCheck.status = 'unhealthy';
    healthCheck.database = {
      connected: false,
      error: error.message
    };
    res.status(503).json(healthCheck);
  }
});
```

### 7.2 Docker Health Check Configurations

**Backend (`Dockerfile`):**
```dockerfile
HEALTHCHECK --interval=15s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"
```

**PostgreSQL (`docker-compose.yml`):**
```yaml
postgres:
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U merchant_portal_user -d merchant_portal_db"]
    interval: 10s
    timeout: 5s
    retries: 5
    start_period: 30s
```

**Frontend (`docker-compose.yml`):**
```yaml
frontend:
  healthcheck:
    test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost/"]
    interval: 30s
    timeout: 5s
    retries: 3
```

### 7.3 Service Dependencies & Startup Ordering

**Problem:** Backend needs database to be ready before starting.

**Solution:** Combine `depends_on` with health checks:

```yaml
services:
  backend:
    depends_on:
      postgres:
        condition: service_healthy  # Wait for postgres health check to pass
    restart: on-failure
```

**Backend Code - Database Retry Logic:**
```javascript
// src/db/pool.js
import pg from 'pg';

async function connectWithRetry(maxRetries = 5, delay = 5000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
      await pool.query('SELECT 1');
      console.log('✅ Database connected');
      return pool;
    } catch (error) {
      console.log(`⚠️  Database connection failed (attempt ${i + 1}/${maxRetries}). Retrying in ${delay}ms...`);
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

---

## 8. Logging Strategy

### 8.1 Logging Architecture

**Approach:** Structured JSON logging + centralized aggregation

```
Backend Container → stdout/stderr → Docker log driver → Volume/External system
PostgreSQL → stdout/stderr → Docker log driver
Nginx → access.log & error.log → stdout/stderr
```

### 8.2 Backend Logging

**Format:** JSON structured logs

**Example Log Entry:**
```json
{
  "timestamp": "2026-02-21T10:30:00.123Z",
  "level": "info",
  "service": "backend",
  "message": "Transaction created",
  "transaction_id": "550e8400-e29b-41d4-a716-446655440000",
  "merchant_id": "123e4567-e89b-12d3-a456-426614174000",
  "source": "stripe",
  "amount": 150.00,
  "duration_ms": 45
}
```

**Implementation:**
```javascript
// src/middleware/logger.js
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: res.statusCode >= 400 ? 'error' : 'info',
      service: 'backend',
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration_ms: Date.now() - start,
      ip: req.ip
    }));
  });

  next();
};
```

### 8.3 Docker Logging Configuration

**Default:** JSON file driver with rotation

```yaml
# docker-compose.yml
services:
  backend:
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
        labels: "service,environment"
```

**Production:** Syslog or external aggregator

```yaml
# docker-compose.prod.yml
services:
  backend:
    logging:
      driver: syslog
      options:
        syslog-address: "udp://logs.example.com:514"
        tag: "merchant-portal-backend"
```

### 8.4 Log Levels by Environment

| Environment | Level | Purpose |
|-------------|-------|---------|
| Development | DEBUG | Full request/response logging |
| Staging | INFO | Standard operational logging |
| Production | WARN | Errors and warnings only |

### 8.5 Log Aggregation (Production Recommendation)

**Recommended Stack:**
- **ELK Stack:** Elasticsearch + Logstash + Kibana
- **Grafana Loki:** Lightweight, cost-effective
- **Cloud Services:** AWS CloudWatch, Google Cloud Logging, Datadog

**Integration Example (Loki):**
```yaml
services:
  backend:
    logging:
      driver: loki
      options:
        loki-url: "http://loki:3100/loki/api/v1/push"
        labels: "service=backend,environment=production"
```

---

## 9. Backup & Restore Strategy

### 9.1 Automated Database Backups

**Strategy:** Daily SQL dumps to persistent volume

#### Backup Configuration

**Cron Job (Inside PostgreSQL Container):**

Create `/docker-entrypoint-initdb.d/02_setup_backup.sh`:
```bash
#!/bin/bash
# Setup automated backups

cat > /etc/periodic/daily/backup-database << 'EOF'
#!/bin/sh
BACKUP_DIR=/backups
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DATABASE=merchant_portal_db
USER=merchant_portal_user

# Create backup directory
mkdir -p $BACKUP_DIR

# Perform backup
pg_dump -U $USER $DATABASE | gzip > $BACKUP_DIR/backup_${TIMESTAMP}.sql.gz

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: backup_${TIMESTAMP}.sql.gz"
EOF

chmod +x /etc/periodic/daily/backup-database

# Add to crontab (runs daily at 2 AM)
echo "0 2 * * * /etc/periodic/daily/backup-database" | crontab -
```

**Volume Mount:**
```yaml
postgres:
  volumes:
    - pg_backup:/backups
```

### 9.2 Manual Backup

**Create on-demand backup:**
```bash
docker-compose exec postgres pg_dump -U merchant_portal_user merchant_portal_db > backup_manual.sql
```

**With compression:**
```bash
docker-compose exec postgres pg_dump -U merchant_portal_user merchant_portal_db | gzip > backup_$(date +%Y%m%d).sql.gz
```

### 9.3 Restore from Backup

**Restore from SQL dump:**
```bash
# Stop backend to prevent connections
docker-compose stop backend

# Restore database
docker-compose exec -T postgres psql -U merchant_portal_user merchant_portal_db < backup_20260221.sql

# Restart backend
docker-compose start backend
```

**Restore from gzipped backup:**
```bash
gunzip -c backup_20260221.sql.gz | docker-compose exec -T postgres psql -U merchant_portal_user merchant_portal_db
```

### 9.4 Disaster Recovery

**Complete database rebuild:**
```bash
# 1. Stop all services
docker-compose down

# 2. Remove database volume (WARNING: DATA LOSS)
docker volume rm merchant-portal_pg_data

# 3. Recreate containers (schema.sql auto-runs)
docker-compose up -d postgres

# 4. Wait for database initialization
docker-compose exec postgres pg_isready

# 5. Restore from backup
gunzip -c /path/to/backup.sql.gz | docker-compose exec -T postgres psql -U merchant_portal_user merchant_portal_db

# 6. Start remaining services
docker-compose up -d
```

### 9.5 Backup Verification

**Scheduled monthly restore test:**
1. Spin up separate test environment
2. Restore latest backup
3. Run integration tests
4. Verify data integrity

---

## 10. Development vs Production Differences

### 10.1 Configuration Files

| Aspect | Development | Production |
|--------|------------|------------|
| Compose File | `docker-compose.yml` + `docker-compose.dev.yml` | `docker-compose.yml` + `docker-compose.prod.yml` |
| Build Target | `development` | `production` |
| Hot Reload | Enabled (bind mounts) | Disabled |
| Adminer | Enabled (port 8080) | Disabled |
| Database Port | Exposed (5433) | Not exposed |
| Log Level | DEBUG | WARN |
| Source Maps | Enabled | Disabled |
| Image Tags | `:dev` | `:latest` or `:v1.0.0` |

### 10.2 Development Mode (`docker-compose.dev.yml`)

**Features:**
- Source code bind mounts for hot reload
- Database exposed on host port 5433 for local tools
- Adminer container for database GUI
- Verbose logging (DEBUG level)
- Non-optimized frontend builds (faster rebuilds)

**Usage:**
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

**Example `docker-compose.dev.yml`:**
```yaml
version: '3.9'

services:
  backend:
    build:
      target: development  # Use dev stage from multi-stage build
    volumes:
      - ./backend/src:/app/src:ro
      - /app/node_modules
    command: npm run dev  # Use --watch mode
    environment:
      - NODE_ENV=development
      - LOG_LEVEL=debug

  frontend:
    build:
      target: development
    volumes:
      - ./frontend/src:/app/src:ro
      - /app/node_modules
    command: npm run dev  # Vite dev server
    ports:
      - "5173:5173"  # Expose Vite dev server

  postgres:
    ports:
      - "5433:5432"  # Expose for local database tools

  adminer:
    image: adminer:4-standalone
    ports:
      - "8080:8080"
    environment:
      - ADMINER_DEFAULT_SERVER=postgres
    depends_on:
      - postgres
```

### 10.3 Production Mode (`docker-compose.prod.yml`)

**Features:**
- Optimized builds (minified, tree-shaken)
- No source code mounts
- No database port exposure
- Minimal logging
- SSL/TLS enabled (requires certificates)
- Resource limits enforced
- Restart policies: `always`

**Usage:**
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

**Example `docker-compose.prod.yml`:**
```yaml
version: '3.9'

services:
  frontend:
    build:
      target: production
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl:ro  # SSL certificates
    environment:
      - NGINX_WORKER_PROCESSES=auto
    restart: always
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M

  backend:
    build:
      target: production
    environment:
      - NODE_ENV=production
      - LOG_LEVEL=warn
    restart: always
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
    # No port exposure (accessed via nginx proxy only)

  postgres:
    restart: always
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 1G
    # No port exposure (internal network only)
    volumes:
      - pg_data:/var/lib/postgresql/data
      - pg_backup:/backups
```

### 10.4 Environment-Specific Environment Variables

**Development (`.env.dev`):**
```bash
DATABASE_URL=postgresql://merchant_portal_user:dev_password@postgres:5432/merchant_portal_db
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=debug
```

**Production (`.env.prod` - never committed):**
```bash
DATABASE_URL=postgresql://merchant_portal_user:${DB_PASSWORD_SECRET}@postgres:5432/merchant_portal_db
NODE_ENV=production
CORS_ORIGIN=https://merchant.example.com
LOG_LEVEL=warn
```

---

## 11. Implementation Specifications

### 11.1 Required Files to Create

#### 11.1.1 Backend Dockerfile

**File:** `/backend/Dockerfile`

**Key Requirements:**
- Multi-stage build (dependencies → production)
- Alpine-based Node.js 22
- Non-root user (node, UID 1000)
- Only production dependencies in final stage
- Health check configured
- Graceful shutdown support

**Structure:**
```dockerfile
# Stage 1: Dependencies
FROM node:22-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Development (optional, for docker-compose.dev.yml)
FROM node:22-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
USER node
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Stage 3: Production
FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY --from=dependencies /app/node_modules ./node_modules
COPY src ./src
USER node
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"
CMD ["node", "src/index.js"]
```

---

#### 11.1.2 Frontend Dockerfile

**File:** `/frontend/Dockerfile`

**Key Requirements:**
- Multi-stage build (Node.js build → Nginx serve)
- Alpine-based images
- Nginx 1.27
- Custom nginx.conf for API proxying
- Security headers
- GZIP compression

**Structure:**
```dockerfile
# Stage 1: Build React app
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Stage 2: Production Nginx server
FROM nginx:1.27-alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80 443
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
```

---

#### 11.1.3 Nginx Configuration

**File:** `/frontend/nginx.conf`

**Key Features:**
- Reverse proxy `/api/*` to backend
- GZIP compression
- Security headers
- SPA fallback routing (all routes → index.html)
- Cache headers for static assets

**Configuration:**
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log warn;

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;

    # GZIP Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;

    # Upstream backend
    upstream backend {
        server backend:3000;
    }

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Security Headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;

        # API Proxy
        location /api/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_connect_timeout 30s;
            proxy_send_timeout 30s;
            proxy_read_timeout 30s;
        }

        # Static assets caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # SPA fallback routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Health check
        location /nginx-health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

---

#### 11.1.4 Docker Compose Main File

**File:** `/docker-compose.yml`

**Base configuration for all environments:**

```yaml
version: '3.9'

services:
  postgres:
    image: postgres:16-alpine
    container_name: merchant-portal-postgres
    environment:
      - POSTGRES_USER=${POSTGRES_USER:-merchant_portal_user}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-CHANGE_ME_STRONG_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB:-merchant_portal_db}
    volumes:
      - pg_data:/var/lib/postgresql/data
      - pg_backup:/backups
      - ./db/schema.sql:/docker-entrypoint-initdb.d/01_schema.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-merchant_portal_user} -d ${POSTGRES_DB:-merchant_portal_db}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    networks:
      - merchant-portal-network
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
      target: production
    container_name: merchant-portal-backend
    env_file:
      - ./backend/.env
    environment:
      - DATABASE_URL=postgresql://${POSTGRES_USER:-merchant_portal_user}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB:-merchant_portal_db}
      - NODE_ENV=${NODE_ENV:-production}
      - PORT=3000
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"]
      interval: 15s
      timeout: 3s
      retries: 3
      start_period: 10s
    networks:
      - merchant-portal-network
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: production
      args:
        - VITE_API_BASE_URL=/api
    container_name: merchant-portal-frontend
    ports:
      - "80:80"
    depends_on:
      backend:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 5s
      retries: 3
    networks:
      - merchant-portal-network
    restart: unless-stopped

networks:
  merchant-portal-network:
    driver: bridge

volumes:
  pg_data:
    name: merchant-portal-pg-data
  pg_backup:
    name: merchant-portal-pg-backup
```

---

#### 11.1.5 Docker Ignore Files

**File:** `/backend/.dockerignore`
```
node_modules
npm-debug.log
coverage
*.test.js
*.spec.js
.env
.env.*
.git
.gitignore
README.md
docs
tests
IMPLEMENTATION_SUMMARY.md
TEST_MANUAL.md
```

**File:** `/frontend/.dockerignore`
```
node_modules
npm-debug.log
dist
.env.local
.env.*.local
.git
.gitignore
README.md
docs
IMPLEMENTATION_SUMMARY.md
```

---

#### 11.1.6 Database Initialization Script

**File:** `/db/init-backup.sh`

Creates backup mechanism inside PostgreSQL container:

```bash
#!/bin/bash
# This script is copied to /docker-entrypoint-initdb.d/ and runs once during initialization

echo "Setting up automated backups..."

# Create backup directory
mkdir -p /backups

# Create backup script
cat > /usr/local/bin/backup-database.sh << 'EOF'
#!/bin/sh
BACKUP_DIR=/backups
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DATABASE=${POSTGRES_DB:-merchant_portal_db}
USER=${POSTGRES_USER:-merchant_portal_user}

echo "Starting backup at $(date)"
pg_dump -U $USER $DATABASE | gzip > $BACKUP_DIR/backup_${TIMESTAMP}.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: backup_${TIMESTAMP}.sql.gz"
EOF

chmod +x /usr/local/bin/backup-database.sh

# Schedule daily backups (requires cron to be installed in production)
echo "0 2 * * * /usr/local/bin/backup-database.sh >> /var/log/backup.log 2>&1" | crontab -

echo "Backup system configured successfully"
```

**Update docker-compose.yml to mount this:**
```yaml
postgres:
  volumes:
    - ./db/init-backup.sh:/docker-entrypoint-initdb.d/02_init_backup.sh:ro
```

---

#### 11.1.7 Environment Template Files

**File:** `/.env.example` (root level)
```bash
# PostgreSQL Configuration
POSTGRES_USER=merchant_portal_user
POSTGRES_PASSWORD=CHANGE_ME_STRONG_PASSWORD
POSTGRES_DB=merchant_portal_db

# Application Environment
NODE_ENV=production

# Ports (for development overrides)
POSTGRES_PORT=5432
BACKEND_PORT=3000
FRONTEND_PORT=80
```

**Developers copy to `.env` and customize**

---

### 11.2 Health Check Implementation Requirements

#### Backend Health Endpoint Enhancement

**File:** `/backend/src/routes/health.js` (to be created)

```javascript
import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  };

  try {
    // Test database connectivity
    const start = Date.now();
    await pool.query('SELECT 1 AS health_check');
    const latency = Date.now() - start;

    healthCheck.database = {
      connected: true,
      latency_ms: latency
    };

    // Memory usage
    const memUsage = process.memoryUsage();
    healthCheck.memory = {
      used_mb: Math.round(memUsage.heapUsed / 1024 / 1024),
      total_mb: Math.round(memUsage.heapTotal / 1024 / 1024)
    };

    res.status(200).json(healthCheck);
  } catch (error) {
    healthCheck.status = 'unhealthy';
    healthCheck.database = {
      connected: false,
      error: error.message
    };
    res.status(503).json(healthCheck);
  }
});

export default router;
```

**Update `/backend/src/index.js`:**
```javascript
import healthRoutes from './routes/health.js';

// Replace existing health check with:
app.use('/health', healthRoutes);
```

---

### 11.3 Database Connection Retry Logic

**File:** `/backend/src/db/pool.js` (enhancement needed)

Add retry logic for container startup:

```javascript
import pg from 'pg';

const MAX_RETRIES = 10;
const RETRY_DELAY = 5000; // 5 seconds

async function createPool() {
  const config = {
    connectionString: process.env.DATABASE_URL,
    max: 20, // Maximum pool size
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const pool = new pg.Pool(config);

      // Test connection
      await pool.query('SELECT NOW()');

      console.log(`✅ Database connected successfully`);
      return pool;
    } catch (error) {
      console.log(`⚠️  Database connection attempt ${i + 1}/${MAX_RETRIES} failed: ${error.message}`);

      if (i === MAX_RETRIES - 1) {
        console.error('❌ Failed to connect to database after maximum retries');
        throw error;
      }

      console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
}

const pool = await createPool();

export default pool;
```

---

## 12. Base Image Recommendations

### 12.1 Rationale for Alpine Linux

**Why Alpine:**
- **Minimal attack surface:** 5MB base image vs 100MB+ for Debian
- **Faster builds:** Smaller layer sizes
- **Security:** Fewer packages = fewer vulnerabilities
- **Performance:** Lower memory footprint

**Tradeoffs:**
- Uses `musl libc` instead of `glibc` (rare compatibility issues)
- Smaller package ecosystem (use `apk` instead of `apt`)

**Recommendation:** Use Alpine unless specific compatibility issues arise.

---

### 12.2 Specific Version Recommendations

| Service | Recommended Base Image | Rationale |
|---------|----------------------|-----------|
| **Backend** | `node:22.11.0-alpine3.20` | LTS Node.js, latest Alpine, production-stable |
| **Frontend (build)** | `node:22.11.0-alpine3.20` | Same as backend for consistency |
| **Frontend (serve)** | `nginx:1.27.3-alpine` | Latest stable Nginx, Alpine-based |
| **PostgreSQL** | `postgres:16.6-alpine` | Latest PostgreSQL 16 (LTS), Alpine-based |
| **Adminer** | `adminer:4.8.1-standalone` | Lightweight, no dependencies |

**Version Pinning Strategy:**
- **Production:** Pin exact versions (e.g., `node:22.11.0-alpine3.20`)
- **Development:** Use minor version tags (e.g., `node:22-alpine`) for automatic patches

---

### 12.3 Alternative: Debian-based Images (If Needed)

**Use Debian (`-slim` variant) if:**
- Compatibility issues with Alpine's `musl libc`
- Need packages not available in Alpine repositories
- Debugging tools required (`gdb`, `strace`, etc.)

**Recommendations:**
- `node:22-slim` (Debian Bookworm-based)
- `postgres:16` (Debian-based)

**Tradeoff:** ~150MB larger final images

---

## 13. Port Mapping Strategy

### 13.1 Port Assignments

| Service | Internal Port | Host Port (Dev) | Host Port (Prod) | Public Access |
|---------|--------------|----------------|-----------------|---------------|
| Frontend | 80 | 80 | 80 | Yes |
| Frontend (HTTPS) | 443 | - | 443 | Yes (production) |
| Backend | 3000 | - | - | No (proxied) |
| PostgreSQL | 5432 | 5433 (optional) | - | No |
| Adminer | 8080 | 8080 | - | Dev only |

### 13.2 Security Principles

1. **Minimize exposed ports:** Only frontend faces the internet
2. **Backend not exposed:** All API traffic routed through Nginx reverse proxy
3. **Database never exposed:** Accessible only via Docker internal network
4. **Development exception:** Database port 5433 for local tools (DBeaver, pgAdmin)

### 13.3 Production Port Mapping

**HTTPS/SSL:**
```yaml
# docker-compose.prod.yml
frontend:
  ports:
    - "80:80"    # HTTP (redirect to HTTPS)
    - "443:443"  # HTTPS
  volumes:
    - ./ssl/cert.pem:/etc/nginx/ssl/cert.pem:ro
    - ./ssl/key.pem:/etc/nginx/ssl/key.pem:ro
```

**Nginx SSL Configuration (production):**
```nginx
server {
    listen 80;
    server_name merchant.example.com;
    return 301 https://$host$request_uri;  # Redirect HTTP to HTTPS
}

server {
    listen 443 ssl http2;
    server_name merchant.example.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # ... rest of configuration
}
```

---

## 14. Orchestration Readiness

### 14.1 Kubernetes Readiness

**Current Docker Compose → Kubernetes Migration Path:**

The architecture is designed to be **Kubernetes-ready** with minimal changes:

| Compose Concept | Kubernetes Equivalent |
|----------------|----------------------|
| Services | Deployments + Services |
| Networks | Network Policies |
| Volumes | PersistentVolumeClaims |
| Health checks | Liveness/Readiness Probes |
| Environment variables | ConfigMaps + Secrets |
| Scaling (deploy.replicas) | ReplicaSets |

**Migration Tools:**
- **Kompose:** Automated Compose → Kubernetes conversion
  ```bash
  kompose convert -f docker-compose.yml
  ```

### 14.2 Kubernetes Manifest Example (Preview)

**Backend Deployment:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: merchant-portal-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: merchant-portal-backend:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: connection-string
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 15
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          limits:
            cpu: "1"
            memory: "512Mi"
          requests:
            cpu: "0.5"
            memory: "256Mi"
```

### 14.3 Docker Swarm Readiness

**For smaller deployments without Kubernetes complexity:**

```bash
# Initialize Swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml -c docker-compose.prod.yml merchant-portal

# Scale services
docker service scale merchant-portal_backend=3
```

**Secrets Management (Swarm):**
```bash
# Create secret
echo "strong_password_here" | docker secret create db_password -

# Update docker-compose.yml
services:
  backend:
    secrets:
      - db_password
    environment:
      - DATABASE_URL=postgresql://user:$(cat /run/secrets/db_password)@postgres/db

secrets:
  db_password:
    external: true
```

### 14.4 Scaling Considerations

**Stateless Services (Can Scale Horizontally):**
- ✅ Backend (API servers)
- ✅ Frontend (Nginx servers)

**Stateful Services (Single Instance):**
- ❌ PostgreSQL (requires replication setup for HA)

**Future Enhancements for High Availability:**
1. **PostgreSQL Replication:**
   - Master-replica setup (Patroni, Stolon)
   - PgBouncer for connection pooling
   - WAL archiving for point-in-time recovery

2. **Backend Scaling:**
   - Load balancer (Nginx, HAProxy, or cloud LB)
   - Session-less API (already stateless)
   - Redis for shared cache (if needed)

3. **Frontend CDN:**
   - CloudFront, Cloudflare for static asset delivery
   - Origin server for dynamic API proxy

---

## 15. Quick Reference: Common Commands

### 15.1 Development Workflow

```bash
# First-time setup
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit .env files with your values

# Start all services (development mode)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Rebuild after code changes
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: DATA LOSS)
docker-compose down -v
```

### 15.2 Production Deployment

```bash
# Start production stack
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Check health
docker-compose ps
docker-compose exec backend curl http://localhost:3000/health

# View logs
docker-compose logs -f --tail=100

# Rolling restart
docker-compose restart backend

# Update to new version
docker-compose pull
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Cleanup old images
docker image prune -a
```

### 15.3 Database Management

```bash
# Access PostgreSQL CLI
docker-compose exec postgres psql -U merchant_portal_user -d merchant_portal_db

# Run SQL file
docker-compose exec -T postgres psql -U merchant_portal_user merchant_portal_db < script.sql

# Manual backup
docker-compose exec postgres pg_dump -U merchant_portal_user merchant_portal_db > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U merchant_portal_user merchant_portal_db < backup.sql

# View database size
docker-compose exec postgres psql -U merchant_portal_user -d merchant_portal_db -c "\l+"

# List all tables
docker-compose exec postgres psql -U merchant_portal_user -d merchant_portal_db -c "\dt"
```

### 15.4 Debugging

```bash
# Shell into backend container
docker-compose exec backend sh

# Shell into database container
docker-compose exec postgres sh

# Inspect network
docker network inspect merchant-portal_merchant-portal-network

# View container resource usage
docker stats

# Check container health
docker inspect --format='{{json .State.Health}}' merchant-portal-backend | jq
```

---

## 16. Success Criteria

**Containerization is successful when:**

✅ **One-Command Startup:**
```bash
docker-compose up
```
Spins up all services with zero manual intervention.

✅ **Database Auto-Initialization:**
- PostgreSQL container runs `schema.sql` on first startup
- Sample data loaded automatically
- No manual SQL execution required

✅ **Health Checks Pass:**
- All containers report healthy status within 60 seconds
- `docker-compose ps` shows all services as "Up (healthy)"

✅ **Frontend Accessible:**
- Navigate to `http://localhost`
- React app loads without errors
- API requests proxied correctly to backend

✅ **Backend Responsive:**
- `/health` endpoint returns 200 OK with database connectivity
- API endpoints (`/api/transactions`, `/api/analytics`) functional

✅ **Data Persistence:**
- Stop and restart containers: data remains intact
- PostgreSQL data survives `docker-compose down` (volume persists)

✅ **Security Validated:**
- No hardcoded secrets in images or configs
- All services run as non-root users
- Backend not directly accessible from host (only via nginx)

✅ **Development Experience:**
- Hot reload works in dev mode
- Source code changes reflect without full rebuild
- Logs stream to terminal with `docker-compose logs -f`

---

## 17. Next Steps for Implementation

**Hand-off to DevOps teammate with this checklist:**

### Phase 1: File Creation
- [ ] Create `/backend/Dockerfile`
- [ ] Create `/backend/.dockerignore`
- [ ] Create `/frontend/Dockerfile`
- [ ] Create `/frontend/.dockerignore`
- [ ] Create `/frontend/nginx.conf`
- [ ] Create `/docker-compose.yml`
- [ ] Create `/docker-compose.dev.yml`
- [ ] Create `/docker-compose.prod.yml`
- [ ] Create `/.env.example` (root level)
- [ ] Create `/db/init-backup.sh`

### Phase 2: Code Updates
- [ ] Add health check endpoint to backend (`/health`)
- [ ] Add database retry logic to `/backend/src/db/pool.js`
- [ ] Update backend to use environment variables correctly
- [ ] Test backend connects to PostgreSQL container (not localhost)

### Phase 3: Testing
- [ ] Build all Docker images: `docker-compose build`
- [ ] Start services: `docker-compose up`
- [ ] Verify health checks: `docker-compose ps`
- [ ] Test frontend loads: `http://localhost`
- [ ] Test API proxying: `http://localhost/api/transactions`
- [ ] Test database persistence: restart containers, verify data intact
- [ ] Test development mode: `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up`

### Phase 4: Documentation
- [ ] Update root `README.md` with Docker setup instructions
- [ ] Document environment variable setup
- [ ] Add troubleshooting guide for common issues
- [ ] Create deployment guide for production

---

## Appendix A: Security Checklist

**Pre-Production Security Audit:**

- [ ] All base images pinned to specific versions (no `:latest` tags)
- [ ] No secrets committed to git (`.env` in `.gitignore`)
- [ ] All containers run as non-root users
- [ ] PostgreSQL password is strong (minimum 16 characters)
- [ ] Database not exposed to host in production
- [ ] Nginx security headers configured (CSP, HSTS, X-Frame-Options)
- [ ] SSL/TLS certificates configured for production
- [ ] Resource limits set for all containers
- [ ] Health checks configured for all services
- [ ] Logs rotated and monitored
- [ ] Backups tested and verified
- [ ] No unnecessary ports exposed
- [ ] Docker socket not mounted in any container
- [ ] Image vulnerability scanning enabled (Trivy, Clair, Snyk)

---

## Appendix B: Performance Tuning

### PostgreSQL Configuration

**File:** `/db/postgresql.conf` (custom config, mount as volume)

```ini
# Connection Settings
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
work_mem = 16MB

# Write-Ahead Logging
wal_buffers = 16MB
checkpoint_completion_target = 0.9
max_wal_size = 1GB
min_wal_size = 256MB

# Query Planning
random_page_cost = 1.1
effective_io_concurrency = 200

# Logging
logging_collector = on
log_directory = 'pg_log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_statement = 'none'  # Production: 'none' | Dev: 'all'
log_duration = off
```

**Mount in docker-compose.yml:**
```yaml
postgres:
  volumes:
    - ./db/postgresql.conf:/etc/postgresql/postgresql.conf:ro
  command: postgres -c config_file=/etc/postgresql/postgresql.conf
```

### Nginx Performance Tuning

```nginx
# Worker processes (auto = number of CPU cores)
worker_processes auto;

# Worker connections
events {
    worker_connections 2048;
    use epoll;
}

http {
    # Connection keepalive
    keepalive_timeout 30;
    keepalive_requests 100;

    # Buffer sizes
    client_body_buffer_size 128k;
    client_max_body_size 10m;
    client_header_buffer_size 1k;

    # Caching (for reverse proxy)
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=100m inactive=60m use_temp_path=off;

    # ... rest of config
}
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-02-21 | Architect | Initial architecture design |

---

**End of Architecture Document**

This document serves as the **source of truth** for the containerization implementation. All files and configurations specified herein must be created exactly as documented to ensure production-grade deployment.
