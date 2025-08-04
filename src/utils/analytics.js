// Analytics and error tracking
export const trackEvent = (eventName, properties = {}) => {
  if (process.env.NODE_ENV === 'production') {
    // Google Analytics 4 tracking
    if (window.gtag) {
      window.gtag('event', eventName, properties);
    }
    
    // Console log for development
    console.log('Event:', eventName, properties);
  }
};

export const trackError = (error, context = {}) => {
  if (process.env.NODE_ENV === 'production') {
    // Error tracking service
    console.error('Error tracked:', error, context);
    
    // Send to error tracking service
    trackEvent('error', {
      error_message: error.message,
      error_stack: error.stack,
      ...context
    });
  }
};

export const trackPerformance = (metric, value) => {
  if (process.env.NODE_ENV === 'production') {
    trackEvent('performance_metric', {
      metric_name: metric,
      metric_value: value,
      timestamp: Date.now()
    });
  }
};

export const trackUserAction = (action, details = {}) => {
  trackEvent('user_action', {
    action_type: action,
    timestamp: Date.now(),
    ...details
  });
};