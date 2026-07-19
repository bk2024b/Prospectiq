# ProspectIQ — squelette MVP

*Your AI Sales Agent for Local Businesses.*

## Architecture

```
┌─────────────────┐        ┌──────────────────┐        ┌─────────────┐
│  Next.js (Vercel)│──API──▶│ Worker (hébergé)  │──écrit▶│  Supabase   │
│  recherche, liste,│◀──────│ Playwright,       │        │  (Postgres  │
│  fiche prospect   │  lit   │ scraping direct   │        │   + RLS)    │
└─────────────────┘        └──────────────────┘        └─────────────┘
```

- **App (ce dossier)** : Next.js 14 (App Router) + Tailwind + Supabase.
  Recherche, tableau de prospects, fiche détaillée avec score expliqué.
- **Worker (`/worker`)** : à construire ensuite — service Node hébergé
  (Railway/Fly.io/Render) qui fait le scraping Google Maps direct et écrit
  dans Supabase. Volontairement hors de Vercel : un scraping dépasse les
  limites de temps d'une fonction serverless.
- **Supabase** : base multi-tenant dès le départ (`user_id` + RLS sur
  chaque table) — même schéma que tu utiliseras avec de vrais clients
  payants demain, pas juste pour ton usage perso aujourd'hui.

## Schéma de données

Voir `supabase/schema.sql` :
- `searches` — une recherche niche + ville
- `prospects` — les entreprises trouvées
- `audits` — résultat de l'analyse du site (HTTPS, responsive, vitesse, SEO)
- `scores` — score d'opportunité + raisons expliquées (`lib/scoring.ts`)

## Démarrage

```bash
npm install
cp .env.example .env.local   # remplir avec tes clés Supabase
npm run dev
```

Puis dans le SQL editor de Supabase, exécute `supabase/schema.sql`.

## État d'avancement

1. ✅ **Worker de scraping** (`/worker`) — service Node+Playwright hébergé,
   scraping direct de Google Maps, écrit dans `prospects` et calcule un
   premier score. Voir `worker/README.md` pour le déploiement.
2. ✅ **Logique de scoring** — moteur de règles (`lib/scoring.ts`, dupliqué
   dans `worker/src/scoring.ts` puisque le worker déploie séparément).
3. ⬜ **Module d'audit Lighthouse** — analyse du site de chaque prospect
   (HTTPS, responsive, vitesse, SEO) pour affiner le score au-delà des
   seuls signaux de scraping. Prochaine étape.
4. ⬜ **Auth** — la page d'accueil suppose un utilisateur connecté
   (`supabase.auth.getUser()`) ; l'écran de connexion Supabase Auth reste à
   brancher.

## Volontairement hors scope pour le MVP

Générateurs de messages (email/WhatsApp/LinkedIn), export PDF, relances
automatiques, extension Chrome, comparaison de chaînes multi-métiers — tout
ça vient après que le cœur (recherche → score → fiche prospect) soit validé
sur de vrais prospects.
