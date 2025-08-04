import React, { useState } from 'react';
import { 
  DocumentDuplicateIcon, 
  ShareIcon, 
  CloudArrowUpIcon,
  QrCodeIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';
import { useHapticFeedback } from '../hooks/useSwipeGestures';

const QuickActions = ({ paperData, onAction }) => {
  const [showQR, setShowQR] = useState(false);
  const { lightTap } = useHapticFeedback();

  const actions = [
    {
      id: 'duplicate',
      icon: DocumentDuplicateIcon,
      label: 'Duplicate',
      color: 'blue',
      action: () => {
        lightTap();
        onAction('duplicate', paperData);
      }
    },
    {
      id: 'share',
      icon: ShareIcon,
      label: 'Share',
      color: 'green',
      action: () => {
        lightTap();
        if (navigator.share) {
          navigator.share({
            title: paperData.metadata?.examName || 'Question Paper',
            text: 'Check out this question paper created with Qmaker',
            url: window.location.href
          });
        } else {
          onAction('share', paperData);
        }
      }
    },
    {
      id: 'cloud',
      icon: CloudArrowUpIcon,
      label: 'Save to Cloud',
      color: 'purple',
      action: () => {
        lightTap();
        onAction('cloud-save', paperData);
      }
    },
    {
      id: 'qr',
      icon: QrCodeIcon,
      label: 'QR Code',
      color: 'indigo',
      action: () => {
        lightTap();
        setShowQR(true);
      }
    },
    {
      id: 'print',
      icon: PrinterIcon,
      label: 'Quick Print',
      color: 'gray',
      action: () => {
        lightTap();
        window.print();
      }
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400',
      green: 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400',
      purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400',
      indigo: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400',
      gray: 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400'
    };
    return colors[color] || colors.gray;
  };

  return (
    <>
      <div className="grid grid-cols-5 gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.action}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-200 hover:scale-105 ${getColorClasses(action.color)}`}
              title={action.label}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4 text-center">Share via QR Code</h3>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 flex items-center justify-center mb-4">
              <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center">
                <QrCodeIcon className="w-24 h-24 text-gray-400" />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
              Scan to access this question paper
            </p>
            <button
              onClick={() => setShowQR(false)}
              className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickActions;