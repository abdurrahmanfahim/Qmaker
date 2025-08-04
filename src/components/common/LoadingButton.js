import React from 'react';
import Button from './Button';

const LoadingButton = ({ 
  loading = false, 
  children, 
  loadingText = 'Loading...', 
  ...props 
}) => {
  return (
    <Button disabled={loading} {...props}>
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {loadingText}
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default LoadingButton;