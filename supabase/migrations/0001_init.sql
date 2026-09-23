-- One South Sycamore: initial schema.
--
-- Three tables, all written only through the server (service role) or the
-- admin panel. RLS is on everywhere with no public policies, so the anon
-- key can't read or write any of it.

create table if not exists board_items (
  id uuid primary key default gen_random_uuid(),
  number int not null,
  name text not null,
  description text not null default '',
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists board_items_number_idx on board_items (number);

create table if not exists gallery_photos (
  id uuid primary key default gen_random_uuid(),
  -- Path inside the `gallery` storage bucket.
  storage_path text not null,
  category text not null,
  caption text not null default '',
  sort_order int not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists gallery_photos_category_idx on gallery_photos (category, sort_order);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  occasion text,
  message text not null,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_idx on contact_messages (created_at desc);

alter table board_items enable row level security;
alter table gallery_photos enable row level security;
alter table contact_messages enable row level security;

-- No policies are created on purpose: every read and write goes through the
-- service-role client on the server. Adding a public read policy for
-- board_items/gallery_photos is safe later if the site ever fetches them
-- from the browser.
