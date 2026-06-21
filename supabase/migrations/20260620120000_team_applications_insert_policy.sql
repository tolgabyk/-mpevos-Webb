-- impevos.com ekip başvurularının panele düşmesi için anon insert izni
-- ÖNCE 20260620100000_team_applications_setup.sql dosyasını çalıştırın!
-- Supabase Dashboard → SQL Editor'de çalıştırın

drop policy if exists "anon_insert_team_applications" on public.team_applications;

create policy "anon_insert_team_applications"
  on public.team_applications
  for insert
  to anon, authenticated
  with check (true);
