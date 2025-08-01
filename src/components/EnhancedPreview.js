import React, { useState, useRef, useEffect } from 'react';
import { 
  MagnifyingGlassPlusIcon, 
  MagnifyingGlassMinusIcon,
  PencilIcon,
  ShareIcon,
  PrinterIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import usePaperStore from '../store/paperStore';

const EnhancedPreview = ({ onClose }) => {
  const { sections, metadata, language } = usePaperStore();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [annotations, setAnnotations] = useState([]);
  const [isAnnotating, setIsAnnotating] = useState(false);
  const previewRef = useRef(null);

  // Pinch to zoom support
  useEffect(() => {
    let initialDistance = 0;
    let initialZoom = zoomLevel;

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        initialZoom = zoomLevel;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        
        const scale = currentDistance / initialDistance;
        const newZoom = Math.min(Math.max(initialZoom * scale, 0.5), 3);
        setZoomLevel(newZoom);
      }
    };

    const element = previewRef.current;
    if (element) {
      element.addEventListener('touchstart', handleTouchStart, { passive: true });
      element.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    return () => {
      if (element) {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [zoomLevel]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleAnnotationClick = (e) => {
    if (!isAnnotating) return;
    
    const rect = previewRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const annotation = {
      id: Date.now(),
      x,
      y,
      text: prompt('Add annotation:') || 'Note'
    };
    
    if (annotation.text) {
      setAnnotations(prev => [...prev, annotation]);
    }
  };

  const removeAnnotation = (id) => {
    setAnnotations(prev => prev.filter(ann => ann.id !== id));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: metadata.subject || 'Question Paper',
          text: `${metadata.subject} - ${metadata.class} question paper`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isRTL = language === 'arabic' || language === 'urdu';

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            ←
          </button>
          <h2 className="font-semibold text-gray-900 dark:text-white">Preview</h2>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= 0.5}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <MagnifyingGlassMinusIcon className="w-5 h-5" />
          </button>
          
          <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[3rem] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          
          <button
            onClick={handleZoomIn}
            disabled={zoomLevel >= 3}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <MagnifyingGlassPlusIcon className="w-5 h-5" />
          </button>
          
          {/* Annotation Toggle */}
          <button
            onClick={() => setIsAnnotating(!isAnnotating)}
            className={`p-2 rounded-lg transition-colors ${
              isAnnotating 
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          
          {/* Show/Hide Annotations */}
          {annotations.length > 0 && (
            <button
              onClick={() => setShowAnnotations(!showAnnotations)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {showAnnotations ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          )}
          
          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ShareIcon className="w-5 h-5" />
          </button>
          
          {/* Print */}
          <button
            onClick={handlePrint}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <PrinterIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-800 p-4">
        <div
          ref={previewRef}
          className="max-w-4xl mx-auto bg-white dark:bg-gray-900 shadow-lg relative cursor-crosshair"
          style={{ 
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center',
            minHeight: '297mm', // A4 height
            width: '210mm', // A4 width
            padding: '20mm'
          }}
          onClick={handleAnnotationClick}
        >
          {/* Paper Header */}
          <div className={`text-center mb-8 ${isRTL ? 'rtl' : 'ltr'}`}>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {metadata.subject || 'Question Paper'}
            </h1>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p>Class: {metadata.class || 'Not specified'}</p>
              <p>Time: {metadata.duration || 'Not specified'} | Marks: {metadata.totalMarks || 'Not specified'}</p>
              {metadata.teacherName && <p>Teacher: {metadata.teacherName}</p>}
            </div>
          </div>

          {/* Instructions */}
          {metadata.instructions && (
            <div className={`mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg ${isRTL ? 'rtl' : 'ltr'}`}>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Instructions:</h3>
              <div 
                className="text-sm text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: metadata.instructions }}
              />
            </div>
          )}

          {/* Sections */}
          {sections.map((section, sectionIndex) => (
            <div key={section.id} className={`mb-8 ${isRTL ? 'rtl' : 'ltr'}`}>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {section.name}
              </h2>
              
              {section.instructions && (
                <div className="mb-4 text-sm text-gray-600 dark:text-gray-400 italic">
                  {section.instructions}
                </div>
              )}

              {section.subQuestions.map((subQuestion, questionIndex) => (
                <div key={subQuestion.id} className="mb-4">
                  <div className="flex items-start gap-3">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {questionIndex + 1}.
                    </span>
                    <div className="flex-1">
                      <div 
                        className="text-gray-900 dark:text-white mb-2"
                        dangerouslySetInnerHTML={{ __html: subQuestion.question }}
                      />
                      {subQuestion.marks && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          [{subQuestion.marks} marks]
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Annotations */}
          {showAnnotations && annotations.map((annotation) => (
            <div
              key={annotation.id}
              className="absolute bg-yellow-200 border border-yellow-400 rounded-lg p-2 text-xs shadow-lg z-10"
              style={{
                left: `${annotation.x}%`,
                top: `${annotation.y}%`,
                transform: 'translate(-50%, -100%)'
              }}
            >
              <div className="flex items-center gap-2">
                <span>{annotation.text}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeAnnotation(annotation.id);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      {isAnnotating && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
            Tap anywhere on the preview to add annotations • Pinch to zoom
          </p>
        </div>
      )}
    </div>
  );
};

export default EnhancedPreview;