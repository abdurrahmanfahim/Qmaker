/**
 * @fileoverview Advanced export formats and utilities
 * Provides multiple export options including Word, HTML, and batch operations
 * @author Qmaker Team
 * @version 1.0.0
 * @since 2024
 */

import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

/**
 * Export question paper to Microsoft Word format
 * @param {Object} paperData - Paper data from store
 * @param {Object} options - Export options
 */
export const exportToWord = async (paperData, options = {}) => {
  const { metadata, sections } = paperData;
  
  try {
    // Create document sections
    const docSections = [];
    
    // Header section
    docSections.push(
      new Paragraph({
        text: metadata.schoolName || 'Question Paper',
        heading: HeadingLevel.TITLE,
        alignment: 'center'
      })
    );
    
    if (metadata.examName) {
      docSections.push(
        new Paragraph({
          text: metadata.examName,
          heading: HeadingLevel.HEADING_1,
          alignment: 'center'
        })
      );
    }
    
    // Metadata information
    const metaInfo = [];
    if (metadata.className) metaInfo.push(`Class: ${metadata.className}`);
    if (metadata.subject) metaInfo.push(`Subject: ${metadata.subject}`);
    if (metadata.duration) metaInfo.push(`Duration: ${metadata.duration}`);
    if (metadata.fullMarks) metaInfo.push(`Full Marks: ${metadata.fullMarks}`);
    
    if (metaInfo.length > 0) {
      docSections.push(
        new Paragraph({
          text: metaInfo.join(' | '),
          alignment: 'center'
        })
      );
    }
    
    // Instructions
    if (metadata.instructions) {
      docSections.push(
        new Paragraph({
          text: 'Instructions:',
          heading: HeadingLevel.HEADING_2
        }),
        new Paragraph({
          text: metadata.instructions
        })
      );
    }
    
    // Question sections
    sections.forEach((section, sectionIndex) => {
      docSections.push(
        new Paragraph({
          text: section.title,
          heading: HeadingLevel.HEADING_2
        })
      );
      
      if (section.instructions) {
        docSections.push(
          new Paragraph({
            text: section.instructions,
            italics: true
          })
        );
      }
      
      section.subQuestions.forEach((subQuestion, index) => {
        // Sub-question heading
        const questionParts = [];
        questionParts.push(
          new TextRun({
            text: `${subQuestion.label} `,
            bold: true
          })
        );
        
        if (subQuestion.heading) {
          questionParts.push(
            new TextRun({
              text: subQuestion.heading,
              bold: true
            })
          );
        }
        
        questionParts.push(
          new TextRun({
            text: ` [${subQuestion.marks} marks]`,
            italics: true
          })
        );
        
        docSections.push(
          new Paragraph({
            children: questionParts
          })
        );
        
        // Sub-question content (simplified - removes HTML)
        if (subQuestion.content) {
          const cleanContent = subQuestion.content.replace(/<[^>]*>/g, '');
          docSections.push(
            new Paragraph({
              text: cleanContent
            })
          );
        }
      });
    });
    
    // Create document
    const doc = new Document({
      sections: [{
        properties: {},
        children: docSections
      }]
    });
    
    // Generate and save
    const buffer = await Packer.toBuffer(doc);
    const filename = options.filename || `question-paper-${new Date().toISOString().split('T')[0]}.docx`;
    saveAs(new Blob([buffer]), filename);
    
  } catch (error) {
    console.error('Word export failed:', error);
    throw new Error('Failed to export to Word format');
  }
};

/**
 * Export question paper to HTML format
 * @param {Object} paperData - Paper data from store
 * @param {Object} options - Export options
 */
