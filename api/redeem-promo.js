import {
  customerFields, database, errorResponse, json, logServerError, newReportToken, readBody,
} from '../server/numguru.js';

export async function POST(request) {
  try {
    const body = await readBody(request);
    const customer = customerFields(body);
    const code = String(body.code || '').trim().toUpperCase();
    if (!/^[A-Z0-9_-]{3,40}$/.test(code)) return errorResponse('Invalid promo code');
    const access = newReportToken();
    const { error } = await database().rpc('claim_numguru_promo', {
      p_code: code,
      p_name: customer.name,
      p_email: customer.email,
      p_phone: customer.phone,
      p_date_of_birth: customer.date_of_birth,
      p_token_hash: access.token_hash,
    });
    if (error) {
      if (/invalid_or_exhausted_promo/.test(error.message)) return errorResponse('Invalid or exhausted promo code');
      throw error;
    }
    return json({ reportToken: access.token });
  } catch (error) {
    logServerError('Promo redemption failed', error);
    return errorResponse('Could not apply promo code. Please try again later.', 503);
  }
}
