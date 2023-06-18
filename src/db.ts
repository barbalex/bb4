import { Pool } from 'pg'

const isDev = process.env.NODE_ENV === 'development'
const options = {
  connectionString: isDev
    ? process.env.PG_CONNECTIONSTRING_DEV
    : process.env.PG_CONNECTIONSTRING_PROD,
}

const pool = new Pool(options)

export const query = (text, params, callback) => {
  return pool.query(text, params, callback)
}
