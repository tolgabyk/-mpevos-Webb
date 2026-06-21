-- ============================================================
-- Ekip başvuruları — TEK SEFERDE KURULUM
-- Supabase Dashboard → SQL Editor → bu dosyanın tamamını çalıştırın
-- (impevosekip.me panelinin bağlı olduğu projede!)
-- ============================================================

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

-- 2) RLS — panel okuyabilsin, form yazabilsin
drop policy if exists "authenticated_read_team_applications" on public.team_applications;
drop policy if exists "anon_insert_team_applications" on public.team_applications;

create policy "authenticated_read_team_applications"
  on public.team_applications
  as permissive for select
  to authenticated
  using (true);

create policy "anon_insert_team_applications"
  on public.team_applications
  as permissive for insert
  to anon, authenticated
  with check (true);

-- 3) CV storage bucket
insert into storage.buckets (id, name, public, file_size_limit)
values ('team-cvs', 'team-cvs', false, 5242880)
on conflict (id) do update set file_size_limit = excluded.file_size_limit;

drop policy if exists "anon_upload_team_cvs" on storage.objects;

create policy "anon_upload_team_cvs"
  on storage.objects
  as permissive for insert
  to anon, authenticated
  with check (bucket_id = 'team-cvs');

-- 4) Form gönderimi RPC (RLS bypass — impevos.com API bunu kullanır)
create or replace function public.submit_team_application(payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  insert into public.team_applications (
    track,
    application_kind,
    full_name,
    email,
    phone,
    city,
    age,
    education,
    linkedin_url,
    github_url,
    cv_url,
    cv_storage_path,
    availability,
    message,
    form_data,
    volunteer_consent,
    source,
    status
  ) values (
    coalesce(payload->>'track', 'diger'),
    payload->>'application_kind',
    payload->>'full_name',
    payload->>'email',
    payload->>'phone',
    payload->>'city',
    payload->>'age',
    payload->>'education',
    payload->>'linkedin_url',
    payload->>'github_url',
    payload->>'cv_url',
    payload->>'cv_storage_path',
    payload->>'availability',
    payload->>'message',
    coalesce(payload->'form_data', '{}'::jsonb),
    coalesce((payload->>'volunteer_consent')::boolean, false),
    coalesce(payload->>'source', 'Web Sitesi'),
    'new'
  )
  returning id into new_id;

  return new_id;
end;
$$;

revoke all on function public.submit_team_application(jsonb) from public;
grant execute on function public.submit_team_application(jsonb) to anon, authenticated;
