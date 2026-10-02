import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import test from 'node:test';
import { customerFields, dateOfBirth, hashToken, newReportToken, validPaymentSignature } from '../server/numguru.js';
import { POST as saveLead } from '../api/leads.js';

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
