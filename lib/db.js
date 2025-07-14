import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL, // Set this in Vercel env vars
  ssl: { rejectUnauthorized: false }
});

export default pool;
