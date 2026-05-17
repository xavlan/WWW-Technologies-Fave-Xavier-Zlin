const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
});

pool.on('error', (err) => {
  console.error('Erreur client PostgreSQL inattendue', err);
});

async function query(text, params) {
  return pool.query(text, params);
}

module.exports = { pool, query };
