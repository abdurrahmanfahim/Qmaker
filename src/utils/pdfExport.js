/**
 * @fileoverview Enhanced PDF export utility with multilingual support
 * Handles PDF generation with proper RTL rendering, font loading, and progress feedback
 * @author Qmaker Team
 * @version 1.0.0
 * @since 2024
 */

import html2pdf from 'html2pdf.js';

/**
 * Export question paper to PDF with enhanced styling and RTL support
 * @param {Object} options - Export configuration options
 * @param {string} options.format - Paper format (a4, letter, a3)
 * @param {string} options.orientation - Page orientation (portrait, landscape)
 * @param {Array} options.margins - Page margins [top, right, bottom, left]
 * @param {number} options.scale - Rendering scale for quality
 * @param {string} options.filename - Output filename
 */
export const exportToPDF = async (options = {}) => {
  let element = null;
  
  try {
    // Validate content exists
    const validationError = validateExportContent();
    if (validationError) {
      showErrorToast(validationError.title, validationError.message);
      return;
    }

    // Locate the content element to export
    element = document.querySelector('[data-export="pdf-content"]') || 
              document.querySelector('.max-w-4xl') ||
              document.querySelector('.preview-content');
    
    if (!element) {
      showErrorToast('Content Not Found', 'Unable to locate content for export. Please refresh and try again.');
      return;
    }

    // Apply PDF-specific styling for better rendering
    await applyPDFStyling(element, options);

  const filename = options.filename || `question-paper-${new Date().toISOString().split('T')[0]}.pdf`;
  
  // Configure PDF generation options with enhanced quality settings
  const opt = {
    margin: options.margins || [0.75, 0.75, 0.75, 0.75], // Page margins in inches
    filename,
    image: { 
      type: 'jpeg', 
      quality: 0.95 // High quality for crisp text
    },
    html2canvas: { 
      scale: options.scale || 2.5, // High DPI for sharp text rendering
      useCORS: true, // Allow cross-origin images
      letterRendering: true, // Better text rendering
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false, // Suppress console logs
      // A4 dimensions in pixels at 96 DPI
      width: options.orientation === 'landscape' ? 1122 : 794,
      height: options.orientation === 'landscape' ? 794 : 1122,
      scrollX: 0,
      scrollY: 0,
      windowWidth: options.orientation === 'landscape' ? 1122 : 794,
      windowHeight: options.orientation === 'landscape' ? 794 : 1122
    },
    jsPDF: { 
      unit: 'in', 
      format: options.format || 'a4', 
      orientation: options.orientation || 'portrait',
      compress: true, // Reduce file size
      precision: 16 // High precision for accurate measurements
    },
    pagebreak: { 
      mode: ['avoid-all', 'css', 'legacy'], // Multiple page break strategies
      before: '.print-page-break', // Elements that should start new pages
      after: '.print-page-break-after',
      avoid: '.print-avoid-break' // Elements to keep together
    }
  };

    // Display progress feedback to user
    const loadingToast = createLoadingToast();
    document.body.appendChild(loadingToast);
    
    // Step 1: Prepare content
    updateLoadingProgress(loadingToast, 'Preparing content...');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Step 2: Generate PDF
    updateLoadingProgress(loadingToast, 'Rendering PDF...');
    await html2pdf().set(opt).from(element).save();
    
    // Show success notification
    showSuccessToast(loadingToast);
    
  } catch (error) {
    console.error('PDF export failed:', error);
    handleExportError(error);
  } finally {
    // Always clean up applied styling
    if (element) {
      removePDFStyling(element);
    }
  }
};

/**
 * Apply PDF-specific styling for better rendering quality
 * @param {HTMLElement} element - Element to be exported
 * @param {Object} options - Export options
 */
