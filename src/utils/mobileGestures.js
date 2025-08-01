/**
 * Mobile gesture utilities for swipe navigation and touch interactions
 */

export class MobileGestures {
  constructor() {
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
    this.minSwipeDistance = 50;
  }

  /**
   * Add swipe gesture support to an element
   */
  addSwipeSupport(element, callbacks) {
    const handleTouchStart = (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
      this.touchStartY = e.changedTouches[0].screenY;
    };

    const handleTouchEnd = (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.touchEndY = e.changedTouches[0].screenY;
      this.handleSwipe(callbacks);
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }

  /**
   * Determine swipe direction and trigger callback
   */
  handleSwipe(callbacks) {
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;
    
    // Only trigger if horizontal swipe is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.minSwipeDistance) {
      if (deltaX > 0) {
        callbacks.onSwipeRight?.();
      } else {
        callbacks.onSwipeLeft?.();
      }
    }
  }

  /**
   * Add pull-to-refresh support
   */
  addPullToRefresh(element, onRefresh) {
    let startY = 0;
    let currentY = 0;
    let isRefreshing = false;

    const handleTouchStart = (e) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      currentY = e.touches[0].clientY;
      const pullDistance = currentY - startY;
      
      if (pullDistance > 100 && element.scrollTop === 0 && !isRefreshing) {
        // Show refresh indicator
        element.style.transform = `translateY(${Math.min(pullDistance - 100, 50)}px)`;
      }
    };

    const handleTouchEnd = () => {
      const pullDistance = currentY - startY;
      
      if (pullDistance > 100 && element.scrollTop === 0 && !isRefreshing) {
        isRefreshing = true;
        onRefresh().finally(() => {
          isRefreshing = false;
          element.style.transform = '';
        });
      } else {
        element.style.transform = '';
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }

  /**
   * Add long press support
   */
  addLongPress(element, onLongPress, delay = 500) {
    let pressTimer = null;

    const handleTouchStart = (e) => {
      pressTimer = setTimeout(() => {
        onLongPress(e);
      }, delay);
    };

    const handleTouchEnd = () => {
      if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    element.addEventListener('touchmove', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchmove', handleTouchEnd);
      if (pressTimer) {
        clearTimeout(pressTimer);
      }
    };
  }
}

export default new MobileGestures();