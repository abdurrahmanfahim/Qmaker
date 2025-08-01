import { lazy } from 'react';

// Lazy load heavy components for better performance
export const LazyTemplateGallery = lazy(() => import('./TemplateGallery'));
export const LazyCollaborationPanel = lazy(() => import('./CollaborationPanel'));
export const LazyAdvancedExportModal = lazy(() => import('./AdvancedExportModal'));
export const LazyEnhancedPreview = lazy(() => import('./EnhancedPreview'));
export const LazyMobileEditor = lazy(() => import('./MobileEditor'));
export const LazySmartSuggestions = lazy(() => import('./SmartSuggestions'));

// Loading fallback component
export const ComponentLoader = ({ className = '' }) => (
  <div className={`flex items-center justify-center p-8 ${className}`}>
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <span className="text-sm text-gray-600 dark:text-gray-400">Loading...</span>
    </div>
  </div>
);