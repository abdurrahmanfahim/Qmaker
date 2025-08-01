import React, { useState } from 'react';
import { TrashIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useSwipeGestures, useLongPress } from '../hooks/useSwipeGestures';

const SwipeableSection = ({ 
  children, 
  onDelete, 
  onMoveLeft, 
  onMoveRight, 
  canMoveLeft = true, 
  canMoveRight = true,
  className = '' 
}) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [showActions, setShowActions] = useState(false);

  const longPressProps = useLongPress(() => {
    setShowActions(true);
  }, 500);

  const swipeRef = useSwipeGestures({
    onSwipeLeft: () => {
      if (canMoveRight && onMoveRight) {
        onMoveRight();
      }
    },
    onSwipeRight: () => {
      if (canMoveLeft && onMoveLeft) {
        onMoveLeft();
      }
    },
    threshold: 80
  });

  const handleDelete = () => {
    setShowActions(false);
    if (onDelete) {
      onDelete();
    }
  };

  const handleMove = (direction) => {
    setShowActions(false);
    if (direction === 'left' && onMoveLeft) {
      onMoveLeft();
    } else if (direction === 'right' && onMoveRight) {
      onMoveRight();
    }
  };

  return (
    <>
      {/* Action overlay */}
      {showActions && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
          onClick={() => setShowActions(false)}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 m-4 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Section Actions
            </h3>
            <div className="space-y-3">
              {canMoveLeft && onMoveLeft && (
                <button
                  onClick={() => handleMove('left')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ArrowLeftIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-900 dark:text-white">Move Left</span>
                </button>
              )}
              {canMoveRight && onMoveRight && (
                <button
                  onClick={() => handleMove('right')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ArrowRightIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-900 dark:text-white">Move Right</span>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <TrashIcon className="w-5 h-5 text-red-600" />
                  <span className="text-red-600">Delete Section</span>
                </button>
              )}
            </div>
            <button
              onClick={() => setShowActions(false)}
              className="w-full mt-4 py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Swipeable content */}
      <div
        ref={swipeRef}
        {...longPressProps}
        className={`relative transition-transform duration-200 ${className}`}
        style={{ transform: `translateX(${swipeOffset}px)` }}
      >
        {children}
        
        {/* Swipe indicators */}
        {canMoveLeft && (
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-30">
            <ArrowLeftIcon className="w-4 h-4 text-blue-600" />
          </div>
        )}
        {canMoveRight && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-30">
            <ArrowRightIcon className="w-4 h-4 text-blue-600" />
          </div>
        )}
      </div>
    </>
  );
};

export default SwipeableSection;