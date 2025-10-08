const CACHE_NAME = 'qmaker-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Skip caching for API calls and dynamic content
  if (url.pathname.includes('/qsn/') || 
      url.pathname.includes('/api/') ||
      url.search.includes('nocache')) {
    return;
  }
  
  const allowedOrigins = [self.location.origin, 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'];
  
  if (!allowedOrigins.some(origin => url.origin === origin || url.href.startsWith(origin))) {
    return;
  }
  
  if (url.hostname === 'localhost' || 
      url.hostname === '127.0.0.1' ||
      url.hostname.startsWith('192.168.') ||
      url.hostname.startsWith('10.') ||
      url.hostname.startsWith('172.')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => new Response('Network error', { status: 408 }))
  );
});