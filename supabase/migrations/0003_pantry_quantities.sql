-- Pantry quantity support. Existing rows are backfilled before constraints are added.

update public.pantry_items
set quantity = 1
where quantity is null or quantity <= 0;

update public.pantry_items
set unit = 'piece'
where unit is null or unit = '';

alter table public.pantry_items
  alter column quantity set default 1,
  alter column quantity set not null,
  alter column unit set default 'piece',
  alter column unit set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'pantry_items_quantity_positive'
      and conrelid = 'public.pantry_items'::regclass
  ) then
    alter table public.pantry_items
      add constraint pantry_items_quantity_positive check (quantity > 0);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'pantry_items_unit_allowed'
      and conrelid = 'public.pantry_items'::regclass
  ) then
    alter table public.pantry_items
      add constraint pantry_items_unit_allowed check (
        unit in ('piece', 'can', 'pack', 'bottle', 'bundle', 'clove', 'cup', 'gram', 'kilogram', 'block')
      );
  end if;
end $$;
