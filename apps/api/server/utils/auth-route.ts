import { auth } from './auth';

const allowedOrigins = [process.env['APP_URL']];

export default {
  fetch: async (request: Request) => {
    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }

    const response = await auth.handler(request);

    // Merge CORS headers. Better Auth returns its own Response, which bypasses
    // Nitro middleware header merging, so we add them here explicitly.
    const headers = corsHeaders(request, response);

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};

function corsHeaders(request: Request, response?: Response): Headers {
  const origin = request.headers.get('origin');
  const headers = new Headers(response?.headers);

  if (origin && allowedOrigins.includes(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Vary', 'Origin');
  }
  headers.set('Access-Control-Allow-Credentials', 'true');
  headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS',
  );
  headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, x-captcha-response',
  );

  return headers;
}
