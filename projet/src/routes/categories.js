const express = require('express');
const { query } = require('../config/db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { rows } = await query(
      'SELECT id, name, slug, description, created_at FROM categories ORDER BY name ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Impossible de charger les catégories' });
  }
});

module.exports = router;
