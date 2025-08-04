/**
 * @fileoverview Lazy-loaded preview panel component for better performance
 * Only loads when preview mode is activated to reduce initial bundle size
 * @author Qmaker Team
 * @version 1.0.0
 * @since 2024
 */

import React, { Suspense, lazy } from 'react';
import { LoadingOverlay } from './ui/LoadingSpinner';

// Lazy load the PreviewPanel component
const PreviewPanel = lazy(() => import('./PreviewPanel'));

/**
 * Wrapper component for lazy-loaded preview panel
 * @param {Object} props - Component props
 * @returns {JSX.Element} Lazy-loaded preview panel with loading fallback
 */
const LazyPreviewPanel = (props) => {
  return (
    <Suspense 
      fallback={
        <LoadingOverlay message="Loading preview..." />
      }
    >
      <PreviewPanel {...props} />
    </Suspense>
  );
};

export default LazyPreviewPanel;