const applyPDFStyling = async (element, options) => {
  // Enable PDF export mode styling
  element.classList.add('pdf-export-mode');
  
  // Optimize RTL language rendering (Arabic, Urdu)
  const rtlElements = element.querySelectorAll('.rtl, .font-arabic, .font-urdu');
  rtlElements.forEach(el => {
    el.style.fontFeatureSettings = '"liga" 1, "calt" 1'; // Enable ligatures
    el.style.textRendering = 'optimizeLegibility'; // Better text quality
    el.style.direction = 'rtl'; // Right-to-left text direction
    el.style.unicodeBidi = 'bidi-override'; // Force RTL rendering
  });
  
  // Optimize table rendering for PDF
  const tables = element.querySelectorAll('table');
  tables.forEach(table => {
    table.style.pageBreakInside = 'avoid'; // Keep tables together
    table.style.borderCollapse = 'collapse'; // Clean borders
    table.style.width = '100%'; // Full width
  });
  
  // Configure page breaks for sections
  const sections = element.querySelectorAll('.print-page-break');
  sections.forEach((section, index) => {
    if (index > 0) {
      section.style.pageBreakBefore = 'auto'; // Allow page breaks between sections
    }
    section.style.pageBreakInside = 'avoid'; // Keep sections together
  });
  
  // Ensure all fonts are loaded before rendering
  if (document.fonts) {
    await document.fonts.ready;
  }
};

/**
 * Clean up PDF-specific styling after export
 * @param {HTMLElement} element - Element that was exported
 */
const removePDFStyling = (element) => {
  element.classList.remove('pdf-export-mode');
  
  // Remove all inline styles added during PDF preparation
  const styledElements = element.querySelectorAll('[style]');
  styledElements.forEach(el => {
    el.removeAttribute('style');
  });
};

/**
 * Create loading toast notification with progress bar
 * @returns {HTMLElement} Loading toast element
 */
const createLoadingToast = () => {
  const toast = document.createElement('div');
  toast.className = 'fixed top-4 right-4 bg-blue-600 text-white px-6 py-4 rounded-lg shadow-xl z-50 flex items-center gap-3 min-w-[280px]';
  
  const container = document.createElement('div');
  container.className = 'flex items-center gap-3';
  
  const spinner = document.createElement('div');
  spinner.className = 'animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent';
  
  const textContainer = document.createElement('div');
  textContainer.className = 'flex flex-col';
  
  const title = document.createElement('span');
  title.className = 'font-medium';
  title.textContent = 'Exporting PDF';
  
  const progressText = document.createElement('span');
  progressText.className = 'text-xs opacity-90';
  progressText.id = 'progress-text';
  progressText.textContent = 'Initializing...';
  
  const progressContainer = document.createElement('div');
  progressContainer.className = 'ml-auto';
  
  const progressBg = document.createElement('div');
  progressBg.className = 'w-16 h-1 bg-blue-400 rounded-full overflow-hidden';
  
  const progressBar = document.createElement('div');
  progressBar.className = 'h-full bg-white rounded-full transition-all duration-500';
  progressBar.id = 'progress-bar';
  progressBar.style.width = '10%';
  
  textContainer.appendChild(title);
  textContainer.appendChild(progressText);
  container.appendChild(spinner);
  container.appendChild(textContainer);
  progressBg.appendChild(progressBar);
  progressContainer.appendChild(progressBg);
  toast.appendChild(container);
  toast.appendChild(progressContainer);
  
  return toast;
};

/**
 * Update loading progress message and bar
 * @param {HTMLElement} toast - Toast element
 * @param {string} message - Progress message
 */
const updateLoadingProgress = (toast, message) => {
  const progressText = toast.querySelector('#progress-text');
  const progressBar = toast.querySelector('#progress-bar');
  
  if (progressText) progressText.textContent = message;
  if (progressBar) {
    const currentWidth = parseInt(progressBar.style.width) || 10;
    progressBar.style.width = Math.min(currentWidth + 30, 90) + '%';
  }
};

/**
 * Transform loading toast to success notification
 * @param {HTMLElement} loadingToast - Loading toast to transform
 */
