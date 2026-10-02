-- NumGuru's private form, customer, payment, and report-access records.
-- Apply to project oirxfaoorbzpfijlrchq before deploying the new checkout.
create table if not exists public.numguru_leads (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('free_sample', 'premium_form')),
  name text,
  date_of_birth date not null,
  created_at timestamptz not null default now()
);

create table if not exists public.numguru_customers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text not null,
  phone text not null,
  date_of_birth date not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'promo')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.numguru_payments (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.numguru_customers(id),
  lead_id uuid references public.numguru_leads(id),
  razorpay_order_id text unique,
  razorpay_payment_id text unique,
  amount_paise integer not null check (amount_paise >= 0),
  currency text not null default 'INR',
  status text not null check (status in ('created', 'captured', 'failed', 'promo')),
  promo_code text,
  created_at timestamptz not null default now(),
  captured_at timestamptz
);

create table if not exists public.numguru_report_access (
  token_hash text primary key check (length(token_hash) = 64),
  customer_id uuid not null references public.numguru_customers(id),
  payment_id uuid not null references public.numguru_payments(id),
  created_at timestamptz not null default now()
);

create index if not exists numguru_leads_created_at_idx on public.numguru_leads(created_at desc);
create index if not exists numguru_customers_email_idx on public.numguru_customers(email);
create index if not exists numguru_payments_customer_idx on public.numguru_payments(customer_id, created_at desc);
create index if not exists numguru_access_customer_idx on public.numguru_report_access(customer_id);

alter table public.numguru_leads enable row level security;
alter table public.numguru_customers enable row level security;
alter table public.numguru_payments enable row level security;
alter table public.numguru_report_access enable row level security;

-- All PII is written through server-side functions using a secret key.
revoke all on public.numguru_leads from anon, authenticated;
revoke all on public.numguru_customers from anon, authenticated;
revoke all on public.numguru_payments from anon, authenticated;
revoke all on public.numguru_report_access from anon, authenticated;
grant all on public.numguru_leads to service_role;
grant all on public.numguru_customers to service_role;
grant all on public.numguru_payments to service_role;
grant all on public.numguru_report_access to service_role;

-- Promo validation and usage changes now happen only inside the server RPC.
alter table public.promo_codes enable row level security;
revoke all on public.promo_codes from anon, authenticated;
grant select, update on public.promo_codes to service_role;

-- Redeem one existing promo code and persist its customer/report in one transaction.
create or replace function public.claim_numguru_promo(
  p_code text,
  p_name text,
  p_email text,
  p_phone text,
  p_date_of_birth date,
  p_token_hash text
) returns uuid
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_promo record;
  v_customer_id uuid;
  v_payment_id uuid;
begin
  select * into v_promo
    from public.promo_codes
   where upper(code) = upper(trim(p_code))
   for update;

  if not found then
    raise exception 'invalid_or_exhausted_promo';
  end if;
  if v_promo.max_uses is null or coalesce(v_promo.usage_count, 0) >= v_promo.max_uses then
    raise exception 'invalid_or_exhausted_promo';
  end if;

  insert into public.numguru_customers (email, name, phone, date_of_birth, status)
  values (lower(trim(p_email)), trim(p_name), trim(p_phone), p_date_of_birth, 'promo')
  returning id into v_customer_id;

  update public.promo_codes
     set usage_count = coalesce(usage_count, 0) + 1
   where id = v_promo.id;

  insert into public.numguru_payments
    (customer_id, amount_paise, currency, status, promo_code, captured_at)
  values (v_customer_id, 0, 'INR', 'promo', upper(trim(p_code)), now())
  returning id into v_payment_id;

  insert into public.numguru_report_access (token_hash, customer_id, payment_id)
  values (p_token_hash, v_customer_id, v_payment_id);

  return v_customer_id;
end;
$$;

revoke all on function public.claim_numguru_promo(text, text, text, text, date, text)
  from public, anon, authenticated;
grant execute on function public.claim_numguru_promo(text, text, text, text, date, text)
  to service_role;
