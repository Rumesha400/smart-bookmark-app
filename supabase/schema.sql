-- Bookmarks table
create table public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  created_at timestamp with time zone default now()
);

-- Index for faster user-scoped queries
create index bookmarks_user_id_idx on public.bookmarks (user_id);

-- Enable Row Level Security
alter table public.bookmarks enable row level security;

-- Users can only see their own bookmarks
create policy "Users can view own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

-- Users can only insert their own bookmarks
create policy "Users can insert own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

-- Users can only delete their own bookmarks
create policy "Users can delete own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- Users can only update their own bookmarks
create policy "Users can update own bookmarks"
  on public.bookmarks for update
  using (auth.uid() = user_id);

-- Enable realtime for bookmarks table
alter publication supabase_realtime add table public.bookmarks;
