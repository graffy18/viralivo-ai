create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text, display_name text, plan text not null default 'free',
  credits integer not null default 2, billing_period_start timestamptz, stripe_customer_id text, stripe_subscription_id text, created_at timestamptz not null default now()
);
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null, topic text not null, script text, status text not null default 'draft',
  created_at timestamptz not null default now()
);
create table if not exists public.project_assets (
  id uuid primary key default gen_random_uuid(), project_id uuid references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade, kind text not null,
  scene_id text, storage_path text, mime_type text, metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create table if not exists public.render_jobs (
  id uuid primary key default gen_random_uuid(), project_id uuid references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade, status text not null default 'queued',
  metadata jsonb not null default '{}'::jsonb,
  output_path text, error text, created_at timestamptz not null default now(), finished_at timestamptz
);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_assets enable row level security;
alter table public.render_jobs enable row level security;

drop policy if exists profiles_select_own on public.profiles; create policy profiles_select_own on public.profiles for select using (auth.uid()=id);
drop policy if exists profiles_update_own on public.profiles; create policy profiles_update_own on public.profiles for update using (auth.uid()=id);
drop policy if exists projects_select_own on public.projects; create policy projects_select_own on public.projects for select using (auth.uid()=user_id);
drop policy if exists projects_insert_own on public.projects; create policy projects_insert_own on public.projects for insert with check (auth.uid()=user_id);
drop policy if exists projects_update_own on public.projects; create policy projects_update_own on public.projects for update using (auth.uid()=user_id);
drop policy if exists projects_delete_own on public.projects; create policy projects_delete_own on public.projects for delete using (auth.uid()=user_id);
drop policy if exists assets_select_own on public.project_assets; create policy assets_select_own on public.project_assets for select using (auth.uid()=user_id);
drop policy if exists assets_insert_own on public.project_assets; create policy assets_insert_own on public.project_assets for insert with check (auth.uid()=user_id);
drop policy if exists assets_delete_own on public.project_assets; create policy assets_delete_own on public.project_assets for delete using (auth.uid()=user_id);
drop policy if exists jobs_select_own on public.render_jobs; create policy jobs_select_own on public.render_jobs for select using (auth.uid()=user_id);
drop policy if exists jobs_insert_own on public.render_jobs; create policy jobs_insert_own on public.render_jobs for insert with check (auth.uid()=user_id);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$ begin insert into public.profiles(id,email,credits) values(new.id,new.email,2); return new; end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
create or replace function public.consume_credit(p_user_id uuid) returns boolean language plpgsql security invoker as $$ declare updated_count integer; begin update public.profiles set credits=credits-1 where id=p_user_id and auth.uid()=p_user_id and credits>0; get diagnostics updated_count=row_count; return updated_count=1; end; $$;
grant execute on function public.consume_credit(uuid) to authenticated;

create index if not exists profiles_stripe_customer_idx on public.profiles(stripe_customer_id);
create index if not exists profiles_stripe_subscription_idx on public.profiles(stripe_subscription_id);
