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
  // Locate the content element to export
  const element = document.querySelector('[data-export="pdf-content"]') || 
                 document.querySelector('.max-w-4xl') ||
                 document.querySelector('.preview-content');
  
  if (!element) {
    alert('No content to export. Please make sure you have added sections and questions.');
    return;
  }

  // Validate that there's actual question content
  const hasContent = element.querySelector('.space-y-8')?.children.length > 0;
  if (!hasContent) {
    alert('No questions found. Please add sections and questions before exporting.');
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

  try {
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
    showErrorToast('Failed to export PDF. Please try again.');
  } finally {
    // Always clean up applied styling
    removePDFStyling(element);
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
  toast.innerHTML = `
    <div class="flex items-center gap-3">
      <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
      <div class="flex flex-col">
        <span class="font-medium">Exporting PDF</span>
        <span class="text-xs opacity-90" id="progress-text">Initializing...</span>
      </div>
    </div>
    <div class="ml-auto">
      <div class="w-16 h-1 bg-blue-400 rounded-full overflow-hidden">
        <div class="h-full bg-white rounded-full transition-all duration-500" id="progress-bar" style="width: 10%"></div>
      </div>
    </div>
  `;
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
  loadingToast.innerHTML = `
    <div class="flex items-center gap-3">
      <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
      <div class="flex flex-col">
        <span class="font-medium">PDF exported successfully!</span>
        <span class="text-xs opacity-90">Check your downloads folder</span>
      </div>
    </div>
  `;
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
 * Display error notification
 * @param {string} message - Error message to display
 */
const showErrorToast = (message) => {
  const errorToast = document.createElement('div');
  errorToast.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-4 rounded-lg shadow-xl z-50 flex items-center gap-3 min-w-[280px]';
  errorToast.innerHTML = `
    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
    </svg>
    <div class="flex flex-col">
      <span class="font-medium">Export Failed</span>
      <span class="text-xs opacity-90">${message}</span>
    </div>
  `;
  
  document.body.appendChild(errorToast);
  
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
  }, 5000);
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