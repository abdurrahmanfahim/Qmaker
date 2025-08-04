import React from 'react';
import Button from './Button';

/**
 * Button component with loading state and spinner
 * Extends the base Button component with loading functionality
 * @param {boolean} loading - Loading state
 * @param {React.ReactNode} children - Button content when not loading
 * @param {string} loadingText - Text to show during loading
 * @param {...Object} props - All other Button component props
 */
const LoadingButton = ({ 
  loading = false, 
  children, 
  loadingText = 'Loading...', 
  ...props 
}) => {
  return (
    <Button disabled={loading} {...props}>
      {loading ? (
        // Loading state with spinner and text
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {loadingText}
        </div>
      ) : (
        // Normal button content
        children
      )}
    </Button>
  );
};

export default LoadingButton;