// Performance monitoring and optimization utilities
export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`${name}: ${end - start}ms`);
  return result;
};

export const lazyLoad = (importFn) => {
  return React.lazy(importFn);
};

export const preloadComponent = (componentImport) => {
  componentImport();
};