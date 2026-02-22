# Bugs & Issues Found - Merchant Transaction Portal

**QA Review Date:** 2026-02-21
**Reviewed By:** QA Engineer (Claude)
**Environment:** Development

---

## Summary

| Priority | Count | Description |
|----------|-------|-------------|
| P1 (Blocking) | 1 | Critical issues preventing deployment |
| P2 (Major) | 1 | Significant issues affecting functionality |
| P3 (Minor) | 2 | Minor issues or improvements |
| **TOTAL** | **4** | |

---

## P1 - Blocking Issues

### BUG-001: Missing Unique Constraint on Transaction ID in Payload

**Severity:** P1 (Blocking)
**Component:** Backend / Database Schema
**Status:** OPEN

**Description:**
The schema does not enforce uniqueness on `transaction_id` within the JSONB `payload` field. The current implementation relies on application-level duplicate detection in the webhook controller, but there's no database constraint to prevent duplicates if transactions are inserted directly via SQL or if the application logic is bypassed.

**Steps to Reproduce:**
1. Insert a transaction via webhook with transaction_id "txn_123"
2. Directly insert another transaction via SQL with the same transaction_id in payload
3. Database allows both inserts (no constraint violation)

**Expected Behavior:**
Database should enforce uniqueness on `payload->>'transaction_id'` to prevent duplicates at the data layer.

**Actual Behavior:**
No database-level constraint exists. Duplicate detection only happens in application code.

**Recommended Fix:**
Add a unique index on the transaction_id extracted from the payload:
```sql
CREATE UNIQUE INDEX idx_transactions_payload_transaction_id
ON transactions ((payload->>'transaction_id'));
```

**Impact:**
- Data integrity risk
- Duplicate transactions possible if application layer bypassed
- Inconsistent duplicate handling across different entry points

**Workaround:**
Ensure all transaction inserts go through the webhook controller which has duplicate detection logic.

---

## P2 - Major Issues

### BUG-002: Frontend Using Mock Data Instead of Live API

**Severity:** P2 (Major)
**Component:** Frontend / Transactions & Analytics Pages
**Status:** OPEN

**Description:**
The frontend Transactions and Analytics pages are currently hardcoded to use mock data instead of making actual API calls to the backend. Lines 40-46 in `/frontend/src/pages/Transactions.jsx` and lines 29-35 in `/frontend/src/pages/Analytics.jsx` show commented-out React Query hooks and forced mock data usage.

**Steps to Reproduce:**
1. Start backend server with real data
2. Start frontend
3. Navigate to Transactions or Analytics page
4. Observe that the same mock data always appears regardless of backend state

**Expected Behavior:**
Frontend should fetch real data from the backend API using the React Query hooks that are already implemented.

**Actual Behavior:**
Commented-out API calls, hardcoded `isLoading = false`, `isError = false`, and mock data returned.

**Code Location:**
- `/frontend/src/pages/Transactions.jsx` lines 39-46
- `/frontend/src/pages/Analytics.jsx` lines 28-35

**Recommended Fix:**
1. Uncomment the `useTransactions()` and `useAnalytics()` hooks
2. Remove the hardcoded mock data assignments
3. Test with live backend

**Impact:**
- Frontend shows static data
- Real-time updates not visible
- Filters and pagination don't actually query backend
- Testing impossible without code changes

**Workaround:**
Manually uncomment the hooks and remove mock data assignments for testing.

---

### BUG-003: Error Handler Properly Implements Duplicate Detection

**Severity:** INFO
**Component:** Backend / Error Handler
**Status:** VERIFIED - NOT A BUG

**Description:**
After verification, the error handler middleware at `/backend/src/middleware/errorHandler.js` correctly handles the DUPLICATE_TRANSACTION error. Lines 26-34 properly map the error to HTTP 409 status with appropriate error response format.

**Verification:**
The error handler includes the exact implementation needed:
- Checks for `err.message === 'DUPLICATE_TRANSACTION'`
- Returns 409 status code
- Returns proper error object with code, message, and requestId

**Status:** No action required - implementation is correct.

---

## P3 - Minor Issues

### BUG-004: Analytics Metadata Currency Defaults to USD

**Severity:** P3 (Minor)
**Component:** Backend / Analytics Controller
**Status:** OPEN

**Description:**
The analytics summary endpoint returns metadata with `currency: 'USD'` as a default even when no currency filter is applied or when multiple currencies exist in the data. This could be misleading.

**Code Location:**
`/backend/src/controllers/analyticsController.js` line 25

