/**
 * PostgreSQL database connection pool with retry logic
 * @module db/pool
 * @description Manages PostgreSQL connection pool using pg driver with container-ready retry logic
 *
 * AI-generated: 100% (120 lines)
 * Human-written: 0% (0 lines)
 */

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Configuration constants
const MAX_RETRIES = 10;
const RETRY_DELAY = 5000; // 5 seconds

/**
 * Create PostgreSQL connection pool with retry logic
 * @returns {Promise<Pool>} Configured PostgreSQL pool
 */
async function createPoolWithRetry() {
  const config = {
    connectionString: process.env.DATABASE_URL,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 10000, // Connection timeout
  };

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Create new pool instance
      const pool = new Pool(config);

      // Test connection
      const client = await pool.connect();
      await client.query('SELECT NOW()');
      client.release();

      console.log(`✅ Database connected successfully (attempt ${attempt}/${MAX_RETRIES})`);
      console.log(`📊 Connection pool: max ${config.max} connections`);

      // Set up error handler for pool
      pool.on('error', (err) => {
        console.error('❌ Unexpected error on idle client:', err.message);
        console.error('Stack:', err.stack);
      });

      return pool;
    } catch (error) {
      console.log(`⚠️  Database connection attempt ${attempt}/${MAX_RETRIES} failed: ${error.message}`);

      if (attempt === MAX_RETRIES) {
        console.error('❌ Failed to connect to database after maximum retries');
        console.error('Please check:');
        console.error('  1. DATABASE_URL environment variable is set correctly');
        console.error('  2. PostgreSQL container is running and healthy');
        console.error('  3. Network connectivity between containers');
        throw error;
      }

      console.log(`⏳ Retrying in ${RETRY_DELAY / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
}

// Initialize pool (top-level await)
let pool;
try {
  pool = await createPoolWithRetry();
} catch (error) {
  console.error('❌ Critical: Unable to establish database connection');
  process.exit(1);
}

/**
 * Query the database
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise<pg.QueryResult>} Query result
 */
export const query = async (text, params) => {
  try {
    return await pool.query(text, params);
  } catch (error) {
    console.error('Query error:', error.message);
    throw error;
  }
};

/**
 * Get a client from the pool for transactions
 * @returns {Promise<pg.PoolClient>} Database client
 */
export const getClient = async () => {
  try {
    return await pool.connect();
  } catch (error) {
    console.error('Failed to get client from pool:', error.message);
    throw error;
  }
};

/**
 * Close the pool (for graceful shutdown)
 * @returns {Promise<void>}
 */
export const close = async () => {
  try {
    await pool.end();
    console.log('📊 Database connection pool closed');
  } catch (error) {
    console.error('Error closing pool:', error.message);
    throw error;
  }
};

/**
 * Export pool instance as default
 */
export default pool;