const showSuccessToast = (loadingToast) => {
  while (loadingToast.firstChild) {
    loadingToast.removeChild(loadingToast.firstChild);
  }
  
  const container = document.createElement('div');
  container.className = 'flex items-center gap-3';
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'w-5 h-5 text-white');
  svg.setAttribute('fill', 'currentColor');
  svg.setAttribute('viewBox', '0 0 20 20');
  
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('fill-rule', 'evenodd');
  path.setAttribute('d', 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z');
  path.setAttribute('clip-rule', 'evenodd');
  
  const textContainer = document.createElement('div');
  textContainer.className = 'flex flex-col';
  
  const title = document.createElement('span');
  title.className = 'font-medium';
  title.textContent = 'PDF exported successfully!';
  
  const subtitle = document.createElement('span');
  subtitle.className = 'text-xs opacity-90';
  subtitle.textContent = 'Check your downloads folder';
  
  svg.appendChild(path);
  textContainer.appendChild(title);
  textContainer.appendChild(subtitle);
  container.appendChild(svg);
  container.appendChild(textContainer);
  loadingToast.appendChild(container);
  loadingToast.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-xl z-50 flex items-center gap-3 min-w-[280px]';
  
  setTimeout(() => {
    if (document.body.contains(loadingToast)) {
      loadingToast.style.opacity = '0';
      loadingToast.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        if (document.body.contains(loadingToast)) {
          document.body.removeChild(loadingToast);
        }
      }, 300);
    }
  }, 3000);
};

/**
 * Validate export content before attempting PDF generation
 * @returns {Object|null} Error object with title and message, or null if valid
 */
const validateExportContent = () => {
  // Get the store data to validate content safely
  const store = window.__QMAKER_STORE__;
  if (!store || typeof store.getState !== 'function') {
    return { title: 'Store Error', message: 'Application state is not available.' };
  }
  const state = store.getState();
  const sections = state?.sections || [];
  const metadata = state?.metadata || {};
  
  // Check if any sections exist
  if (sections.length === 0) {
    return {
      title: 'No Sections Found',
      message: 'Please add at least one section using the "Add Section" button before exporting.'
    };
  }

  // Check if any questions exist
  const totalQuestions = sections.reduce((count, section) => count + (section.subQuestions?.length || 0), 0);
  if (totalQuestions === 0) {
    return {
      title: 'No Questions Found', 
      message: 'Please add at least one question to your sections using "Add Question" button.'
    };
  }

  // Check if questions have content
  const hasQuestionContent = sections.some(section => 
    section.subQuestions?.some(q => q.content?.trim()?.length > 0)
  );
  
  if (!hasQuestionContent) {
    return {
      title: 'Empty Questions',
      message: 'Your questions appear to be empty. Please add content to your questions using the text editor.'
    };
  }

  // Check basic paper information
  if (!metadata.examName?.trim() || metadata.examName === 'Exam Name') {
    return {
      title: 'Missing Exam Information',
      message: 'Please fill in the exam name in "Paper Information" section before exporting.'
    };
  }

  // Check if preview content exists in DOM
  const previewContent = document.querySelector('.preview-content, [data-export="pdf-content"], .max-w-4xl');
  if (!previewContent) {
    return {
      title: 'Preview Not Available',
      message: 'Please open the preview panel first, then try exporting to PDF.'
    };
  }

  return null; // All validations passed
};

/**
 * Handle different types of export errors with specific messages
 * @param {Error} error - The error that occurred during export
 */
const handleExportError = (error) => {
  let title = 'Export Failed';
  let message = 'An unexpected error occurred. Please try again.';

  if (error.message?.includes('html2canvas')) {
    title = 'Rendering Error';
    message = 'Failed to render content. Try refreshing the page and export again.';
  } else if (error.message?.includes('jsPDF')) {
    title = 'PDF Generation Error';
    message = 'Failed to generate PDF file. Please check your browser settings and try again.';
  } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
    title = 'Network Error';
    message = 'Network connection issue. Please check your internet connection.';
  } else if (error.message?.includes('memory') || error.message?.includes('quota')) {
    title = 'Memory Error';
    message = 'Not enough memory to generate PDF. Try closing other tabs and export again.';
  } else if (error.message?.includes('font')) {
    title = 'Font Loading Error';
    message = 'Failed to load fonts. The PDF may not display correctly.';
  } else if (error.message?.includes('permission')) {
    title = 'Permission Error';
    message = 'Browser blocked the download. Please allow downloads and try again.';
  }

  showErrorToast(title, message);
};

