/**
 * Real hardware product images (Unsplash — free to use, hotlink-friendly).
 * Each SKU maps to a distinct photo appropriate for its component category.
 */
export const COMPONENT_IMAGES: Record<string, string> = {
  // CPUs
  'CPU-IN-14900K':
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX09q_p1KP0Tbdvdcn7IjK5slbJxbI7cxG4g&s',
  'CPU-IN-14700K':
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX09q_p1KP0Tbdvdcn7IjK5slbJxbI7cxG4g&s',
  'CPU-AM-7950X':
    'https://www.cybertek.fr/images_produits/6f576bd5-4f5e-450e-902a-1ceef59dd8c1.jpg',
  'CPU-AM-7800X3D':
    'https://www.cybertek.fr/images_produits/6f576bd5-4f5e-450e-902a-1ceef59dd8c1.jpg',

  // GPUs
  'GPU-NV-4090':
    'https://upload.wikimedia.org/wikipedia/commons/d/df/Leistungsanalyse_NVIDIA_GeForce_RTX_4090_%28Geekerwan%29_02_cropped.jpg',
  'GPU-NV-4070S':
    'https://m.media-amazon.com/images/I/71BS6DcmRyL._AC_UF1000,1000_QL80_.jpg',
  'GPU-AM-7900XTX':
    'https://static.gigabyte.com/StaticFile/Image/Global/df68c5863e046427671d3cf6d9a4d6e4/Product/32888/webp/400',
  'GPU-AM-7800XT':
    'https://static.gigabyte.com/StaticFile/Image/Global/df68c5863e046427671d3cf6d9a4d6e4/Product/32888/webp/400',

  // RAM
  'RAM-CS-32GB-D5':
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE3V0XF_iwjQUgrUq7acb4llKA5ysXRgTbEw&s',
  'RAM-GS-64GB-D5':
    'https://img.overclockers.co.uk/media/image/MY10KGS_167481.png',
  'RAM-KS-16GB-D4':
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmUzdU6APeHcLhnFbgEwN71tfEb5RBbyFoDA&s',
  'RAM-CR-32GB-D5':
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoRyG0YvkIGnUaop8Y8lksPN5AaXOsN0i_JA&s',

  // Storage
  'SSD-SM-990P-2TB':
    'https://img-cdn.heureka.group/v1/5669b3e4-4bc4-47bf-b401-264316328b09.jpg?width=350&height=350',
  'SSD-WD-SN850X-1TB':
    'SSD-WD-SN850X-1TB',
  'HDD-SG-4TB':
    'https://images.mironet.cz/foto/w3/92428337/1.jpg.add.webp',
  'SSD-CR-P3P-500GB':
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzDqv1nuwLfp-SmW0OGxQJKern27U4jcnIgw&s',

  // Motherboards
  'MB-AS-Z790E':
    'https://m.media-amazon.com/images/I/81HpQ4fEd7L._AC_UF894,1000_QL80_.jpg',
  'MB-MS-B650-TW':
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcEUiPXkbv8mcOOkAhwMGnAcCkTyLBCg02sA&s',
  'MB-GB-B760M-D4':
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTs_rz-kEMa-yFFW539EYM4GFT9ReySZ4nPZA&s',

  // PSUs
  'PSU-CS-RM850X':
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTLuFxVwZSEaaVdkHZ6mKUVCag1TkvWX5oGg&s',
  'PSU-SS-FGX750':
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_GaggU3PeGSjH2PGxvHUm5Z-f6gAKutJ0sQ&s',
  'PSU-BQ-SP11-650':
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoRyG0YvkIGnUaop8Y8lksPN5AaXOsN0i_JA&s',
  'PSU-EV-SN1000GT':
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzDqv1nuwLfp-SmW0OGxQJKern27U4jcnIgw&s',
};

export const DEFAULT_COMPONENT_IMAGE =
  'https://images.unsplash.com/photo-1531297483781-856814fd8774?auto=format&fit=crop&w=800&h=600&q=80';

export function getComponentImageUrl(sku: string): string {
  return COMPONENT_IMAGES[sku] ?? DEFAULT_COMPONENT_IMAGE;
}
