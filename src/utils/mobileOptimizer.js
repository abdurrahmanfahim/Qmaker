/**
 * Mobile optimization utilities for Qmaker
 * Handles responsive behavior, touch interactions, and mobile-specific features
 */

class MobileOptimizer {
  constructor() {
    this.isMobile = this.detectMobile();
    this.touchStartY = 0;
    this.touchStartX = 0;
    this.init();
  }

  /**
   * Initialize mobile optimizations
   */
  init() {
    if (this.isMobile) {
      this.setupTouchHandlers();
      this.optimizeViewport();
      this.setupSwipeGestures();
      this.optimizeScrolling();
    }
  }

  /**
   * Detect if device is mobile
   */
  detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth < 768;
  }

  /**
   * Setup touch event handlers
   */
  setupTouchHandlers() {
    // Prevent zoom on double tap for buttons
    document.addEventListener('touchend', (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        e.preventDefault();
      }
    });

    // Improve touch responsiveness
    document.addEventListener('touchstart', (e) => {
      this.touchStartY = e.touches[0].clientY;
      this.touchStartX = e.touches[0].clientX;
    }, { passive: true });
  }

  /**
   * Optimize viewport settings
   */
  optimizeViewport() {
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }
    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
  }

  /**
   * Setup swipe gestures for section navigation
   */
  setupSwipeGestures() {
    const sectionTabs = document.querySelector('[data-testid="section-tabs"]');
    if (!sectionTabs) return;

    let startX = 0;
    let startY = 0;

    sectionTabs.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    sectionTabs.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      
      // Only trigger swipe if horizontal movement is greater than vertical
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          this.navigateSection('prev');
        } else {
          this.navigateSection('next');
        }
      }
    }, { passive: true });
  }

  /**
   * Navigate between sections
   */
  navigateSection(direction) {
    const tabs = document.querySelectorAll('[data-testid="section-tab"]');
    const activeTab = document.querySelector('[data-testid="section-tab"].active');
    
    if (!activeTab || tabs.length <= 1) return;
    
    const currentIndex = Array.from(tabs).indexOf(activeTab);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = currentIndex + 1 < tabs.length ? currentIndex + 1 : 0;
    } else {
      newIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : tabs.length - 1;
    }
    
    tabs[newIndex].click();
  }

  /**
   * Optimize scrolling behavior
   */
  optimizeScrolling() {
    // Smooth scrolling for iOS
    document.documentElement.style.webkitOverflowScrolling = 'touch';
    
    // Prevent overscroll bounce
    document.body.addEventListener('touchmove', (e) => {
      if (e.target === document.body) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  /**
   * Check if touch targets meet accessibility guidelines
   */
  validateTouchTargets() {
    const issues = [];
    const buttons = document.querySelectorAll('button, a, input, select, textarea');
    
    buttons.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      const minSize = 44; // WCAG AA standard
      
      if (rect.width < minSize || rect.height < minSize) {
        issues.push({
          element: element.tagName.toLowerCase(),
          index,
          size: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
          required: `${minSize}x${minSize}`
        });
      }
    });
    
    return issues;
  }

  /**
   * Optimize mobile layout
   */
  optimizeMobileLayout() {
    if (!this.isMobile) return;

    // Add mobile-specific classes
    document.body.classList.add('mobile-optimized');
    
    // Optimize header for mobile
    const header = document.querySelector('header');
    if (header) {
      header.style.position = 'sticky';
      header.style.top = '0';
      header.style.zIndex = '1000';
    }
    
    // Optimize modals for mobile
    const modals = document.querySelectorAll('[role="dialog"]');
    modals.forEach(modal => {
      modal.style.maxHeight = '90vh';
      modal.style.overflowY = 'auto';
    });
  }

  /**
   * Handle orientation changes
   */
  handleOrientationChange() {
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        // Recalculate layout after orientation change
        this.optimizeMobileLayout();
        
        // Trigger resize event for components
        window.dispatchEvent(new Event('resize'));
      }, 100);
    });
  }

  /**
   * Optimize mobile export experience
   */
  optimizeMobileExport() {
    const exportButtons = document.querySelectorAll('[data-testid="export-button"]');
    
    exportButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        if (this.isMobile) {
          // Show mobile-friendly loading state
          this.showMobileExportLoading(button);
        }
      });
    });
  }

  /**
   * Show mobile export loading state
   */
  showMobileExportLoading(button) {
    const originalText = button.textContent;
    button.textContent = 'Preparing...';
    button.disabled = true;
    
    // Create progress indicator
    const progress = document.createElement('div');
    progress.className = 'mobile-export-progress';
    progress.innerHTML = `
      <div class="progress-bar">
        <div class="progress-fill"></div>
      </div>
      <div class="progress-text">Generating PDF...</div>
    `;
    
    button.parentNode.insertBefore(progress, button.nextSibling);
    
    // Cleanup after export
    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
      if (progress.parentNode) {
        progress.parentNode.removeChild(progress);
      }
    }, 3000);
  }

  /**
   * Add mobile-specific CSS
   */
  addMobileStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .mobile-optimized {
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }
      
      .mobile-export-progress {
        margin-top: 10px;
        padding: 15px;
        background: #f3f4f6;
        border-radius: 8px;
        text-align: center;
      }
      
      .progress-bar {
        width: 100%;
        height: 4px;
        background: #e5e7eb;
        border-radius: 2px;
        overflow: hidden;
        margin-bottom: 8px;
      }
      
      .progress-fill {
        height: 100%;
        background: #3b82f6;
        border-radius: 2px;
        animation: progress 2s ease-in-out infinite;
      }
      
      .progress-text {
        font-size: 14px;
        color: #6b7280;
      }
      
      @keyframes progress {
        0% { width: 0%; }
        50% { width: 70%; }
        100% { width: 100%; }
      }
      
      @media (max-width: 768px) {
        button, .btn {
          min-height: 44px;
          min-width: 44px;
          padding: 12px 16px;
        }
        
        input, select, textarea {
          min-height: 44px;
          padding: 12px;
        }
        
        .modal {
          margin: 10px;
          max-height: calc(100vh - 20px);
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Run mobile optimization tests
   */
  runMobileTests() {
    const results = {
      touchTargets: this.validateTouchTargets(),
      viewport: this.checkViewportSettings(),
      performance: this.checkMobilePerformance()
    };
    
    console.log('📱 Mobile Optimization Results:', results);
    return results;
  }

  /**
   * Check viewport settings
   */
  checkViewportSettings() {
    const viewport = document.querySelector('meta[name="viewport"]');
    return {
      exists: !!viewport,
      content: viewport?.content || 'Not set',
      optimized: viewport?.content.includes('width=device-width')
    };
  }

  /**
   * Check mobile performance metrics
   */
  checkMobilePerformance() {
    return {
      loadTime: performance.now(),
      memoryUsage: performance.memory?.usedJSHeapSize || 0,
      renderTime: this.measureRenderTime()
    };
  }

  /**
   * Measure render time
   */
  measureRenderTime() {
    const start = performance.now();
    requestAnimationFrame(() => {
      const end = performance.now();
      return end - start;
    });
  }
}

// Initialize mobile optimizer
const mobileOptimizer = new MobileOptimizer();

export default mobileOptimizer;