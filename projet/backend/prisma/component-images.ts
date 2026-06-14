/**
 * Real hardware product images (Unsplash — free to use, hotlink-friendly).
 * Each SKU maps to a distinct photo appropriate for its component category.
 */
export const COMPONENT_IMAGES: Record<string, string> = {
  // CPUs
  'CPU-IN-14900K':
    'https://images.unsplash.com/photo-1555611703-51a3171a454a?auto=format&fit=crop&w=800&h=600&q=80',
  'CPU-IN-14700K':
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&h=600&q=80',
  'CPU-AM-7950X':
    'https://images.unsplash.com/photo-1629654298829-8502a20977da?auto=format&fit=crop&w=800&h=600&q=80',
  'CPU-AM-7800X3D':
    'https://images.unsplash.com/photo-1591799279583-9a33b11cc2a3?auto=format&fit=crop&w=800&h=600&q=80',

  // GPUs
  'GPU-NV-4090':
    'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&h=600&q=80',
  'GPU-NV-4070S':
    'https://images.unsplash.com/photo-1600861940866-56c0435d9081?auto=format&fit=crop&w=800&h=600&q=80',
  'GPU-AM-7900XTX':
    'https://images.unsplash.com/photo-1587202372775-62d9b3125f6e?auto=format&fit=crop&w=800&h=600&q=80',
  'GPU-AM-7800XT':
    'https://images.unsplash.com/photo-1613417190839-38b67a4c5c5c?auto=format&fit=crop&w=800&h=600&q=80',

  // RAM
  'RAM-CS-32GB-D5':
    'https://images.unsplash.com/photo-1562976540-7572b9994faa?auto=format&fit=crop&w=800&h=600&q=80',
  'RAM-GS-64GB-D5':
    'https://images.unsplash.com/photo-1625847903659-452e035421b8?auto=format&fit=crop&w=800&h=600&q=80',
  'RAM-KS-16GB-D4':
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&h=600&q=80',
  'RAM-CR-32GB-D5':
    'https://images.unsplash.com/photo-1587831990711-e84908721891?auto=format&fit=crop&w=800&h=600&q=80',

  // Storage
  'SSD-SM-990P-2TB':
    'https://images.unsplash.com/photo-1597872200969-2b65d565775b?auto=format&fit=crop&w=800&h=600&q=80',
  'SSD-WD-SN850X-1TB':
    'https://images.unsplash.com/photo-1531498865778-7861fd1060f2?auto=format&fit=crop&w=800&h=600&q=80',
  'HDD-SG-4TB':
    'https://images.unsplash.com/photo-1587203462448-44e25957dcc5?auto=format&fit=crop&w=800&h=600&q=80',
  'SSD-CR-P3P-500GB':
    'https://images.unsplash.com/photo-1626863750655-53166a453e09?auto=format&fit=crop&w=800&h=600&q=80',

  // Motherboards
  'MB-AS-Z790E':
    'https://images.unsplash.com/photo-1555687404-086427109e66?auto=format&fit=crop&w=800&h=600&q=80',
  'MB-MS-B650-TW':
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&h=600&q=80',
  'MB-GB-B760M-D4':
    'https://images.unsplash.com/photo-1593640408182-31c70c745acb?auto=format&fit=crop&w=800&h=600&q=80',

  // PSUs
  'PSU-CS-RM850X':
    'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=800&h=600&q=80',
  'PSU-SS-FGX750':
    'https://images.unsplash.com/photo-1587202372634-32705e127013?auto=format&fit=crop&w=800&h=600&q=80',
  'PSU-BQ-SP11-650':
    'https://images.unsplash.com/photo-1593642532976-d136b3364edf?auto=format&fit=crop&w=800&h=600&q=80',
  'PSU-EV-SN1000GT':
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&h=600&q=80',
};

export const DEFAULT_COMPONENT_IMAGE =
  'https://images.unsplash.com/photo-1531297483781-856814fd8774?auto=format&fit=crop&w=800&h=600&q=80';

export function getComponentImageUrl(sku: string): string {
  return COMPONENT_IMAGES[sku] ?? DEFAULT_COMPONENT_IMAGE;
}
