import React, { useState } from 'react';
import { 
  ArrowLeftIcon,
  UserCircleIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useHapticFeedback } from '../../hooks/useSwipeGestures';
import ImageCropper from '../ImageCropper';

const UserProfile = ({ onBack, onShowGoogleSignup }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    school: '',
    subject: '',
    picture: ''
  });
  const [showCropper, setShowCropper] = useState(false);
  const [tempImage, setTempImage] = useState('');
  const { lightTap } = useHapticFeedback();

  React.useEffect(() => {
    const saved = localStorage.getItem('qmaker-profile');
    if (saved) {
      setProfile(JSON.parse(saved));
      setIsSignedIn(true);
    } else {
      // Auto sign in for demo
      setIsSignedIn(true);
    }
  }, []);
  
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

  const handleSave = () => {
    lightTap();
    setIsEditing(false);
    localStorage.setItem('qmaker-profile', JSON.stringify(profile));
  };

  const handleCancel = () => {
    lightTap();
    setIsEditing(false);
    // Reset to saved data
    const saved = localStorage.getItem('qmaker-profile');
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  };

  const handleGoogleSignup = () => {
    lightTap();
    onShowGoogleSignup();
  };

  if (!isSignedIn) {
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
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">User Profile</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">Sign in to sync your data</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sign In Content */}
        <div className="max-w-md mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCircleIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome to Qmaker</h2>
            <p className="text-gray-600 dark:text-gray-300">Sign in to save your papers and sync across devices</p>
          </div>

          <button
            onClick={handleGoogleSignup}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-medium text-gray-700 dark:text-gray-300">Continue with Google</span>
          </button>

          <button
            onClick={() => {
              lightTap();
              setIsSignedIn(true);
            }}
            className="w-full text-[#09302f] dark:text-[#4ade80] font-medium py-2 hover:underline"
          >
            Skip for now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  lightTap();
                  onBack();
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">User Profile</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">Manage your information</p>
              </div>
            </div>
            
            {!isEditing ? (
              <button
                onClick={() => {
                  lightTap();
                  setIsEditing(true);
                }}
                className="p-2 text-[#09302f] dark:text-[#4ade80] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                >
                  <CheckIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-md mx-auto px-4 py-6 pb-20">
        <div className="text-center mb-8">
          <div className="relative">
            <div className="w-20 h-20 bg-[#09302f] dark:bg-[#4ade80] rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
              {profile.picture ? (
                <img src={profile.picture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserCircleIcon className="w-12 h-12 text-white dark:text-gray-900" />
              )}
            </div>
            {isEditing && (
              <button
                onClick={() => document.getElementById('picture-upload').click()}
                className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2 w-8 h-8 bg-[#09302f] dark:bg-[#4ade80] text-white dark:text-gray-900 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            )}
            <input
              id="picture-upload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    setTempImage(e.target.result);
                    setShowCropper(true);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="hidden"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#09302f] focus:border-[#09302f] bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-700"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#09302f] focus:border-[#09302f] bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-700"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">School/Institution</label>
            <input
              type="text"
              value={profile.school}
              onChange={(e) => setProfile({...profile, school: e.target.value})}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#09302f] focus:border-[#09302f] bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-700"
              placeholder="Your school or institution"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
            <input
              type="text"
              value={profile.subject}
              onChange={(e) => setProfile({...profile, subject: e.target.value})}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#09302f] focus:border-[#09302f] bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-700"
              placeholder="Your teaching subject"
            />
          </div>
        </div>
      </div>
      
      {showCropper && (
        <ImageCropper
          imageSrc={tempImage}
          onCrop={(croppedImage) => {
            setProfile({...profile, picture: croppedImage});
            setShowCropper(false);
            setTempImage('');
          }}
          onCancel={() => {
            setShowCropper(false);
            setTempImage('');
          }}
        />
      )}
    </div>
  );
};

export default UserProfile;