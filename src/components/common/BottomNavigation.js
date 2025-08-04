import React from 'react';
import { 
  HomeIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  ShareIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useHapticFeedback } from '../../hooks/useSwipeGestures';

const BottomNavigation = ({ currentPage, onNavigate, onHome }) => {
  const { lightTap } = useHapticFeedback();

  const navItems = [
    { id: 'home', icon: HomeIcon, label: 'Home' },
    { id: 'recent', icon: FolderIcon, label: 'Recent' },
    { id: 'search', icon: MagnifyingGlassIcon, label: 'Search' },
    { id: 'shared', icon: ShareIcon, label: 'Shared' },
    { id: 'settings', icon: Cog6ToothIcon, label: 'Settings' }
  ];

  const handleNavClick = (itemId) => {
    lightTap();
    if (itemId === 'home' && onHome) {
      onHome();
    } else {
      onNavigate(itemId);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 z-40">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex flex-col items-center gap-1 p-2 ${
                  isActive 
                    ? 'text-[#09302f] dark:text-[#4ade80]' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className={`text-xs ${isActive ? 'font-medium' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;