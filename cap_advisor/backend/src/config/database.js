const { Pool } = require('pg');
const { initEnv } = require('./env');

const env = initEnv();

const pool = new Pool({ connectionString: env.DATABASE_URL });

pool.on('error', (error) => {
  // keep app from silently failing
  console.error('Unexpected PG client error', error);
});

async function query(text, params) {
  return pool.query(text, params);
}

module.exports = { pool, query };
