-- Hapag Phase 11 master schema.
-- Apply with the Supabase SQL editor or: npx supabase db push

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  language text not null default 'Taglish' check (language in ('Taglish', 'Tagalog', 'English')),
  default_servings integer not null default 3 check (default_servings between 1 and 20),
  dietary_preference text not null default 'none' check (dietary_preference in ('none', 'vegetarian', 'low-sodium', 'diabetic-friendly')),
  allergies text[] not null default '{}',
  spice_level text not null default 'mild' check (spice_level in ('mild', 'medium', 'hot')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.saved_recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_id text not null,
  title text not null,
  source text not null check (source in ('fixture', 'ai')),
  recipe_snapshot jsonb not null check (jsonb_typeof(recipe_snapshot) = 'object'),
  is_favorite boolean not null default true,
  saved_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, recipe_id)
);

create table if not exists public.cooked_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_id text not null,
  recipe_snapshot jsonb not null check (jsonb_typeof(recipe_snapshot) = 'object'),
  servings integer not null default 3 check (servings between 1 and 20),
  cooked_at timestamptz not null default timezone('utc', now()),
  notes text
);

create table if not exists public.pantry_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  ingredient_name text not null,
  canonical_name text not null,
  quantity numeric,
  unit text,
  confidence text not null default 'high' check (confidence in ('high', 'medium', 'low')),
  available boolean not null default true,
  expires_at date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, canonical_name)
);

create index if not exists saved_recipes_user_saved_at_idx on public.saved_recipes (user_id, saved_at desc);
create index if not exists cooked_events_user_cooked_at_idx on public.cooked_events (user_id, cooked_at desc);
create index if not exists pantry_items_user_created_at_idx on public.pantry_items (user_id, created_at desc);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists preferences_set_updated_at on public.user_preferences;
create trigger preferences_set_updated_at before update on public.user_preferences for each row execute function public.set_updated_at();
drop trigger if exists saved_recipes_set_updated_at on public.saved_recipes;
create trigger saved_recipes_set_updated_at before update on public.saved_recipes for each row execute function public.set_updated_at();
drop trigger if exists pantry_items_set_updated_at on public.pantry_items;
create trigger pantry_items_set_updated_at before update on public.pantry_items for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  insert into public.user_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.saved_recipes enable row level security;
alter table public.cooked_events enable row level security;
alter table public.pantry_items enable row level security;

grant usage on schema public to authenticated;
grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.user_preferences to authenticated;
grant select, insert, update, delete on table public.saved_recipes to authenticated;
grant select, insert, update, delete on table public.cooked_events to authenticated;
grant select, insert, update, delete on table public.pantry_items to authenticated;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles for select to authenticated using ((select auth.uid()) = id);
drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

drop policy if exists preferences_select_own on public.user_preferences;
create policy preferences_select_own on public.user_preferences for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists preferences_insert_own on public.user_preferences;
create policy preferences_insert_own on public.user_preferences for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists preferences_update_own on public.user_preferences;
create policy preferences_update_own on public.user_preferences for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists saved_recipes_select_own on public.saved_recipes;
create policy saved_recipes_select_own on public.saved_recipes for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists saved_recipes_insert_own on public.saved_recipes;
create policy saved_recipes_insert_own on public.saved_recipes for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists saved_recipes_update_own on public.saved_recipes;
create policy saved_recipes_update_own on public.saved_recipes for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists saved_recipes_delete_own on public.saved_recipes;
create policy saved_recipes_delete_own on public.saved_recipes for delete to authenticated using ((select auth.uid()) = user_id);

drop policy if exists cooked_events_select_own on public.cooked_events;
create policy cooked_events_select_own on public.cooked_events for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists cooked_events_insert_own on public.cooked_events;
create policy cooked_events_insert_own on public.cooked_events for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists cooked_events_delete_own on public.cooked_events;
create policy cooked_events_delete_own on public.cooked_events for delete to authenticated using ((select auth.uid()) = user_id);

drop policy if exists pantry_items_select_own on public.pantry_items;
create policy pantry_items_select_own on public.pantry_items for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists pantry_items_insert_own on public.pantry_items;
create policy pantry_items_insert_own on public.pantry_items for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists pantry_items_update_own on public.pantry_items;
create policy pantry_items_update_own on public.pantry_items for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists pantry_items_delete_own on public.pantry_items;
create policy pantry_items_delete_own on public.pantry_items for delete to authenticated using ((select auth.uid()) = user_id);
