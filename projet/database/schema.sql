-- TechInventory — schéma PostgreSQL
-- Exécution : psql -U postgres -d techinventory -f database/schema.sql

BEGIN;

-- Catégories de composants (CPU, GPU, etc.)
CREATE TABLE IF NOT EXISTS categories (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(120) NOT NULL,
  slug            VARCHAR(120) NOT NULL UNIQUE,
  description     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comptes administrateurs (connexion JWT)
CREATE TABLE IF NOT EXISTS users (
  id              SERIAL PRIMARY KEY,
  email           VARCHAR(255) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  role            VARCHAR(40) NOT NULL DEFAULT 'admin',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Articles en stock
CREATE TABLE IF NOT EXISTS components (
  id                  SERIAL PRIMARY KEY,
  category_id         INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name                VARCHAR(255) NOT NULL,
  slug                VARCHAR(255) NOT NULL UNIQUE,
  sku                 VARCHAR(80) NOT NULL UNIQUE,
  brand               VARCHAR(120),
  description         TEXT,
  specs               JSONB NOT NULL DEFAULT '{}',
  price               NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  stock_quantity      INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  low_stock_threshold INTEGER NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
  image_url           TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_components_category_id ON components(category_id);
CREATE INDEX IF NOT EXISTS idx_components_price ON components(price);
CREATE INDEX IF NOT EXISTS idx_components_stock ON components(stock_quantity);
-- Mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_components_updated_at ON components;
CREATE TRIGGER trg_components_updated_at
  BEFORE UPDATE ON components
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

COMMIT;

-- ---------------------------------------------------------------------------
-- Données d'exemple
-- ---------------------------------------------------------------------------

BEGIN;

INSERT INTO categories (name, slug, description) VALUES
  ('Processeurs (CPU)', 'cpu', 'Processeurs pour socket desktop et workstation.'),
  ('Cartes graphiques (GPU)', 'gpu', 'GPU gaming et professionnels.'),
  ('Mémoire vive (RAM)', 'ram', 'Barrettes DDR4 / DDR5.'),
  ('Stockage', 'storage', 'SSD, NVMe, disques durs.')
ON CONFLICT (slug) DO NOTHING;

-- Mot de passe de démo : admin123  (hash bcrypt)
INSERT INTO users (email, password_hash, role) VALUES
  ('admin@techinventory.local', '$2b$10$4VsDpJt7zfNid3HL3XoJ1uqf4BkVwdXzlu1pVsyurtjTk129Go0Ga', 'admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO components (category_id, name, slug, sku, brand, description, specs, price, stock_quantity, low_stock_threshold, image_url)
SELECT c.id, v.name, v.slug, v.sku, v.brand, v.description, v.specs::jsonb, v.price, v.stock_quantity, v.low_stock_threshold, v.image_url
FROM categories c
JOIN (VALUES
  ('cpu', 'AMD Ryzen 7 7800X3D', 'amd-ryzen-7-7800x3d', 'CPU-AMD-7800X3D', 'AMD',
   'CPU gaming 8 cœurs / 16 threads, cache 3D V-Cache.',
   '{"socket":"AM5","cores":8,"threads":16,"base_ghz":4.2,"boost_ghz":5.0,"tdp_w":120}',
   419.99, 12, 5, NULL),
  ('cpu', 'Intel Core i5-14600K', 'intel-core-i5-14600k', 'CPU-INT-14600K', 'Intel',
   'Hybride 14 cœurs, débloqué pour overclocking.',
   '{"socket":"LGA1700","cores":14,"threads":20,"base_ghz":3.5,"boost_ghz":5.3,"tdp_w":125}',
   289.00, 3, 5, NULL),
  ('gpu', 'NVIDIA GeForce RTX 4070 Super', 'nvidia-rtx-4070-super', 'GPU-NV-4070S', 'NVIDIA',
   'Ray tracing, DLSS 3.',
   '{"vram_gb":12,"bus":"PCIe 4.0","outputs":["HDMI 2.1","DisplayPort 1.4a"],"length_mm":242}',
   599.00, 8, 4, NULL),
  ('gpu', 'AMD Radeon RX 7800 XT', 'amd-rx-7800-xt', 'GPU-AMD-7800XT', 'AMD',
   'Performances 1440p, AV1.',
   '{"vram_gb":16,"bus":"PCIe 4.0","outputs":["HDMI 2.1","DisplayPort 2.1"],"length_mm":267}',
   499.00, 2, 6, NULL),
  ('ram', 'Corsair Vengeance DDR5 32 Go (2x16)', 'corsair-vengeance-ddr5-32gb', 'RAM-CS-32G-D5', 'Corsair',
   'Kit 32 Go 6000 MT/s CL36.',
   '{"type":"DDR5","capacity_gb":32,"speed_mts":6000,"kit":"2x16GB","voltage":1.35}',
   139.99, 25, 8, NULL),
  ('storage', 'Samsung 990 Pro 2 To NVMe', 'samsung-990-pro-2tb', 'SSD-SMG-990P-2T', 'Samsung',
   'SSD NVMe PCIe 4.0 hautes performances.',
   '{"interface":"NVMe PCIe 4.0","capacity_tb":2,"read_mb_s":7450,"write_mb_s":6900,"form_factor":"M.2 2280"}',
   189.99, 4, 5, NULL)
) AS v(cat_slug, name, slug, sku, brand, description, specs, price, stock_quantity, low_stock_threshold, image_url)
  ON c.slug = v.cat_slug
ON CONFLICT (slug) DO NOTHING;

COMMIT;
