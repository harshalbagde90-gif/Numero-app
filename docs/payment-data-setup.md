# NumGuru customer and payment data setup

The website writes private data through Vercel functions in `api/`. The browser never receives a Supabase service key or Razorpay secret.

On 2026-10-02, the SQL in `supabase/migrations/20261002_customer_payments.sql` was applied to the live NumGuru project through Supabase SQL Editor. A follow-up query confirmed that all four tables exist with RLS enabled, `anon` cannot read them, and `service_role` can insert. The existing promo code remained in place; only `service_role` can execute promo redemption. The SQL Editor does not add an entry to Supabase's migration history.

A rollback-only SQL test inserted a linked lead, customer, payment, and report-access record successfully. A subsequent count query confirmed all four live tables still had zero rows, so the test left no customer data behind. This verifies the schema, not the undeployed website-to-API or Razorpay flow.

1. For a fresh environment, apply `supabase/migrations/20261002_customer_payments.sql` to Supabase project `oirxfaoorbzpfijlrchq` using the SQL Editor or the linked Supabase CLI. Confirm the four new tables appear: `numguru_leads`, `numguru_customers`, `numguru_payments`, and `numguru_report_access`. Existing `reviews` and `promo_codes` stay intact. This step is already complete for the live project.
2. In the Vercel project settings, set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_KEY_ID`, and `RAZORPAY_KEY_SECRET` for the appropriate deployment environments. Keep the existing public `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. The Razorpay ID and secret must belong to the **same** test or live key pair. Never commit or expose the secret keys as `VITE_` variables.
3. Deploy only after steps 1–2. The new checkout intentionally refuses to grant paid access when the server cannot verify payment.
4. Test the free sample and premium form with clearly labelled test data. Both should create rows in `numguru_leads`. At checkout, an order should create a customer row and a `created` payment row. A successful Razorpay test payment should change the payment to `captured`, the customer to `paid`, and create a report-access row. The report link should open on a fresh browser; editing an old `?v=` link must not unlock it. Promo codes should create a customer with `promo` status, a zero-amount `promo` payment, and a report-access row while incrementing usage once.
5. If a customer is charged but the report remains locked, search Razorpay for the payment ID and compare it with `numguru_payments`. The browser keeps the signed payment response and retries verification on the next visit. Do not mark a database row paid from a screenshot or client-side status alone.

The `numguru_report_access` table stores only a hash of each bearer token. Treat report URLs as private because anyone with the URL can open that report.

## First 50 promo campaign

Apply `supabase/migrations/20261005_numguru_first_50_promo.sql` before deploying the checkout code that calls `claim_numguru_promo_with_position`. The migration activates `NUMGURU100` for 50 successful claims, disables the unused `NUMGURU50` code, blocks repeat use by the same email, and returns the successful claim's position to the checkout. The database row lock and `NUMGURU100` check constraint enforce the cap even for simultaneous requests. Do not run the old scratch scripts that create `NUMGURU100` with 100 uses.

After deployment, verify without consuming a slot:

```sql
select code, usage_count, max_uses
from public.promo_codes
where upper(code) in ('NUMGURU50', 'NUMGURU100')
order by code;

select count(*) as recorded_claims
from public.numguru_payments
where status = 'promo' and upper(promo_code) = 'NUMGURU100';
```

`usage_count` should match `recorded_claims`; the limit must remain 50. Testing a real redemption consumes one of the 50 places, so use a separate test environment for a full 50th/51st end-to-end test.
