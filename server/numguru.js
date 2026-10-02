import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

export const PRICES = Object.freeze({
  INR: Object.freeze({ currency: 'INR', amount: 9900 }),
  USD: Object.freeze({ currency: 'USD', amount: 499 }),
});

export function priceForRequest(request) {
  // Vercel supplies the visitor's country to serverless functions. If it is
  // unavailable (for example, local development), keep the Indian price.
  const country = request.headers.get('x-vercel-ip-country')?.toUpperCase();
  return country && country !== 'IN' ? PRICES.USD : PRICES.INR;
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

export function errorResponse(message, status = 400) {
  return json({ error: message }, status);
}

export async function readBody(request) {
  if (request.headers.get('origin') && request.headers.get('origin') !== new URL(request.url).origin) {
    throw new Error('Invalid request origin');
  }
  const length = Number(request.headers.get('content-length') || 0);
  if (length > 16_384) throw new Error('Request too large');
  const body = await request.json();
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Invalid request');
  return body;
}

export function dateOfBirth(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('Invalid date of birth');
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== value ||
      value < '1900-01-01' || date > new Date()) throw new Error('Invalid date of birth');
  return value;
}

export function customerFields(body) {
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const phone = String(body.phone || '').trim();
  if (name.length < 2 || name.length > 120) throw new Error('Enter a valid name');
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid email');
  if (!/^\+?[0-9 ()-]{7,24}$/.test(phone)) throw new Error('Enter a valid phone number');
  return { name, email, phone, date_of_birth: dateOfBirth(body.dob) };
}

export function database() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !secret) throw new Error('Server database configuration is missing');
  return createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });
}

function razorpayCredentials() {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !secret || !/^rzp_(test|live)_/.test(keyId)) {
    throw new Error('Server Razorpay configuration is missing');
  }
  return { keyId, secret };
}

export function razorpayKeyId() {
  return razorpayCredentials().keyId;
}

export async function razorpayRequest(path, init = {}) {
  const { keyId, secret } = razorpayCredentials();
  const response = await fetch(`https://api.razorpay.com/v1${path}`, {
    ...init,
    headers: {
      authorization: `Basic ${Buffer.from(`${keyId}:${secret}`).toString('base64')}`,
      'content-type': 'application/json',
      ...init.headers,
    },
  });
  if (!response.ok) throw new Error(`Razorpay request failed (${response.status})`);
  return response.json();
}

export function validPaymentSignature(orderId, paymentId, signature) {
  if (typeof signature !== 'string' || !/^[a-f0-9]{64}$/i.test(signature)) return false;
  const expected = createHmac('sha256', razorpayCredentials().secret)
    .update(`${orderId}|${paymentId}`).digest();
  return timingSafeEqual(expected, Buffer.from(signature, 'hex'));
}

export function newReportToken() {
  const token = randomBytes(32).toString('hex');
  return { token, token_hash: hashToken(token) };
}

export function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

export function logServerError(label, error) {
  console.error(label, error instanceof Error ? error.message : 'Unknown error');
}