**Expected Behavior:**
- If currency filter applied: return that currency
- If no filter: return "ALL" or "MIXED" or omit currency from metadata
- If data contains multiple currencies: clearly indicate this

**Actual Behavior:**
Always defaults to 'USD' in metadata when no filter is provided.

**Recommended Fix:**
```javascript
const metadata = {
  currency: filters.currency || 'ALL',
  generatedAt: new Date().toISOString()
};
```

**Impact:**
- Misleading metadata
- Users might assume all amounts are in USD
- Analytics interpretation could be incorrect

**Workaround:**
Users should check the currency filter parameter in the request.

---

### BUG-005: Jest Configuration File Exists

**Severity:** INFO
**Component:** Backend / Testing
**Status:** VERIFIED - NOT A BUG

**Description:**
After verification, the jest.config.js file exists at `/backend/jest.config.js`. The test configuration is properly set up.

**Status:** No action required - configuration exists.

---

### BUG-005: Pagination Could Show Too Many Page Buttons

**Severity:** P3 (Minor)
**Component:** Frontend / Transactions Page
**Status:** OPEN

**Description:**
The pagination implementation in Transactions.jsx (lines 235-247) renders a button for every page without limit. If there are 100 pages, it will try to render 100 buttons, which could cause UI issues.

**Code Location:**
`/frontend/src/pages/Transactions.jsx` lines 235-247

**Expected Behavior:**
Pagination should show a limited number of page buttons (e.g., max 5-7) with ellipsis for large page counts, like:
`[Previous] [1] ... [5] [6] [7] ... [100] [Next]`

**Actual Behavior:**
Renders a button for every single page: `[1] [2] [3] [4] ... [100]`

**Recommended Fix:**
Implement smart pagination with ellipsis and limited button count. Only show:
- First page
- Last page
- Current page
- 1-2 pages before/after current
- Ellipsis where needed

**Impact:**
- Performance degradation with many pages
- UI clutter
- Poor UX for large datasets

**Workaround:**
Use smaller limit values or keep page counts low during testing.

---

## Additional Observations (Not Bugs)

### OBS-001: Environment Variables Not Documented

**Severity:** INFO
**Component:** Documentation

**Description:**
The required environment variables for the backend (DATABASE_URL, PORT, CORS_ORIGIN, NODE_ENV) are not documented in a README or .env.example file.

**Recommendation:**
Create a `.env.example` file in `/backend/` with:
```
DATABASE_URL=postgresql://user:password@localhost:5432/merchant_portal
PORT=3000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

---

### OBS-002: No API Documentation

**Severity:** INFO
**Component:** Documentation

**Description:**
While endpoints are implemented correctly, there's no formal API documentation (OpenAPI/Swagger spec) for consumers.

**Recommendation:**
Consider adding Swagger/OpenAPI documentation or at least a REST API markdown file documenting all endpoints, request/response formats, and error codes.

---

### OBS-003: No Database Migration Strategy

**Severity:** INFO
**Component:** Backend / Database

**Description:**
The schema.sql file exists but there's no migration tooling (e.g., Knex, Sequelize migrations, or custom migration scripts) for version control and updates.

**Recommendation:**
Consider implementing a migration strategy for production deployments to track schema changes over time.

---

### OBS-004: Missing Integration Tests for Other Endpoints

**Severity:** INFO
**Component:** Backend / Testing

**Description:**
Integration tests created only cover webhook endpoints. Transactions and Analytics endpoints also need integration test coverage.

**Recommendation:**
Create additional integration test files:
- `/backend/src/tests/integration/transactions.integration.test.js`
- `/backend/src/tests/integration/analytics.integration.test.js`

---

## Testing Notes

- Integration tests written assume access to a test database
- All tests use the sample merchant UUID from schema.sql
- Tests clean up after themselves but require proper test database setup
- Frontend tests are manual only (no automated UI tests)

---

## Priority Definitions

- **P1 (Blocking):** Prevents deployment, causes data corruption, or critical security issue
- **P2 (Major):** Significantly impacts functionality but has workaround
- **P3 (Minor):** Cosmetic, UX improvement, or minor functionality issue
- **INFO:** Observations or recommendations, not blocking

---

## Next Steps

1. **Immediate:** Fix P1 bug (add unique constraint on transaction_id)
2. **Before deployment:** Fix P2 bugs (enable live API in frontend, verify error handler)
3. **Post-deployment:** Address P3 bugs in next sprint
4. **Ongoing:** Address observations as time permits

---

**QA Engineer Sign-off:** Claude (QA)
**Date:** 2026-02-21
**Status:** Review Complete - **NEEDS FIXES** before deployment
