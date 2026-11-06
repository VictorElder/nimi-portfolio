-- Nimi portfolio admin: run once in the Supabase SQL Editor.

create table if not exists public.admin_members (
  email text primary key check (email = lower(trim(email))),
  role text not null check (role in ('owner', 'admin', 'manager')),
  created_at timestamptz not null default now()
);

alter table public.admin_members enable row level security;
revoke all on public.admin_members from anon, authenticated;
grant all on public.admin_members to service_role;

create table if not exists public.design_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null,
  description text not null,
  image_url text not null,
  sort_order integer not null default 0 check (sort_order >= 0),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.design_projects enable row level security;
revoke all on public.design_projects from anon, authenticated;
grant select on public.design_projects to anon, authenticated;
grant all on public.design_projects to service_role;

drop policy if exists "Published designs are visible to everyone" on public.design_projects;
create policy "Published designs are visible to everyone"
  on public.design_projects for select to anon, authenticated
  using (is_published = true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-designs',
  'portfolio-designs',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- The original project gallery stays intact after connecting Supabase.
insert into public.design_projects (title, type, description, image_url, sort_order, is_published)
select seed.title, seed.type, seed.description, seed.image_url, seed.sort_order, true
from (values
  (
    'Rare Bites',
    'Restaurant launch campaign',
    'An opening announcement designed to make the menu the hero. Soft pink tones, oversized type, and modular food imagery create a friendly, immediate prompt to order.',
    '/images/nimi-job-rare-bites.jpg',
    0
  ),
  (
    'Bexgaming',
    'Esports tournament poster',
    'A tournament listing reimagined as an event identity. High-contrast typography, electric green accents, and athlete-led imagery build momentum before match day.',
    '/images/nimi-job-bexgaming.jpg',
    1
  ),
  (
    'Dpastry Paradise',
    'Bakery brand promotion',
    'A single promotional visual that gives the full product range a delicious sense of scale. The warm palette and clear hierarchy make every offer easy to discover.',
    '/images/nimi-job-dpastry.jpg',
    2
  ),
  (
    'The Fragrance House',
    'Luxury retail campaign',
    'A luxury retail visual that positions fragrance as an experience, not just a product. Editorial typography and a cinematic Paris setting create a premium, aspirational mood.',
    '/images/nimi-job-fragrance-house.jpg',
    3
  )
) as seed(title, type, description, image_url, sort_order)
where not exists (
  select 1 from public.design_projects existing where existing.title = seed.title
);
