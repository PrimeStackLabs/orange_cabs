export const redactSensitiveLogValue = (value) => String(value ?? '')
  .replace(/mongodb(?:\+srv)?:\/\/[^\s"'<>]+/gi, '[MongoDB URI redacted]')
  .replace(/\bBearer\s+[A-Za-z0-9._~+/-]+=*/gi, 'Bearer [redacted]')
  .replace(/\b(password|passwd|token|secret|api[_-]?key)\b\s*[:=]\s*[^,\s;]+/gi, '$1=[redacted]');

export const errorHandler = (err, req, res, next) => {

  let statusCode = err.statusCode || err.status || (res.statusCode === 200 ? 500 : res.statusCode);
  let message = err.publicMessage || err.message || 'Internal Server Error';

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found with id of ${err.value}`;
  }

  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value entered for ${field}`;
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  console.error('[API Error]', JSON.stringify({
    method: req.method,
    path: req.path,
    statusCode,
    error: err.name || 'Error',
    message: redactSensitiveLogValue(err.message)
  }));

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' || process.env.VERCEL === '1' ? null : err.stack
  });
};
