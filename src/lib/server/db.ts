import { Pool } from 'pg';
import type { Pool as PoolType } from 'pg';
import { env } from '$env/dynamic/private';

const globalForPg = globalThis as unknown as { pool: PoolType | undefined };

// Use cached pool in dev to avoid exhausting connections
export const pool =
  globalForPg.pool ??
  new Pool({
    connectionString: env.DATABASE_URL?.trim(),
    ssl: { rejectUnauthorized: false },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPg.pool = pool;
}
