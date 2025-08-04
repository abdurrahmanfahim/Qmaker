import { useEffect, useState } from 'react';

export const usePerformance = () => {
  const [metrics, setMetrics] = useState({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null
  });

  useEffect(() => {
    // Web Vitals monitoring
    if ('web-vitals' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP }) => {
        getCLS((metric) => setMetrics(prev => ({ ...prev, cls: metric.value })));
        getFID((metric) => setMetrics(prev => ({ ...prev, fid: metric.value })));
        getFCP((metric) => setMetrics(prev => ({ ...prev, fcp: metric.value })));
        getLCP((metric) => setMetrics(prev => ({ ...prev, lcp: metric.value })));
      });
    }

    // Memory usage monitoring
    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = performance.memory;
        if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
          console.warn('High memory usage detected');
        }
      }
    };

    const memoryInterval = setInterval(checkMemory, 30000);
    return () => clearInterval(memoryInterval);
  }, []);

  return metrics;
};

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};