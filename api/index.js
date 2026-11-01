import app from '../server/src/app.js';

export default function handler(req, res) {
  const requestUrl = new URL(req.url, 'http://localhost');
  const apiPath = requestUrl.searchParams.get('__vercel_api_path');

  if (!apiPath) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ success: false, message: 'API route not found.' }));
    return;
  }

  requestUrl.searchParams.delete('__vercel_api_path');
  const encodedPath = apiPath.split('/').map(encodeURIComponent).join('/');
  req.url = `/api/${encodedPath}${requestUrl.search}`;

  return app(req, res);
}
