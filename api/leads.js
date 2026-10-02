import { database, dateOfBirth, errorResponse, json, logServerError, readBody } from '../server/numguru.js';

export async function POST(request) {
  try {
    const body = await readBody(request);
    if (body.source !== 'free_sample' && body.source !== 'premium_form') {
      return errorResponse('Invalid form source');
    }
    const name = body.source === 'premium_form' ? String(body.name || '').trim() : null;
    if (body.source === 'premium_form' && (!name || name.length > 120)) {
      return errorResponse('Enter a valid name');
    }
    const { data, error } = await database().from('numguru_leads')
      .insert({ source: body.source, name, date_of_birth: dateOfBirth(body.dob) })
      .select('id').single();
    if (error) throw error;
    return json({ leadId: data.id }, 201);
  } catch (error) {
    logServerError('Lead save failed', error);
    return errorResponse(error instanceof SyntaxError ? 'Invalid request' : 'Could not save form data', 500);
  }
}
