create table if not exists public.orders (
  id text primary key,
  customer_name text not null,
  phone text not null,
  address text not null,
  village text not null,
  landmark text not null default '',
  notes text not null default '',
  items jsonb not null,
  subtotal_amount integer not null check (subtotal_amount > 0),
  total_amount integer not null check (total_amount > 0),
  payment_method text not null check (payment_method in ('pay_at_farm', 'razorpay')),
  payment_status text not null check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  order_status text not null check (order_status in ('pending_confirmation', 'confirmed', 'completed', 'cancelled')),
  gateway_order_id text unique,
  gateway_payment_id text unique,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;
revoke all on public.orders from anon, authenticated;
grant all on public.orders to service_role;

create index if not exists orders_created_at_idx on public.orders (created_at desc);