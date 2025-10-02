// XSS Protection Utility
const sanitizeHtml = (html) => {
  if (typeof html !== 'string') return html;
  
  // Basic HTML sanitization
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

const sanitizeText = (text) => {
  if (typeof text !== 'string') return text;
  
  // Remove potentially dangerous characters
  return text.replace(/[<>\"'&]/g, '');
};

const sanitizeObject = (obj) => {
  if (typeof obj === 'string') {
    return sanitizeText(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }
  
  return obj;
};

export { sanitizeHtml, sanitizeText, sanitizeObject };