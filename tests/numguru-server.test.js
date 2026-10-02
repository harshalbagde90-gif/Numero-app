import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import test from 'node:test';
import { customerFields, dateOfBirth, hashToken, newReportToken, priceForRequest, validPaymentSignature } from '../server/numguru.js';
import { POST as saveLead } from '../api/leads.js';
import { POST as createOrder } from '../api/create-order.js';
import { GET as getPricing } from '../api/pricing.js';

test('regional prices match the server quote and keep currency subunits', async () => {
  for (const [country, currency, amount] of [['IN', 'INR', 9900], ['US', 'USD', 499], ['GB', 'USD', 499]]) {
    const request = new Request('https://numguru.online/api/pricing', {
      headers: { 'x-vercel-ip-country': country },
    });
    assert.deepEqual(priceForRequest(request), { currency, amount });
    assert.deepEqual(await (await getPricing(request)).json(), { currency, amount });
  }
  assert.deepEqual(priceForRequest(new Request('http://localhost/api/pricing')), { currency: 'INR', amount: 9900 });
});

test('checkout creates and records the exact regional Razorpay amount', async () => {
  const previousFetch = globalThis.fetch;
  const previousEnv = Object.fromEntries(['SUPABASE_URL', 'SUPABASE_SECRET_KEY', 'RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET']
    .map((key) => [key, process.env[key]]));
  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SECRET_KEY = 'sb_secret_unit_test';
  process.env.RAZORPAY_KEY_ID = 'rzp_test_unit_test';
  process.env.RAZORPAY_KEY_SECRET = 'unit-test-secret';
  try {
    for (const [country, currency, amount] of [['IN', 'INR', 9900], ['US', 'USD', 499]]) {
      const calls = [];
      globalThis.fetch = async (input, init = {}) => {
        const url = String(input);
        const payload = init.body ? JSON.parse(init.body) : undefined;
        calls.push({ url, payload });
        if (url.includes('/numguru_customers')) {
          return new Response(JSON.stringify({ id: '11111111-1111-4111-8111-111111111111' }),
            { status: 201, headers: { 'content-type': 'application/json' } });
        }
        if (url === 'https://api.razorpay.com/v1/orders') {
          return new Response(JSON.stringify({ id: 'order_test', amount: payload.amount, currency: payload.currency }),
            { status: 200, headers: { 'content-type': 'application/json' } });
        }
        if (url.includes('/numguru_payments')) return new Response(null, { status: 201 });
        throw new Error(`Unexpected request: ${url}`);
      };
      const request = new Request('https://numguru.online/api/create-order', {
        method: 'POST',
        headers: { origin: 'https://numguru.online', 'x-vercel-ip-country': country },
        body: JSON.stringify({ name: 'Jane Doe', email: 'jane@example.com', phone: '+1 212 555 0199', dob: '1990-02-28' }),
      });
      const response = await createOrder(request);
      assert.equal(response.status, 201);
      assert.deepEqual(await response.json(), { orderId: 'order_test', amount, currency, keyId: 'rzp_test_unit_test' });
      assert.equal(calls.find(({ url }) => url.includes('api.razorpay.com')).payload.amount, amount);
      assert.equal(calls.find(({ url }) => url.includes('/numguru_payments')).payload.currency, currency);
    }
  } finally {
    globalThis.fetch = previousFetch;
    for (const [key, value] of Object.entries(previousEnv)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

test('validates customer details before storing them', () => {
  assert.deepEqual(customerFields({
    name: ' Jane Doe ', email: 'Jane@Example.com ', phone: '+1 212 555 0199', dob: '1990-02-28',
  }), {
    name: 'Jane Doe', email: 'jane@example.com', phone: '+1 212 555 0199', date_of_birth: '1990-02-28',
  });
  assert.throws(() => dateOfBirth('2001-02-29'));
  assert.throws(() => customerFields({ name: 'J', email: 'not-an-email', phone: '1', dob: '2001-02-01' }));
});

test('payment signature must match the exact order and payment', () => {
  const previousId = process.env.RAZORPAY_KEY_ID;
  const previousSecret = process.env.RAZORPAY_KEY_SECRET;
  process.env.RAZORPAY_KEY_ID = 'rzp_test_testkey';
  process.env.RAZORPAY_KEY_SECRET = 'unit-test-secret';
  try {
    const signature = createHmac('sha256', 'unit-test-secret').update('order_123|pay_456').digest('hex');
    assert.equal(validPaymentSignature('order_123', 'pay_456', signature), true);
    assert.equal(validPaymentSignature('order_123', 'pay_789', signature), false);
    assert.equal(validPaymentSignature('order_123', 'pay_456', 'invalid'), false);
  } finally {
    if (previousId === undefined) delete process.env.RAZORPAY_KEY_ID;
    else process.env.RAZORPAY_KEY_ID = previousId;
    if (previousSecret === undefined) delete process.env.RAZORPAY_KEY_SECRET;
    else process.env.RAZORPAY_KEY_SECRET = previousSecret;
  }
});

test('access token is random and only its hash is stored', () => {
  const first = newReportToken();
  const second = newReportToken();
  assert.notEqual(first.token, second.token);
  assert.equal(first.token_hash, hashToken(first.token));
  assert.notEqual(first.token, first.token_hash);
});

test('a malformed lead cannot reach the database', async () => {
  const request = new Request('https://numguru.online/api/leads', {
    method: 'POST', headers: { origin: 'https://numguru.online', 'content-type': 'application/json' },
    body: JSON.stringify({ source: 'other', dob: '1990-01-01' }),
  });
  const response = await saveLead(request);
  assert.equal(response.status, 400);
});
