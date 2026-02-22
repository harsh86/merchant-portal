# Merchant Portal Backend API

RESTful API for managing merchant transactions from multiple payment sources.

## Features

- Webhook ingestion from multiple payment providers (Stripe, PayPal, Square, etc.)
- Transaction querying with advanced filtering and pagination
- Analytics and reporting endpoints
- Comprehensive validation using Zod
- Full test coverage with Jest

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express 4.x
- **Database**: PostgreSQL with pg driver
- **Validation**: Zod
- **Testing**: Jest + Supertest
- **API Documentation**: OpenAPI 3.0

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Update DATABASE_URL in .env with your PostgreSQL connection string
```

### Database Setup

```bash
# Run the schema SQL file
psql -U username -d database_name -f ../db/schema.sql
```

### Running the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000` by default.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## API Endpoints

### Webhooks

- `POST /api/webhooks/ingest` - Ingest webhook from payment source

### Transactions

- `GET /api/transactions` - Get list of transactions with filters
- `GET /api/transactions/:id` - Get single transaction by ID

### Analytics

- `GET /api/analytics/summary` - Get analytics summary

### Health Check

- `GET /health` - Server health check

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | - |
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment (development/production) | development |
| `CORS_ORIGIN` | Allowed CORS origin | * |

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── db/              # Database connection
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic & DB queries
│   ├── tests/           # Jest tests
│   └── index.js         # App entry point
├── package.json
└── .env.example
```

## Development Guidelines

1. **All database queries must go in the services layer**
2. **Add JSDoc comments to all exported functions**
3. **Use environment variables for all credentials**
4. **Write tests for all new features**
5. **Follow the existing code structure and patterns**

## API Documentation

See [docs/api-contract.yaml](../docs/api-contract.yaml) for full OpenAPI specification.

## License

MIT
