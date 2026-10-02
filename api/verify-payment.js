import {
  CURRENCY, PRICE_PAISE, database, errorResponse, json, logServerError,
  newReportToken, razorpayRequest, readBody, validPaymentSignature,
} from '../server/numguru.js';

export async function POST(request) {
  try {
    const body = await readBody(request);
    const orderId = String(body.razorpay_order_id || '');
    const paymentId = String(body.razorpay_payment_id || '');
    if (!/^order_[\w-]+$/.test(orderId) || !/^pay_[\w-]+$/.test(paymentId) ||
        !validPaymentSignature(orderId, paymentId, body.razorpay_signature)) {
      return errorResponse('Payment verification failed', 403);
    }

    const db = database();
    const { data: order, error: orderError } = await db.from('numguru_payments')
      .select('id,customer_id,status,amount_paise,currency,razorpay_payment_id')
      .eq('razorpay_order_id', orderId).single();
    if (orderError || !order || order.amount_paise !== PRICE_PAISE || order.currency !== CURRENCY ||
        (order.razorpay_payment_id && order.razorpay_payment_id !== paymentId)) {
      return errorResponse('Payment order not found', 404);
    }

    const payment = await razorpayRequest(`/payments/${encodeURIComponent(paymentId)}`);
    if (payment.order_id !== orderId || payment.amount !== PRICE_PAISE ||
        payment.currency !== CURRENCY || payment.status !== 'captured') {
      return errorResponse('Payment is not captured yet', 409);
    }

    const { error: updateError } = await db.from('numguru_payments').update({
      razorpay_payment_id: paymentId, status: 'captured', captured_at: new Date().toISOString(),
    }).eq('id', order.id);
    if (updateError) throw updateError;
    const { error: customerError } = await db.from('numguru_customers')
      .update({ status: 'paid', updated_at: new Date().toISOString() }).eq('id', order.customer_id);
    if (customerError) throw customerError;

    const access = newReportToken();
    const { error: accessError } = await db.from('numguru_report_access').insert({
      token_hash: access.token_hash, customer_id: order.customer_id, payment_id: order.id,
    });
    if (accessError) throw accessError;
    return json({ reportToken: access.token });
  } catch (error) {
    logServerError('Payment verification failed', error);
    return errorResponse('Could not verify payment. Contact support with your payment ID.', 503);
  }
}
