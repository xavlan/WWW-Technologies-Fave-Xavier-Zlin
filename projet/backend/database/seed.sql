-- TechInventory sample data
-- Run after schema.sql: psql $DATABASE_URL -f database/schema.sql -f database/seed.sql
-- For the full catalog (24 components + admin user), use: npm run db:seed

INSERT INTO "Category" ("id", "name", "slug", "description", "createdAt", "updatedAt") VALUES
  ('cat_cpu', 'CPU', 'cpu', 'Central Processing Units', NOW(), NOW()),
  ('cat_gpu', 'GPU', 'gpu', 'Graphics Processing Units', NOW(), NOW()),
  ('cat_ram', 'RAM', 'ram', 'System memory modules', NOW(), NOW()),
  ('cat_storage', 'Storage', 'storage', 'SSDs and hard drives', NOW(), NOW()),
  ('cat_mobo', 'Motherboard', 'motherboard', 'Mainboards and chipsets', NOW(), NOW()),
  ('cat_psu', 'PSU', 'psu', 'Power supply units', NOW(), NOW())
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "Component" (
  "id", "name", "brand", "model", "description", "price", "stock", "sku",
  "imageUrl", "specifications", "isActive", "categoryId", "createdAt", "updatedAt"
) VALUES
  (
    'comp_i9', 'Intel Core i9-14900K', 'Intel', 'Core i9-14900K',
    '14th Gen flagship CPU with 24 cores for gaming and productivity.',
    589.99, 12, 'CPU-IN-14900K', NULL,
    '{"cores": 24, "socket": "LGA1700", "tdp": "125W"}'::jsonb,
    true, 'cat_cpu', NOW(), NOW()
  ),
  (
    'comp_7950x', 'AMD Ryzen 9 7950X', 'AMD', 'Ryzen 9 7950X',
    'High-core-count AM5 processor for workstations and gaming.',
    549.99, 10, 'CPU-AM-7950X', NULL,
    '{"cores": 16, "socket": "AM5", "tdp": "170W"}'::jsonb,
    true, 'cat_cpu', NOW(), NOW()
  ),
  (
    'comp_4090', 'NVIDIA GeForce RTX 4090', 'NVIDIA', 'RTX 4090',
    'Top-tier GPU with 24GB GDDR6X for 4K gaming and AI workloads.',
    1599.99, 5, 'GPU-NV-4090', NULL,
    '{"memory": "24GB", "interface": "PCIe 4.0"}'::jsonb,
    true, 'cat_gpu', NOW(), NOW()
  ),
  (
    'comp_7800xt', 'AMD Radeon RX 7800 XT', 'AMD', 'RX 7800 XT',
    'Strong 1440p gaming graphics card with 16GB VRAM.',
    499.99, 15, 'GPU-AM-7800XT', NULL,
    '{"memory": "16GB", "interface": "PCIe 4.0"}'::jsonb,
    true, 'cat_gpu', NOW(), NOW()
  ),
  (
    'comp_ddr5', 'Corsair Vengeance 32GB DDR5', 'Corsair', 'CMK32GX5M2B5600C36',
    '32GB DDR5 kit at 5600MHz for modern Intel and AMD builds.',
    114.99, 30, 'RAM-CO-32DDR5', NULL,
    '{"capacity": "32GB", "speed": "5600MHz", "type": "DDR5"}'::jsonb,
    true, 'cat_ram', NOW(), NOW()
  ),
  (
    'comp_ssd', 'Samsung 990 PRO 2TB', 'Samsung', 'MZ-V9P2T0BW',
    'NVMe Gen4 SSD with high read/write speeds for OS and games.',
    179.99, 25, 'SSD-SA-990PRO2T', NULL,
    '{"capacity": "2TB", "interface": "M.2 NVMe", "seqRead": "7450 MB/s"}'::jsonb,
    true, 'cat_storage', NOW(), NOW()
  ),
  (
    'comp_mobo', 'ASUS ROG STRIX B650E-F', 'ASUS', 'ROG STRIX B650E-F GAMING WIFI',
    'AM5 motherboard with PCIe 5.0, WiFi 6E, and solid VRM design.',
    269.99, 8, 'MOBO-AS-B650EF', NULL,
    '{"socket": "AM5", "chipset": "B650E", "formFactor": "ATX"}'::jsonb,
    true, 'cat_mobo', NOW(), NOW()
  ),
  (
    'comp_psu', 'be quiet! Straight Power 11 850W', 'be quiet!', 'BN311',
    '80+ Gold modular PSU with quiet operation and stable power delivery.',
    139.99, 20, 'PSU-BQ-850W', NULL,
    '{"wattage": "850W", "efficiency": "80+ Gold", "modular": true}'::jsonb,
    true, 'cat_psu', NOW(), NOW()
  )
ON CONFLICT ("sku") DO NOTHING;
