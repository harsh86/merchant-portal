-- Merchant Transaction Portal - PostgreSQL Schema
-- Version: 1.0.0
-- Description: Schema for multi-source transaction ingestion and analytics

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- MERCHANTS TABLE
-- ============================================================================
-- Stores merchant/business information
-- Each merchant can have multiple transactions from various sources
CREATE TABLE merchants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index for merchant name lookups
CREATE INDEX idx_merchants_name ON merchants(name);

-- Index for chronological queries
CREATE INDEX idx_merchants_created_at ON merchants(created_at);

-- ============================================================================
-- TRANSACTIONS TABLE
-- ============================================================================
-- Central table for all transaction records from multiple payment sources
-- JSONB payload allows flexible storage of source-specific data
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source VARCHAR(100) NOT NULL, -- Payment source identifier (e.g., 'stripe', 'paypal', 'square')
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    amount NUMERIC(15, 2) NOT NULL CHECK (amount >= 0), -- Amount with 2 decimal precision
    currency VARCHAR(3) NOT NULL, -- ISO 4217 currency code (e.g., 'USD', 'EUR')
    status VARCHAR(50) NOT NULL, -- Transaction status (e.g., 'pending', 'completed', 'failed', 'refunded')
    payload JSONB NOT NULL DEFAULT '{}', -- Source-specific data (flexible schema)
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Composite index for merchant + status queries (most common filter combination)
CREATE INDEX idx_transactions_merchant_status ON transactions(merchant_id, status);

-- Index for source-based filtering
CREATE INDEX idx_transactions_source ON transactions(source);

-- Index for status-based filtering (analytics queries)
CREATE INDEX idx_transactions_status ON transactions(status);

-- Index for date range queries (critical for time-based analytics)
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

-- Composite index for source + date range queries
CREATE INDEX idx_transactions_source_created_at ON transactions(source, created_at DESC);

-- GIN index for JSONB payload querying (for source-specific field searches)
CREATE INDEX idx_transactions_payload ON transactions USING GIN (payload);

-- Partial index for active/pending transactions (hot data)
CREATE INDEX idx_transactions_active ON transactions(merchant_id, created_at DESC)
WHERE status IN ('pending', 'processing');

-- Index for amount-based queries (volume analytics)
CREATE INDEX idx_transactions_amount ON transactions(amount) WHERE status = 'completed';

-- ============================================================================
-- WEBHOOK_LOGS TABLE
-- ============================================================================
-- Audit trail for all webhook requests and responses
-- Enables debugging, compliance, and monitoring
CREATE TABLE webhook_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL, -- Nullable: log even if transaction creation fails
    source VARCHAR(100) NOT NULL, -- Payment source identifier
    http_status INTEGER NOT NULL, -- HTTP response status code sent back to webhook caller
    request_payload JSONB NOT NULL, -- Full incoming webhook payload
    response_payload JSONB, -- Response sent back (nullable for errors)
    error_message TEXT, -- Error details if processing failed
    processing_time_ms INTEGER, -- Time taken to process webhook (milliseconds)
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index for transaction-based log lookups
CREATE INDEX idx_webhook_logs_transaction_id ON webhook_logs(transaction_id);

-- Index for source-based log filtering
CREATE INDEX idx_webhook_logs_source ON webhook_logs(source);

-- Index for chronological queries (audit reports)
CREATE INDEX idx_webhook_logs_created_at ON webhook_logs(created_at DESC);

-- Index for error tracking (failed webhooks)
CREATE INDEX idx_webhook_logs_errors ON webhook_logs(http_status)
WHERE http_status >= 400;

-- Composite index for source + time range queries
CREATE INDEX idx_webhook_logs_source_created_at ON webhook_logs(source, created_at DESC);

-- GIN index for request payload debugging
CREATE INDEX idx_webhook_logs_request_payload ON webhook_logs USING GIN (request_payload);

-- ============================================================================
-- CONSTRAINTS & VALIDATION
-- ============================================================================

-- Ensure currency codes are uppercase (ISO 4217 standard)
ALTER TABLE transactions ADD CONSTRAINT chk_currency_uppercase
CHECK (currency = UPPER(currency));

-- Ensure status values are lowercase for consistency
ALTER TABLE transactions ADD CONSTRAINT chk_status_lowercase
CHECK (status = LOWER(status));

-- Ensure valid HTTP status codes
ALTER TABLE webhook_logs ADD CONSTRAINT chk_http_status_valid
CHECK (http_status >= 100 AND http_status < 600);

-- Ensure processing time is non-negative
ALTER TABLE webhook_logs ADD CONSTRAINT chk_processing_time_valid
CHECK (processing_time_ms >= 0);

-- Ensure source identifiers are lowercase and alphanumeric
ALTER TABLE transactions ADD CONSTRAINT chk_source_format
CHECK (source ~ '^[a-z0-9_-]+$');

ALTER TABLE webhook_logs ADD CONSTRAINT chk_source_format
CHECK (source ~ '^[a-z0-9_-]+$');

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for merchants table
CREATE TRIGGER update_merchants_updated_at
    BEFORE UPDATE ON merchants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for transactions table
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS (Optional - for common queries)
-- ============================================================================