export const exportToHTML = (paperData, options = {}) => {
  const { metadata, sections } = paperData;
  
  const getFontClass = (language) => {
    switch (language) {
      case 'arabic': return 'font-family: "Amiri", serif; direction: rtl;';
      case 'urdu': return 'font-family: "Jameel Noori Nastaleeq", serif; direction: rtl;';
      case 'bangla': return 'font-family: "SolaimanLipi", serif;';
      default: return 'font-family: "Roboto", sans-serif;';
    }
  };
  
  let html = `
<!DOCTYPE html>
<html lang="${metadata.language || 'en'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metadata.examName || 'Question Paper'}</title>
    <style>
        body {
            ${getFontClass(metadata.language)}
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
        }
        .school-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .exam-name {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 15px;
        }
        .meta-info {
            font-size: 14px;
            margin-bottom: 10px;
        }
        .instructions {
            background: #f5f5f5;
            padding: 15px;
            border-left: 4px solid #007bff;
            margin: 20px 0;
        }
        .section {
            margin: 30px 0;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #007bff;
        }
        .sub-question {
            margin: 15px 0;
            padding-left: 20px;
        }
        .sub-question-header {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .marks {
            font-style: italic;
            color: #666;
        }
        .content {
            margin: 10px 0;
        }
        @media print {
            body { margin: 0; padding: 15px; }
            .header { page-break-after: avoid; }
            .section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        ${metadata.schoolName ? `<div class="school-name">${metadata.schoolName}</div>` : ''}
        ${metadata.examName ? `<div class="exam-name">${metadata.examName}</div>` : ''}
        <div class="meta-info">
            ${metadata.className ? `Class: ${metadata.className}` : ''}
            ${metadata.subject ? ` | Subject: ${metadata.subject}` : ''}
            ${metadata.duration ? ` | Duration: ${metadata.duration}` : ''}
            ${metadata.fullMarks ? ` | Full Marks: ${metadata.fullMarks}` : ''}
        </div>
    </div>
    
    ${metadata.instructions ? `
    <div class="instructions">
        <strong>Instructions:</strong><br>
        ${metadata.instructions}
    </div>
    ` : ''}
    
    ${sections.map(section => `
    <div class="section">
        <div class="section-title">${section.title}</div>
        ${section.instructions ? `<div class="instructions">${section.instructions}</div>` : ''}
        
        ${section.subQuestions.map(subQuestion => `
        <div class="sub-question">
            <div class="sub-question-header">
                ${subQuestion.label} ${subQuestion.heading || ''} 
                <span class="marks">[${subQuestion.marks || 0} marks]</span>
            </div>
            <div class="content">${subQuestion.content || ''}</div>
        </div>
        `).join('')}
    </div>
    `).join('')}
    
    <div style="text-align: center; margin-top: 40px; font-style: italic; color: #666;">
        --- End of Question Paper ---
    </div>
</body>
</html>`;
  
  const blob = new Blob([html], { type: 'text/html' });
  // Sanitize filename to prevent path traversal
  const safeFilename = (options.filename || `question-paper-${new Date().toISOString().split('T')[0]}.html`)
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/\.\./g, '_');
  saveAs(blob, safeFilename);
};

/**
 * Batch export multiple papers in different formats
 * @param {Array} papers - Array of paper data objects
 * @param {Object} options - Export options
 */
export const batchExport = async (papers, options = {}) => {
  const { formats = ['pdf', 'html'], zipName = 'question-papers' } = options;
  
  try {
    const JSZip = await import('jszip');
    const zip = new JSZip.default();
    
    for (let i = 0; i < papers.length; i++) {
      const paper = papers[i];
      const paperName = paper.metadata.examName || `Paper-${i + 1}`;
      
      for (const format of formats) {
        switch (format) {
          case 'html':
            const htmlContent = exportToHTML(paper, { returnContent: true });
            zip.file(`${paperName}.html`, htmlContent);
            break;
          case 'json':
            const jsonContent = JSON.stringify(paper, null, 2);
            zip.file(`${paperName}.json`, jsonContent);
            break;
          // PDF would require different handling due to async nature
          default:
            console.warn(`Unsupported export format: ${format}`);
            break;
        }
      }
    }
    
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${zipName}.zip`);
    
  } catch (error) {
    console.error('Batch export failed:', error);
    throw new Error('Failed to create batch export');
  }
};

/**
 * Export configurations for different formats
 */
export const exportFormats = {
  pdf: {
    name: 'PDF Document',
    extension: 'pdf',
    mimeType: 'application/pdf',
    description: 'Portable Document Format - best for printing'
  },
  word: {
    name: 'Word Document',
    extension: 'docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    description: 'Microsoft Word format - editable document'
  },
  html: {
    name: 'HTML Document',
    extension: 'html',
    mimeType: 'text/html',
    description: 'Web page format - viewable in any browser'
  },
  json: {
    name: 'JSON Data',
    extension: 'json',
    mimeType: 'application/json',
    description: 'Raw data format - for backup and sharing'
  }
};

export default {
  exportToWord,
  exportToHTML,
  batchExport,
  exportFormats
};