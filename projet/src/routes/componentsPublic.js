const express = require('express');
const { query } = require('../config/db');
const { normalizeCatalogQuery } = require('../utils/catalogParams');

const router = express.Router();

function withStockMeta(row) {
  const low = row.stock_quantity <= row.low_stock_threshold;
  return {
    ...row,
    low_stock: low,
  };
}

router.get('/', async (req, res) => {
  const {
    search,
    categoryId,
    minPrice,
    maxPrice,
    limit,
    page,
  } = normalizeCatalogQuery(req.query);

  const offset = (page - 1) * limit;

  const conditions = [];
  const params = [];
  let p = 1;

  if (search) {
    conditions.push(
      `(c.name ILIKE $${p} OR c.brand ILIKE $${p} OR c.sku ILIKE $${p})`
    );
    params.push(`%${search}%`);
    p += 1;
  }
  if (categoryId != null && Number.isFinite(categoryId)) {
    conditions.push(`c.category_id = $${p}`);
    params.push(categoryId);
    p += 1;
  }
  if (minPrice != null && Number.isFinite(minPrice)) {
    conditions.push(`c.price >= $${p}`);
    params.push(minPrice);
    p += 1;
  }
  if (maxPrice != null && Number.isFinite(maxPrice)) {
    conditions.push(`c.price <= $${p}`);
    params.push(maxPrice);
    p += 1;
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const countSql = `
      SELECT COUNT(*)::int AS total
      FROM components c
      ${where}
    `;
    const { rows: countRows } = await query(countSql, params);
    const total = countRows[0]?.total ?? 0;

    params.push(limit, offset);
    const listSql = `
      SELECT
        c.id, c.category_id, c.name, c.slug, c.sku, c.brand,
        c.description, c.specs, c.price, c.stock_quantity,
        c.low_stock_threshold, c.image_url, c.created_at, c.updated_at,
        cat.name AS category_name, cat.slug AS category_slug
      FROM components c
      JOIN categories cat ON cat.id = c.category_id
      ${where}
      ORDER BY c.name ASC
      LIMIT $${p} OFFSET $${p + 1}
    `;
    const { rows } = await query(listSql, params);
    res.json({
      total,
      page,
      limit,
      items: rows.map(withStockMeta),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Impossible de charger le catalogue' });
  }
});

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: 'Identifiant invalide' });
  }
  try {
    const { rows } = await query(
      `SELECT
        c.id, c.category_id, c.name, c.slug, c.sku, c.brand,
        c.description, c.specs, c.price, c.stock_quantity,
        c.low_stock_threshold, c.image_url, c.created_at, c.updated_at,
        cat.name AS category_name, cat.slug AS category_slug
       FROM components c
       JOIN categories cat ON cat.id = c.category_id
       WHERE c.id = $1`,
      [id]
    );
    if (!rows.length) {
      return res.status(404).json({ error: 'Composant introuvable' });
    }
    res.json(withStockMeta(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Impossible de charger le composant' });
  }
});

module.exports = router;
