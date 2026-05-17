const {
  normalizeCatalogQuery,
  catalogQueryToUrlSearchParams,
  MAX_SEARCH_LEN,
} = require('../src/utils/catalogParams');

describe('normalizeCatalogQuery (recherche catalogue)', () => {
  it('triture et limite la longueur de search', () => {
    const long = 'x'.repeat(300);
    const r = normalizeCatalogQuery({ search: '  ' + long + '  ' });
    expect(r.search.length).toBe(MAX_SEARCH_LEN);
    expect(r.search.startsWith('xx')).toBe(true);
  });

  it('filtre categoryId, prix et pagination', () => {
    const r = normalizeCatalogQuery({
      search: 'rtx',
      categoryId: '2',
      minPrice: '100.5',
      maxPrice: '999',
      page: '2',
      limit: '12',
    });
    expect(r.search).toBe('rtx');
    expect(r.categoryId).toBe(2);
    expect(r.minPrice).toBe(100.5);
    expect(r.maxPrice).toBe(999);
    expect(r.page).toBe(2);
    expect(r.limit).toBe(12);
  });

  it('ignore les prix et catégories invalides', () => {
    const r = normalizeCatalogQuery({
      categoryId: 'abc',
      minPrice: 'x',
      maxPrice: '',
      page: '0',
    });
    expect(r.categoryId).toBeNull();
    expect(r.minPrice).toBeNull();
    expect(r.maxPrice).toBeNull();
    expect(r.page).toBe(1);
  });

  it('plafonne limit à 100', () => {
    const r = normalizeCatalogQuery({ limit: '500' });
    expect(r.limit).toBe(100);
  });
});

describe('catalogQueryToUrlSearchParams', () => {
  it('reproduit les clés attendues par GET /api/components', () => {
    const n = normalizeCatalogQuery({
      search: 'amd',
      categoryId: '1',
      minPrice: '10',
      maxPrice: '500',
      page: '1',
      limit: '24',
    });
    const p = catalogQueryToUrlSearchParams(n);
    expect(p.get('search')).toBe('amd');
    expect(p.get('categoryId')).toBe('1');
    expect(p.get('minPrice')).toBe('10');
    expect(p.get('maxPrice')).toBe('500');
    expect(p.get('page')).toBe('1');
    expect(p.get('limit')).toBe('24');
  });
});
