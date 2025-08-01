// Tree-shaking optimized imports
export const optimizedImports = {
  // Only import specific icons instead of entire library
  heroicons: {
    outline: [
      'PlusIcon',
      'DocumentTextIcon', 
      'EyeIcon',
      'ShareIcon',
      'TrashIcon'
    ],
    solid: [
      'DocumentTextIcon',
      'EyeIcon'
    ]
  }
};

// Preload critical resources
export const preloadCriticalResources = () => {
  // Preload fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.href = '/fonts/roboto.woff2';
  fontLink.as = 'font';
  fontLink.type = 'font/woff2';
  fontLink.crossOrigin = 'anonymous';
  document.head.appendChild(fontLink);

  // Preload critical CSS
  const cssLink = document.createElement('link');
  cssLink.rel = 'preload';
  cssLink.href = '/static/css/main.css';
  cssLink.as = 'style';
  document.head.appendChild(cssLink);
};

// Code splitting by route
export const routeBasedSplitting = {
  '/': () => import('../components/WelcomeScreen'),
  '/editor': () => import('../components/SectionEditor'),
  '/preview': () => import('../components/EnhancedPreview'),
  '/templates': () => import('../components/TemplateGallery')
};

// Optimize images
export const optimizeImage = (src, width = 400, quality = 80) => {
  if (src.startsWith('data:')) return src;
  
  // Use modern image formats when supported
  const supportsWebP = document.createElement('canvas')
    .toDataURL('image/webp')
    .indexOf('data:image/webp') === 0;
  
  const format = supportsWebP ? 'webp' : 'jpg';
  return `${src}?w=${width}&q=${quality}&f=${format}`;
};

// Debounce expensive operations
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle scroll events
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};