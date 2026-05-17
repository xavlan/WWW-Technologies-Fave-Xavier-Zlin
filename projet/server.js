const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/auth');
const categoriesRoutes = require('./src/routes/categories');
const componentsPublicRoutes = require('./src/routes/componentsPublic');
const adminComponentsRoutes = require('./src/routes/adminComponents');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// API REST
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/components', componentsPublicRoutes);
app.use('/api/admin', adminComponentsRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'TechInventory API',
    time: new Date().toISOString(),
  });
});

// Fichiers statiques (HTML / JS / Tailwind via CDN dans les pages)
app.use(express.static(path.join(__dirname, 'public')));

// SPA simple : 404 API JSON, sinon laisser le navigateur gérer les routes front
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Route API introuvable' });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`TechInventory — serveur http://localhost:${PORT}`);
});
