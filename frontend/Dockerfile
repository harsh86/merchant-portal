# Frontend Dockerfile - Merchant Portal React App
# Multi-stage build: Node.js build -> Nginx production serve
# AI-generated: 100%

# ==============================================
# Stage 1: Builder - Build React application
# ==============================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build argument for API base URL
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build the application
RUN npm run build

# Default command for builder stage (development mode)
# This will be overridden by docker-compose.dev.yml
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ==============================================
# Stage 2: Production - Nginx web server
# ==============================================
FROM nginx:1.27-alpine AS production

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create nginx user (if not exists) and set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose HTTP and HTTPS ports
EXPOSE 80 443

# Health check - Verify Nginx is responding
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
