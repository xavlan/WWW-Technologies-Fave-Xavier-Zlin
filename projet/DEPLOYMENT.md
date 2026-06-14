# TechInventory — Guide complet de mise en ligne (100 % gratuit possible)

**Repo GitHub :** https://github.com/xavlan/WWW-Technologies-Fave-Xavier-Zlin

---

## Combien ça coûte ?

| Service | Rôle | Prix | Limites gratuites |
|---------|------|------|-------------------|
| **Vercel** | Site web (frontend) | **Gratuit** | Parfait pour Next.js, URL `.vercel.app` |
| **Render** | API (backend Express) | **Gratuit** | Le serveur **s’endort** après ~15 min sans visite → 1re requête lente (~30 s) |
| **Neon** | Base PostgreSQL | **Gratuit** | 0,5 Go stockage — largement suffisant pour ce projet |
| **GitHub** | Code source + CI | **Gratuit** | Repo public ou privé étudiant |

### Ce qui est PAYANT sur Render (à éviter)

- **PostgreSQL Render** ≈ **7 $/mois** — ne pas créer de base sur Render
- Utilise **Neon** à la place (gratuit)

**Total recommandé : 0 €/mois** pour un projet étudiant.

---

## Architecture en ligne

```
Utilisateur
    │
    ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Vercel (FREE)  │────▶│  Render (FREE)   │────▶│  Neon (FREE)    │
│  Next.js :3000  │ API │  Express :3001   │ SQL │  PostgreSQL     │
│  techinventory  │     │  techinventory-  │     │  base distante  │
│  .vercel.app    │     │  api.onrender.com│     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

---

# PARTIE 1 — Préparer le code sur GitHub

### 1.1 Ouvrir PowerShell

```powershell
cd C:\aaaCours\zlin\WWW-Technologies-Fave-Xavier-Zlin\projet
```

### 1.2 Vérifier l’état Git

```powershell
git status
```

### 1.3 Tout committer et pousser

```powershell
git add .
git commit -m "TechInventory ready for deployment"
git push origin main
```

Si `git push` demande de se connecter : utilise ton compte GitHub (navigateur ou token).

---

# PARTIE 2 — Base de données PostgreSQL sur Neon (GRATUIT)

### 2.1 Créer un compte

1. Va sur **https://neon.tech**
2. Clique **Sign up** (connexion avec GitHub recommandé)
3. Confirme ton email si demandé

### 2.2 Créer un projet

1. **New Project**
2. Nom : `techinventory`
3. Région : choisis la plus proche (ex. `Frankfurt` pour l’Europe)
4. PostgreSQL version : **15** ou **16** (par défaut)
5. Clique **Create project**

### 2.3 Copier l’URL de connexion

Sur le dashboard Neon, tu vois **Connection string** :

```
postgresql://USER:PASSWORD@ep-xxxxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

1. Clique **Copy**
2. **Garde cette URL** — tu en auras besoin 2 fois (Render + éventuellement seed local)

> Neon crée par défaut une base `neondb`. C’est parfait, ne change rien.

### 2.4 (Optionnel) Tester la connexion en local

Si Docker n’est pas installé, tu peux utiliser Neon directement en local :

```powershell
cd backend
copy .env.example .env
```

Ouvre `.env` et remplace `DATABASE_URL` par l’URL Neon copiée.

Puis :

```powershell
npx prisma generate
npx prisma migrate deploy
npm run db:seed
```

Tu dois voir : `Seed completed successfully.` et `24 component(s)`.

---

# PARTIE 3 — Backend API sur Render (GRATUIT)

### 3.1 Créer un compte Render

1. Va sur **https://render.com**
2. **Get started** → connecte **GitHub**
3. Autorise l’accès au repo `WWW-Technologies-Fave-Xavier-Zlin`

### 3.2 Créer le Web Service (PAS de base Render)

1. Dashboard → **New +** → **Web Service**
2. Connecte le repo `WWW-Technologies-Fave-Xavier-Zlin`
3. Configure **exactement** :

| Champ | Valeur |
|-------|--------|
| **Name** | `techinventory-api` |
| **Region** | Frankfurt (EU) ou Oregon (US) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm run build:render` |
| **Start Command** | `npm start` |
| **Instance Type** | **Free** ← important ! |

4. **Ne crée PAS** de PostgreSQL sur Render (bouton "Add database" → ignore)

### 3.3 Variables d’environnement (section Environment)

Clique **Add Environment Variable** pour chaque ligne :

| Key | Value |
|-----|-------|
| `DATABASE_URL` | *(colle l’URL Neon de la Partie 2)* |
| `JWT_SECRET` | *(génère une chaîne aléatoire ≥ 32 caractères, ex. `TechInv2026SuperSecretKeyForJWTAuth!!`)* |
| `JWT_EXPIRES_IN` | `7d` |
| `NODE_ENV` | `production` |
| `CORS_ORIGIN` | `https://placeholder.vercel.app` *(tu corrigeras après Vercel)* |
| `PORT` | `3001` |

> **Note :** `CORS_ORIGIN` sera mis à jour à l’étape 4 avec ta vraie URL Vercel.

5. Clique **Create Web Service**
6. Attends le premier deploy (5–15 min). Logs à surveiller :
   - `Running Prisma migrate deploy` → OK
   - `Seed completed successfully` → OK
   - `Build successful` → OK

### 3.4 Vérifier que l’API fonctionne

Render te donne une URL, ex. :

```
https://techinventory-api.onrender.com
```

Teste dans le navigateur :

1. **Health check :**  
   `https://techinventory-api.onrender.com/health`  
   → doit afficher `"status":"ok"`

