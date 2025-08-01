/**
 * @fileoverview Custom hook for lazy loading components and resources
 * Improves initial page load performance by loading content on demand
 * @author Qmaker Team
 * @version 1.0.0
 * @since 2024
 */

import { useState, useEffect, useRef } from 'react';

/**
 * Lazy load component when it enters viewport
 * @param {Object} options - Intersection observer options
 * @returns {Object} { ref, isVisible, hasLoaded }
 */
export const useLazyLoad = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasLoaded(true);
          // Stop observing once loaded
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return { ref, isVisible, hasLoaded };
};

/**
 * Lazy load images with placeholder support
 * @param {string} src - Image source URL
 * @param {string} placeholder - Placeholder image URL
 * @returns {Object} { imgRef, isLoaded, error }
 */
export const useLazyImage = (src, placeholder = '') => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholder);
  const imgRef = useRef(null);

  const { ref, isVisible } = useLazyLoad();

  useEffect(() => {
    if (isVisible && src) {
      const img = new Image();
      img.onload = () => {
        setCurrentSrc(src);
        setIsLoaded(true);
      };
      img.onerror = () => {
        setError(true);
      };
      img.src = src;
    }
  }, [isVisible, src]);

  return { 
    ref, 
    imgRef, 
    src: currentSrc, 
    isLoaded, 
    error 
  };
};

/**
 * Preload resources when component mounts
 * @param {Array} resources - Array of resource URLs to preload
 * @returns {Object} { loadedResources, loadingProgress }
 */
export const usePreload = (resources = []) => {
  const [loadedResources, setLoadedResources] = useState(new Set());
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    if (resources.length === 0) return;

    const loadResource = (url) => {
      return new Promise((resolve, reject) => {
        if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          // Image preloading
          const img = new Image();
          img.onload = () => resolve(url);
          img.onerror = () => reject(url);
          img.src = url;
        } else if (url.match(/\.(woff|woff2|ttf|otf)$/i)) {
          // Font preloading
          const font = new FontFace('preload-font', `url(${url})`);
          font.load().then(() => resolve(url)).catch(() => reject(url));
        } else {
          // Generic resource preloading
          fetch(url)
            .then(() => resolve(url))
            .catch(() => reject(url));
        }
      });
    };

    const loadAll = async () => {
      const loaded = new Set();
      
      for (let i = 0; i < resources.length; i++) {
        try {
          const url = await loadResource(resources[i]);
          loaded.add(url);
        } catch (error) {
          console.warn(`Failed to preload resource: ${error}`);
        }
        
        setLoadedResources(new Set(loaded));
        setLoadingProgress(((i + 1) / resources.length) * 100);
      }
    };

    loadAll();
  }, [resources]);

  return { loadedResources, loadingProgress };
};

export default useLazyLoad;