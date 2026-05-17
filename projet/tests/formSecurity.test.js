const {
  sanitizePlainText,
  isValidSlug,
  isValidSku,
  validateSpecsObject,
  validatePositiveMoney,
  validateNonNegativeInt,
} = require('../src/utils/formSecurity');

describe('sanitizePlainText (entrées formulaires / XSS)', () => {
  it('supprime les caractères de contrôle', () => {
    expect(sanitizePlainText('a\u0000b\nc', 100)).toBe('abc');
  });

  it('tronque la longueur', () => {
    expect(sanitizePlainText('0123456789', 5).length).toBe(5);
  });
});

describe('isValidSlug', () => {
  it('accepte slugs kebab-case', () => {
    expect(isValidSlug('amd-ryzen-7-7800x3d')).toBe(true);
  });

  it('refuse chaînes vides ou caractères invalides', () => {
    expect(isValidSlug('')).toBe(false);
    expect(isValidSlug('slug avec espaces')).toBe(false);
    expect(isValidSlug('UPPER')).toBe(false);
  });
});

describe('isValidSku', () => {
  it('valide un SKU alphanumérique courant', () => {
    expect(isValidSku('CPU-AMD-7800X3D')).toBe(true);
  });

  it('refuse les SKU trop courts', () => {
    expect(isValidSku('a')).toBe(false);
  });
});

describe('validateSpecsObject (JSON injecté)', () => {
  it('accepte un objet plain', () => {
    const r = validateSpecsObject({ cores: 8, socket: 'AM5' });
    expect(r.ok).toBe(true);
    expect(r.value.cores).toBe(8);
  });

  it('refuse les tableaux et trop de clés', () => {
    expect(validateSpecsObject([1, 2]).ok).toBe(false);
    const big = {};
    for (let i = 0; i < 60; i += 1) big['k' + i] = 1;
    expect(validateSpecsObject(big).ok).toBe(false);
  });
});

describe('validatePositiveMoney / validateNonNegativeInt', () => {
  it('valide prix et quantités', () => {
    expect(validatePositiveMoney(0).ok).toBe(true);
    expect(validatePositiveMoney(-1).ok).toBe(false);
    expect(validateNonNegativeInt(10).value).toBe(10);
    expect(validateNonNegativeInt('x').ok).toBe(false);
  });
});