2. **Catalogue :**  
   `https://techinventory-api.onrender.com/api/v1/components`  
   → doit afficher une liste JSON de composants

3. **Catégories :**  
   `https://techinventory-api.onrender.com/api/v1/categories`

Si erreur 502 : le serveur démarre encore, attends 1–2 min.

### 3.5 Copier ton JWT_SECRET

Render → service → **Environment** → note la valeur de `JWT_SECRET` (tu la recopieras sur Vercel).

---

# PARTIE 4 — Frontend sur Vercel (GRATUIT)

### 4.1 Créer un compte Vercel

1. Va sur **https://vercel.com**
2. **Sign up** avec GitHub (même compte)

### 4.2 Importer le projet

1. **Add New…** → **Project**
2. Import `WWW-Technologies-Fave-Xavier-Zlin`
3. **Configure Project** :

| Champ | Valeur |
|-------|--------|
| **Framework Preset** | Next.js (auto-détecté) |
| **Root Directory** | Clique **Edit** → sélectionne `frontend` |

4. **Environment Variables** :

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://techinventory-api.onrender.com/api/v1` *(ton URL Render + `/api/v1`)* |
| `NEXT_PUBLIC_APP_NAME` | `TechInventory` |
| `JWT_SECRET` | *(exactement la même valeur que sur Render)* |
| `JWT_EXPIRES_IN` | `7d` |

5. Clique **Deploy**
6. Attends 2–5 min

### 4.3 Récupérer l’URL Vercel

Exemple : `https://www-techinventory-xxx.vercel.app` ou `https://techinventory.vercel.app`

Ouvre cette URL → tu dois voir la page d’accueil TechInventory.

### 4.4 Mettre à jour CORS sur Render (OBLIGATOIRE)

1. Retourne sur **Render** → `techinventory-api` → **Environment**
2. Modifie `CORS_ORIGIN` :

```
https://TON-NOM.vercel.app
```

- **Sans** slash à la fin
- **Exactement** l’URL affichée par Vercel (copie-colle depuis la barre d’adresse)

3. **Save Changes** → Render redéploie automatiquement (~2 min)

### 4.5 Test complet du site

| Test | URL / action | Résultat attendu |
|------|--------------|------------------|
| Accueil | `/` | Page avec logo TECH, composants |
| Catalogue | `/components` | Grille avec images |
| Détail | Clique un composant | Image + specs |
| Admin login | `/admin/login` | Formulaire login |
| Connexion admin | `admin@techinventory.com` / `Admin1234!` | Dashboard |
| Inventaire | `/admin/inventory` | Liste + CRUD |
| Favoris | `/favorites` | Page vide ou favoris |
| PC Builder | `/builder` | Sélecteur composants |

---

# PARTIE 5 — Ce que tu rends au professeur

Remplis ce tableau avec **tes vraies URLs** :

| Élément | URL |
|---------|-----|
| **Site public (principal)** | `https://________________.vercel.app` |
| **API (optionnel)** | `https://________________.onrender.com/api/v1` |
| **GitHub** | `https://github.com/xavlan/WWW-Technologies-Fave-Xavier-Zlin` |
| **Admin login** | `https://________________.vercel.app/admin/login` |
| **Email admin** | `admin@techinventory.com` |
| **Mot de passe admin** | `Admin1234!` |

---

# PARTIE 6 — Problèmes fréquents

### Le site charge mais pas de composants (erreur réseau)

- Vérifie `NEXT_PUBLIC_API_URL` sur Vercel (doit finir par `/api/v1`)
- Redéploie Vercel après modification des variables

### Erreur CORS dans la console (F12)

- `CORS_ORIGIN` sur Render ≠ URL Vercel exacte
- Pas de `http` vs `https` mélangé
- Pas de slash final

### L’API met 30–60 secondes à répondre

- Normal sur Render **Free** : le serveur était endormi
- Recharge une fois, ensuite c’est rapide

### Admin login ne fonctionne pas

- `JWT_SECRET` **identique** sur Render ET Vercel
- Minimum 32 caractères

### Pas d’images sur les composants

- Sur Render → **Shell** (onglet) :
  ```bash
  npm run db:seed
  ```
- Ou redéploie le service (le build lance déjà le seed)

### Build Render échoue sur Prisma

- Vérifie que `DATABASE_URL` Neon est correcte
- L’URL doit contenir `?sslmode=require`

### Neon : "connection limit exceeded"

- Attends 1 min et réessaie (plan free limité en connexions)

---

# PARTIE 7 — CI/CD GitHub Actions (optionnel, bonus PDF)

Déjà configuré dans le repo. Pour activer le deploy auto :

1. GitHub → repo → **Settings** → **Secrets and variables** → **Actions**
2. Ajoute :
   - `RENDER_DEPLOY_HOOK_URL` — Render → service → Settings → **Deploy Hook** → copie l’URL
   - `VERCEL_TOKEN` — Vercel → Account Settings → **Tokens** → Create

Chaque push sur `main` relancera CI + deploy.

---

# PARTIE 8 — Récapitulatif des comptes à créer

1. ✅ GitHub (déjà fait)
2. ✅ Neon — base PostgreSQL gratuite
3. ✅ Render — API gratuite (instance **Free**)
4. ✅ Vercel — frontend gratuit

**Ordre recommandé :** GitHub push → Neon → Render → Vercel → corriger CORS

---

# PARTIE 9 — Commandes locales (développement)

```powershell
# Terminal 1 — Backend (avec URL Neon dans backend/.env)
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

- Site local : http://localhost:3000
- API local : http://localhost:3001

---

*Guide TechInventory — Xavier Favé — WWW Technologies TBU Zlín 2026*
