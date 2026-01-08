
-- Create a table for transactions
create table public.transactions (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric not null check (amount > 0),
  type text not null check (type in ('income', 'expense')),
  category text not null,
  description text,
  date timestamptz not null default now(),
  is_confirmed boolean default true, -- "user confirmed data"
  created_at timestamptz not null default now(),
  
  primary key (id)
);

-- Enable Row Level Security
alter table public.transactions enable row level security;

-- Create Policy: Users can only view their own transactions
create policy "Users can view their own transactions"
on public.transactions for select
using (auth.uid() = user_id);

-- Create Policy: Users can insert their own transactions
create policy "Users can insert their own transactions"
on public.transactions for insert
with check (auth.uid() = user_id);

-- Create Policy: Users can update their own transactions
create policy "Users can update their own transactions"
on public.transactions for update
using (auth.uid() = user_id);

-- Create Policy: Users can delete their own transactions
create policy "Users can delete their own transactions"
on public.transactions for delete
using (auth.uid() = user_id);

-- Create indexes for performance
create index transactions_user_id_idx on public.transactions(user_id);
create index transactions_date_idx on public.transactions(date);
