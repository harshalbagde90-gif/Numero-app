import { randomUUID } from 'node:crypto';
import {
  CURRENCY, PRICE_PAISE, customerFields, database, errorResponse, json,
  logServerError, razorpayKeyId, razorpayRequest, readBody,
} from '../server/numguru.js';

export async function POST(request) {
  try {
    const body = await readBody(request);
    const customer = customerFields(body);
    const db = database();
    const { data: savedCustomer, error: customerError } = await db
      .from('numguru_customers').insert(customer).select('id').single();
    if (customerError) throw customerError;

    const order = await razorpayRequest('/orders', {
      method: 'POST',
      body: JSON.stringify({ amount: PRICE_PAISE, currency: CURRENCY, receipt: `ng_${randomUUID().slice(0, 24)}` }),
    });
    if (!order.id || order.amount !== PRICE_PAISE || order.currency !== CURRENCY) {
      throw new Error('Razorpay returned an unexpected order');
    }

    const leadId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      .test(String(body.leadId || '')) ? body.leadId : null;
    const { error: paymentError } = await db.from('numguru_payments').insert({
      customer_id: savedCustomer.id,
      lead_id: leadId,
      razorpay_order_id: order.id,
      amount_paise: PRICE_PAISE,
      currency: CURRENCY,
      status: 'created',
    });
    if (paymentError) throw paymentError;
    return json({ orderId: order.id, amount: PRICE_PAISE, currency: CURRENCY, keyId: razorpayKeyId() }, 201);
  } catch (error) {
    logServerError('Order creation failed', error);
    return errorResponse('Payment setup is unavailable. Please try again later.', 503);
  }
}
