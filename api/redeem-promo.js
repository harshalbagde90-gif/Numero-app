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
    const { data, error } = await database().rpc('claim_numguru_promo_with_position', {
      p_code: code,
      p_name: customer.name,
      p_email: customer.email,
      p_phone: customer.phone,
      p_date_of_birth: customer.date_of_birth,
      p_token_hash: access.token_hash,
    });
    if (error) {
      if (/promo_code_invalid/.test(error.message)) return errorResponse('This promo code is not valid.');
      if (/promo_code_exhausted/.test(error.message)) {
        return errorResponse('Sorry, all 50 places for this promo code have been claimed.', 409);
      }
      if (/promo_already_used/.test(error.message)) {
        return errorResponse('This email has already used this promo code.', 409);
      }
      throw error;
    }
    return json({
      reportToken: access.token,
      position: Number.isInteger(data?.position) ? data.position : null,
      limit: Number.isInteger(data?.limit) ? data.limit : null,
    });
  } catch (error) {
    logServerError('Promo redemption failed', error);
    return errorResponse('Could not apply promo code. Please try again later.', 503);
  }
}
