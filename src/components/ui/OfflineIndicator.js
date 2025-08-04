import React, { useState, useEffect } from 'react';
import { 
  WifiIcon, 
  CloudIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import offlineManager from '../utils/offlineManager';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasUnsyncedChanges, setHasUnsyncedChanges] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for unsynced changes periodically
    const checkSyncStatus = () => {
      const status = offlineManager.getConnectionStatus();
      setHasUnsyncedChanges(status.hasUnsyncedChanges);
    };

    const interval = setInterval(checkSyncStatus, 5000);
    checkSyncStatus();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        icon: ExclamationTriangleIcon,
        text: 'Offline',
        color: 'text-red-600 bg-red-50',
        description: 'Working offline. Changes will sync when online.'
      };
    }
    
    if (hasUnsyncedChanges) {
      return {
        icon: CloudIcon,
        text: 'Syncing',
        color: 'text-yellow-600 bg-yellow-50',
        description: 'Syncing offline changes...'
      };
    }
    
    return {
      icon: CheckCircleIcon,
      text: 'Online',
      color: 'text-green-600 bg-green-50',
      description: 'All changes saved and synced.'
    };
  };

  const status = getStatusInfo();
  const Icon = status.icon;

  return (
    <>
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-colors ${status.color}`}
      >
        <Icon className="w-3 h-3" />
        <span className="hidden sm:inline">{status.text}</span>
      </button>

      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <Icon className={`w-6 h-6 ${status.color.split(' ')[0]}`} />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Connection Status
              </h3>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {status.description}
            </p>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Network:</span>
                <span className={`font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                  {isOnline ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Sync Status:</span>
                <span className={`font-medium ${hasUnsyncedChanges ? 'text-yellow-600' : 'text-green-600'}`}>
                  {hasUnsyncedChanges ? 'Pending' : 'Up to date'}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Offline Mode:</span>
                <span className="font-medium text-blue-600">Available</span>
              </div>
            </div>
            
            {!isOnline && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Offline Mode Active:</strong> You can continue working. 
                  All changes are saved locally and will sync automatically when you're back online.
                </p>
              </div>
            )}
            
            <button
              onClick={() => setShowDetails(false)}
              className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default OfflineIndicator;