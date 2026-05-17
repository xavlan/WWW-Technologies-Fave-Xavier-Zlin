/**
 * Validations légères pour les payloads formulaires (admin) et entrées utilisateur.
 */

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SKU_RE = /^[A-Za-z0-9._-]{2,80}$/;

function clampString(str, max) {
  if (str == null || str === '') return '';
  return String(str).trim().slice(0, max);
}

/** Évite les entrées trop longues / HTML pour champs texte libre affichés côté client */
function sanitizePlainText(str, maxLen) {
  const s = clampString(str, maxLen);
  return s.replace(/[\u0000-\u001F\u007F]/g, '');
}

function isValidSlug(slug) {
  if (!slug || typeof slug !== 'string') return false;
  return slug.length <= 255 && SLUG_RE.test(slug);
}

function isValidSku(sku) {
  if (!sku || typeof sku !== 'string') return false;
  return SKU_RE.test(sku);
}

/** specs doit être un objet plain JSON (pas de fonctions) */
function validateSpecsObject(specs) {
  if (specs == null) return { ok: true, value: {} };
  if (typeof specs !== 'object' || Array.isArray(specs)) {
    return { ok: false, error: 'Specs doit être un objet JSON' };
  }
  const keys = Object.keys(specs);
  if (keys.length > 50) {
    return { ok: false, error: 'Trop de clés dans specs' };
  }
  return { ok: true, value: specs };
}

function validatePositiveMoney(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return { ok: false, error: 'Prix invalide' };
  return { ok: true, value: n };
}

function validateNonNegativeInt(value) {
  const n = parseInt(String(value), 10);
  if (!Number.isFinite(n) || n < 0) return { ok: false, error: 'Quantité invalide' };
  return { ok: true, value: n };
}

module.exports = {
  sanitizePlainText,
  isValidSlug,
  isValidSku,
  validateSpecsObject,
  validatePositiveMoney,
  validateNonNegativeInt,
  MAX_SEARCH_LEN: 200,
};
