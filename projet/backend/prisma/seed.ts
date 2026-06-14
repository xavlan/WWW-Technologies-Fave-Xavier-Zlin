import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { getComponentImageUrl } from './component-images';

const prisma = new PrismaClient();

const BCRYPT_ROUNDS = 12;

async function main(): Promise<void> {
  console.log('Seeding TechInventory database...');

  const passwordHash = await bcrypt.hash('Admin1234!', BCRYPT_ROUNDS);

  await prisma.user.upsert({
    where: { email: 'admin@techinventory.com' },
    update: {
      passwordHash,
      name: 'Super Admin',
      role: Role.SUPERADMIN,
    },
    create: {
      email: 'admin@techinventory.com',
      passwordHash,
      name: 'Super Admin',
      role: Role.SUPERADMIN,
    },
  });

  const categories = [
    {
      name: 'CPU',
      slug: 'cpu',
      description: 'Central Processing Units for desktop and workstation builds',
    },
    {
      name: 'GPU',
      slug: 'gpu',
      description: 'Graphics Processing Units for gaming, content creation, and compute',
    },
    {
      name: 'RAM',
      slug: 'ram',
      description: 'System memory modules for improved multitasking performance',
    },
    {
      name: 'Storage',
      slug: 'storage',
      description: 'SSDs and HDDs for operating systems, applications, and data',
    },
    {
      name: 'Motherboard',
      slug: 'motherboard',
      description: 'Mainboards connecting CPU, memory, storage, and expansion cards',
    },
    {
      name: 'PSU',
      slug: 'psu',
      description: 'Power supply units delivering stable power to PC components',
    },
  ];

  const categoryRecords: Record<string, string> = {};

  for (const category of categories) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
      },
      create: category,
    });
    categoryRecords[category.slug] = record.id;
  }

  const components = [
    {
      name: 'Intel Core i9-14900K',
      brand: 'Intel',
      model: 'Core i9-14900K',
      description:
        'Flagship 14th Gen Intel desktop processor with 24 cores and high single-thread performance for gaming and productivity.',
      price: 589.99,
      stock: 12,
      sku: 'CPU-IN-14900K',
      imageUrl: 'https://placehold.co/400x300/3b82f6/ffffff?text=Intel+i9-14900K',
      specifications: {
        cores: 24,
        threads: 32,
        baseClock: '3.2 GHz',
        boostClock: '6.0 GHz',
        socket: 'LGA1700',
        tdp: '125W',
      },
      categorySlug: 'cpu',
    },
    {
      name: 'Intel Core i7-14700K',
      brand: 'Intel',
      model: 'Core i7-14700K',
      description:
        'High-performance 14th Gen processor balancing core count and efficiency for enthusiast builds.',
      price: 409.99,
      stock: 18,
      sku: 'CPU-IN-14700K',
      imageUrl: 'https://placehold.co/400x300/3b82f6/ffffff?text=Intel+i7-14700K',
      specifications: {
        cores: 20,
        threads: 28,
        baseClock: '3.4 GHz',
        boostClock: '5.6 GHz',
        socket: 'LGA1700',
        tdp: '125W',
      },
      categorySlug: 'cpu',
    },
    {
      name: 'AMD Ryzen 9 7950X',
      brand: 'AMD',
      model: 'Ryzen 9 7950X',
      description:
        'Zen 4 flagship with 16 cores designed for heavy multitasking, rendering, and workstation workloads.',
      price: 549.99,
      stock: 9,
      sku: 'CPU-AM-7950X',
      imageUrl: 'https://placehold.co/400x300/3b82f6/ffffff?text=amd-7950x.jpg',
      specifications: {
        cores: 16,
        threads: 32,
        baseClock: '4.5 GHz',
        boostClock: '5.7 GHz',
        socket: 'AM5',
        tdp: '170W',
      },
      categorySlug: 'cpu',
    },
    {
      name: 'AMD Ryzen 7 7800X3D',
      brand: 'AMD',
      model: 'Ryzen 7 7800X3D',
      description:
        'Gaming-focused CPU with 3D V-Cache technology for exceptional frame rates in modern titles.',
      price: 449.99,
      stock: 3,
      sku: 'CPU-AM-7800X3D',
      imageUrl: 'https://placehold.co/400x300/3b82f6/ffffff?text=amd-7800x3d.jpg',
      specifications: {
        cores: 8,
        threads: 16,
        baseClock: '4.2 GHz',
        boostClock: '5.0 GHz',
        socket: 'AM5',
        cache: '96MB',
        tdp: '120W',
      },
      categorySlug: 'cpu',
    },
    {
      name: 'NVIDIA GeForce RTX 4090',
      brand: 'NVIDIA',
      model: 'GeForce RTX 4090',
      description:
        'Top-tier Ada Lovelace graphics card for 4K gaming, AI workloads, and professional content creation.',
      price: 1599.99,
      stock: 4,
      sku: 'GPU-NV-4090',
      imageUrl: 'https://placehold.co/400x300/3b82f6/ffffff?text=rtx-4090.jpg',
      specifications: {
        memory: '24 GB GDDR6X',
        boostClock: '2520 MHz',
        cudaCores: 16384,
        tdp: '450W',
        interface: 'PCIe 4.0 x16',
      },
      categorySlug: 'gpu',
    },
    {
      name: 'NVIDIA GeForce RTX 4070 Super',
      brand: 'NVIDIA',
      model: 'GeForce RTX 4070 Super',
      description:
        'Mid-high range GPU offering excellent 1440p gaming performance with DLSS 3 support.',
      price: 599.99,
      stock: 14,
      sku: 'GPU-NV-4070S',
      imageUrl: 'https://placehold.co/400x300/3b82f6/ffffff?text=rtx-4070-super.jpg',
      specifications: {
        memory: '12 GB GDDR6X',
        boostClock: '2475 MHz',
        cudaCores: 7168,
        tdp: '220W',
        interface: 'PCIe 4.0 x16',
      },
      categorySlug: 'gpu',
    },
    {
      name: 'AMD Radeon RX 7900 XTX',
      brand: 'AMD',
      model: 'Radeon RX 7900 XTX',
      description:
        'High-end RDNA 3 graphics card with strong rasterization performance and ample VRAM.',
      price: 949.99,
      stock: 0,
      sku: 'GPU-AM-7900XTX',
      imageUrl: 'https://placehold.co/400x300/3b82f6/ffffff?text=rx-7900-xtx.jpg',
      specifications: {
        memory: '24 GB GDDR6',
        boostClock: '2500 MHz',
        computeUnits: 96,
        tdp: '355W',
        interface: 'PCIe 4.0 x16',
      },
      categorySlug: 'gpu',
    },
    {
      name: 'AMD Radeon RX 7800 XT',
      brand: 'AMD',
      model: 'Radeon RX 7800 XT',
      description:
        'Competitive 1440p gaming GPU with 16GB memory for modern AAA titles and streaming.',
      price: 499.99,
      stock: 7,
      sku: 'GPU-AM-7800XT',
      imageUrl: 'https://placehold.co/400x300/3b82f6/ffffff?text=rx-7800-xt.jpg',
      specifications: {
        memory: '16 GB GDDR6',
        boostClock: '2430 MHz',
        computeUnits: 60,
        tdp: '263W',
        interface: 'PCIe 4.0 x16',
      },
      categorySlug: 'gpu',
    },
    {
      name: 'Corsair Vengeance RGB 32GB DDR5',
      brand: 'Corsair',
      model: 'CMH32GX5M2E6000C36',
      description:
        'Dual-channel 32GB DDR5 kit rated at 6000MT/s with RGB lighting and XMP 3.0 support.',
      price: 114.99,
      stock: 22,
      sku: 'RAM-CS-32GB-D5',
      imageUrl: 'https://placehold.co/400x300/3b82f6/ffffff?text=corsair-vengeance-32gb.jpg',
      specifications: {
        capacity: '32GB (2x16GB)',
        speed: '6000 MT/s',
        type: 'DDR5',
        latency: 'CL36',
        voltage: '1.35V',
      },
      categorySlug: 'ram',
    },
    {
      name: 'G.Skill Trident Z5 RGB 64GB DDR5',
      brand: 'G.Skill',
      model: 'F5-6400J3239G32GX2-TZ5RK',
      description:
        'Premium 64GB DDR5 memory kit for content creators and power users running heavy workloads.',
      price: 219.99,
      stock: 5,
      sku: 'RAM-GS-64GB-D5',
      imageUrl: 'https://placehold.co/400x300/3b82f6/ffffff?text=gskill-trident-z5.jpg',
      specifications: {
        capacity: '64GB (2x32GB)',
        speed: '6400 MT/s',
        type: 'DDR5',
        latency: 'CL32',
        voltage: '1.40V',
      },
      categorySlug: 'ram',
    },
    {
      name: 'Kingston Fury Beast 16GB DDR4',
      brand: 'Kingston',
      model: 'KF432C16BB/16',
      description:
        'Reliable single 16GB DDR4 module for budget builds and office systems.',
      price: 39.99,
      stock: 0,
      sku: 'RAM-KS-16GB-D4',
      imageUrl: 'https://placehold.co/400x300/3b82f6/ffffff?text=kingston-fury-beast.jpg',
      specifications: {
        capacity: '16GB (1x16GB)',
        speed: '3200 MT/s',
        type: 'DDR4',
        latency: 'CL16',
        voltage: '1.35V',
      },
      categorySlug: 'ram',
    },
    {
      name: 'Crucial Pro 32GB DDR5',
      brand: 'Crucial',
      model: 'CP2K16G56C46U5',
      description:
        'Value-oriented 32GB DDR5 kit with solid compatibility for Intel and AMD platforms.',
      price: 89.99,
      stock: 2,
      sku: 'RAM-CR-32GB-D5',
      imageUrl: 'https://placehold.co/400x300/3b82f6/ffffff?text=crucial-pro-32gb.jpg',
      specifications: {
        capacity: '32GB (2x16GB)',
        speed: '5600 MT/s',
        type: 'DDR5',
        latency: 'CL46',
        voltage: '1.25V',
      },
      categorySlug: 'ram',
    },
    {
      name: 'Samsung 990 Pro 2TB NVMe SSD',
      brand: 'Samsung',
      model: 'MZ-V9P2T0BW',
      description:
        'PCIe 4.0 NVMe SSD with high sequential speeds for OS drives and large game libraries.',
      price: 179.99,
      stock: 25,
      sku: 'SSD-SM-990P-2TB',
      imageUrl: 'https://placehold.co/400x300/3b82f6/ffffff?text=samsung-990-pro.jpg',
      specifications: {
        capacity: '2TB',
        interface: 'PCIe 4.0 x4 NVMe',
        readSpeed: '7450 MB/s',
        writeSpeed: '6900 MB/s',
        formFactor: 'M.2 2280',
      },
      categorySlug: 'storage',
    },
    {
      name: 'WD Black SN850X 1TB NVMe SSD',
      brand: 'Western Digital',
      model: 'WDS100T2X0E',
      description:
        'Performance NVMe drive optimized for gaming with a heatsink option and strong random I/O.',
      price: 89.99,
      stock: 16,
      sku: 'SSD-WD-SN850X-1TB',
      imageUrl: 'https://placehold.co/400x300/3b82f6/ffffff?text=wd-sn850x.jpg',
      specifications: {
        capacity: '1TB',
        interface: 'PCIe 4.0 x4 NVMe',
        readSpeed: '7300 MB/s',
        writeSpeed: '6300 MB/s',
        formFactor: 'M.2 2280',
      },
      categorySlug: 'storage',
    },
    {
      name: 'Seagate Barracuda 4TB HDD',
      brand: 'Seagate',
      model: 'ST4000DM004',
      description:
        'High-capacity 3.5-inch hard drive for bulk storage, backups, and media archives.',
      price: 79.99,
      stock: 4,
      sku: 'HDD-SG-4TB',
      imageUrl: 'https://placehold.co/400x300/3b82f6/ffffff?text=seagate-barracuda-4tb.jpg',
      specifications: {
        capacity: '4TB',
        interface: 'SATA 6Gb/s',
        rpm: 5400,
        formFactor: '3.5-inch',
        cache: '256MB',
      },
      categorySlug: 'storage',
    },
    {
      name: 'Crucial P3 Plus 500GB NVMe SSD',
      brand: 'Crucial',
      model: 'CT500P3PSSD8',
      description:
        'Affordable PCIe 4.0 SSD suitable for secondary storage and budget gaming builds.',
      price: 44.99,
      stock: 30,
      sku: 'SSD-CR-P3P-500GB',
      imageUrl: 'https://placehold.co/400x300/3b82f6/ffffff?text=crucial-p3-plus.jpg',
      specifications: {
        capacity: '500GB',
        interface: 'PCIe 4.0 x4 NVMe',
        readSpeed: '5000 MB/s',
        writeSpeed: '3600 MB/s',
        formFactor: 'M.2 2280',
      },
      categorySlug: 'storage',
    },
    {
      name: 'ASUS ROG Strix Z790-E Gaming WiFi',
      brand: 'ASUS',
      model: 'ROG Strix Z790-E Gaming WiFi',
      description:
        'Premium Intel Z790 motherboard with PCIe 5.0, Wi-Fi 6E, and robust VRM for overclocking.',
      price: 489.99,
      stock: 6,
      sku: 'MB-AS-Z790E',
      imageUrl: 'https://placehold.co/400x300/3b82f6/ffffff?text=asus-z790e.jpg',
      specifications: {
        chipset: 'Intel Z790',
        socket: 'LGA1700',
        memorySupport: 'DDR5 up to 7800+ MT/s',
        pcieSlots: '1x PCIe 5.0 x16',
        wifi: 'Wi-Fi 6E',
        formFactor: 'ATX',
      },
      categorySlug: 'motherboard',
    },
    {
      name: 'MSI MAG B650 Tomahawk WiFi',
      brand: 'MSI',
      model: 'MAG B650 Tomahawk WiFi',
      description:
        'Well-balanced AM5 motherboard with PCIe 4.0, dual M.2 slots, and integrated Wi-Fi.',
      price: 219.99,
      stock: 11,
      sku: 'MB-MS-B650-TW',
      imageUrl: 'https://placehold.co/400x300/3b82f6/ffffff?text=msi-b650-tomahawk.jpg',
      specifications: {
        chipset: 'AMD B650',
        socket: 'AM5',
        memorySupport: 'DDR5 up to 6400+ MT/s',
        pcieSlots: '1x PCIe 4.0 x16',
        wifi: 'Wi-Fi 6E',
        formFactor: 'ATX',
      },
      categorySlug: 'motherboard',
    },
    {
      name: 'Gigabyte B760M DS3H DDR4',
      brand: 'Gigabyte',
      model: 'B760M DS3H DDR4',
      description:
        'Compact micro-ATX board for budget Intel builds with DDR4 memory support.',
      price: 109.99,
      stock: 1,
      sku: 'MB-GB-B760M-D4',
      imageUrl: 'https://placehold.co/400x300/3b82f6/ffffff?text=gigabyte-b760m.jpg',
      specifications: {
        chipset: 'Intel B760',
        socket: 'LGA1700',
        memorySupport: 'DDR4 up to 3200 MT/s',
        pcieSlots: '1x PCIe 4.0 x16',
        wifi: false,
        formFactor: 'Micro-ATX',
      },
      categorySlug: 'motherboard',
    },
    {
      name: 'Corsair RM850x Shift 850W',
      brand: 'Corsair',
      model: 'CP-9020270-NA',
      description:
        'Fully modular 80 PLUS Gold power supply with side-mounted connectors for cleaner cable routing.',
      price: 149.99,
      stock: 13,
      sku: 'PSU-CS-RM850X',
      imageUrl: 'https://placehold.co/400x300/3b82f6/ffffff?text=corsair-rm850x.jpg',
      specifications: {
        wattage: '850W',
        efficiency: '80 PLUS Gold',
        modular: 'Fully Modular',
        fanSize: '140mm',
        warranty: '10 years',
      },
      categorySlug: 'psu',
    },
    {
      name: 'Seasonic Focus GX-750 750W',
      brand: 'Seasonic',
      model: 'SSR-750FX',
      description:
        'Reliable 750W Gold-rated PSU with quiet operation and strong voltage regulation.',
      price: 119.99,
      stock: 8,
      sku: 'PSU-SS-FGX750',
      imageUrl: 'https://placehold.co/400x300/3b82f6/ffffff?text=seasonic-focus-gx750.jpg',
      specifications: {
        wattage: '750W',
        efficiency: '80 PLUS Gold',
        modular: 'Fully Modular',
        fanSize: '135mm',
        warranty: '10 years',
      },
      categorySlug: 'psu',
    },
    {
      name: 'be quiet! Straight Power 11 650W',
      brand: 'be quiet!',
      model: 'BN297',
      description:
        'Silent-focused 650W power supply ideal for mid-range gaming systems.',
      price: 109.99,
      stock: 0,
      sku: 'PSU-BQ-SP11-650',
      imageUrl: 'https://placehold.co/400x300/3b82f6/ffffff?text=bequiet-sp11-650.jpg',
      specifications: {
        wattage: '650W',
        efficiency: '80 PLUS Gold',
        modular: 'Semi-Modular',
        fanSize: '135mm',
        warranty: '5 years',
      },
      categorySlug: 'psu',
    },
    {
      name: 'EVGA SuperNOVA 1000 GT 1000W',
      brand: 'EVGA',
      model: '220-GT-1000-X1',
      description:
        'High-wattage Gold PSU for multi-GPU setups and power-hungry enthusiast configurations.',
      price: 169.99,
      stock: 3,
      sku: 'PSU-EV-SN1000GT',
      imageUrl: 'https://placehold.co/400x300/3b82f6/ffffff?text=evga-sn1000gt.jpg',
      specifications: {
        wattage: '1000W',
        efficiency: '80 PLUS Gold',
        modular: 'Fully Modular',
        fanSize: '135mm',
        warranty: '10 years',
      },
      categorySlug: 'psu',
    },
  ];

  for (const component of components) {
    const categoryId = categoryRecords[component.categorySlug];

    if (!categoryId) {
      throw new Error(`Missing category for slug: ${component.categorySlug}`);
    }

    const { categorySlug, ...componentData } = component; // eslint-disable-line @typescript-eslint/no-unused-vars

    const imageUrl = getComponentImageUrl(component.sku);

    await prisma.component.upsert({
      where: { sku: component.sku },
      update: {
        ...componentData,
        imageUrl,
        categoryId,
      },
      create: {
        ...componentData,
        imageUrl,
        categoryId,
      },
    });
  }

  const userCount = await prisma.user.count();
  const categoryCount = await prisma.category.count();
  const componentCount = await prisma.component.count();
  const lowStockCount = await prisma.component.count({
    where: { stock: { lte: 5 }, isActive: true },
  });
  const outOfStockCount = await prisma.component.count({
    where: { stock: 0, isActive: true },
  });

  console.log(`Seeded ${userCount} user(s)`);
  console.log(`Seeded ${categoryCount} categor(ies)`);
  console.log(`Seeded ${componentCount} component(s)`);
  console.log(`Low stock components (<= 5): ${lowStockCount}`);
  console.log(`Out of stock components: ${outOfStockCount}`);
  console.log('Seed completed successfully.');
}

main()
  .catch((error: unknown) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
