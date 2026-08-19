# -mpevos-Webb

İmpevos kurumsal web sitesi — ekip başvurusu, staj formu ve CRM (Supabase) entegrasyonu.

## Stack

- **Frontend:** React + Vite (`client/`)
- **API:** Vercel serverless (`api/`, `client/api/`)
- **Veritabanı:** Supabase (`team_applications`)

## Kurulum

```bash
cd client && npm install && npm run dev
```

## Supabase

Yeni projede bir kez çalıştırın:

`supabase/setup_team_applications_complete.sql`

## Vercel env

```
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...  # CV storage (opsiyonel)
```
