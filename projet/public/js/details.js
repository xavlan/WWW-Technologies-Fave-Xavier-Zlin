(function () {
  const api = (path) => window.TI_API_BASE + path;

  function escapeHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const el = document.getElementById('detail-root');
  const err = document.getElementById('detail-error');

  if (!id || !/^\d+$/.test(id)) {
    err.textContent = 'Paramètre id manquant ou invalide.';
    err.classList.remove('hidden');
    return;
  }

  fetch(api('/api/components/' + encodeURIComponent(id)))
    .then((r) => {
      if (r.status === 404) throw new Error('Produit introuvable');
      if (!r.ok) throw new Error('Erreur serveur');
      return r.json();
    })
    .then((item) => {
      const price = Number(item.price).toLocaleString('fr-FR', {
        style: 'currency',
        currency: 'EUR',
      });
      const low = item.low_stock;
      const stockLabel = low ? 'Stock bas — réapprovisionnement conseillé' : 'Stock suffisant';
      const specs =
        item.specs && typeof item.specs === 'object'
          ? Object.entries(item.specs)
          : [];

      let specsRows = '';
      for (const [k, v] of specs) {
        specsRows +=
          '<tr class="border-b border-slate-800"><th class="py-2 pr-4 text-left font-medium text-slate-400">' +
          escapeHtml(String(k)) +
          '</th><td class="py-2">' +
          escapeHtml(typeof v === 'object' ? JSON.stringify(v) : String(v)) +
          '</td></tr>';
      }

      el.innerHTML =
        '<div class="grid gap-8 lg:grid-cols-2">' +
        '<div class="rounded-xl border border-slate-800 bg-slate-900/60 p-6">' +
        '<p class="text-sm text-slate-500">' +
        escapeHtml(item.category_name || '') +
        '</p>' +
        '<h1 class="mt-2 text-3xl font-bold">' +
        escapeHtml(item.name) +
        '</h1>' +
        '<p class="mt-2 text-slate-400">' +
        escapeHtml(item.brand || '') +
        ' · SKU ' +
        escapeHtml(item.sku || '') +
        '</p>' +
        '<p class="mt-6 text-4xl font-semibold text-sky-400">' +
        escapeHtml(price) +
        '</p>' +
        '<p class="mt-4 flex flex-wrap items-center gap-2">' +
        '<span class="rounded px-2 py-1 text-sm ' +
        (low ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300') +
        '">' +
        escapeHtml(String(item.stock_quantity)) +
        ' en stock</span>' +
        '<span class="text-sm text-slate-500">' +
        escapeHtml(stockLabel) +
        '</span></p>' +
        '</div>' +
        '<div class="rounded-xl border border-slate-800 bg-slate-900/60 p-6">' +
        '<h2 class="text-lg font-semibold">Description</h2>' +
        '<p class="mt-3 whitespace-pre-wrap text-slate-300">' +
        escapeHtml(item.description || 'Pas de description.') +
        '</p>' +
        '</div></div>' +
        '<section class="mt-10 rounded-xl border border-slate-800 bg-slate-900/60 p-6">' +
        '<h2 class="text-lg font-semibold">Spécifications techniques</h2>' +
        (specsRows
          ? '<table class="mt-4 w-full border-collapse text-sm">' + specsRows + '</table>'
          : '<p class="mt-4 text-slate-500">Aucune spécification détaillée.</p>') +
        '</section>';
    })
    .catch((e) => {
      err.textContent = e instanceof Error ? e.message : 'Erreur';
      err.classList.remove('hidden');
    });
})();
