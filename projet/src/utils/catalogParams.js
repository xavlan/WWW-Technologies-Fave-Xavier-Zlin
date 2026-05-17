/**
 * Normalisation des paramètres catalogue (recherche / filtres).
 * Utilisé par l’API et testé par Jest — garder la même logique côté client (voir public/js/catalog.js).
 */

const MAX_SEARCH_LEN = 200;

function parsePositiveInt(value, fallback) {
  const n = parseInt(String(value), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function parseOptionalInt(value) {
  if (value === undefined || value === null || value === '') return null;
  const n = parseInt(String(value), 10);
  return Number.isFinite(n) ? n : null;
}

function parseOptionalPrice(value) {
  if (value === undefined || value === null || value === '') return null;
  const n = parseFloat(String(value));
  return Number.isFinite(n) ? n : null;
}

/**
 * @param {Record<string, unknown>} raw — typiquement req.query
 * @returns {{
 *   search: string,
 *   categoryId: number | null,
 *   minPrice: number | null,
 *   maxPrice: number | null,
 *   limit: number,
 *   page: number,
 * }}
 */
function normalizeCatalogQuery(raw) {
  const searchRaw = raw.search != null ? String(raw.search) : '';
  const search = searchRaw.trim().slice(0, MAX_SEARCH_LEN);

  let categoryId = parseOptionalInt(raw.categoryId);
  if (categoryId != null && categoryId <= 0) categoryId = null;

  let minPrice = parseOptionalPrice(raw.minPrice);
  let maxPrice = parseOptionalPrice(raw.maxPrice);
  if (minPrice != null && minPrice < 0) minPrice = null;
  if (maxPrice != null && maxPrice < 0) maxPrice = null;

  const limit = Math.min(parsePositiveInt(raw.limit, 24), 100);
  const page = parsePositiveInt(raw.page, 1);

  return {
    search,
    categoryId,
    minPrice,
    maxPrice,
    limit,
    page,
  };
}

/** Construit les paramètres d’URL pour le fetch côté navigateur (mêmes clés que l’API). */
function catalogQueryToUrlSearchParams(normalized) {
  const p = new URLSearchParams();
  if (normalized.search) p.set('search', normalized.search);
  if (normalized.categoryId != null) p.set('categoryId', String(normalized.categoryId));
  if (normalized.minPrice != null) p.set('minPrice', String(normalized.minPrice));
  if (normalized.maxPrice != null) p.set('maxPrice', String(normalized.maxPrice));
  p.set('page', String(normalized.page));
  p.set('limit', String(normalized.limit));
  return p;
}

module.exports = {
  normalizeCatalogQuery,
  catalogQueryToUrlSearchParams,
  MAX_SEARCH_LEN,
};
