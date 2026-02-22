# Manual Testing Guide

This guide provides step-by-step instructions for manually testing the Merchant Portal API endpoints.

## Prerequisites

1. PostgreSQL database running
2. Database schema applied (run `db/schema.sql`)
3. Backend server running (`npm run dev`)
4. Environment variables configured (`.env` file)

## Test Environment Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env and set DATABASE_URL to your PostgreSQL connection string

# 3. Run the database schema
psql -U username -d database_name -f ../db/schema.sql

# 4. Start the server
npm run dev
```

## Endpoint Tests

### 1. Health Check

```bash
curl -X GET http://localhost:3000/health
```

**Expected Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T12:00:00.000Z",
  "uptime": 123.456
}
```

---

### 2. POST /api/webhooks/ingest

**Test Case 1: Valid Stripe Webhook**

```bash
curl -X POST http://localhost:3000/api/webhooks/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "source": "stripe",
    "merchant_id": "00000000-0000-0000-0000-000000000001",
    "amount": 150.00,
    "currency": "USD",
    "status": "completed",
    "transaction_id": "ch_test_123456",
    "metadata": {
      "customer_email": "customer@example.com",
      "stripe_charge_id": "ch_test_123456"
    }
  }'
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "transaction_id": "<uuid>",
    "webhook_log_id": "<uuid>"
  },
  "message": "Transaction created successfully"
}
```

**Test Case 2: Invalid Payload (Missing Fields)**

```bash
curl -X POST http://localhost:3000/api/webhooks/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "source": "stripe",
    "amount": 100
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request payload",
    "details": [...],
    "requestId": "req_..."
  }
}
```

**Test Case 3: Duplicate Transaction**

```bash
# Run the same request from Test Case 1 again
curl -X POST http://localhost:3000/api/webhooks/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "source": "stripe",
    "merchant_id": "00000000-0000-0000-0000-000000000001",
    "amount": 150.00,
    "currency": "USD",
    "status": "completed",
    "transaction_id": "ch_test_123456",
    "metadata": {
      "customer_email": "customer@example.com"
    }
  }'
```

**Expected Response (409 Conflict):**
```json
{
  "error": {
    "code": "DUPLICATE_TRANSACTION",
    "message": "Transaction with this ID already exists",
    "requestId": "req_..."
  }
}
```

---

### 3. GET /api/transactions

**Test Case 1: Get All Transactions (Default Pagination)**

```bash
curl -X GET http://localhost:3000/api/transactions
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "totalPages": 2
  }
}
```

**Test Case 2: Filter by Source**

```bash
curl -X GET "http://localhost:3000/api/transactions?source=stripe"
```

**Test Case 3: Filter by Status**

```bash
curl -X GET "http://localhost:3000/api/transactions?status=completed"
```

**Test Case 4: Filter by Merchant ID**

```bash
curl -X GET "http://localhost:3000/api/transactions?merchant_id=00000000-0000-0000-0000-000000000001"
```

**Test Case 5: Filter by Date Range**

```bash
curl -X GET "http://localhost:3000/api/transactions?date_from=2024-01-01T00:00:00Z&date_to=2024-12-31T23:59:59Z"
```

**Test Case 6: Custom Pagination**

```bash
curl -X GET "http://localhost:3000/api/transactions?page=2&limit=25"
```

**Test Case 7: Combined Filters**

```bash
curl -X GET "http://localhost:3000/api/transactions?source=stripe&status=completed&page=1&limit=10"
```

**Test Case 8: Sort by Amount**

```bash
curl -X GET "http://localhost:3000/api/transactions?sort_by=amount&sort_order=desc"
```

---

### 4. GET /api/transactions/:id

**Test Case 1: Valid Transaction ID**

```bash
# Replace <transaction-id> with an actual UUID from your database
curl -X GET http://localhost:3000/api/transactions/<transaction-id>
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "<uuid>",
    "source": "stripe",
    "merchant_id": "<uuid>",
    "amount": 150.00,
    "currency": "USD",
    "status": "completed",
    "payload": {
      "transaction_id": "ch_test_123456",
      "customer_email": "customer@example.com"
    },
    "created_at": "2024-01-20T12:00:00.000Z",
    "updated_at": "2024-01-20T12:00:00.000Z"
  }
}
```