/**
 * Display error notification with title and message
 * @param {string} title - Error title
 * @param {string} message - Detailed error message
 */
const showErrorToast = (title, message) => {
  const errorToast = document.createElement('div');
  errorToast.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-4 rounded-lg shadow-xl z-50 flex items-center gap-3 min-w-[320px] max-w-[400px]';
  
  const sanitizeText = (text) => String(text).replace(/[<>"'&]/g, (match) => {
    const entities = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
    return entities[match];
  });
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'w-6 h-6 text-white flex-shrink-0');
  svg.setAttribute('fill', 'currentColor');
  svg.setAttribute('viewBox', '0 0 20 20');
  
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('fill-rule', 'evenodd');
  path.setAttribute('d', 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z');
  path.setAttribute('clip-rule', 'evenodd');
  
  const textContainer = document.createElement('div');
  textContainer.className = 'flex flex-col flex-1';
  
  const titleSpan = document.createElement('span');
  titleSpan.className = 'font-semibold text-sm';
  titleSpan.textContent = sanitizeText(title);
  
  const messageSpan = document.createElement('span');
  messageSpan.className = 'text-xs opacity-90 mt-1 leading-relaxed';
  messageSpan.textContent = sanitizeText(message);
  
  const closeButton = document.createElement('button');
  closeButton.className = 'ml-2 text-white hover:text-red-200 flex-shrink-0';
  closeButton.addEventListener('click', () => errorToast.remove());
  
  const closeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  closeSvg.setAttribute('class', 'w-4 h-4');
  closeSvg.setAttribute('fill', 'currentColor');
  closeSvg.setAttribute('viewBox', '0 0 20 20');
  
  const closePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  closePath.setAttribute('fill-rule', 'evenodd');
  closePath.setAttribute('d', 'M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z');
  closePath.setAttribute('clip-rule', 'evenodd');
  
  svg.appendChild(path);
  textContainer.appendChild(titleSpan);
  textContainer.appendChild(messageSpan);
  closeSvg.appendChild(closePath);
  closeButton.appendChild(closeSvg);
  errorToast.appendChild(svg);
  errorToast.appendChild(textContainer);
  errorToast.appendChild(closeButton);
  
  document.body.appendChild(errorToast);
  
  // Auto-remove after 8 seconds
  setTimeout(() => {
    if (document.body.contains(errorToast)) {
      errorToast.style.opacity = '0';
      errorToast.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        if (document.body.contains(errorToast)) {
          document.body.removeChild(errorToast);
        }
      }, 300);
    }
  }, 8000);
};

/**
 * Predefined export configurations for different paper formats
 * Each option includes format, orientation, margins, scale, and filename
 */
export const exportOptions = {
  standard: {
    format: 'a4',
    orientation: 'portrait',
    margins: [0.75, 0.75, 0.75, 0.75],
    scale: 2.5,
    filename: `question-paper-${new Date().toISOString().split('T')[0]}.pdf`
  },
  landscape: {
    format: 'a4', 
    orientation: 'landscape',
    margins: [0.5, 0.75, 0.5, 0.75],
    scale: 2.2,
    filename: `question-paper-landscape-${new Date().toISOString().split('T')[0]}.pdf`
  },
  letter: {
    format: 'letter',
    orientation: 'portrait',
    margins: [0.75, 0.75, 0.75, 0.75],
    scale: 2.5,
    filename: `question-paper-letter-${new Date().toISOString().split('T')[0]}.pdf`
  },
  compact: {
    format: 'a4',
    orientation: 'portrait',
    margins: [0.5, 0.5, 0.5, 0.5],
    scale: 2.8,
    filename: `question-paper-compact-${new Date().toISOString().split('T')[0]}.pdf`
  },
  large: {
    format: 'a3',
    orientation: 'portrait',
    margins: [1, 1, 1, 1],
    scale: 3,
    filename: `question-paper-large-${new Date().toISOString().split('T')[0]}.pdf`
  }
};