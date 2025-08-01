import { useEffect, useRef } from 'react';

export const usePerformanceMonitor = () => {
  const metricsRef = useRef({
    renderCount: 0,
    lastRenderTime: 0,
    slowRenders: 0
  });

  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      metricsRef.current.renderCount++;
      metricsRef.current.lastRenderTime = renderTime;
      
      if (renderTime > 16) { // Slower than 60fps
        metricsRef.current.slowRenders++;
      }
      
      // Log performance warnings
      if (renderTime > 100) {
        console.warn(`Slow render detected: ${renderTime.toFixed(2)}ms`);
      }
    };
  });

  return metricsRef.current;
};

export const useMemoryMonitor = () => {
  useEffect(() => {
    if (!performance.memory) return;

    const checkMemory = () => {
      const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = performance.memory;
      const usage = (usedJSHeapSize / jsHeapSizeLimit) * 100;
      
      if (usage > 80) {
        console.warn(`High memory usage: ${usage.toFixed(1)}%`);
      }
    };

    const interval = setInterval(checkMemory, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);
};

export const measureWebVitals = () => {
  // Largest Contentful Paint
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log('LCP:', lastEntry.startTime);
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  // First Input Delay
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      console.log('FID:', entry.processingStart - entry.startTime);
    });
  }).observe({ entryTypes: ['first-input'] });

  // Cumulative Layout Shift
  let clsValue = 0;
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    });
    console.log('CLS:', clsValue);
  }).observe({ entryTypes: ['layout-shift'] });
};