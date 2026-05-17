(function () {
  const api = (path) => window.TI_API_BASE + path;

  function debounce(fn, ms) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  /** Aligné sur server/src/utils/catalogParams.js (normalisation recherche / filtres). */
  function normalizeFilters(state) {
    const search = String(state.search || '')
      .trim()
      .slice(0, 200);
    let categoryId =
      state.categoryId === '' || state.categoryId == null
        ? null
        : parseInt(String(state.categoryId), 10);
    if (categoryId != null && (!Number.isFinite(categoryId) || categoryId <= 0)) {
      categoryId = null;
    }
    let minPrice =
      state.minPrice === '' || state.minPrice == null
        ? null
        : parseFloat(String(state.minPrice));
    let maxPrice =
      state.maxPrice === '' || state.maxPrice == null
        ? null
        : parseFloat(String(state.maxPrice));
    if (minPrice != null && (!Number.isFinite(minPrice) || minPrice < 0)) minPrice = null;
    if (maxPrice != null && (!Number.isFinite(maxPrice) || maxPrice < 0)) maxPrice = null;
    const limit = Math.min(Math.max(parseInt(String(state.limit || 24), 10) || 24, 1), 100);
    const page = Math.max(parseInt(String(state.page || 1), 10) || 1, 1);
    return { search, categoryId, minPrice, maxPrice, limit, page };
  }

  function toSearchParams(n) {
    const p = new URLSearchParams();
    if (n.search) p.set('search', n.search);
    if (n.categoryId != null) p.set('categoryId', String(n.categoryId));
    if (n.minPrice != null) p.set('minPrice', String(n.minPrice));
    if (n.maxPrice != null) p.set('maxPrice', String(n.maxPrice));
    p.set('page', String(n.page));
    p.set('limit', String(n.limit));
    return p;
  }

  const sortModes = {
    name: (a, b) => String(a.name).localeCompare(String(b.name), 'fr'),
    priceAsc: (a, b) => Number(a.price) - Number(b.price),
    priceDesc: (a, b) => Number(b.price) - Number(a.price),
  };

  const grid = document.getElementById('catalog-grid');
  const meta = document.getElementById('catalog-meta');
  const errBox = document.getElementById('catalog-error');
  const paginationEl = document.getElementById('catalog-pagination');
  const searchEl = document.getElementById('filter-search');
  const categoryEl = document.getElementById('filter-category');
  const minEl = document.getElementById('filter-min');
  const maxEl = document.getElementById('filter-max');
  const sortEl = document.getElementById('filter-sort');
  const applyBtn = document.getElementById('filter-apply');

  let state = {
    search: '',
    categoryId: '',
    minPrice: '',
    maxPrice: '',
    page: 1,
    limit: 24,
    sort: 'name',
  };

  function escapeHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function cardHtml(item) {
    const low = item.low_stock;
    const badge = low
      ? '<span class="rounded bg-amber-500/20 text-amber-300 px-2 py-0.5 text-xs font-medium">Stock bas</span>'
      : '<span class="rounded bg-emerald-500/20 text-emerald-300 px-2 py-0.5 text-xs font-medium">En stock</span>';
    const price = Number(item.price).toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    });
    return (
      '<article class="flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg transition hover:border-sky-500/40">' +
      '<div class="flex flex-1 flex-col gap-3 p-4">' +
      '<div class="flex items-start justify-between gap-2">' +
      '<h2 class="text-lg font-semibold leading-snug">' +
      escapeHtml(item.name) +
      '</h2>' +
      badge +
      '</div>' +
      '<p class="text-sm text-slate-400">' +
      escapeHtml(item.brand || '') +
      ' · ' +
      escapeHtml(item.category_name || '') +
      '</p>' +
      '<p class="mt-auto text-xl font-bold text-sky-400">' +
      escapeHtml(price) +
      '</p>' +
      '<a class="inline-flex items-center justify-center rounded-lg bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-500" href="/details.html?id=' +
      encodeURIComponent(String(item.id)) +
      '">Voir la fiche</a>' +
      '</div></article>'
    );
  }

  async function loadCategories() {
    const r = await fetch(api('/api/categories'));
    if (!r.ok) throw new Error('Catégories indisponibles');
    return r.json();
  }

  async function loadComponents() {
    const n = normalizeFilters({
      search: state.search,
      categoryId: state.categoryId,
      minPrice: state.minPrice,
      maxPrice: state.maxPrice,
      page: state.page,
      limit: state.limit,
    });
    const qs = toSearchParams(n).toString();
    const r = await fetch(api('/api/components?' + qs));
    if (!r.ok) throw new Error('Catalogue indisponible');
    const data = await r.json();
    const sortFn = sortModes[state.sort] || sortModes.name;
    data.items = [...data.items].sort(sortFn);
    return data;
  }

  function renderPagination(total, page, limit) {
    const pages = Math.max(1, Math.ceil(total / limit));
    if (page > pages) {
      state.page = pages;
      return render();
    }
    let html =
      '<div class="flex flex-wrap items-center justify-center gap-2">';
    html +=
      '<button type="button" class="rounded border border-slate-700 px-3 py-1 text-sm hover:bg-slate-800" data-page="' +
      (page - 1) +
      '"' +
      (page <= 1 ? ' disabled' : '') +
      '>Précédent</button>';
    html +=
      '<span class="text-sm text-slate-400">Page ' +
      page +
      ' / ' +
      pages +
      ' — ' +
      total +
      ' article(s)</span>';
    html +=
      '<button type="button" class="rounded border border-slate-700 px-3 py-1 text-sm hover:bg-slate-800" data-page="' +
      (page + 1) +
      '"' +
      (page >= pages ? ' disabled' : '') +
      '>Suivant</button></div>';
    paginationEl.innerHTML = html;
    paginationEl.querySelectorAll('button[data-page]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const p = parseInt(btn.getAttribute('data-page'), 10);
        if (!Number.isFinite(p) || p < 1) return;
        state.page = p;
        render();
      });
    });
  }

  async function render() {
    errBox.classList.add('hidden');
    errBox.textContent = '';
    grid.innerHTML =
      '<p class="col-span-full text-center text-slate-500">Chargement…</p>';
    meta.textContent = '';
    try {
      const data = await loadComponents();
      meta.textContent =
        data.total + ' résultat(s) · tri côté page : ' + (sortEl.options[sortEl.selectedIndex]?.text || '');
      if (!data.items.length) {
        grid.innerHTML =
          '<p class="col-span-full text-center text-slate-500">Aucun composant ne correspond aux filtres.</p>';
      } else {
        grid.innerHTML = data.items.map(cardHtml).join('');
      }
      renderPagination(data.total, data.page, data.limit);
    } catch (e) {
      grid.innerHTML = '';
      paginationEl.innerHTML = '';
      errBox.textContent =
        e instanceof Error ? e.message : 'Erreur de chargement';
      errBox.classList.remove('hidden');
    }
  }

  const scheduleRender = debounce(() => {
    state.page = 1;
    render();
  }, 320);

  searchEl.addEventListener('input', () => {
    state.search = searchEl.value;
    scheduleRender();
  });

  categoryEl.addEventListener('change', () => {
    state.categoryId = categoryEl.value;
    state.page = 1;
    render();
  });

  minEl.addEventListener('change', () => {
    state.minPrice = minEl.value;
    state.page = 1;
    render();
  });

  maxEl.addEventListener('change', () => {
    state.maxPrice = maxEl.value;
    state.page = 1;
    render();
  });

  sortEl.addEventListener('change', () => {
    state.sort = sortEl.value;
    render();
  });

  applyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    state.page = 1;
    render();
  });

  loadCategories()
    .then((cats) => {
      categoryEl.innerHTML =
        '<option value="">Toutes les catégories</option>' +
        cats
          .map(
            (c) =>
              '<option value="' +
              String(c.id) +
              '">' +
              escapeHtml(c.name) +
              '</option>'
          )
          .join('');
    })
    .catch(() => {
      errBox.textContent = 'Impossible de charger les catégories';
      errBox.classList.remove('hidden');
    });

  render();
})();
