-- One limited campaign: NUMGURU100 is valid for exactly 50 successful claims.
-- Retire the unused legacy code so it cannot create a second pool of free reports.
update public.promo_codes
   set max_uses = 0
 where upper(code) = 'NUMGURU50';

insert into public.promo_codes (code, usage_count, max_uses)
values ('NUMGURU100', 0, 50)
on conflict (code) do update set max_uses = 50;

alter table public.promo_codes
  add constraint numguru100_first_50_check
  check (upper(code) <> 'NUMGURU100' or
         (max_uses = 50 and usage_count is not null and usage_count between 0 and 50));

-- The row lock serializes claims, including the duplicate-email check.
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
    raise exception 'promo_code_invalid';
  end if;
  if v_promo.max_uses is null or v_promo.max_uses = 0 then
    raise exception 'promo_code_invalid';
  end if;
  if coalesce(v_promo.usage_count, 0) >= v_promo.max_uses then
    raise exception 'promo_code_exhausted';
  end if;
  if exists (
    select 1 from public.numguru_payments p
    join public.numguru_customers c on c.id = p.customer_id
    where p.status = 'promo'
      and upper(p.promo_code) = upper(v_promo.code)
      and lower(c.email) = lower(trim(p_email))
  ) then
    raise exception 'promo_already_used';
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

-- The inner function retains its promo-row lock until this call commits,
-- so usage_count here is the exact position of this successful redemption.
create or replace function public.claim_numguru_promo_with_position(
  p_code text,
  p_name text,
  p_email text,
  p_phone text,
  p_date_of_birth date,
  p_token_hash text
) returns jsonb
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_position integer;
  v_limit integer;
begin
  perform public.claim_numguru_promo(
    p_code, p_name, p_email, p_phone, p_date_of_birth, p_token_hash
  );

  select usage_count, max_uses into strict v_position, v_limit
    from public.promo_codes
   where upper(code) = upper(trim(p_code));

  return jsonb_build_object('position', v_position, 'limit', v_limit);
end;
$$;

revoke all on function public.claim_numguru_promo_with_position(text, text, text, text, date, text)
  from public, anon, authenticated;
grant execute on function public.claim_numguru_promo_with_position(text, text, text, text, date, text)
  to service_role;
