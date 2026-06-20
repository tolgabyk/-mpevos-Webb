-- Public form: RLS bypass via SECURITY DEFINER RPC
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
    coalesce(payload->>'source', 'impevos.com'),
    'new'
  )
  returning id into new_id;

  return new_id;
end;
$$;

revoke all on function public.submit_team_application(jsonb) from public;
grant execute on function public.submit_team_application(jsonb) to anon, authenticated;
