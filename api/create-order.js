import { randomUUID } from 'node:crypto';
import {
  customerFields, database, errorResponse, json, priceForRequest,
  logServerError, razorpayKeyId, razorpayRequest, readBody,
} from '../server/numguru.js';

export async function POST(request) {
  try {
    const body = await readBody(request);
    const price = priceForRequest(request);
    const customer = customerFields(body);
    const db = database();
    const { data: savedCustomer, error: customerError } = await db
      .from('numguru_customers').insert(customer).select('id').single();
    if (customerError) throw customerError;

    const order = await razorpayRequest('/orders', {
      method: 'POST',
      body: JSON.stringify({ amount: price.amount, currency: price.currency, receipt: `ng_${randomUUID().slice(0, 24)}` }),
    });
    if (!order.id || order.amount !== price.amount || order.currency !== price.currency) {
      throw new Error('Razorpay returned an unexpected order');
    }

    const leadId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      .test(String(body.leadId || '')) ? body.leadId : null;
    const { error: paymentError } = await db.from('numguru_payments').insert({
      customer_id: savedCustomer.id,
      lead_id: leadId,
      razorpay_order_id: order.id,
      amount_paise: price.amount,
      currency: price.currency,
      status: 'created',
    });
    if (paymentError) throw paymentError;
    return json({ orderId: order.id, amount: price.amount, currency: price.currency, keyId: razorpayKeyId() }, 201);
  } catch (error) {
    logServerError('Order creation failed', error);
    return errorResponse('Payment setup is unavailable. Please try again later.', 503);
  }
}