**Test Case 2: Non-Existent Transaction ID**

```bash
curl -X GET http://localhost:3000/api/transactions/00000000-0000-0000-0000-999999999999
```

**Expected Response (404 Not Found):**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Transaction not found",
    "requestId": "req_..."
  }
}
```

**Test Case 3: Invalid UUID Format**

```bash
curl -X GET http://localhost:3000/api/transactions/not-a-uuid
```

**Expected Response (400 Bad Request):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid URL parameters",
    "details": [...],
    "requestId": "req_..."
  }
}
```

---

### 5. GET /api/analytics/summary

**Test Case 1: Overall Analytics**

```bash
curl -X GET http://localhost:3000/api/analytics/summary
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalVolume": 15750.50,
    "totalTransactions": 237,
    "countByStatus": {
      "pending": 15,
      "processing": 8,
      "completed": 200,
      "failed": 10,
      "refunded": 3,
      "cancelled": 1
    },
    "topSources": [
      {
        "source": "stripe",
        "count": 120,
        "volume": 8500.00
      },
      {
        "source": "paypal",
        "count": 85,
        "volume": 5250.50
      }
    ],
    "averageTransactionAmount": 78.75,
    "successRate": 84.38
  },
  "metadata": {
    "currency": "USD",
    "generatedAt": "2024-01-20T12:00:00.000Z"
  }
}
```

**Test Case 2: Filter by Merchant ID**

```bash
curl -X GET "http://localhost:3000/api/analytics/summary?merchant_id=00000000-0000-0000-0000-000000000001"
```

**Test Case 3: Filter by Date Range**

```bash
curl -X GET "http://localhost:3000/api/analytics/summary?date_from=2024-01-01T00:00:00Z&date_to=2024-12-31T23:59:59Z"
```

**Test Case 4: Filter by Currency**

```bash
curl -X GET "http://localhost:3000/api/analytics/summary?currency=USD"
```

---

## Error Cases

### Invalid Endpoint (404)

```bash
curl -X GET http://localhost:3000/api/invalid-endpoint
```

**Expected Response (404 Not Found):**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Endpoint not found",
    "requestId": "req_..."
  }
}
```

---

## Testing Checklist

- [ ] Health check endpoint works
- [ ] POST /webhooks/ingest accepts valid payloads
- [ ] POST /webhooks/ingest rejects invalid payloads
- [ ] POST /webhooks/ingest handles duplicate transactions
- [ ] GET /transactions returns paginated results
- [ ] GET /transactions filters work (source, status, merchant_id, dates)
- [ ] GET /transactions pagination works correctly
- [ ] GET /transactions/:id returns transaction details
- [ ] GET /transactions/:id returns 404 for non-existent IDs
- [ ] GET /analytics/summary returns correct aggregations
- [ ] GET /analytics/summary filters work
- [ ] Error responses follow standard format
- [ ] Request logging is working
- [ ] Database queries are efficient (check logs)

---

## Performance Testing

### Load Test Example (using Apache Bench)

```bash
# Test webhook ingestion with 100 requests, 10 concurrent
ab -n 100 -c 10 -T 'application/json' -p payload.json \
  http://localhost:3000/api/webhooks/ingest
```

Where `payload.json` contains:
```json
{
  "source": "stripe",
  "merchant_id": "00000000-0000-0000-0000-000000000001",
  "amount": 100.00,
  "currency": "USD",
  "status": "completed",
  "transaction_id": "ch_load_test"
}
```

---

## Notes

- All timestamps should be in ISO 8601 format with timezone
- All UUIDs should follow the standard UUID v4 format
- Currency codes must be uppercase 3-letter ISO 4217 codes
- Status values must be lowercase
- Source identifiers must be lowercase alphanumeric with hyphens/underscores
