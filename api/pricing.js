import { json, priceForRequest } from '../server/numguru.js';

export function GET(request) {
  return json(priceForRequest(request));
}
