-- Idempotency table for Shopify credit pack orders processed by the webhook
create table public.shopify_credit_orders (
  id uuid primary key default gen_random_uuid(),
  shopify_order_id text not null unique,
  user_id uuid not null references auth.users(id) on delete cascade,
  price_id text not null,
  credits_granted int not null default 0,
  unlimited boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_shopify_credit_orders_user
  on public.shopify_credit_orders(user_id);

create index idx_shopify_credit_orders_order
  on public.shopify_credit_orders(shopify_order_id);

alter table public.shopify_credit_orders enable row level security;

create policy "Admins can view credit orders"
  on public.shopify_credit_orders for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Insert is service-role only (webhook uses SUPABASE_SERVICE_ROLE_KEY)
