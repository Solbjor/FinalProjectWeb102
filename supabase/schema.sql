-- Run this in the Supabase SQL editor when you're ready to connect the backend.
create table posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  content text,
  image_url text,
  upvotes integer not null default 0
);

create table comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  content text not null
);

-- Open policies for a no-login forum. Tighten these if you add auth.
alter table posts enable row level security;
alter table comments enable row level security;
create policy "public posts" on posts for all using (true) with check (true);
create policy "public comments" on comments for all using (true) with check (true);

-- Atomic upvote
create function increment_upvotes(post_id uuid) returns integer
language sql as $$
  update posts set upvotes = upvotes + 1 where id = post_id returning upvotes;
$$;
