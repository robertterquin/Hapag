-- Phase 11/13 follow-up: grant the authenticated client role access to
-- user-owned tables. RLS policies still restrict every row to its owner.

grant usage on schema public to authenticated;
grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.user_preferences to authenticated;
grant select, insert, update, delete on table public.saved_recipes to authenticated;
grant select, insert, update, delete on table public.cooked_events to authenticated;
grant select, insert, update, delete on table public.pantry_items to authenticated;
