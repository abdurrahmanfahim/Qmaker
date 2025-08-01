/**
 * Bottom navigation for mobile-first navigation pattern
 */

import React from 'react';
import { 
  DocumentTextIcon,
  RectangleStackIcon,
  FolderIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import {
  DocumentTextIcon as DocumentTextSolid,
  RectangleStackIcon as RectangleStackSolid,
  FolderIcon as FolderSolid,
  Cog6ToothIcon as Cog6ToothSolid
} from '@heroicons/react/24/solid';

const BottomNavigation = ({ activeTab, onTabChange, hasUnsavedChanges }) => {
  const tabs = [
    {
      id: 'create',
      label: 'Create',
      icon: DocumentTextIcon,
      activeIcon: DocumentTextSolid,
      badge: hasUnsavedChanges
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: RectangleStackIcon,
      activeIcon: RectangleStackSolid
    },
    {
      id: 'papers',
      label: 'Papers',
      icon: FolderIcon,
      activeIcon: FolderSolid
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Cog6ToothIcon,
      activeIcon: Cog6ToothSolid
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 safe-area-pb z-40 md:hidden">
      <div className="flex items-center justify-around px-2 py-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = isActive ? tab.activeIcon : tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center min-w-[60px] py-2 px-3 rounded-lg transition-all duration-200 touch-manipulation active:scale-95 ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 transform scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 mb-1 transition-transform duration-200 ${
                  isActive ? 'scale-110' : ''
                }`} />
                {tab.badge && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
              <span className={`text-xs font-medium transition-all duration-200 ${
                isActive ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-600 dark:text-gray-400'
              }`}>
                {tab.label}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;