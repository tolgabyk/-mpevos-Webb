-- Panel giriş yapmış kullanıcılar başvuruları okuyabilsin (RLS SELECT eksikti)
-- ÖNCE 20260620100000_team_applications_setup.sql dosyasını çalıştırın!
drop policy if exists "authenticated_read_team_applications" on public.team_applications;

create policy "authenticated_read_team_applications"
  on public.team_applications
  as permissive
  for select
  to authenticated
  using (true);