-- View for transaction summary by merchant
CREATE OR REPLACE VIEW v_merchant_transaction_summary AS
SELECT
    m.id AS merchant_id,
    m.name AS merchant_name,
    COUNT(t.id) AS total_transactions,
    SUM(CASE WHEN t.status = 'completed' THEN t.amount ELSE 0 END) AS total_completed_volume,
    SUM(CASE WHEN t.status = 'pending' THEN 1 ELSE 0 END) AS pending_count,
    SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) AS completed_count,
    SUM(CASE WHEN t.status = 'failed' THEN 1 ELSE 0 END) AS failed_count,
    MAX(t.created_at) AS last_transaction_at
FROM merchants m
LEFT JOIN transactions t ON m.id = t.merchant_id
GROUP BY m.id, m.name;

-- View for source performance analytics
CREATE OR REPLACE VIEW v_source_analytics AS
SELECT
    t.source,
    COUNT(t.id) AS total_transactions,
    SUM(CASE WHEN t.status = 'completed' THEN t.amount ELSE 0 END) AS total_volume,
    AVG(CASE WHEN t.status = 'completed' THEN t.amount ELSE NULL END) AS avg_transaction_amount,
    SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END)::FLOAT /
        NULLIF(COUNT(t.id), 0) AS success_rate,
    MAX(t.created_at) AS last_transaction_at
FROM transactions t
GROUP BY t.source;

-- View for webhook reliability monitoring
CREATE OR REPLACE VIEW v_webhook_reliability AS
SELECT
    wl.source,
    COUNT(wl.id) AS total_requests,
    SUM(CASE WHEN wl.http_status < 400 THEN 1 ELSE 0 END) AS successful_requests,
    SUM(CASE WHEN wl.http_status >= 400 THEN 1 ELSE 0 END) AS failed_requests,
    AVG(wl.processing_time_ms) AS avg_processing_time_ms,
    MAX(wl.created_at) AS last_request_at
FROM webhook_logs wl
GROUP BY wl.source;

-- ============================================================================
-- SAMPLE DATA (for development/testing)
-- ============================================================================

-- Insert sample merchants
INSERT INTO merchants (id, name) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Acme Corporation'),
    ('00000000-0000-0000-0000-000000000002', 'TechStart Inc'),
    ('00000000-0000-0000-0000-000000000003', 'Global Retail LLC');

-- Insert sample transactions
INSERT INTO transactions (source, merchant_id, amount, currency, status, payload) VALUES
    ('stripe', '00000000-0000-0000-0000-000000000001', 150.00, 'USD', 'completed',
     '{"stripe_charge_id": "ch_abc123", "customer_email": "customer@example.com"}'),
    ('paypal', '00000000-0000-0000-0000-000000000001', 75.50, 'USD', 'completed',
     '{"paypal_transaction_id": "txn_xyz789", "payer_email": "payer@example.com"}'),
    ('square', '00000000-0000-0000-0000-000000000002', 200.00, 'USD', 'pending',
     '{"square_payment_id": "pay_def456", "location_id": "loc_123"}'),
    ('stripe', '00000000-0000-0000-0000-000000000003', 99.99, 'EUR', 'failed',
     '{"stripe_charge_id": "ch_fail123", "error_code": "card_declined"}');

-- ============================================================================
-- PERMISSIONS (for application database user)
-- ============================================================================

-- Create application user (run separately with superuser privileges)
-- CREATE USER merchant_portal_app WITH PASSWORD 'your_secure_password_here';

-- Grant minimal required permissions (principle of least privilege)
-- GRANT CONNECT ON DATABASE merchant_portal TO merchant_portal_app;
-- GRANT USAGE ON SCHEMA public TO merchant_portal_app;
-- GRANT SELECT, INSERT, UPDATE ON merchants, transactions, webhook_logs TO merchant_portal_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO merchant_portal_app;
-- GRANT SELECT ON v_merchant_transaction_summary, v_source_analytics, v_webhook_reliability TO merchant_portal_app;

-- Note: Application user should NOT have DROP, TRUNCATE, or ALTER permissions

-- ============================================================================
-- MAINTENANCE
-- ============================================================================

-- Enable auto-vacuum for all tables (recommended for production)
ALTER TABLE merchants SET (autovacuum_enabled = true);
ALTER TABLE transactions SET (autovacuum_enabled = true);
ALTER TABLE webhook_logs SET (autovacuum_enabled = true);

-- Analyze tables for query planner optimization
ANALYZE merchants;
ANALYZE transactions;
ANALYZE webhook_logs;

-- ============================================================================
-- COMMENTS (for documentation)
-- ============================================================================

COMMENT ON TABLE merchants IS 'Stores merchant/business entities that own transactions';
COMMENT ON TABLE transactions IS 'Central table for all transaction records from multiple payment sources';
COMMENT ON TABLE webhook_logs IS 'Audit trail for all incoming webhook requests and processing outcomes';

COMMENT ON COLUMN transactions.payload IS 'JSONB field for flexible, source-specific transaction metadata';
COMMENT ON COLUMN webhook_logs.processing_time_ms IS 'Time taken to process webhook from receipt to response (milliseconds)';
COMMENT ON COLUMN webhook_logs.transaction_id IS 'References created transaction; NULL if transaction creation failed';

-- ============================================================================
-- NOTES
-- ============================================================================
-- 1. All timestamps use TIMESTAMP WITH TIME ZONE for proper timezone handling
-- 2. UUID primary keys for distributed system compatibility
-- 3. Indexes optimized for common query patterns (see analytics API)
-- 4. JSONB allows flexible payload storage without schema changes
-- 5. Constraints ensure data integrity at database level
-- 6. Views provide pre-computed analytics for dashboard queries
-- 7. Auto-update triggers keep updated_at columns in sync
-- 8. Sample data included for local development/testing
