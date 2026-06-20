-- CV dosyaları için storage bucket
insert into storage.buckets (id, name, public, file_size_limit)
values ('team-cvs', 'team-cvs', false, 5242880)
on conflict (id) do update set file_size_limit = excluded.file_size_limit;

drop policy if exists "anon_upload_team_cvs" on storage.objects;

create policy "anon_upload_team_cvs"
  on storage.objects
  for insert
  to anon, authenticated
  with check (bucket_id = 'team-cvs');
