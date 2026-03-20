import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const globalForPg = globalThis as unknown as { pool: Pool | undefined };

// Use cached pool in dev to avoid exhausting connections
export const pool =
  globalForPg.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL?.trim(),
    ssl: { rejectUnauthorized: false },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPg.pool = pool;
}
