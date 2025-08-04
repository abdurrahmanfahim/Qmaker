import React, { useState } from 'react';
import { 
  ArrowLeftIcon,
  UserCircleIcon,
  SunIcon,
  MoonIcon,
  Cog6ToothIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { useHapticFeedback } from '../../hooks/useSwipeGestures';
import usePaperStore from '../../store/paperStore';
import Button from '../common/Button';
import Modal from '../common/Modal';

const SettingsPage = ({ onBack, onShowProfile }) => {
  const { darkMode, toggleDarkMode } = usePaperStore();
  const { lightTap } = useHapticFeedback();
  const [showAbout, setShowAbout] = useState(false);
  
  // Handle mobile back button
  React.useEffect(() => {
    const handleBackButton = (e) => {
      e.preventDefault();
      onBack();
    };
    
    window.addEventListener('popstate', handleBackButton);
    window.history.pushState(null, '', window.location.href);
    
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [onBack]);

  const settingsItems = [
    {
      icon: UserCircleIcon,
      title: 'User Profile',
      subtitle: 'Manage your account and preferences',
      action: () => {
        lightTap();
        onShowProfile();
      }
    },
    {
      icon: darkMode ? MoonIcon : SunIcon,
      title: 'Dark Mode',
      subtitle: 'Switch between light and dark theme',
      isToggle: true,
      toggleValue: darkMode,
      action: () => {
        lightTap();
        toggleDarkMode();
      }
    },
    {
      icon: InformationCircleIcon,
      title: 'About Qmaker',
      subtitle: 'Version 1.0.0 - Question Paper Builder',
      action: () => {
        lightTap();
        setShowAbout(true);
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                lightTap();
                onBack();
              }}
              className="p-2"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">Manage your preferences</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24">
        <div className="space-y-4">
          {settingsItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.action}
                className="w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 p-6 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 text-left group hover:scale-[1.01]"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center group-hover:from-[#09302f] group-hover:to-[#072625] dark:group-hover:from-[#4ade80] dark:group-hover:to-[#22c55e] transition-all duration-200">
                    <Icon className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-white dark:group-hover:text-gray-900 transition-colors duration-200" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1 group-hover:text-[#09302f] dark:group-hover:text-[#4ade80] transition-colors duration-200">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      {item.subtitle}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {item.isToggle ? (
                      <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        item.toggleValue ? 'bg-[#09302f] dark:bg-[#4ade80]' : 'bg-gray-200 dark:bg-gray-600'
                      }`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          item.toggleValue ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </div>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-[#09302f] dark:group-hover:text-[#4ade80] transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">About Qmaker</h2>
                <button
                  onClick={() => setShowAbout(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Version 1.0.0</h3>
                  <p>A comprehensive multilingual question paper builder designed specifically for teachers in madrasas, schools, and coaching centers.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Our Mission</h3>
                  <p>Born from a deep passion to make the lives of Bangladeshi madrasha teachers easier, Qmaker bridges the gap between traditional Islamic education and modern technology. We understand the unique challenges faced by madrasha educators in creating multilingual question papers that honor both Arabic heritage and local languages.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Features</h3>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Support for Arabic, Bangla, Urdu, and English</li>
                    <li>RTL and LTR text direction support</li>
                    <li>Professional PDF export</li>
                    <li>Rich text editing with proper fonts</li>
                    <li>Section-based question organization</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Developer</h3>
                  <p className="mb-2">Created with ❤️ by <span className="font-medium">Abdur Rahman Fahim</span></p>
                  <div className="space-y-2">
                    <a 
                      href="https://github.com/abdurrahmanfahim/Qmaker" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub Repository
                    </a>
                    <a 
                      href="https://www.facebook.com/ar.fahim.dev" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook Profile
                    </a>
                    <a 
                      href="mailto:ar.fahim.dev@gmail.com"
                      className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      ar.fahim.dev@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-600 space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    "Empowering educators, preserving tradition, embracing technology"
                  </p>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">السلام عليكم ورحمة الله وبركاته</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      May Allah ﷻ bless the developer and grant him success in this world and the hereafter. 
                      <br />جزاك الله خيراً
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;