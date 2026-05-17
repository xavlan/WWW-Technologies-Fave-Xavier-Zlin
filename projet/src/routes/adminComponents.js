const express = require('express');
const { query } = require('../config/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

function withStockMeta(row) {
  const low = row.stock_quantity <= row.low_stock_threshold;
  return { ...row, low_stock: low };
}

// GET /api/admin/components — liste complète (tableau de bord)
router.get('/components', async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT
        c.id, c.category_id, c.name, c.slug, c.sku, c.brand,
        c.description, c.specs, c.price, c.stock_quantity,
        c.low_stock_threshold, c.image_url, c.created_at, c.updated_at,
        cat.name AS category_name, cat.slug AS category_slug
       FROM components c
       JOIN categories cat ON cat.id = c.category_id
       ORDER BY c.updated_at DESC`
    );
    res.json(rows.map(withStockMeta));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Impossible de charger l\'inventaire' });
  }
});

// GET /api/admin/components/:id
router.get('/components/:id', async (req, res) => {
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
    res.status(500).json({ error: 'Erreur lecture composant' });
  }
});

// POST /api/admin/components
router.post('/components', async (req, res) => {
  const b = req.body || {};
  const required = ['category_id', 'name', 'slug', 'sku', 'price', 'stock_quantity'];
  for (const k of required) {
    if (b[k] === undefined || b[k] === '') {
      return res.status(400).json({ error: `Champ requis manquant: ${k}` });
    }
  }
  try {
    const { rows } = await query(
      `INSERT INTO components (
        category_id, name, slug, sku, brand, description, specs,
        price, stock_quantity, low_stock_threshold, image_url
      ) VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8,$9,$10,$11)
      RETURNING *`,
      [
        b.category_id,
        b.name,
        b.slug,
        b.sku,
        b.brand || null,
        b.description || null,
        JSON.stringify(b.specs && typeof b.specs === 'object' ? b.specs : {}),
        b.price,
        b.stock_quantity,
        b.low_stock_threshold != null ? b.low_stock_threshold : 5,
        b.image_url || null,
      ]
    );
    res.status(201).json(withStockMeta(rows[0]));
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Slug ou SKU déjà utilisé' });
    }
    if (err.code === '23503') {
      return res.status(400).json({ error: 'Catégorie invalide' });
    }
    console.error(err);
    res.status(500).json({ error: 'Création impossible' });
  }
});

// PUT /api/admin/components/:id — remplace la fiche (même champs qu’à la création)
router.put('/components/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: 'Identifiant invalide' });
  }
  const b = req.body || {};
  const required = ['category_id', 'name', 'slug', 'sku', 'price', 'stock_quantity'];
  for (const k of required) {
    if (b[k] === undefined || b[k] === '') {
      return res.status(400).json({ error: `Champ requis pour la mise à jour: ${k}` });
    }
  }
  try {
    const { rows } = await query(
      `UPDATE components SET
        category_id = $2,
        name = $3,
        slug = $4,
        sku = $5,
        brand = $6,
        description = $7,
        specs = $8::jsonb,
        price = $9,
        stock_quantity = $10,
        low_stock_threshold = $11,
        image_url = $12
      WHERE id = $1
      RETURNING *`,
      [
        id,
        b.category_id,
        b.name,
        b.slug,
        b.sku,
        b.brand || null,
        b.description || null,
        JSON.stringify(b.specs && typeof b.specs === 'object' ? b.specs : {}),
        b.price,
        b.stock_quantity,
        b.low_stock_threshold != null ? b.low_stock_threshold : 5,
        b.image_url || null,
      ]
    );
    if (!rows.length) {
      return res.status(404).json({ error: 'Composant introuvable' });
    }
    res.json(withStockMeta(rows[0]));
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Slug ou SKU déjà utilisé' });
    }
    console.error(err);
    res.status(500).json({ error: 'Mise à jour impossible' });
  }
});

// DELETE /api/admin/components/:id
router.delete('/components/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: 'Identifiant invalide' });
  }
  try {
    const { rowCount } = await query('DELETE FROM components WHERE id = $1', [id]);
    if (!rowCount) {
      return res.status(404).json({ error: 'Composant introuvable' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Suppression impossible' });
  }
});

module.exports = router;
