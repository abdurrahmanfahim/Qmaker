import html2pdf from 'html2pdf.js';

export const exportToPDF = async () => {
  const element = document.querySelector('.max-w-4xl');
  
  if (!element) {
    alert('No content to export');
    return;
  }

  const opt = {
    margin: [0.5, 0.5, 0.5, 0.5],
    filename: `question-paper-${new Date().toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true
    },
    jsPDF: { 
      unit: 'in', 
      format: 'a4', 
      orientation: 'portrait',
      compress: true
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error('PDF export failed:', error);
    alert('Failed to export PDF. Please try again.');
  }
};