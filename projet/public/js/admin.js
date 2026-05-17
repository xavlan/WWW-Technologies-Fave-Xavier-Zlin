(function () {
  const api = (path) => window.TI_API_BASE + path;
  const TOKEN_KEY = 'ti_admin_jwt';

  function escapeHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function setToken(t) {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  }

  function authHeaders() {
    const t = getToken();
    const h = { 'Content-Type': 'application/json' };
    if (t) h.Authorization = 'Bearer ' + t;
    return h;
  }

  const loginSection = document.getElementById('admin-login');
  const dashboardSection = document.getElementById('admin-dashboard');
  const loginForm = document.getElementById('form-login');
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) logoutBtn.classList.add('hidden');
  const tableBody = document.getElementById('admin-table-body');
  const formCrud = document.getElementById('form-crud');
  const formTitle = document.getElementById('form-title');
  const editId = document.getElementById('field-edit-id');
  const messageEl = document.getElementById('admin-message');

  let categories = [];

  function showMessage(text, isError) {
    messageEl.textContent = text || '';
    messageEl.className =
      'rounded-lg px-4 py-2 text-sm ' +
      (isError ? 'bg-red-950 text-red-200 border border-red-800' : 'bg-emerald-950 text-emerald-200 border border-emerald-800');
    if (!text) messageEl.classList.add('hidden');
    else messageEl.classList.remove('hidden');
  }

  function showLogin() {
    loginSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
    if (logoutBtn) logoutBtn.classList.add('hidden');
  }

  function showDashboard() {
    loginSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    if (logoutBtn) logoutBtn.classList.remove('hidden');
  }

  async function apiJson(path, options) {
    const r = await fetch(api(path), {
      ...options,
      headers: { ...authHeaders(), ...(options && options.headers) },
    });
    const text = await r.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }
    }
    if (!r.ok) {
      const err = new Error((data && data.error) || r.statusText || 'Erreur API');
      err.status = r.status;
      err.body = data;
      throw err;
    }
    return data;
  }

  async function loadCategories() {
    const rows = await apiJson('/api/categories');
    categories = rows;
    const sel = document.getElementById('field-category');
    const html =
      '<option value="">—</option>' +
      rows
        .map(
          (c) =>
            '<option value="' +
            String(c.id) +
            '">' +
            escapeHtml(c.name) +
            '</option>'
        )
        .join('');
    sel.innerHTML = html;
  }

  function resetForm() {
    editId.value = '';
    formTitle.textContent = 'Nouveau composant';
    formCrud.reset();
    document.getElementById('field-specs').value = '{}';
    document.getElementById('field-low-threshold').value = '5';
  }

  async function refreshTable() {
    const rows = await apiJson('/api/admin/components', { method: 'GET' });
    tableBody.innerHTML = rows
      .map((row) => {
        const low = row.low_stock;
        const rowCls = low ? 'bg-amber-950/30' : '';
        return (
          '<tr class="border-b border-slate-800 ' +
          rowCls +
          '">' +
          '<td class="px-2 py-2 font-mono text-xs">' +
          row.id +
          '</td>' +
          '<td class="px-2 py-2">' +
          escapeHtml(row.name) +
          '</td>' +
          '<td class="px-2 py-2">' +
          escapeHtml(String(row.stock_quantity)) +
          '</td>' +
          '<td class="px-2 py-2">' +
          (low ? '<span class="text-amber-400">Stock bas</span>' : 'OK') +
          '</td>' +
          '<td class="px-2 py-2 text-right">' +
          '<button type="button" class="rounded bg-slate-800 px-2 py-1 text-xs hover:bg-slate-700" data-act="edit" data-id="' +
          row.id +
          '">Modifier</button> ' +
          '<button type="button" class="rounded bg-red-950 px-2 py-1 text-xs text-red-200 hover:bg-red-900" data-act="del" data-id="' +
          row.id +
          '">Supprimer</button>' +
          '</td></tr>'
        );
      })
      .join('');

    tableBody.querySelectorAll('button[data-act="edit"]').forEach((btn) => {
      btn.addEventListener('click', () => loadOne(parseInt(btn.getAttribute('data-id'), 10)));
    });
    tableBody.querySelectorAll('button[data-act="del"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'), 10);
        if (!confirm('Supprimer le composant #' + id + ' ?')) return;
        remove(id);
      });
    });
  }

  async function loadOne(id) {
    const row = await apiJson('/api/admin/components/' + id, { method: 'GET' });
    editId.value = String(row.id);
    formTitle.textContent = 'Modifier le composant #' + row.id;
    document.getElementById('field-category').value = String(row.category_id);
    document.getElementById('field-name').value = row.name;
    document.getElementById('field-slug').value = row.slug;
    document.getElementById('field-sku').value = row.sku;
    document.getElementById('field-brand').value = row.brand || '';
    document.getElementById('field-desc').value = row.description || '';
    document.getElementById('field-specs').value = JSON.stringify(row.specs || {}, null, 2);
    document.getElementById('field-price').value = row.price;
    document.getElementById('field-stock').value = row.stock_quantity;
    document.getElementById('field-low-threshold').value = row.low_stock_threshold;
    document.getElementById('field-image').value = row.image_url || '';
    showMessage('', false);
    window.scrollTo({ top: formCrud.offsetTop - 80, behavior: 'smooth' });
  }

  async function remove(id) {
    try {
      await fetch(api('/api/admin/components/' + id), {
        method: 'DELETE',
        headers: authHeaders(),
      }).then(async (r) => {
        if (!r.ok) {
          const t = await r.text();
          let err = t;
          try {
            err = JSON.parse(t).error;
          } catch (_) {}
          throw new Error(err);
        }
      });
      showMessage('Supprimé.', false);
      await refreshTable();
      resetForm();
    } catch (e) {
      showMessage(e instanceof Error ? e.message : 'Erreur', true);
    }
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    try {
      const res = await fetch(api('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Connexion refusée');
      setToken(data.token);
      showMessage('Connecté.', false);
      showDashboard();
      await loadCategories();
      await refreshTable();
      resetForm();
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'Erreur', true);
    }
  });

  logoutBtn.addEventListener('click', () => {
    setToken(null);
    resetForm();
    showLogin();
    showMessage('', false);
  });

  formCrud.addEventListener('submit', async (e) => {
    e.preventDefault();
    let specs = {};
    try {
      specs = JSON.parse(document.getElementById('field-specs').value || '{}');
    } catch {
      showMessage('JSON invalide dans Spécifications.', true);
      return;
    }
    const payload = {
      category_id: parseInt(document.getElementById('field-category').value, 10),
      name: document.getElementById('field-name').value.trim(),
      slug: document.getElementById('field-slug').value.trim(),
      sku: document.getElementById('field-sku').value.trim(),
      brand: document.getElementById('field-brand').value.trim(),
      description: document.getElementById('field-desc').value.trim(),
      specs,
      price: parseFloat(document.getElementById('field-price').value),
      stock_quantity: parseInt(document.getElementById('field-stock').value, 10),
      low_stock_threshold: parseInt(
        document.getElementById('field-low-threshold').value || '5',
        10
      ),
      image_url: document.getElementById('field-image').value.trim() || null,
    };

    const id = editId.value.trim();
    try {
      if (id) {
        await apiJson('/api/admin/components/' + id, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        showMessage('Composant mis à jour.', false);
      } else {
        await apiJson('/api/admin/components', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        showMessage('Composant créé.', false);
      }
      await refreshTable();
      resetForm();
    } catch (err) {
      if (err.status === 401) {
        setToken(null);
        showLogin();
      }
      showMessage(err instanceof Error ? err.message : 'Erreur', true);
    }
  });

  document.getElementById('btn-cancel-edit').addEventListener('click', () => {
    resetForm();
  });

  function init() {
    if (getToken()) {
      showDashboard();
      loadCategories()
        .then(() => refreshTable())
        .catch((err) => {
          if (err.status === 401) {
            setToken(null);
            showLogin();
          } else {
            showMessage(err instanceof Error ? err.message : 'Erreur chargement', true);
          }
        });
    } else {
      showLogin();
    }
  }

  init();
})();
