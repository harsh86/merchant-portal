# Backend Dockerfile - Merchant Portal API
# Multi-stage build for optimized production image
# AI-generated: 100%

# ==============================================
# Stage 1: Base - Common layer for all stages
# ==============================================
FROM node:22-alpine AS base
WORKDIR /app

# ==============================================
# Stage 2: Dependencies - Production dependencies only
# ==============================================
FROM base AS dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# ==============================================
# Stage 3: Development - All dependencies + dev tools
# ==============================================
FROM base AS development
COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY . .
# Note: Not using USER node in dev to avoid permission issues with volume mounts
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ==============================================
# Stage 4: Production - Optimized final image
# ==============================================
FROM node:22-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy package files and install production dependencies
COPY --chown=node:node package*.json ./
COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules

# Copy application source
COPY --chown=node:node src ./src

# Use non-root user for security
USER node

# Expose backend port
EXPOSE 3000

# Health check - Verify API is responding
HEALTHCHECK --interval=15s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "src/index.js"]
