// Simple error handler utility
export const handleError = (error, context = '') => {
  console.error(`Error in ${context}:`, error);
  
  // Log to localStorage for debugging
  try {
    const errorLog = JSON.parse(localStorage.getItem('qmaker-errors') || '[]');
    errorLog.push({
      timestamp: new Date().toISOString(),
      context,
      message: error.message,
      stack: error.stack
    });
    
    // Keep only last 10 errors
    if (errorLog.length > 10) {
      errorLog.splice(0, errorLog.length - 10);
    }
    
    localStorage.setItem('qmaker-errors', JSON.stringify(errorLog));
  } catch (logError) {
    console.error('Failed to log error:', logError);
  }
};

export const clearErrorLog = () => {
  localStorage.removeItem('qmaker-errors');
};