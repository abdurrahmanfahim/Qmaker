import React, { useState } from 'react';
import { 
  ArrowLeftIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useHapticFeedback } from '../hooks/useSwipeGestures';

const GoogleSignup = ({ onBack, onSignupComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { lightTap } = useHapticFeedback();
  
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

  const handleGoogleSignup = async () => {
    lightTap();
    setIsLoading(true);
    
    // Simulate Google OAuth flow
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      // Simulate successful signup
      setTimeout(() => {
        onSignupComplete({
          name: 'John Teacher',
          email: 'john.teacher@gmail.com',
          school: 'Demo School',
          subject: 'Mathematics'
        });
      }, 2000);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome to Qmaker!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Your account has been created successfully</p>
          <div className="animate-pulse">
            <div className="h-2 bg-[#09302f] dark:bg-[#4ade80] rounded-full"></div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Setting up your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                lightTap();
                onBack();
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              disabled={isLoading}
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Sign Up</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">Create your Qmaker account</p>
            </div>
          </div>
        </div>
      </div>

      {/* Signup Content */}
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#09302f] dark:bg-[#4ade80] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white dark:text-gray-900" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Join Qmaker</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">Sign up with Google to sync your question papers across all devices</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-4 flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-300 border-t-[#09302f] rounded-full animate-spin"></div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Signing up...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-medium text-gray-700 dark:text-gray-300">Continue with Google</span>
              </>
            )}
          </button>

          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Why sign up?</h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Sync papers across devices</li>
            <li>• Cloud backup of your work</li>
            <li>• Share papers with colleagues</li>
            <li>• Access from anywhere</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GoogleSignup;