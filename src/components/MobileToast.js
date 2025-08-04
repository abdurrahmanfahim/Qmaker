import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const MobileToast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStyles = () => {
    const base = "fixed top-4 left-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 transition-all duration-300";
    
    if (isExiting) {
      return `${base} transform translate-y-[-100px] opacity-0`;
    }
    
    switch (type) {
      case 'success':
        return `${base} bg-green-50 border border-green-200 dark:bg-green-900 dark:border-green-700`;
      case 'error':
        return `${base} bg-red-50 border border-red-200 dark:bg-red-900 dark:border-red-700`;
      default:
        return `${base} bg-blue-50 border border-blue-200 dark:bg-blue-900 dark:border-blue-700`;
    }
  };

  return (
    <div className={getStyles()}>
      {getIcon()}
      <span className="flex-1 text-sm font-medium text-gray-900 dark:text-white">
        {message}
      </span>
    </div>
  );
};

export default MobileToast;