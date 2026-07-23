create table if not exists public.recipe_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_id text not null,
  feedback_type text not null check (feedback_type in ('helpful', 'not-relevant', 'missing-ingredient', 'not-filipino')),
  ingredients jsonb not null default '[]'::jsonb,
  candidate_dishes jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, recipe_id)
);

alter table public.recipe_feedback enable row level security;

drop policy if exists "Users can read their own recipe feedback" on public.recipe_feedback;
create policy "Users can read their own recipe feedback"
  on public.recipe_feedback for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can create their own recipe feedback" on public.recipe_feedback;
create policy "Users can create their own recipe feedback"
  on public.recipe_feedback for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own recipe feedback" on public.recipe_feedback;
create policy "Users can update their own recipe feedback"
  on public.recipe_feedback for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own recipe feedback" on public.recipe_feedback;
create policy "Users can delete their own recipe feedback"
  on public.recipe_feedback for delete to authenticated
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.recipe_feedback to authenticated;
