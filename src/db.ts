// https://node-postgres.com/guides/project-structure
import pg from 'pg'
// Named export 'Pool' not found im: import { Pool } from 'pg'
const { Pool } = pg

const isDev = process.env.NODE_ENV === 'development'
const options = {
  connectionString: isDev
    ? process.env.PG_CONNECTIONSTRING_DEV
    : process.env.PG_CONNECTIONSTRING_PROD,
}

const pool = new Pool(options)

export const query = (text, params, callback) =>
  pool.query(text, params, callback)
