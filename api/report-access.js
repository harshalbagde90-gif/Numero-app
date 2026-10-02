import { database, errorResponse, hashToken, json, logServerError, readBody } from '../server/numguru.js';

export async function POST(request) {
  try {
    const body = await readBody(request);
    const token = String(body.token || '');
    if (!/^[a-f0-9]{64}$/i.test(token)) return errorResponse('Invalid report link', 403);
    const db = database();
    const { data: access, error: accessError } = await db.from('numguru_report_access')
      .select('customer_id,payment_id').eq('token_hash', hashToken(token)).single();
    if (accessError || !access) return errorResponse('Report link not found', 404);
    const [{ data: customer, error: customerError }, { data: payment, error: paymentError }] = await Promise.all([
      db.from('numguru_customers').select('name,date_of_birth,status').eq('id', access.customer_id).single(),
      db.from('numguru_payments').select('status').eq('id', access.payment_id).single(),
    ]);
    if (customerError || paymentError || !customer || !payment ||
        !['paid', 'promo'].includes(customer.status) || !['captured', 'promo'].includes(payment.status)) {
      return errorResponse('Report access is unavailable', 403);
    }
    return json({ name: customer.name, dob: customer.date_of_birth });
  } catch (error) {
    logServerError('Report lookup failed', error);
    return errorResponse('Could not open report', 503);
  }
}
