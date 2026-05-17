/** Origine de l’API (même serveur par défaut). Sur Vercel statique, définir window.TI_API_BASE avant ce script. */
(function () {
  window.TI_API_BASE =
    typeof window.TI_API_BASE === 'string'
      ? window.TI_API_BASE.replace(/\/$/, '')
      : '';
})();
