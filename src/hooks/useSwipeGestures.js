import { useEffect, useRef } from 'react';

/**
 * Custom hook for handling swipe gestures on mobile devices
 * @param {Object} options - Configuration options
 * @param {Function} options.onSwipeLeft - Callback for left swipe
 * @param {Function} options.onSwipeRight - Callback for right swipe  
 * @param {Function} options.onSwipeUp - Callback for up swipe
 * @param {Function} options.onSwipeDown - Callback for down swipe
 * @param {number} options.threshold - Minimum distance for swipe (default: 50)
 * @param {boolean} options.preventScroll - Prevent default scroll behavior
 * @returns {Object} - Ref to attach to swipeable element
 */
export const useSwipeGestures = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  preventScroll = false
}) => {
  const elementRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const touchEndRef = useRef({ x: 0, y: 0, time: 0 });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };
    };

    const handleTouchMove = (e) => {
      if (preventScroll) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e) => {
      const touch = e.changedTouches[0];
      touchEndRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };

      const deltaX = touchEndRef.current.x - touchStartRef.current.x;
      const deltaY = touchEndRef.current.y - touchStartRef.current.y;
      const deltaTime = touchEndRef.current.time - touchStartRef.current.time;

      // Ignore if touch was too slow (> 300ms) or too short
      if (deltaTime > 300 || (Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold)) {
        return;
      }

      // Determine swipe direction based on larger delta
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp();
        }
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventScroll });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, preventScroll]);

  return elementRef;
};

/**
 * Custom hook for pull-to-refresh functionality
 * @param {Function} onRefresh - Callback when refresh is triggered
 * @param {number} threshold - Pull distance threshold (default: 80)
 * @returns {Object} - Ref and refresh state
 */
export const usePullToRefresh = (onRefresh, threshold = 80) => {
  const elementRef = useRef(null);
  const startYRef = useRef(0);
  const currentYRef = useRef(0);
  const isPullingRef = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e) => {
      if (element.scrollTop === 0) {
        startYRef.current = e.touches[0].clientY;
        isPullingRef.useRef = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!isPullingRef.current) return;

      currentYRef.current = e.touches[0].clientY;
      const pullDistance = currentYRef.current - startYRef.current;

      if (pullDistance > 0 && element.scrollTop === 0) {
        e.preventDefault();
        
        // Add visual feedback
        element.style.transform = `translateY(${Math.min(pullDistance * 0.5, threshold)}px)`;
        element.style.transition = 'none';
        
        if (pullDistance > threshold) {
          element.style.opacity = '0.8';
        }
      }
    };

    const handleTouchEnd = () => {
      if (!isPullingRef.current) return;

      const pullDistance = currentYRef.current - startYRef.current;
      
      element.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      element.style.transform = 'translateY(0)';
      element.style.opacity = '1';

      if (pullDistance > threshold && onRefresh) {
        onRefresh();
      }

      isPullingRef.current = false;
      startYRef.current = 0;
      currentYRef.current = 0;
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onRefresh, threshold]);

  return elementRef;
};

/**
 * Custom hook for long press gestures
 * @param {Function} onLongPress - Callback for long press
 * @param {number} duration - Long press duration in ms (default: 500)
 * @returns {Object} - Event handlers to spread on element
 */
export const useLongPress = (onLongPress, duration = 500) => {
  const timeoutRef = useRef(null);
  const isLongPressRef = useRef(false);

  const start = (e) => {
    isLongPressRef.current = false;
    timeoutRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      onLongPress(e);
    }, duration);
  };

  const clear = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const clickHandler = (e) => {
    if (isLongPressRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return {
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchStart: start,
    onTouchEnd: clear,
    onTouchCancel: clear,
    onClick: clickHandler
  };
};