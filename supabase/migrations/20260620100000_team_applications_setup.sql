-- 1) Tablo
create table if not exists public.team_applications (
  id uuid primary key default gen_random_uuid(),
  track text not null check (track in ('yazilim', 'pazarlama', 'aktif_proje', 'diger')),
  application_kind text,
  full_name text not null,
  email text not null,
  phone text,
  city text,
  age text,
  education text,
  linkedin_url text,
  github_url text,
  cv_url text,
  cv_storage_path text,
  availability text,
  message text,
  form_data jsonb,
  volunteer_consent boolean not null default false,
  source text not null default 'Web Sitesi',
  status text not null default 'new' check (status in (
    'new', 'reviewing', 'shortlisted', 'rejected', 'accepted'
  )),
  admin_note text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists team_applications_track_idx
  on public.team_applications (track, created_at desc);
create index if not exists team_applications_status_idx
  on public.team_applications (status, created_at desc);
create index if not exists team_applications_email_idx
  on public.team_applications (lower(email));

alter table public.team_applications enable row level security;
