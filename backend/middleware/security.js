const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// CSRF protection middleware
const csrfProtection = (req, res, next) => {
  const token = req.header('X-CSRF-Token');
  if (!token && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    return res.status(403).json({ error: 'CSRF token required' });
  }
  next();
};

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      return obj
        .replace(/[<>\"'&]/g, (match) => {
          const entities = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
          return entities[match];
        })
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .replace(/<script[^>]*>.*?<\/script>/gi, '');
    }
    if (Array.isArray(obj)) {
      return obj.map(item => sanitize(item));
    }
    if (obj && typeof obj === 'object') {
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        const sanitizedKey = typeof key === 'string' ? key.replace(/[<>\"'&]/g, '_') : key;
        sanitized[sanitizedKey] = sanitize(value);
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.query) {
    req.query = sanitize(req.query);
  }
  if (req.params) {
    req.params = sanitize(req.params);
  }

  next();
};

// Security headers middleware
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      manifestSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Request validation middleware
const validateRequest = (req, res, next) => {
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /\.\.\//g,  // Path traversal
    /<script/gi, // Script injection
    /javascript:/gi, // JavaScript protocol
    /vbscript:/gi, // VBScript protocol
    /on\w+=/gi, // Event handlers
  ];

  const checkString = (str) => {
    return suspiciousPatterns.some(pattern => pattern.test(str));
  };

  const checkObject = (obj) => {
    if (typeof obj === 'string') {
      return checkString(obj);
    }
    if (Array.isArray(obj)) {
      return obj.some(item => checkObject(item));
    }
    if (obj && typeof obj === 'object') {
      return Object.values(obj).some(value => checkObject(value));
    }
    return false;
  };

  if (checkObject(req.body) || checkObject(req.query) || checkObject(req.params)) {
    return res.status(400).json({ error: 'Invalid request data' });
  }

  next();
};

module.exports = {
  authLimiter,
  generalLimiter,
  csrfProtection,
  sanitizeInput,
  securityHeaders,
  validateRequest
};